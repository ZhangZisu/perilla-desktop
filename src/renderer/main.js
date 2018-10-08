import Vue from 'vue'
import './plugins/vuetify'
import './plugins/github'
import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'
import './assets/lightui.styl'

Vue.config.productionTip = false
Vue.config.silent = true

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
