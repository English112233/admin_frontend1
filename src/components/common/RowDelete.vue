<template>
  <el-button type="danger" class="delBtn" plain @click="removeItem($event)">删除</el-button>
</template>
<script>
  import $ from 'jquery'

  let dialog = require('art-dialog')
  export default {
    name: 'RowDelete',
    props: {
      url: {
        type: String
      },
      para: {
        type: Object
      },
      dialogContent: {
        type: String,
        'default': '确认删除?'
      },
      callback: {
        type: Function,
        default: function () {
          if ($('.delBtn').length === 0) {
            location.reload()
          }
        }
      }
    },
    methods: {
      removeItem: function (event) {
        let btn = $(event.target)
        let self = this
        let d = dialog({
          title: '操作确认',
          content: self.dialogContent,
          okValue: '确定',
          width: 300,
          ok: function () {
            this.title('提交中…')
            self.$post({
              btn: btn,
              url: self.url,
              data: self.para,
              success: function (res) {
                btn.parent().parent().parent().remove()
                self.callback(res)
              },
              'loading-msg': '处理中...',
              'success-msg': '删除成功'
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
