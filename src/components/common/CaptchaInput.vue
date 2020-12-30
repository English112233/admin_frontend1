<template>
  <el-form-item label="验证码">
    <el-input class="captcha-input" :maxlength="4" id="_captcha" name="_captcha" placeholder="验证码"></el-input>
    <img :src="imgUrl" class="captcha ml10"/>
    <a href="javascript:" @click="changeImg" class="ml10">换一张</a>
  </el-form-item>
</template>
<script>
  export default {
    data: function () {
      return {
        imgUrl: this.$getReqUrl('/common/captcha.jpg') + '?' + new Date().getTime()
      }
    },
    methods: {
      changeImg: function () {
        this.imgUrl = this.$getReqUrl('/common/captcha.jpg') + '?' + new Date().getTime()
      }
    }
  }
</script>
<style>
  .captcha-input, .captcha-input input {
    width: 100px;
  }

  .captcha {
    vertical-align: middle;
  }
</style>
