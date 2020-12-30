<template>
  <div class="panel login-panel">
    <div class="panel-head">{{title}}</div>
    <div class="panel-body">
      <el-form ref="form" method="post" :action="$getReqUrl('/adminAuth/active.action')" id="loginForm"
               onsubmit="return false" label-width="90px">
        <el-form-item prop="mobile" label="登录账号">
          <el-input name="mobile" id="mobile" v-model="mobile" placeholder="登录账号"></el-input>
        </el-form-item>
        <el-form-item label="设置密码">
          <el-input name="password" id="password" type="password" placeholder="设置密码"></el-input>
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input name="passwordConfirm" id="passwordConfirm" type="password" placeholder="确认密码"></el-input>
        </el-form-item>

        <captcha-input ref="captcha-input"></captcha-input>


        <el-form-item label="短信验证码">
          <el-input class="captcha-input" :maxlength="6" id="smsCode" name="smsCode" placeholder="短信验证码"></el-input>
          <el-button type="button" v-if="timeout<=0" @click="sendSms">获取</el-button>
          <el-button type="button" v-if="timeout>0">{{timeout}}秒</el-button>
        </el-form-item>

        <el-form-item>
          <input type="hidden" class="_tip" value="激活成功！">
          <input type="hidden" class="_loading" value="1">
          <input type="hidden" class="_lock" value="1">
          <el-button type="primary" native-type="submit">激活账号</el-button>
        </el-form-item>

        <div class="clear"></div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import CaptchaInput from '../common/CaptchaInput.vue'
  import notifierAlter from 'bluesdk-notifier-alter'

  export default {
    name: 'UserAuthActive',
    data: function () {
      return {
        title: '账号激活',
        mobile: '',
        timeout: 0,
        intervalJob: null
      }
    },
    components: {
      'captcha-input': CaptchaInput
    },
    mounted: function () {
      let self = this
      this.$formValidate({
        'rules': {
          'mobile': 'required',
          'password': 'required',
          'passwordConfirm': 'required|same:password',
          'smsCode': 'required|length:6'
        },
        'customErrorMsg': {
          'smsCode': {
            'length': '短信验证码错误'
          },
          password: {
            required: '请输入登录密码'
          },
          passwordConfirm: {
            required: '请再次输入登录密码'
          }
        },
        'focus': true,
        'blur': true,
        'form': 'loginForm'
      }, {
        success: function () {
          notifierAlter.loading('登录成功，正在跳转...', 300000)
          self.$getCsrfToken(function (token) {
            self.$router.push({ name: 'home' })
          })
        }
      })
    },
    beforeCreate: function () {
      let self = this
      this.$getJson({
        url: '/adminAuth/isLogin.action',
        callback: function (vue, res) {
          self.$router.push({ name: 'home' })
        },
        loading: false,
        filter: function (res) {
          return res['code'] === '00'
        },
        fail: function () {}
      })
    },
    methods: {
      sendSms () {
        const self = this
        if (this.interval > 0) {
          this.$message.error('你的操作过于频繁')
          return
        }
        if (!this.mobile) {
          this.$message.error('请填写手机号')
          return
        }
        let captcha = document.getElementById('_captcha').value
        if (!captcha) {
          this.$message.error('请输入图片验证码')
          return
        }

        this.$post({
          url: '/adminAuth/sendVerifyCode.action',
          data: { mobile: this.mobile, _captcha: captcha },
          success (res) {
            self.$message.success('短信发送成功')
            self.timeout = 60
            self.intervalJob = setInterval(function () {
              if (self.timeout > 0) {
                self.timeout = self.timeout - 1
              }
              if (self.timeout <= 0) {
                clearInterval(self.intervalJob)
              }
            }, 1000)
          }
        })
      },
      beforeDestroy () {
        if (this.intervalJob) {
          clearInterval(this.intervalJob)
        }
      }
    }
  }
</script>
<style scoped>
  .login-panel {
    height: 440px;
    margin-top: -220px;
  }

  form {
    padding-right: 10px;
  }
</style>
