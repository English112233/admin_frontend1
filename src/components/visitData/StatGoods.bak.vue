<template>
  <div>
    <visit-breadcrumb :title="title"/>

    <el-form :inline="true" :model="query" class="query-form">

      <el-form-item label="日期" prop="tradeDate">

        <date-picker
          id="tradeDate"
          name="tradeDate"
          @update:value="val=>query.tradeDate=val"
          :value="query.tradeDate.substring(0,10)"
          readonly="readonly"
          class="el-input__inner date-picker"
        ></date-picker>

      </el-form-item>

      <el-form-item label="商品名" prop="goodsName">
        <el-input name="goodsName" v-model="query.goodsName" placeholder="商品名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>

    </el-form>

    <el-table
      :data="content.list"
      border
      @sort-change="elSort"
      :default-sort="{prop: 'visitTime', order: 'descending'}"
      style="width: 100%" class="mt20">

      <el-table-column label="日期" align="center" width="160">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.tradeDate).substr(0,10)}}
        </template>
      </el-table-column>

      <el-table-column prop="goodsName" label="商品" align="center"></el-table-column>


      <el-table-column prop="uv" label="UV"
                       width="150"
                       sortable="custom"
                       :sort-orders="['ascending', 'descending']"
                       header-align="center" align="right"></el-table-column>
      <el-table-column prop="taskNum" label="做单数"
                       width="150"
                       sortable="custom"
                       :sort-orders="['ascending', 'descending']" header-align="center" align="right"></el-table-column>

      <el-table-column label="转换率" header-align="center" align="right">
        <template slot-scope="scope">
          {{scope.row.taskNum>0? $numToPercent(scope.row.uv/scope.row.taskNum):'0'}}
        </template>
      </el-table-column>
      <el-table-column label="最后更新" align="center" width="160">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.updatedAt)}}
        </template>
      </el-table-column>


    </el-table>

    <pagination :pager="content" :query="query"/>
  </div>

</template>

<script>
  import Pagination from '../common/Pagination.vue'
  import VisitBreadcrumb from './VisitBreadcrumb'
  import DatePicker from 'bluesdk-vue-datepicker'
  import DateUtil from 'bluesdk-date-util'

  export default {
    name: 'AdminUserList',
    data: function () {
      return {
        title: '关键字汇总',
        usePagePlugin: true,
        content: {},
        query: {
          tradeDate: this.$url.getPara('tradeDate', DateUtil.now('Y-m-d')),
          goodsName: this.$url.getPara('goodsName'),
          orderColumn: this.$url.getPara('orderColumn', 'uv'),
          orderType: this.$url.getPara('orderType', 'DESC')
        },
        checkList: [],
        user: ''
      }
    },
    components: {
      VisitBreadcrumb,
      Pagination,
      DatePicker
    },
    methods: {
      createTask () {
        if (this.checkList.length === 0) {
          this.$message.error('请选择关键字')
          return
        }
        let config = []
        for (let i = 0, len = this.checkList.length; i < len; i++) {
          const id = this.checkList[i]
          const input = document.querySelector('#num_' + id)
          const value = input.value
          if (value < 1) {
            this.$message.error('下发任务数不能为0')
            input.focus()
            return
          }
          config.push({ id, taskNum: value, keyword: input.dataset.word })
        }
        if (!this.user) {
          this.$message.error('分配员工未指定')
          return false
        }
        const _this = this
        this.$post({
          url: '/task/create.do',
          data: {
            userName: _this.user,
            config: JSON.stringify(config)
          },
          success () {
            _this.$message.success('任务创建成功')
            _this.refreshPage()
          }
        })
      }
    }
  }
</script>
<style scoped>
  label {
    width: 30px;
    height: 30px;
    margin: auto;
    text-align: center;
    vertical-align: middle;
    display: table-cell;
  }

  label > input[type=checkbox] {
    vertical-align: middle;
  }
</style>



