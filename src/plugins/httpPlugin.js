import FormUtil from './FormUtil'
import $ from 'jquery'
import notifierAlter from 'bluesdk-notifier-alter'
import { post } from 'bluesdk-post'
import log from 'bluesdk-logger'

let httpPlugin = {}
/**
 * options.serverUrl function
 * options.loginUrl
 * @param Vue
 * @param options
 */
httpPlugin.install = function (Vue, options) {
  if (!Vue.urlPluginInstalled) {
    log.error('you should install bluesdk-vue-url first')
    return
  }

  let notifier = options['notifier'] || notifierAlter

  if (!options['login']) {
    options['login'] = function (res) {
      let loginUrl = options.loginUrl + '?fromUrl=' + encodeURIComponent(window.location.href)
      setTimeout(function () {
        notifier.error(res['msg'])
        window.location.href = loginUrl
      }, 2000)
    }
  }
  Vue.httpPluginInstalled = true
  /**
   * 对服务器响应数据进行过滤
   */
  Vue.prototype.$responseFilter = function (res) {
    if (res['code'] === '12') {
      if (options.csrfUrl) {
        Vue.prototype.$getJson({
          url: options.csrfUrl,
          callback: function (vue, res) {

          },
          loading: false,
          filter: function (res) {
            return res['code'] === '00'
          },
          fail: function () {

          }
        })
      }
    }
    if (res['code'] === '10') {
      options['login'](res)
    }
    if (res['code'] === '00') {
      window['csrf_pass'] = true
      return true
    }
    return false
  }

  Vue.prototype.$httpErrorHandle = function (res) {
    res = res || { msg: '请求失败' }
    notifier.error(res['errors'] ? res['errors'] : res['msg'])
  }

  /**
   * 表单验证，事件绑定
   */
  Vue.prototype.$formValidate = function (validatorConfig, eventConfig) {
    if (!eventConfig) {
      eventConfig = {}
    }
    if (!eventConfig['filter']) {
      eventConfig['filter'] = this.$responseFilter
    }
    let util = new FormUtil(validatorConfig, eventConfig)

    let self = this
    setTimeout(function () {
      let input = document.createElement('input')
      input.name = '_token'
      input.type = 'hidden'
      if (window['csrf_pass'] && window['crsf_token']) {
        input.value = window['crsf_token']
        validatorConfig['form'].append(input)
      } else {
        self.$getCsrfToken(function (token) {
          input.value = token
          validatorConfig['form'].append(input)
        })
      }
    }, 1000)
    return util
  }

  /**
   * 获取后端真实地址
   */
  Vue.prototype.$getReqUrl = function (url) {
    return options.serverUrl + url
  }

  /**
   * 从服务器获取json数据
   */
  Vue.prototype.$getJson = function (params) {
    if (!params) params = {}
    let vue = this
    if (!params['url']) {
      params['url'] = this.$url.getCurrentUrl()
    }
    if (params['cache'] === undefined) {
      params['cache'] = false
    }
    if (params['data'] !== undefined) {
      let query = this.$url.queryToStr(params['data'])
      if (params['url'].indexOf('?') > 0) {
        params['url'] += '&' + query
      } else {
        params['url'] += '?' + query
      }
    }
    if (!params['cache']) {
      if (params['url'].indexOf('?') > 0) {
        params['url'] += '&_t=' + new Date().getTime()
      } else {
        params['url'] += '?_t=' + new Date().getTime()
      }
    }

    if (!params['callback']) {
      params['callback'] = function (vue, res) {
        vue.$data['content'] = res['data']
      }
    }
    if (!params['filter']) {
      params['filter'] = this.$responseFilter
    }
    if (!params['fail']) {
      params['fail'] = this.$httpErrorHandle
    }

    if (params['loading'] === undefined) {
      params['loading'] = true
    }

    if (params['loading']) {
      notifier.loading('加载中...')
    }

    $.getJSON(vue.$getReqUrl(params['url']), function (res) {
      if (params['loading']) {
        notifier.hide()
      }
      if (params['filter'](res)) {
        if (params['callback']) {
          params['callback'](vue, res)
        }
      } else {
        params['fail'](res)
      }
    }).fail(function () {
      params['fail']()
    }).always(function () {
      if (params['always']) {
        params['always']()
      }
    })
  }

  Vue.prototype.$post = function (config) {
    config['url'] = this.$getReqUrl(config['url'])
    if (!config['filter']) {
      config['filter'] = this.$responseFilter
    }
    if (!config['beforePost']) {
      config['beforePost'] = function () {
        notifier.loading(config['loading-msg'] || '处理中...')
      }
    }
    if (!config['afterPost']) {
      config['afterPost'] = function () {
        notifier.hide()
      }
    }
    if (!config['success']) {
      config['success'] = function () {
        notifier.success(config['success-msg'] || '处理成功！')
      }
    }

    if (!config['fail']) {
      config['fail'] = this.$httpErrorHandle
    }

    if (window['csrf_pass'] && window['crsf_token']) {
      config['data']['_token'] = window['crsf_token']
      post(config)
    } else {
      this.$getCsrfToken(function (token) {
        config['data']['_token'] = token
        post(config)
      }, function () {
        notifier.error('网络错误，请稍后重试。')
      })
    }
  }

  Vue.prototype.$getCsrfToken = function (success, fail) {
    $.getJSON(this.$getReqUrl(options.csrfUrl) + '?_t=' + new Date().getTime(), function (res) {
      window['crsf_token'] = res.data
      if (success) {
        success(res.data)
      }
    }).fail(function () {
      if (fail) {
        fail()
      }
    })
  }
}
export default httpPlugin
