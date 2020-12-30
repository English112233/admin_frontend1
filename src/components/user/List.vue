<template>
  <div>
    <admin-user-breadcrumb></admin-user-breadcrumb>

    <el-form :inline="true" :model="query" class="query-form">


      <el-form-item label="用户名" prop="userName">
        <el-input name="userName" v-model="query.userName" placeholder="用户名"></el-input>
      </el-form-item>


      <el-form-item label="角色">
        <enum-select :show-empty="true" :options="UserRoleEnum.map" :selected-id="query.userRole"
                     @change="val=>query.userRole=val"></enum-select>
      </el-form-item>

      <el-form-item label="停用">
        <enum-select :show-empty="true" :options="$enum.yesNo" :selected-id="query.disabled"
                     @change="val=>query.disabled=val"></enum-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>

      <router-link v-bind:to="{ name: 'userCreate'}" class="el-button pull-right mr20 el-button--default">
        添加
      </router-link>
    </el-form>

    <el-table
      :data="content.list"
      border
      style="width: 100%" class="mt20">

      <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>

      <el-table-column prop="userRole" label="角色" align="center">
        <template slot-scope="scope">
          {{ $getObjVal(UserRoleEnum.map, scope.row.userRole)}}
        </template>

      </el-table-column>
      <el-table-column prop="userName" label="用户名" align="center"></el-table-column>

      <el-table-column prop="disabled" label="状态" align="center">
        <template slot-scope="scope">
          {{scope.row.disabled===0?'启用':'停用'}}
        </template>
      </el-table-column>


      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.createdAt)}}
        </template>
      </el-table-column>


      <el-table-column label="最后更新" align="center">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.updatedAt)}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <router-link class="el-button el-button--primary is-plain"
                       :to="{ name: 'userUpdate', params: { userId: scope.row.userId }}">
            编辑
          </router-link>
        </template>
      </el-table-column>

    </el-table>

    <pagination :pager="content" :query="query"></pagination>
  </div>

</template>

<script>
  import $ from 'jquery'
  import Pagination from '../common/Pagination.vue'
  import AdminUserBreadcrumb from './AdminUserBreadcrumb'
  import { EnumSelect } from 'bluesdk-element-common'
  import UserRoleEnum from './../../enum/UserRoleEnum'

  let dialog = require('art-dialog')
  export default {
    name: 'AdminUserList',
    data: function () {
      return {
        title: '账号列表',
        usePagePlugin: true,
        content: {},
        groups: [],
        query: {
          userName: this.$url.getPara('userName'),
          userRole: this.$url.getPara('userRole'),
          disabled: this.$url.getPara('disabled'),
          orderColumn: 'userId',
          orderType: 'DESC',
          pageSize: this.$url.getPara('pageSize', 20)
        },
        UserRoleEnum,
        groupMap: {}
      }
    },
    components: {
      EnumSelect,
      AdminUserBreadcrumb,
      Pagination
    },
    methods: {
      resetPasswd: function (userId, event) {
        let btn = $(event.target)
        let self = this
        let d = dialog({
          title: '操作确认',
          content: '确认重置用户密码？',
          okValue: '确定',
          width: 200,
          ok: function () {
            this.title('提交中…')
            self.$post({
              btn: btn,
              url: '/adminUser/resetPasswd.do',
              data: { 'userId': userId },
              'loading-msg': '处理中...',
              'success-msg': '密码重置成功'
            })
            return true
          },
          cancelValue: '取消',
          cancel: function () {
          }
        })
        d.showModal()
      }
    }
  }
</script>




