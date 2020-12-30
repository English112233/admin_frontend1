<template>
  <div>
    <div class="pull-left" :style="{display: isShow ? 'block' : 'none'}">
      <slot name="left-extend"></slot>
      <slot name="left-number"></slot>
    </div>
    <el-pagination class="mt10 pull-right" layout="total,sizes, prev, pager, next" :total="Number(pager.total)"
                   :page-size="pager.pageSize" :page-count="pager.pageTotal" :current-page="pager.pageNum"
                   :page-sizes="[20, 50, 100, 200]"
                   @size-change="sizeChange"
                   @current-change="goPage">
    </el-pagination>
    <div class="clear"></div>
  </div>
</template>
<script>
  export default {
    name: 'Pagination',
    data: function () {
      return {
        isShow: false
      }
    },
    props: {
      pager: {
        type: Object,
        'default': {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          pageTotal: 0
        }
      },
      query: Object
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll, true)
    },
    methods: {
      goPage: function (currentPage) {
        this.search({ pageNum: currentPage })
      },
      handleScroll (e) {
        const tableScrollTop = document.getElementById('query-table-id')
        if (tableScrollTop) {
          if (window.innerHeight > tableScrollTop.getBoundingClientRect().top + 200) {
            this.isShow = true
          } else {
            this.isShow = false
          }
        }
      },
      sizeChange (pageSize) {
        this.search({ pageNum: 1, pageSize })
      }
    }
  }
</script>
<style scoped>
  .pull-left {
    position: fixed;
    bottom: 15px;
  }
</style>


