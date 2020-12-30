import log from 'bluesdk-logger'
import $ from 'jquery'

let pagePlugin = {}
pagePlugin.install = function (Vue, options) {
  if (!Vue.utilPluginInstalled) {
    log.error('you should install bluesdk-vue-util first')
    return
  }
  if (!Vue.httpPluginInstalled) {
    log.error('you should install bluesdk-vue-http first')
    return
  }
  Vue.pagePluginInstalled = true

  Vue.mixin({
    created: function () {
      if (this.$data['usePagePlugin']) {
        if (!this.query) this.query = {}
        if (!this.query.pageNum) {
          this.query.pageNum = this.$url.getPara('pageNum', 1)
        }
        this.$data['defaultQuery'] = this.$copyObject(this.query)
        let cQuery = this.$url.getQuery()
        for (let i in cQuery) {
          if (this.query.hasOwnProperty(i)) {
            this.query[i] = cQuery[i]
          }
        }
        this.fetchData(this.getServerUrl(this.query))
      }
    },
    watch: {
      '$route': function (route) {
        if (!this.$data['usePagePlugin']) return
        let query = this.$copyObject(route.query)
        if (this.$isEmptyObject(route.query)) {
          this.query = this.$copyObject(this.$data['defaultQuery'])
        }
        for (let i in this.$data['defaultQuery']) {
          if (!route.query.hasOwnProperty(i)) {
            query[i] = this.$data['defaultQuery'][i]
          }
        }
        this.fetchData(this.getServerUrl(query))
      }
    },
    methods: {
      /**
       * elementUI 的排序方法
       */
      elSort ({ column, prop, order }) {
        this.query.orderColumn = prop
        if (order === 'ascending') {
          this.query.orderType = 'ASC'
        } else if (order === 'descending') {
          this.query.orderType = 'DESC'
        } else {
          this.query.orderType = ''
          this.query.orderColumn = ''
        }
        this.query.pageNum = 1
        return this.search()
      },
      sort: function (event) {
        if (!this.query) {
          return
        }
        let e = $(event.target)
        let column = e.data('column')
        $('.sorting_asc').each(function () {
          let t = $(this)
          if (t.data('column') !== column) {
            t.removeClass('sorting_asc').addClass('sorting')
          }
        })
        $('.sorting_desc').each(function () {
          let t = $(this)
          if (t.data('column') !== column) {
            t.removeClass('sorting_desc').addClass('sorting')
          }
        })

        if (!e.hasClass('sorting_desc')) {
          e.removeClass('sorting').removeClass('sorting_asc').addClass('sorting_desc')
          this.query.orderType = 'DESC'
        } else {
          e.removeClass('sorting').removeClass('sorting_desc').addClass('sorting_asc')
          this.query.orderType = 'ASC'
        }
        this.query.orderColumn = column
        this.query.pageNum = 1
        return this.search()
      },
      refreshPage: function (para) {
        this.fetchData(this.getServerUrl(this.getSearchQuery(para)), true)
      },
      search: function (para) {
        this.$router.push({ path: this.$url.getUri(), query: this.getSearchQuery(para) })
      },
      getServerUrl: function (query) {
        // 服务器真实地址
        let url = this.$data['queryUrl'] || this.$url.getUri()
        return url + '?' + this.$url.queryToStr(query)
      },
      fetchData: function (url) {
        this.$getJson({ url: url })
      },
      getSearchQuery (para) {
        para = para || {}
        para['_t'] = new Date().getTime()
        if (para['pageNum'] === undefined) {
          para['pageNum'] = 1
        }
        for (let key in para) {
          this.query[key] = para[key].toString().trim()
        }
        return this.query
      }
    }
  })
}
export default pagePlugin
