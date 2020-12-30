<template>
  <a :href="src" target="_blank" v-show="src">
     <img :src="src" :alt="alt" :style="{'max-width':maxWidth,'max-height':maxHeight }"/>
   </a>
</template>
<script>
  export default {
    name: 'PreviewImg',
    props: {
      src: String,
      alt: String,
      maxWidth: {
        type: String,
        default: '200px'
      },
      maxHeight: {
        type: String,
        default: '200px'
      }
    }
  }
</script>
