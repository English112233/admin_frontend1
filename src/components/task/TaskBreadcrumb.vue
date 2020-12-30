<template>
  <div>
    <breadcrumb-container>
      <template slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>任务中心</el-breadcrumb-item>

          <template v-if="title">
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
          </template>

        </el-breadcrumb>
      </template>
      <template slot="rightPart">
        <slot name="rightPart"></slot>
      </template>
    </breadcrumb-container>

  </div>
</template>
<script>
  import BreadcrumbContainer from '../common/BreadcrumbContainer'

  export default {
    props: {
      title: {
        type: String
      }
    },
    components: { BreadcrumbContainer }
  }
</script>
