<template>
  <div>
    <admin-user-breadcrumb :title="title"></admin-user-breadcrumb>
    <admin-user-form :action="action" :model="model" :is-new="false" :select-ids="selectIds"></admin-user-form>
  </div>
</template>

<script>
  import AdminUserBreadcrumb from './AdminUserBreadcrumb'
  import AdminUserForm from './AdminUserForm'

  export default {
    name: 'AdminUserUpdate',
    components: {
      AdminUserForm,
      AdminUserBreadcrumb
    },
    data: function () {
      return {
        action: '/user/update.do',
        model: {},
        selectIds: [],
        title: '编辑账号'
      }
    },
    beforeCreate: function () {
      let userId = this.$route.params.userId
      this.$getJson({
        url: '/user/view.do?userId=' + userId,
        callback: function (vue, res) {
          vue.model = res['data']
        }
      })
    }
  }
</script>
