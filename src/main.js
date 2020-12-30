// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/global.css'
import utilPlugin from 'bluesdk-vue-util'
import urlPlugin from 'bluesdk-vue-url'
import httpPlugin from './plugins/httpPlugin'
import pagePlugin from './plugins/pagePlugin'
import formatPlugin from 'bluesdk-vue-format'
import titlePlugin from 'bluesdk-vue-title'
import enumPlugin from 'bluesdk-vue-enum'
import commonPlugin from './plugins/common'
import App from './App.vue'
import notifierPage from './modules/notifier-page/notifierPage'
import store from './store' // 引入store

require('es6-promise').polyfill()
Vue.use(ElementUI)
Vue.use(enumPlugin)
Vue.use(utilPlugin)
Vue.use(urlPlugin)
Vue.use(httpPlugin, {
  serverUrl: '/api',
  loginUrl: '#/userAuth/login',
  csrfUrl: '/common/csrf.action'
})
Vue.use(pagePlugin)
Vue.use(formatPlugin)
Vue.use(titlePlugin)
Vue.use(commonPlugin)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App},
  mounted: function () {
    document.getElementById('page-loading').style.display = 'none'
    document.getElementById('body').style.display = 'block'
  }
})

router.beforeEach((to, from, next) => {
  notifierPage.loading()
  next()
})

router.afterEach(route => {
  notifierPage.hide()
  let arr = document.getElementsByClassName('_bluesdk_notifier')
  for (let i = 0, len = arr.length; i < len; i++) {
    arr[i].remove()
  }
  window.scrollTo(0, 0)
  Vue.prototype.$getCsrfToken()
})
