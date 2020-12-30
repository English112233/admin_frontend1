<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>统计数据</el-breadcrumb-item>

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
