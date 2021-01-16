import { _Vue } from './install';

class Store {
  constructor(options) {
    const { state, getters, mutations, actions } = options;

    // 源码中对这里做了处理，每个matations和actions中的函数做了包装，进行this绑定和传参
    this._mutations = mutations;
    this._actions = actions;

    this._vm = new _Vue({
      data() {
        return {
          $$state: state, // 使用 $$ vue不会对$$的属性做代理
        }
      }
    });

    const { commit, dispatch } = this;

    // 包装实例从原型上继承的commit方法
    this.commit = function bindCommit(type, payload, options) {
      commit.call(store, type, payload, options)
    }

    // 包装实例从原型上继承的dispatch方法
    this.dispatch = function bindDispatch(type, payload, options) {
      dispatch.call(store, type, payload);
    }

    // 利用标志位避免直接修改state的值，比如调用 this.state.a = xxx;
    this.strict = options.strict;
    this._commiting = false;

    // 实现vuex getters 计算属性
    this._wrapperGetters = getters;
    this.resetStoreVm();
  }

  get state() {
    return this._vm._data.$$state;
  }

  // 实际上是执行bindCommit
  commit(type, payload) {
    const entry = this._mutations[type];

    if(!entry) {
      console.error('unknown mutation type: ', type);
      return;
    }

    // commit 实际就是调用mutation中的方法
    // 这里的this指向store
    entry(this.state, payload);
  }

  // 实际上执行bindDispatch
  dispatch(type, payload) {
    const entry = this._actions[type];

    if(!entry) {
      console.error('unknown action type', type);
      return;
    }

    // 传入this作为参数，this指向store
    return entry(this, payload);
  }

  resetStoreVm() {
    const store = this;
    store.getters = {};

    const computed = {};
    Object.keys(this._wrapperGetters).forEach(key => {
      const fn = this._wrapperGetters[key];
      // 将每个key对应的函数定义到计算属性中
      computed[key] = function() {
        return fn(store);
      }

      // 访问 store.getter[key]时就是在访问 this._vm[key]，即在访问vue实例中的计算属性
      Object.defineProperty(store.getters, key, {
        get() {
          return store._vm[key];
        }
      })
    });

    // 重写vue实例，将computed 传入
    this._vm = new _Vue({
      data() {
        return {
          $$state: state,
        }
      },
      computed,
    })

    // 严格模式下才监听
    if(this.strict) {
      this._vm.$watch(this._vm._data.$$state, () => {
        if(__Dev__) {
          if(!store._commiting) {
            console.error('can not change state directly');
            return;
          }
        }
      }, { deep: true, sync: true, })
    }
  }

  _withCommiting(fn) {
    const _commiting = this._commiting;
    this._commiting = true;
    fn();
    this._commiting = _commiting;
  }
}

export default Store;