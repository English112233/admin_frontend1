<template>

  <el-button class="btn btn-default" type="primary" @click="download($event)">下载表格</el-button>

</template>
<script>
  export default {
    props: {
      query: Object,
      url: String
    },
    methods: {
      download: function (event) {
        let self = this
        let data = this.$copyObject(self.query, ['orderColumn', 'orderType', 'pageSize', 'pageNum'])
        this.$getJson({
          url: this.url + '?' + this.$url.queryToStr(data) + '&fileType=2',
          cache: true,
          callback: function (vue, res) {
            if (res.content.downUrl) {
              location.href = res.content.downUrl
            } else {
              self.showDowning()
              self.checkDownload(res.content.fileKey, res.content.checkKey, 0)
            }
          }
        })
      },
      downloadSuccess: function (url) {
        let e = document.getElementById('download-num')
        let num = parseInt(e.innerText)
        e.innerText = num - 1
        if (num === 1) {
          document.getElementById('downloading-tip').style.display = 'none'
        }
        this.$alert('报表文件已生成', '提示', {
          confirmButtonText: '下载',
          callback: action => {
            location.href = url
          }
        })
      },
      showDowning: function () {
        let e = document.getElementById('downloading-tip')
        if (e) {
          let numE = document.getElementById('download-num')
          numE.innerText = parseInt(numE.innerText) + 1
          e.style.display = 'block'
        } else {
          let div = document.createElement('div')
          div.setAttribute('id', 'downloading-tip')
          div.innerHTML = '<i class="ico_down"></i><span class="txt">报表文件下载中</span><span id="download-num" class="badge">1</span>'
          document.body.appendChild(div)
        }
      },
      checkDownload: function (fileKey, checkKey, times) {
        let self = this
        let timeout = 5000
        if (times === 0) {
          timeout = 1000
        } else if (times === 1) {
          timeout = 2000
        }
        setTimeout(function () {
          self.$getJson({
            url: '/reportFile/check.do?fileKey=' + fileKey + '&checkKey=' + checkKey,
            loading: false,
            callback: function (vue, res) {
              if (res.content.downUrl) {
                self.downloadSuccess(res.content.downUrl)
              } else {
                self.checkDownload(fileKey, checkKey, ++times)
              }
            }
          })
        }, timeout)
      }
    }
  }
</script>

<style>
  #downloading-tip {
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    box-sizing: border-box;
    background-color: #44b54a;
    position: fixed;
    bottom: 1px;
    right: 0;
    padding: 5px 8px;
    z-index: 999;
  }

  #downloading-tip .ico_down {
    background: url("../../assets/ico_down.gif") 0 0 no-repeat;
    width: 18px;
    height: 32px;
    display: inline-block;
    vertical-align: middle;
  }

  #downloading-tip .txt {
    color: #ffffff;
    margin: 0 5px;
    font-size: 12px;
  }

  #downloading-tip .badge {
    display: inline-block;
    min-width: 10px;
    padding: 3px 7px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    color: #999;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    background-color: #ffffff;
    border-radius: 10px;
  }
</style>
