import { install, _Vue } from './install.js';
import { createRouteMap } from './utils/create-route-map.js';


class VueRouter {
  constructor(options) {
    this.options = options;
    
    this.routeMap = createRouteMap(options.routes || []);

    // 如果用vue 构造实例， 在组件beforeCreate时找不到$parent
    // this.app = new _Vue({
    //   data: {
    //     current: '/',
    //   }，
    // })
    
    // 构造响应式对象
    this.reactiveObj = {
      current: '/',
    }
  }

  init() {
    // 监听事件
    this.bindEvent();
    // 注册组件
    this.initComponent();
  }

  bindEvent() {
    window.addEventListener('load', this.hashChange.bind(this));
    window.addEventListener('hashchange', this.hashChange.bind(this));
  }

  hashChange() {
    // 修改响应式对象触发vue 重新渲染
    // 视图更新关键在于 使用了 router-view组件，重新渲染 使得 router-view重新计算
    this.reactiveObj.current = location.hash.slice(1) || '/';
  }

  initComponent() {
    Vue.component('router-link', {
      props: {
        to: {
          type: String,
        }
      },
      render(h) {
        return h(
          'a',
          {
            attrs: { href: '#' + this.to }
          },
          [this.$slots.default]
        )
      },
    });
  
    Vue.component('router-view', {
      render(h) {
        const component = this._root._rootRouter.routeMap[this._root._rootRouter.reactiveObj.current];
        return h(component);
      },
    })
  }
}

VueRouter.install = install;

window.VueRouter = VueRouter;

export default VueRouter;