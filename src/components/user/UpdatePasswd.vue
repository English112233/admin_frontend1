<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" method="post" :action="$getReqUrl('/user/updatePassword.do')" id="validateForm"
             onsubmit="return false" label-width="80px">

      <el-form-item label="当前密码">
        <el-input class="w300" name="passwordOld" id="passwordOld" type="password" placeholder="当前密码"></el-input>
      </el-form-item>

      <el-form-item label="新密码">
        <el-input class="w300" name="passwordNew" id="passwordNew" type="password" placeholder="新密码"></el-input>
      </el-form-item>

      <el-form-item label="再次输入">
        <el-input class="w300" name="passwordConfirm" id="passwordConfirm" type="password" placeholder="再次输入"></el-input>
      </el-form-item>


      <el-form-item>
        <input type="hidden" class="_tip" value="密码修改成功！">
        <input type="hidden" class="_loading" value="1">
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Updatepassword',
    data: function () {
      return {
        title: '修改密码'
      }
    },
    mounted: function () {
      this.$formValidate({
        'rules': {
          'passwordOld': 'required',
          'passwordNew': 'required|password|lengthBetween:6,16',
          'passwordConfirm': 'required|same:passwordNew'
        },
        'blockMode': true,
        'blur': true,
        'form': 'validateForm',
        'customErrorMsg': {
          'passwordConfirm': {
            'required': '请再次输入新密码',
            'same': '两次密码输入不一致'
          }
        }
      }, {
        success: function () {
          document.getElementById('validateForm').reset()
        }
      })
    }
  }
</script>
