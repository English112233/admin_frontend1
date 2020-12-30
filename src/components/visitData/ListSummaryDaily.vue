<template>
  <div>
    <visit-breadcrumb :title="title"/>

    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item label="店铺">
        <shop-select @change="changeShop" @updateMap="val=>shopMap=val" />
      </el-form-item>
      <el-form-item label="日期" prop="visitTime">

        <date-picker
          id="visitTime"
          name="visitTime"
          @update:value="updateTime"
          :value="query.tradeDate.substring(0,10)"
          readonly="readonly"
          class="el-input__inner date-picker"
        ></date-picker>

      </el-form-item>


      <el-form-item label="商品名" prop="goodsName">
        <goods-select ref="goods-select" @change="updateGoods"/>
      </el-form-item>


    </el-form>

    <el-table
      :data="content.page.list"
      border
      @sort-change="elSort"
      :default-sort="{prop: 'uv', order: 'descending'}"
      style="width: 100%" class="mt20">

      <el-table-column label="店铺" align="center" width="200">
        <template slot-scope="scope">
          {{shopMap[scope.row.shopId]}}
        </template>
      </el-table-column>

      <el-table-column label="日期" align="center" prop="visitTime" sortable="custom"
                       :sort-orders="['ascending', 'descending']" width="160">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.tradeDate, 'Y-m-d')}}
        </template>
      </el-table-column>


      <el-table-column label="商品" prop="goodsName" align="left" header-align="center">
        <template slot-scope="scope">
          <router-link
            :to="{name:'statGoods', query:{shopId:scope.row.shopId,shopName:shopMap[scope.row.shopId], goodsId:scope.row.goodsId, dateBegin:query.tradeDate.substring(0,10), dateEnd:query.tradeDate.substring(0,10)}}">
            <img :src="content.goodsMap[scope.row.goodsId].goodsImg"
                 v-show="content.goodsMap[scope.row.goodsId].goodsImg" class="goodsImg">
            {{content.goodsMap[scope.row.goodsId].goodsName}}
          </router-link>
        </template>
      </el-table-column>


      <el-table-column prop="uv" label="UV"
                       width="150"
                       sortable="custom"
                       :sort-orders="['ascending', 'descending']"
                       header-align="center" align="right"></el-table-column>
      <el-table-column prop="taskDone" label="做单数"
                       width="150"
                       sortable="custom"
                       :sort-orders="['ascending', 'descending']" header-align="center" align="right"></el-table-column>

      <el-table-column label="转换率" header-align="center" align="right" width="150">
        <template slot-scope="scope">
          {{scope.row.uv?$numToPercent(scope.row.taskDone/scope.row.uv):''}}
        </template>
      </el-table-column>

    </el-table>

    <pagination :pager="content.page" :query="query"/>
  </div>

</template>

<script>
  import Pagination from '../common/Pagination.vue'
  import VisitBreadcrumb from './VisitBreadcrumb'
  import DatePicker from 'bluesdk-vue-datepicker'
  import DateUtil from 'bluesdk-date-util'
  import ShopSelect from '../common/ShopSelect'
  import GoodsSelect from '../common/GoodsSelect'

  export default {
    name: 'ListSummaryDaily',
    data: function () {
      return {
        title: '商品统计',
        queryUrl: '/goods/listSummaryDaily.do',
        usePagePlugin: true,
        content: { page: { list: [] }, goodsMap: {} },
        shopMap: {},
        query: {
          shopId: this.$url.getPara('shopId'),
          shopName: this.$url.getPara('shopName'),
          goodsName: this.$url.getPara('goodsName'),
          goodsId: this.$url.getPara('goodsId'),
          tradeDate: this.$url.getPara('tradeDate', DateUtil.now('Y-m-d')),
          orderColumn: 'uv',
          orderType: 'DESC',
          pageSize: this.$url.getPara('pageSize', 20)
        }
      }
    },
    components: {
      GoodsSelect,
      ShopSelect,
      VisitBreadcrumb,
      Pagination,
      DatePicker
    },
    methods: {
      changeShop (c) {
        this.query.shopId = c.shopId
        this.query.shopName = c.shopName
        this.$refs['goods-select'].queryGoods(this.query.tradeDate, c.shopId, this.query.goodsId)
        this.search()
      },
      updateTime (val) {
        this.query.tradeDate = val
        this.$refs['goods-select'].queryGoods(this.query.tradeDate, this.query.shopId, this.query.goodsId)
        this.search()
      },
      updateGoods (val) {
        this.query.goodsId = val.goodsId
        this.query.goodsName = val.goodsName
        this.search()
      }
    }
  }
</script>
<style scoped>
  .goodsImg {
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }
</style>



