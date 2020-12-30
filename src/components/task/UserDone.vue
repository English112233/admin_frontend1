<template>
  <div>
    <task-breadcrumb :title="title"/>


    <el-form :inline="true" :model="query" class="query-form">


      <el-form-item label="商品名" prop="goodsName">
        <goods-select ref="goods-select" @change="updateGoods"/>
      </el-form-item>

      <el-form-item label="模糊查询" prop="fuzzy">
        <el-input v-model="query.fuzzy" :clearable="true" @change="handleSearch"></el-input>
      </el-form-item>
    </el-form>


    <el-table
      :data="content.list"
      @sort-change="elSort"
      :default-sort="{prop: 'completedAt', order: 'descending'}"
      border
      style="width: 100%" class="mt20">

      <el-table-column prop="taskId" label="taskID" align="center" width="80"></el-table-column>

      <el-table-column prop="shopId" label="店铺" align="center" width="150">
        <template slot-scope="scope">
          {{shopMap[scope.row.shopId]}}
        </template>
      </el-table-column>


      <el-table-column prop="keywordValue" label="关键字" align="left" header-align="center"></el-table-column>
      <el-table-column prop="mobile" label="手机号" align="left" header-align="center" width="130"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" align="left" header-align="center" width="130"></el-table-column>

      <el-table-column prop="goodsName" label="商品" align="left" header-align="center">
        <template slot-scope="scope">
          <img :src="scope.row.goodsImg" v-show="scope.row.goodsImg" class="goodsImg">
          <span>{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wangwang" label="旺旺" align="left" header-align="center" width="130">
        <template slot-scope="scope">
              <span :class="scope.row.wangwangSigned ?'red':'black'">
                {{scope.row.wangwang}}
              </span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center" width="240">
        <template slot-scope="scope">
          <span :id="'remark_info_'+scope.row.taskId">{{scope.row.remark}}</span>
          <div :id="'remark_edit_'+scope.row.taskId" style="visibility: hidden;height: 0;">
            <div class="el-input"><!----><input :id="'remark_input_'+scope.row.taskId" type="text"
                                                autocomplete="off" class="el-input__inner"><!----><!----><!---->
            </div>
            <div>
              <el-button @click="saveRemark(scope.row.taskId)">保存</el-button>
              <el-button @click="hideEditRemark(scope.row.taskId)">取消</el-button>
            </div>
          </div>
        </template>

      </el-table-column>


      <el-table-column label="录入时间" prop="completedAt" align="center" sortable="custom"
                       :sort-orders="['ascending', 'descending']"  width="160">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.completedAt)}}
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" width="190">
        <template slot-scope="scope">

          <el-button type="button" @click="showEditRemark(scope.row.taskId)">备注</el-button>
          <el-button type="button" v-show="scope.row.wangwangSigned"
                     @click="setWangwangSign(scope.row.taskId, 0)">取消
          </el-button>
          <el-button type="button" v-show="!scope.row.wangwangSigned"
                     @click="setWangwangSign(scope.row.taskId, 1)">标红
          </el-button>


        </template>
      </el-table-column>

    </el-table>

    <pagination :pager="content" :query="query"/>

    <el-dialog title="编辑" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false">
      <slot name="top"></slot>
      <task-item-form action="/taskItem/update.do" :is-new="false" @submitItemForm="submitItemForm"
                      :model="model"></task-item-form>
      <slot name="bottom"></slot>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Pagination from '../common/Pagination.vue'
  import TaskBreadcrumb from './TaskBreadcrumb'
  import $ from 'jquery'
  import TaskItemForm from './TaskItemForm'
  import UserSelect from '../user/UserSelect'
  import ShopSelect from '../common/ShopSelect'
  import GoodsSelect from '../common/GoodsSelect'
  import DatePicker from 'bluesdk-vue-datepicker'

  let dialog = require('art-dialog')
  export default {
    name: 'TaskItemList',
    data: function () {
      return {
        title: '完成记录',
        usePagePlugin: true,
        content: {},
        query: {
          fuzzy: this.$url.getPara('fuzzy'),
          flag: 1,
          orderColumn: this.$url.getPara('orderColumn', 'completedAt'),
          orderType: this.$url.getPara('orderType', 'DESC'),
          pageSize: this.$url.getPara('pageSize', 20)
        },
        queryUrl: '/taskItem/userDone.do',
        model: {
          wangwang: '',
          remark: '',
          taskId: '',
          id: ''
        },
        dateRange: '',
        shopMap: {},
        userMap: {},
        dialogVisible: false
      }
    },
    components: {
      GoodsSelect,
      ShopSelect,
      UserSelect,
      TaskItemForm,
      TaskBreadcrumb,
      Pagination,
      DatePicker
    },
    created () {
      if (!this.dateRange) {
        this.dateRange = [new Date(this.query.dateBegin), new Date(this.query.dateEnd)]
      }
    },
    mounted () {
      this.$refs['goods-select'].queryTaskGoods()
    },
    methods: {
      changeShop (c) {
        this.query.shopId = c.shopId
        this.query.shopName = c.shopName
        this.$refs['goods-select'].queryTaskGoods2(this.query.goodsId, this.query.createdAt)
        this.handleSearch()
      },
      updateGoods (val) {
        this.$router.push({ name: 'taskUserList', query: val })
      },
      updateTime (val) {
        this.query.createdAt = val
        this.$refs['goods-select'].queryTaskGoods2(this.query.goodsId, this.query.createdAt)
        this.handleSearch()
      },
      changeUser (userId) {
        this.query.userId = userId
        this.handleSearch()
      },
      showEditRemark (taskId) {
        const info = document.getElementById('remark_info_' + taskId)
        const remark = info.innerText.trim()
        info.style.visibility = 'hidden'
        const edit = document.getElementById('remark_edit_' + taskId)
        edit.style.visibility = 'visible'
        edit.style.height = '80px'
        const input = document.getElementById('remark_input_' + taskId)
        input.value = remark
        input.focus()
      },
      setWangwangSign (taskId, wangwangSigned) {
        const self = this
        self.$post({
          url: '/taskItem/update.do',
          data: { taskId, wangwangSigned },
          success () {
            self.handleSearch()
          }
        })
      },
      handleSearch () {
        this.search()
      },
      showEditForm (model) {
        this.model.wangwang = model.wangwang
        this.model.remark = model.remark
        this.model.taskId = model.taskId
        this.model.id = model.id
        this.dialogVisible = true
      },
      remove (taskId, event) {
        let btn = $(event.target)
        let self = this
        let d = dialog({
          title: '操作确认',
          content: '确认删除该记录？',
          okValue: '确定',
          width: 200,
          ok: function () {
            this.title('提交中…')
            self.$post({
              btn: btn,
              url: '/taskItem/remove.do',
              data: { taskId },
              'loading-msg': '处理中...',
              'success-msg': '删除成功',
              success () {
                self.refreshPage()
              }
            })
            return true
          },
          cancelValue: '取消',
          cancel: function () {
          }
        })
        d.showModal()
      },
      hideEditRemark (taskId) {
        document.getElementById('remark_info_' + taskId).style.visibility = 'visible'
        const edit = document.getElementById('remark_edit_' + taskId)
        edit.style.visibility = 'hidden'
        edit.style.height = '0'
      },
      saveRemark (taskId) {
        const info = document.getElementById('remark_info_' + taskId)
        const e = document.getElementById('remark_input_' + taskId)
        const remark = e.value.trim()
        const self = this
        self.$post({
          url: '/taskItem/remark.do',
          data: { taskId, remark },
          success () {
            info.innerText = remark
            self.hideEditRemark(taskId)
          }
        })
      },
      submitItemForm () {
        this.dialogVisible = false
        this.refreshPage()
      }
    }
  }
</script>
<style scoped>
  .goodsImg {
    width: 30px;
    height: 30px;
    display: block;
    float: left;
  }
</style>



