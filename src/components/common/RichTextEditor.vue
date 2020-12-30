<!--富文本编辑器-->
<template>
  <div class="RichTextEditor-Wrap">
    <!-- 图片上传组件辅助-->
    <upload class="el-button quill-img" v-show="false"
            :url="uploadUrl" @done="uploadSuccess"
            types="*.jpg;*.png" size="5MB"></upload>

    <quill-editor :content="content"
                  :options="editorOption"
                  class="ql-editor"
                  ref="myQuillEditor"
                  @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>
<script>
  import Upload from 'bluesdk-vue-upload'
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
  // 设置title
  import { addQuillTitle } from './quill-title.js'

  // 工具栏
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
    [{ 'align': [] }],
    [{ 'clean': '清楚' }], // remove formatting button
    ['link', 'image']
  ]
  export default {
    name: 'RichTextEditor',
    components: {
      Upload,
      quillEditor
    },
    props: {
      content: { // 返回的html片段
        type: String,
        default: ''
      },
      uploadUrl: { // 图片上传地址
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
        editorOption: {
          placeholder: '',
          theme: 'snow', // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions, // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    // 触发input框选择图片文件
                    document.querySelector('.quill-img').click()
                  } else {
                    this.quill.format('image', false)
                  }
                }
              }
            }
          }
        }
      }
    },
    mounted () {
      // 初始给编辑器设置title
      addQuillTitle()
    },
    methods: {
      // 文本编辑
      onEditorChange ({ quill, html, text }) {
        // console.log('editor change!', quill, html, text)
        // console.log(html.replace(/<[^>]*>|/g, ''), 33333333)
        // this.content = html
        this.$emit('update:content', html)
      },
      uploadSuccess (res) { // 把已经上传的图片显示回富文本编辑框中
        // res返回的格式是{url:"图片的路径"}，这个是后台接口返回的
        let quill = this.$refs.myQuillEditor.quill
        quill.focus()
        quill.insertEmbed(quill.getSelection().index, 'image', res)
      }
    }
  }
</script>
<style>
  .RichTextEditor-Wrap .ql-container {
    height: 300px;
  }

  .RichTextEditor-Wrap .ql-editor {
    padding: 0;
  }

  .RichTextEditor-Wrap .ql-tooltip {
    left: 5px !important;
  }
</style>
