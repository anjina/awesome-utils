export let _Vue;

function install(Vue) {
  if(install.installed && Vue === _Vue) return;

  install.installed = true;
  _Vue = Vue;

  Vue.mixin({
    beforeCreate() {
      if(this.$options.store) {
        this.$store = this.$options.store;
      }
    },
  })
}

export default install;