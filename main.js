import App from './App'
import uviewPlus, { setConfig } from '@/uni_modules/uview-plus'

import * as Pinia from 'pinia';

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
  app.use(uviewPlus)
app.$mount()


// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
// import shareMixin from '/libs/mixin/shareMixin.js'
import mpShare from '/libs/mixin/mpShare.js'


export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus)
  app.use(Pinia.createPinia());
  app.mixin(mpShare)
  return {
    app,
	Pinia
  }
}

// #endif