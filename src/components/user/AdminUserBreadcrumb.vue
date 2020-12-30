<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营人员</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'adminUserList'}">员工账号</el-breadcrumb-item>
      <template v-if="title">
        <el-breadcrumb-item >{{title}}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String
      }
    }
  }
</script>
