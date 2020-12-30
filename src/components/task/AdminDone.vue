<template>
  <div>
    <task-breadcrumb :title="title"/>


    <el-form :inline="true" :model="query" class="query-form">

      <el-form-item label="员工">
        <user-select @change="changeUser" :show-empty="true" @updateMap="val=>userMap=val"></user-select>
      </el-form-item>

      <el-form-item label="店铺">
        <shop-select @change="changeShop" @updateMap="val=>shopMap=val"/>
      </el-form-item>
      <el-form-item label="日期" prop="tradeDate">

        <my-date-range @change="dateRangeChange"></my-date-range>

      </el-form-item>


      <el-form-item label="商品名" prop="goodsName">
        <goods-select ref="goods-select" @change="updateGoods"/>
      </el-form-item>

      <el-form-item label="返款状态">
        <el-select v-model="query.wangwangSigned" :clearable="true" placeholder="请选择"
                   style="width: 200px" @change="handleSearch">
          <el-option
            v-for="item in fankuanMap"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模糊查询" prop="fuzzy">
        <el-input v-model="query.fuzzy" :clearable="true" @change="handleSearch"></el-input>
      </el-form-item>

      <el-button type="button" @click="exportExcel">导出</el-button>
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

      <el-table-column prop="userId" label="员工" align="center" width="100">
        <template slot-scope="scope">
          {{userMap[scope.row.userId]}}
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
      <el-table-column prop="remark" label="备注" align="left" header-align="center" width="130"></el-table-column>


      <el-table-column label="录入时间" align="center" sortable="custom"
                       prop="completedAt"
                       :sort-orders="['ascending', 'descending']" width="160">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.completedAt)}}
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" width="270">
        <template slot-scope="scope">
          <el-button type="button" v-show="scope.row.wangwangSigned"
                     @click="setWangwangSign(scope.row.taskId, 0)">取消
          </el-button>
          <el-button type="button" v-show="!scope.row.wangwangSigned"
                     @click="setWangwangSign(scope.row.taskId, 1)">标红
          </el-button>
          <el-button type="button" @click="showEditForm(scope.row)">编辑</el-button>

          <el-button @click="remove(scope.row.taskId, $event)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination :pager="content" :query="query"/>

    <el-dialog title="编辑" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false">
      <slot name="top"></slot>
      <task-item-form action="/taskItem/update.do" :is-new="false" @submitItemForm="submitItemForm"
                      :model="model"></task-item-form>
      <slot name="bottom"></slot>
      <!--<div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>-->
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
  import DateUtil from 'bluesdk-date-util'
  import DatePicker from 'bluesdk-vue-datepicker'
  import MyDateRange from '../common/MyDateRange'

  let dialog = require('art-dialog')
  export default {
    name: 'TaskItemList',
    data: function () {
      return {
        title: '完成记录',
        usePagePlugin: true,
        content: {},
        query: {
          shopId: this.$url.getPara('shopId'),
          userId: this.$url.getPara('userId'),
          shopName: this.$url.getPara('shopName'),
          goodsName: this.$url.getPara('goodsName'),
          goodsId: this.$url.getPara('goodsId'),
          wangwangSigned: this.$url.getPara('wangwangSigned'),
          fuzzy: this.$url.getPara('fuzzy'),
          dateBegin: this.$url.getPara('dateBegin', DateUtil.now('Y-m-d')),
          dateEnd: this.$url.getPara('dateEnd', DateUtil.now('Y-m-d')),
          flag: 1,
          orderColumn: this.$url.getPara('orderColumn', 'completedAt'),
          orderType: this.$url.getPara('orderType', 'DESC'),
          pageSize: this.$url.getPara('pageSize', 20)
        },
        queryUrl: '/taskItem/list.do',
        model: {
          wangwang: '',
          remark: '',
          taskId: '',
          mobile: '',
          orderNo: '',
          completedAt: '',
          id: ''
        },
        fankuanMap: [
          { name: '全部', value: '' },
          { name: '已返款', value: 1 },
          { name: '未返款', value: 0 }
        ],
        dateRange: '',
        shopMap: {},
        userMap: {},
        dialogVisible: false
      }
    },
    components: {
      MyDateRange,
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
    methods: {
      dateRangeChange (val) {
        this.query.dateBegin = val.dateBegin
        this.query.dateEnd = val.dateEnd
        this.handleSearch()
      },
      changeShop (c) {
        this.query.shopId = c.shopId
        this.query.shopName = c.shopName
        this.$refs['goods-select'].queryTaskGoods2(this.query.goodsId, this.query.createdAt)
        this.handleSearch()
      },
      updateGoods (val) {
        if (this.query.goodsId !== val.goodsId) {
          this.query.goodsId = val.goodsId
          this.query.goodsName = val.goodsName
          this.handleSearch()
        }
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
      handleSearch () {
        this.search()
      },
      showEditForm (model) {
        this.model.wangwang = model.wangwang
        this.model.mobile = model.mobile
        this.model.orderNo = model.orderNo
        this.model.completedAt = this.$mTimeToDate(model.completedAt)
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
      submitItemForm () {
        this.dialogVisible = false
        this.refreshPage()
      },
      setWangwangSign (taskId, wangwangSigned) {
        const self = this
        self.$post({
          url: '/taskItem/update.do',
          data: { taskId, wangwangSigned },
          success () {
            self.refreshPage()
          }
        })
      },
      exportExcel () {
        this.fullscreenLoading = true
        this.$getJson({
          url: '/taskItem/download.do',
          data: this.query,
          callback (vue, res) {
            vue.fullscreenLoading = false
            window.location.href = location.origin + res.data
          }
        })
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



