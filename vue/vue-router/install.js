// 导出后在 vue-router中任意地方可以使用
export let _Vue;

export function install(Vue) {
  // 已经注册过
  if(install.installed && Vue === _Vue) return;

  install.installed = true;
  _Vue = Vue;

  Vue.mixin({
    beforeCreate() {
      if(this.$options.router) {
        this._root = this;
        this._rootRouter = this.$options.router;
        this._rootRouter.init();

        // 将current 变为响应式
        Vue.util.defineReactive(this, '_route', this._rootRouter.reactiveObj);
      } else {
        // 注意这里，如果是子组件，则找到 根组件的_root 
        this._root = (this.$parent && this.$parent._root) || this;
      }
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._root._rootRouter;
    }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return {
        current: this._root._rootRouter.reactiveObj.current,
      }
    }
  });
}