# Vuex 实现原理

一个状态管理仓库，作为插件注册到Vue中

## 实现步骤

- 通过install方法注册，通过混入生命周期的方式使每个Vue实例都能访问到store

- 核心代码使用Store类来实现，包括以下功能：

1. modules注册
2. commit， dispatch api 定义
3. state的响应式定义

## 使用方式

```javascript
import Vuex from 'vuex';
import Vue from 'vue'

const store = new Vuex.Store({
  modules: {
    moduleA: {...},
    moduleB: {...}
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});

new Vue({
  ...,
  store,
})
```
