import Vue from 'vue'
import Vuex from 'vuex'
import urlTool from 'bluesdk-url'

Vue.use(Vuex)
let vm2 = new Vue() // 实例化一个vue对象，为了在actions里面使用挂载在vue实例上的方法
export default new Vuex.Store({
  state: {
    // excel下载相关
    downloadFiles: {
      openTimerTask: false, // 是否启用定时获取下载列表任务
      isSureOpen: false, // 是否确定允许打开弹窗
      shopDetails: {
        shopName: '',
        shopId: 0
      }
    }
  },
  getters: {},
  mutations: {
    changeStateVal ({ downloadFiles }, { key, value }) {
      downloadFiles[key] = value
    },
    changeShopDetails (state, details) {
      state.downloadFiles.shopDetails.shopName = details.shopName
      state.downloadFiles.shopDetails.shopId = details.shopId
    }
  },
  actions: {
    /**
     *  @url:表格下载接口地址
     *  @params：表格下载参数
     * */
    excelDownLoad ({ commit }, { url, params }) {
      vm2.$getJson({
        url: url + '?' + urlTool.queryToStr(params),
        cache: true,
        callback: function (vue, res) {
          if (res.content.downUrl) {
            window.location.href = res.content.downUrl
          } else {
            commit('changeStateVal', { key: 'isSureOpen', value: true }) // 没有url则自动弹出下载列表
          }
        }
      })
      commit('changeStateVal', { key: 'openTimerTask', value: true }) // 开启下载列表定时服务
    }
  }
})
