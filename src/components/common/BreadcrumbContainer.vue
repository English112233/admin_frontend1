<template>
  <div class="container">
      <slot name="breadcrumb" class="breadcrumb"></slot>
    <div class="right-part">
      <slot name="rightPart"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'BreadcrumbContainer'
  }
</script>
<style scoped>
  .container {
    position: relative;
    height: 40px
  }

  .breadcrumb {
    position: absolute;
    top: 5px;
  }

  .right-part {
    position: absolute;
    right: 0;
    top: -10px
  }
</style>
