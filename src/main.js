import { createSSRApp } from 'vue'
import App from './App.vue'
import cartStore from './store/cartStore'

import { $http } from '@escook/request-miniprogram'

$http.baseUrl = 'https://www.uinav.com'
uni.$http = $http

$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '请求加载中...',
  })
}

$http.afterRequest = function () {
  uni.hideLoading()
}

// 封装的展示消息提示的方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500, icon = 'none') {
  uni.showToast({
    title,
    duration,
    icon,
  })
}

export function createApp() {
  const app = createSSRApp(App)
  app.use(cartStore)
  return {
    app,
  }
}
