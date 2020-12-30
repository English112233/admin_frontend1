<template>
  <div>
    <admin-user-breadcrumb :title="title"></admin-user-breadcrumb>
    <admin-user-form :is-new="true" :action="action" :model="model"></admin-user-form>
  </div>
</template>

<script>
  import AdminUserForm from './AdminUserForm'
  import AdminUserBreadcrumb from './AdminUserBreadcrumb'
  import UserRoleEnum from './../../enum/UserRoleEnum'

  export default {
    name: 'AdminUserCreate',
    components: {
      AdminUserBreadcrumb,
      AdminUserForm
    },
    data: function () {
      return {
        title: '新增账号',
        action: '/user/create.do',
        model: {
          disabled: 0,
          userRole: UserRoleEnum.STAFF.value
        }
      }
    }
  }
</script>
