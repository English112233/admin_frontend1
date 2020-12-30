<template>
  <div>
    <visit-breadcrumb :title="title"/>

    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item label="店铺">
        <shop-select @change="changeShop" @updateMap="val=>shopMap=val"/>
      </el-form-item>
      <el-form-item label="日期" prop="visitTime">

        <date-picker
          id="visitTime"
          name="visitTime"
          @update:value="updateTime"
          :value="query.visitTime.substring(0,10)"
          readonly="readonly"
          class="el-input__inner date-picker"
        ></date-picker>

      </el-form-item>


      <el-form-item label="商品名" prop="goodsName">
        <goods-select ref="goods-select" @change="updateGoods"/>
      </el-form-item>

      <el-form-item label="模糊查询" prop="fuzzy">
        <el-input v-model="query.fuzzy" :clearable="true" @change="handleSearch"></el-input>
      </el-form-item>

    </el-form>

    <el-table
      :data="content.list"
      border
      @sort-change="elSort"
      :default-sort="{prop: 'visitTime', order: 'descending'}"
      style="width: 100%" class="mt20">


      <el-table-column label="访问时间" align="center" prop="visitTime" sortable="custom"
                       :sort-orders="['ascending', 'descending']" width="160">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.visitTime)}}
        </template>
      </el-table-column>

      <el-table-column prop="visitFrom" label="入店来源" align="center" width="180"></el-table-column>
      <el-table-column prop="keyword" label="关键字" align="center"></el-table-column>


      <el-table-column label="被访问页面" prop="goodsName" align="left" header-align="center">
        <template slot-scope="scope">
          <router-link
            :to="{name:'statGoods', query:{shopId:scope.row.shopId,shopName:shopMap[scope.row.shopId], goodsId:scope.row.goodsId, tradeDate:query.visitTime.substring(0,10)}}">
            <img :src="scope.row.goodsImg" v-show="scope.row.goodsImg" class="goodsImg">
            {{scope.row.goodsName}}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column prop="visitorPosition" label="访客位置" align="center" width="180"></el-table-column>
      <el-table-column prop="visitorNo" label="访客编号" align="center" width="150"></el-table-column>

    </el-table>

    <pagination :pager="content" :query="query"/>
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
    name: 'AdminUserList',
    data: function () {
      return {
        title: '访问明细',
        usePagePlugin: true,
        content: {},
        shopMap: {},
        query: {
          fuzzy: this.$url.getPara('fuzzy'),
          shopId: this.$url.getPara('shopId'),
          shopName: this.$url.getPara('shopName'),
          goodsName: this.$url.getPara('goodsName'),
          goodsId: this.$url.getPara('goodsId'),
          visitTime: this.$url.getPara('visitTime', DateUtil.now('Y-m-d')),
          orderColumn: 'visitTime',
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
        this.$refs['goods-select'].queryGoods(this.query.visitTime, c.shopId, this.query.goodsId)
        this.search()
      },
      updateTime (val) {
        this.query.visitTime = val
        if (this.query.shopId) {
          this.$refs['goods-select'].queryGoods(this.query.visitTime, this.query.shopId, this.query.goodsId)
          this.search()
        }
      },
      updateGoods (val) {
        this.query.goodsId = val.goodsId
        this.query.goodsName = val.goodsName
        this.search()
      },
      handleSearch () {
        this.search()
      },
      fetchData: function (url) {
        if (this.query.shopId) {
          this.$getJson({ url: url })
        }
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



