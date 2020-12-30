import notifierAlter from 'bluesdk-notifier-alter'

function NotifierPage () {
  let self = this
  // 开放方法
  self.error = function (msg, el) {
    notifierAlter.error(msg)
  }

  self.info = function (msg) {
    notifierAlter.info(msg)
  }

  self.success = function (msg) {
    notifierAlter.success(msg)
  }

  self.loading = function (msg, timeout) {
    let e = document.getElementById('nav-loading')
    if (e) {
      e.style.display = 'block'
    }
    if (timeout) {
      setTimeout(function () {
        self.hide()
      }, timeout)
    }
  }

  self.hide = function (el) {
    let e = document.getElementById('nav-loading')
    if (e) {
      e.style.display = 'none'
    }
    notifierAlter.hide()
  }

  self.clear = function () {
    let e = document.getElementById('nav-loading')
    if (e) {
      e.style.display = 'none'
    }
    notifierAlter.clear()
  }
}

export default new NotifierPage()
