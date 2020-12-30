import Validator from 'bluesdk-validator'
import notifierArrow from 'bluesdk-notifier-arrow'
import maskLayer from 'bluesdk-mask-layer'
import { post } from 'bluesdk-post'
import $ from 'jquery'

function FormUtil (validatorConfig, eventConfig) {
  let self = this
  validatorConfig = validatorConfig || {}
  eventConfig = eventConfig || {}
  /**
   * 自定义某个字段的错误消息显示方式
   * @type Object {fieldName:notifier}
   */
  let specifyNotifier = eventConfig['specifyNotifier'] || {}
  /**
   * 默认错误信息提示器
   */
  this.notifier = eventConfig['notifier'] || notifierArrow
  if (typeof validatorConfig['form'] === 'string') {
    validatorConfig['form'] = $('#' + validatorConfig['form'])
  }
  this.validator = new Validator(validatorConfig)
  this.validator.onError = eventConfig['onError'] || function (event) {
    if (event['eventType'] === 'change') return
    let name = event['name']
    if (specifyNotifier[name]) {
      specifyNotifier[name].error(event['errorMsg'], event['validator'].getEl(name))
    } else {
      self.notifier.error(event['errorMsg'], event['validator'].getEl(name))
    }
  }
  this.validator.onSuccess = eventConfig['onSuccess'] || function (event) {
    if (specifyNotifier[event['name']]) {
      specifyNotifier[event['name']].hide(event['validator'].getEl(event['name']))
    } else {
      self.notifier.hide(event['validator'].getEl(event['name']))
    }
  }
  if (eventConfig['afterValidate']) {
    this.validator.afterValidate = eventConfig['afterValidate']
  }
  let form = validatorConfig['form']
  let showLoading = form.find('._loading').length
  this.submitBtn = validatorConfig['buttonId'] ? $('#' + validatorConfig['buttonId']) : form.find(':submit')
  // 请求成功后
  let responseSuccess = function () {
    if (form.find('._lock').length) {
      maskLayer.show()
    }

    let tipEl = form.find('._tip')
    if (tipEl.length > 0) {
      self.notifier.success(tipEl.val())
    }
    let redirectEl = form.find('._redirect')
    if (redirectEl.length > 0) {
      let timeout = form.find('._timeout').val() || 1000
      setTimeout(function () {
        window.location.href = redirectEl.val()
      }, timeout)
    }
  }

  self.fail = function (res) {
    if (res['errors']) {
      for (let name in res['errors']) {
        if (!res['errors'].hasOwnProperty(name)) continue
        self.validator.addError(self.validator.errorEvent({ name: name, errorMsg: res['errors'][name] }))
      }
    } else {
      self.notifier.error(res['msg'])
    }
  }

  // 服务器处理 返回失败
  if (!eventConfig['fail']) {
    eventConfig['fail'] = self.fail
  }

  if (!eventConfig['filter']) {
    eventConfig['filter'] = function (res) {
      return res['code'] === '00'
    }
  }

  // 调用验证
  self.validate = function () {
    if (eventConfig['beforeValidate'] && !eventConfig['beforeValidate'](self)) return false
    return self.validator.run()
  }

  // 提交表单
  self.submit = function () {
    if (eventConfig['beforeSubmit'] && !eventConfig['beforeSubmit'](self)) {
      return false
    }
    self.post()
  }
  self.post = function () {
    if (showLoading) {
      let tip = form.find('._loading').data('tip') || '提交中...'
      self.notifier.loading(tip, 60000)
    }
    // 对数据做转换
    let data
    if (eventConfig['converter'] !== undefined) {
      let items = form.serializeArray()
      data = []
      for (let i = 0, len = items.length; i < len; i++) {
        data.push(items[i].name + '=' + encodeURIComponent(eventConfig['converter'](items[i])))
      }
      data = data.join('&')
    } else {
      data = form.serialize()
    }

    post({
      'btn': self.submitBtn,
      'url': form.attr('action'),
      'data': data,
      'success': function (res) {
        responseSuccess()
        if (eventConfig['success']) {
          eventConfig['success'](res)
        }
      },
      'fail': function (res) {
        if (eventConfig['fail']) {
          eventConfig['fail'](res)
        }
      },
      'filter': function (res) {
        self.notifier.clear()
        if (eventConfig['filter']) {
          return eventConfig['filter'](res)
        }
      },
      'afterPost': function (res) {
        if (eventConfig['afterPost']) {
          eventConfig['afterPost'](res)
        }
      }
    })
  }

  this.submitBtn.click(function (e) {
    if (self.validate()) {
      if (!form.attr('onsubmit')) return true
      self.submit()
    }
    return false
  })
}

export default FormUtil
