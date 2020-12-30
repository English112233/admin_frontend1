<template>
  <div class="panel login-panel">
    <div class="panel-head">{{title}}</div>
    <div class="panel-body">
      <el-form ref="form" method="post" :action="$getReqUrl('/auth/login.action')" id="loginForm"
               onsubmit="return false" label-width="80px">
        <el-form-item prop="loginAccount" label="登录账号">
          <el-input name="loginAccount" id="loginAccount" v-model="loginAccount" placeholder="登录账号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="loginPassword">
          <el-input name="loginPassword" id="loginPassword" type="password" placeholder="登录密码"></el-input>
        </el-form-item>
        <captcha-input ref="captcha-input"></captcha-input>


        <el-form-item>
          <input type="hidden" class="_tip" value="登录成功！">
          <input type="hidden" class="_loading" value="1">
          <input type="hidden" class="_lock" value="1">
          <el-button type="primary" native-type="submit">立即登录</el-button>
          <el-checkbox v-model="remember">记住账号</el-checkbox>

        </el-form-item>

        <div class="clear"></div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import CaptchaInput from '../common/CaptchaInput.vue'
  import cookie from 'bluesdk-cookie'
  import notifierAlter from 'bluesdk-notifier-alter'

  export default {
    name: 'UserAuthLogin',
    data: function () {
      return {
        title: '请先登录',
        remember: false,
        loginAccount: ''
      }
    },
    components: {
      'captcha-input': CaptchaInput
    },
    mounted: function () {
      let self = this
      this.$formValidate({
        'rules': {
          'loginAccount': 'required',
          'loginPassword': 'required',
          '_captcha': 'required|length:4'
        },
        'customErrorMsg': {
          '_captcha': {
            'length': '验证码错误'
          }
        },
        'focus': true,
        'blur': true,
        'form': 'loginForm'
      }, {
        success: function () {
          notifierAlter.loading('登录成功，正在跳转...', 300000)
          if (self.remember) {
            cookie.set('loginAccount', self.loginAccount, 86400)
          } else {
            cookie.del('loginAccount')
          }
          self.$getCsrfToken(function (token) {
            if (self.$url.getPara('fromUrl')) {
              location.href = self.$url.getPara('fromUrl')
            } else {
              self.$router.push({ name: 'home' })
            }
          })
        },
        afterPost: function (res) {
          if (res['retCode'] !== '00') {
            self.$refs['captcha-input'].changeImg()
          }
        }
      })
      self.loginAccount = cookie.get('loginAccount')
      if (self.loginAccount) {
        self.remember = true
      }
    },
    beforeCreate: function () {
      let self = this
      this.$getJson({
        url: '/auth/isLogin.action',
        callback: function (vue, res) {
          self.$router.push({ name: 'home' })
        },
        loading: false,
        filter: function (res) {
          return res['code'] === '00'
        },
        fail: function () {}
      })
    }
  }
</script>
<style scoped>
  .login-panel {
    height: 320px;
    margin-top: -170px;
  }

  form {
    padding-right: 10px;
  }
</style>
