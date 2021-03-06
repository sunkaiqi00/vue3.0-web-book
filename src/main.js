import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'
// import Mock from './mock'
// import CreateApi from 'vue-create-api'
import VueLazyLoad from 'vue3-lazyload'
import './assets/css/index.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(VueLazyLoad)
  // .use(Mock)
  // .use(CreateApi)
  .mount('#app')
