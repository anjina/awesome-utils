#

## Vue Router 用法

```javascript
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
];

const router = new VueRouter({
  routes,
});

const app = new Vue({
  el: '#app',
  render(h) {
    return h(App);
  }
  router,
})
```

## 实现步骤

- 通过vue.use注册
- 执行install方法：完成钩子混入，属性定义，组件注册，对重复注册的判断
- new VueRouter 过程：创建了 router 对象，根据options创建matcher对象，创建routeMap，路由和组件的映射关系，提供match方法查找匹配到的路由
- 路由切换：钩子实现，url切换，组件重新渲染
url切换： 通过监听history事件实现

## 测试步骤

- 全局安装 http-server，npm i http-server -g
- 根目录执行 npm run test
- 服务启动后，进入 http://127.0.0.1:8080/test/index.html