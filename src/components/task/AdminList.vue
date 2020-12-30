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
        <date-picker
          id="createdAt"
          name="createdAt"
          @update:value="updateTime"
          :value="query.createdAt.substring(0,10)"
          readonly="readonly"
          class="el-input__inner date-picker"
        ></date-picker>

      </el-form-item>


      <el-form-item label="商品名" prop="goodsName">
        <goods-select ref="goods-select" @change="updateGoods"/>
      </el-form-item>

      <el-form-item label="查询">
        <el-select v-model="value" placeholder="请选择" @change="onSelectedDrug(value)">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


    </el-form>


    <el-table
      :data="content.list"
      border
      @sort-change="elSort"
      :default-sort="{prop: 'createdAt', order: 'descending'}"
      style="width: 100%" class="mt20">

      <el-table-column prop="id" label="taskID" align="center" width="80"></el-table-column>

      <el-table-column prop="shopId" label="店铺" align="center" width="150">
        <template slot-scope="scope">
          {{shopMap[scope.row.shopId]}}
        </template>
      </el-table-column>

      <el-table-column prop="userId" label="员工" align="center" width="150">
        <template slot-scope="scope">
          {{userMap[scope.row.userId]}}
        </template>
      </el-table-column>

      <el-table-column prop="goodsName" label="商品" align="left" header-align="center">
        <template slot-scope="scope">
          <img :src="scope.row.goodsImg" v-show="scope.row.goodsImg" class="goodsImg">
          {{scope.row.goodsName}}
        </template>
      </el-table-column>
      <el-table-column prop="taskTotal" label="总单数" align="right" header-align="center" width="100">
        <template slot-scope="scope">
          {{scope.row.taskTotal - scope.row.taskDone}}
        </template>
      </el-table-column>


      <el-table-column label="创建时间" prop="createdAt" align="center" sortable="custom"
                       :sort-orders="['ascending', 'descending']" width="160">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.createdAt)}}
        </template>
      </el-table-column>

      <el-table-column prop="taskTotal" label="计划状态" align="center" width="160">
        <template slot-scope="scope">
          <span class="red" v-if="scope.row.taskTotal > scope.row.taskDone">正在执行</span>
          <span v-else>计划完成</span>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">

          <router-link
            :to="{name:'taskUserList', query:{goodsId:scope.row.goodsId, goodsName:scope.row.goodsName,userId:scope.row.userId}}"
            class="el-button el-button--default">
            查看计划
          </router-link>

          <el-button type="danger" @click="cancelPlan(scope.row.id, $event)">放弃计划</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination :pager="content" :query="query"/>


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

  let dialog = require('art-dialog')
  export default {
    name: 'TaskItemList',
    data: function () {
      return {
        title: '完成记录',
        usePagePlugin: true,
        content: {},
        defaultContent: {},
        options: [{
          value: 'today',
          label: '当天'
        }, {
          value: 'all',
          label: '查询全部'
        }, {
          value: 'complete',
          label: '查询已完成'
        }, {
          value: 'unfinished',
          label: '查询未完成'
        }],
        contentAllList: [],
        value: 'today',
        currentValue: 'today',
        query: {
          shopId: this.$url.getPara('shopId'),
          userId: this.$url.getPara('userId'),
          shopName: this.$url.getPara('shopName'),
          goodsName: this.$url.getPara('goodsName'),
          goodsId: this.$url.getPara('goodsId'),
          createdAt: this.$url.getPara('createdAt', DateUtil.now('Y-m-d')),
          flag: 1,
          orderColumn: this.$url.getPara('orderColumn', 'createdAt'),
          orderType: this.$url.getPara('orderType', 'DESC'),
          pageSize: this.$url.getPara('pageSize', 20)
        },
        queryUrl: '/task/list.do',
        model: {
          wangwang: '',
          remark: '',
          taskId: '',
          id: ''
        },
        shopMap: {},
        userMap: {},
        dialogVisible: false,
        first: true
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
    methods: {
      changeShop (c) {
        this.query.shopId = c.shopId
        this.query.shopName = c.shopName
        this.$refs['goods-select'].queryTaskGoods2(this.query.goodsId, this.query.createdAt)
        this.handleSearch()
        this.contentAllList = this.content.list
      },
      updateGoods (val) {
        if (this.query.goodsId !== val.goodsId) {
          this.query.goodsId = val.goodsId
          this.query.goodsName = val.goodsName
          this.handleSearch()
        }
      },
      searchGoods (val) {
        if (this.query.goodsId !== val.goodsId) {
          this.query.goodsId = val.goodsId
          this.query.goodsName = val.goodsName
          this.handleSearch()
        }
      },
      onSelectedDrug (value) {
        if (value !== 'today') {
          this.queryUrl = '/task/alllist.do'
          this.query.value = value
          this.$refs['goods-select'].queryTaskGoods2(this.query.goodsId, this.query.createdAt)
          this.handleSearch()
        } else {
          this.queryUrl = '/task/list.do'
          delete this.query.value
          this.$refs['goods-select'].queryTaskGoods2(this.query.goodsId, this.query.createdAt)
          this.handleSearch()
        }
        this.currentValue = value
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
        this.model.remark = model.remark
        this.model.taskId = model.taskId
        this.model.id = model.id
        this.dialogVisible = true
      },
      cancelPlan (id, event) {
        let btn = $(event.target)
        let self = this
        let d = dialog({
          title: '操作确认',
          content: '确认放弃计划？',
          okValue: '确定',
          width: 200,
          ok: function () {
            this.title('提交中…')
            self.$post({
              btn: btn,
              url: '/task/cancel.do',
              data: { id },
              'loading-msg': '处理中...',
              'success-msg': '处理成功',
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



