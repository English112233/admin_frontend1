<template>
  <div>
    <el-form ref="form" method="post" :action="$getReqUrl(action)" id="validateForm" onsubmit="return false"
             label-width="80px">


      <el-form-item label="用户名">
        <el-col :span="6">
          <el-input name="userName" id="userName" v-model="model.userName" type="text"
                    placeholder="用户名"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="ml10">作为登录账号</span>
        </el-col>
      </el-form-item>

      <el-form-item label="角色">
        <el-col :span="6">
          <enum-select :show-empty="false" :options="UserRoleEnum.map" :selected-id="model.userRole"
                       @change="val=>model.userRole=val"></enum-select>
          <input type="hidden" name="userRole" id="userRole" v-model="model.userRole">
        </el-col>

      </el-form-item>

      <el-form-item label="登录密码">
        <el-col :span="6">
          <el-input name="loginPassword" id="loginPassword" v-model="model.loginPassword" type="text"
                    placeholder="登录密码"></el-input>
        </el-col>
        <el-col :span="6" v-if="!isNew">
          <span class="ml10">留空则不做修改</span>
        </el-col>
      </el-form-item>


      <el-form-item label="状态">
        <el-radio v-model="model.disabled" name="disabled" :label="1">关闭</el-radio>
        <el-radio v-model="model.disabled" name="disabled" :label="0">开启</el-radio>
      </el-form-item>


      <el-form-item>
        <input type="hidden" name="userId" v-model="model.userId">
        <input type="hidden" class="_tip" value="保存成功！">
        <input type="hidden" class="_loading" value="1">
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import { EnumSelect } from 'bluesdk-element-common'
  import UserRoleEnum from './../../enum/UserRoleEnum'

  export default {
    name: 'AdminUserForm',
    components: { EnumSelect },
    data () {
      return {
        privilegeAssignConfig: {
          label: '菜单分配',
          groups: [],
          groupName: 'moduleName',
          childrenNode: 'menus',
          childName: 'menuName',
          childId: 'menuId',
          checkboxName: 'menuId'
        },
        UserRoleEnum
      }
    },
    props: {
      action: {
        type: String,
        'default': ''
      },
      model: {
        type: Object,
        default () {
          return {
            disabled: 0,
            userRole: UserRoleEnum.STAFF.value
          }
        }
      },
      selectIds: {
        type: Array,
        'default': function () {
          return []
        }
      },
      isNew: {
        type: Boolean
      }
    },
    mounted: function () {
      let self = this
      this.$formValidate({
        'rules': {
          'userName': 'required|maxLength:36',
          'loginPassword': 'password'
        },
        'focus': true,
        'blockMode': true,
        'form': 'validateForm'
      }, {
        success: function () {
          self.$router.push({ name: 'userList' })
        }
      })
    }
  }
</script>
