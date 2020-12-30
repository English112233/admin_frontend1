<template>
  <div>
    <visit-breadcrumb :title="title"/>

    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item label="店铺">
        <shop-select @change="changeShop" @updateMap="val=>shopMap=val"/>
      </el-form-item>


      <el-form-item label="日期" prop="tradeDate">


        <my-date-range @change="dateRangeChange"></my-date-range>

      </el-form-item>


      <el-form-item label="商品名" prop="goodsName">
        <goods-select ref="goods-select" @change="updateGoods"/>
      </el-form-item>


    </el-form>

    <div class="mt10" v-show="content.list.length>0">

      <div class="pull-left" style="width:700px">
        <stat-summary-daily @update="updateSummaryDaily" ref="stat-summary-daily" :goods-img="goodsInfo.goodsImg"
                            :goods-name="goodsInfo.goodsName"/>
        <stat-summary-hour ref="stat-summary-hour" v-if="query.dateEnd==query.dateBegin" :goods-id="query.goodsId"
                           :trade-date="query.dateBegin"/>

        <stat-summary-daily-chart v-if="query.dateEnd!=query.dateBegin"
                                  ref="stat-summary-daily-chart"></stat-summary-daily-chart>

      </div>
      <stat-by-region ref="stat-by-region" class="pull-right"/>
      <stat-by-source ref="stat-by-source" class="pull-right mr20"/>
      <div class="clear"></div>
    </div>


    <el-form :inline="true" :model="query" class="query-form" onsubmit="return false">
      <el-form-item label="关键字" prop="keywordValue">
        <el-input v-model="query.keywordValue" :clearable="true" @change="searchByKeyword"></el-input>
      </el-form-item>
    </el-form>

    <el-table
      ref="multipleTable"
      id="query-table-id"
      :data="content.list"
      border
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'tradeDate', order: 'descending'}"
      style="width: 100%" class="mt20">

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column label="下发任务数" align="center" width="150">
        <template slot-scope="scope">
          <div class="el-input">
            <el-input-number :id="'num_'+scope.row.id" size="mini" v-model="checkRowList[scope.row.id]" controls-position="right" @change="(e) => handleChangeNum(e, scope.row)" :min="0" :max="999"></el-input-number>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="日期"
                       sortable="custom"
                       :sort-orders="['ascending', 'descending']"
                       align="center" width="160">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.tradeDate).substr(0,10)}}
        </template>
      </el-table-column>

      <el-table-column prop="keywordValue" label="关键字" align="center"></el-table-column>


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
      <el-table-column label="最后更新" align="center" width="160">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.updatedAt)}}
        </template>
      </el-table-column>


    </el-table>

    <pagination class="pager-area mt10" :pager="content" :query="query" v-show="content.list.length>0">
      <template slot="left-extend">
        <el-button @click="selectAll">全部选中</el-button>
        <el-button @click="cancelAll">全部取消</el-button>
        <user-select :show-empty="false" @change="changeUser"/>
        <el-button @click="createTask">下发任务</el-button>
      </template>
      <template slot="left-number">
        <span>总共：{{this.number}}单</span>
      </template>
    </pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="1360px"
    >
      <div slot="title">
        <div style="float: left;width: 50%"><b>任务表</b></div>
        <div style="float: right;width: 50%"><b>记录表</b></div>
        <div class="clear"></div>
      </div>
      <div>
        <el-input
          style="display: block;float: left;width: 49%"
          type="textarea"
          :rows="15"
          placeholder="请输入内容"
          v-model="keywords"/>

        <el-input
          style="display: block;float: right;width: 49%"
          type="textarea"
          :rows="15"
          placeholder="请输入内容"
          v-model="goodsRemark"
          @change="saveGoodsRemark"
        />


        <div class="clear"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-input type="text" class="remark" v-model="remark" placeholder="备注"></el-input>
          <el-button type="primary" @click="submitTask">下发任务</el-button>
        </div>
        <div style="clear: both;margin-top: 10px">
          <div class="text-left">
            <span>
              开始日期
              <el-date-picker
                v-model="taskDateBegin"
                type="date"
                style="width: 136px"
                @change="changeTaskDateBegin"
                placeholder="选择日期">
              </el-date-picker>
            </span>
            <span title="提前多少分钟">
              显示时间
              <el-input-number v-model="taskShowMinute" :min="0" :max="6000"></el-input-number>
            </span>
          </div>

          <div class="time-setting">
            <div class="time-label">
              数量设置
            </div>
            <div class="time-item">
              <div v-for="hour in [0,1,2,3,4,5,6,7,8,9,10,11]">
                <span class="text-center">{{hour<10?'0'+hour:hour}}:00</span>
                <el-input-number size="small" class="num" v-model="taskTime[hour]" :min="0"
                                 :max="taskRest+taskTime[hour]"
                                 :disabled="disableHours[hour]"
                                 @change="setTaskTime"/>
              </div>
              <div v-for="hour in [12,13,14,15,16,17,18,19,20,21,22,23]" class="mt10">
                <span class="text-center">{{hour}}:00</span>
                <el-input-number size="small" class="num" v-model="taskTime[hour]" :min="0"
                                 :max="taskRest+taskTime[hour]"
                                 :disabled="disableHours[hour]"
                                 @change="setTaskTime"/>
              </div>
            </div>
          </div>
          <div class="time-desc">
            总共<span>{{taskTotal}}</span>单，已设置<span>{{taskDone}}</span>单，未设置<span
            class="error">{{taskRest}}</span>单。
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import Pagination from '../common/Pagination.vue'
  import VisitBreadcrumb from './VisitBreadcrumb'
  import DatePicker from 'bluesdk-vue-datepicker'
  import DateUtil from 'bluesdk-date-util'
  import GoodsSelect from '../common/GoodsSelect'
  import ShopSelect from '../common/ShopSelect'
  import StatByRegion from './StatByRegion'
  import StatSummaryDaily from './StatSummaryDaily'
  import StatSummaryHour from './StatSummaryHour'
  import UserSelect from '../user/UserSelect'
  import StatBySource from './StatBySource'
  import StatSummaryDailyChart from './StatSummaryDailyChart'
  import MyDateRange from '../common/MyDateRange'

  const today = DateUtil.format('Ymd')
  export default {
    name: 'AdminUserList',
    data: function () {
      return {
        num: 1,
        dialogVisible: false,
        title: '商品统计',
        queryUrl: '/goods/statByKeywordDaily.do',
        usePagePlugin: true,
        content: { list: [] },
        hashNumer: {},
        number: 0,
        shopMap: {},
        query: {
          shopId: this.$url.getPara('shopId'),
          shopName: this.$url.getPara('shopName'),
          keywordValue: this.$url.getPara('keywordValue'),
          goodsName: this.$url.getPara('goodsName'),
          goodsId: this.$url.getPara('goodsId'),
          dateBegin: this.$url.getPara('dateBegin', this.$route.query.tradeDate),
          dateEnd: this.$url.getPara('dateEnd', this.$route.query.tradeDate),
          orderColumn: 'uv',
          orderType: 'DESC',
          commonDateRange: this.$url.getPara('commonDateRange', 'yesterday'),
          pageSize: this.$url.getPara('pageSize', 20)
        },
        dateRange: '',
        goodsInfo: { goodsImg: '' },
        checkList: [],
        user: '',
        keywords: '',
        remark: '',
        taskDateBegin: new Date(),
        taskShowMinute: 40,
        taskTime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        goodsRemark: '',
        taskTotal: 0,
        taskDone: 0,
        taskRest: 0,
        disableHours: {},
        multipleSelection: [],
        checkRowList: {},
        firstLoad: true
      }
    },
    components: {
      MyDateRange,
      StatSummaryDailyChart,
      StatBySource,
      UserSelect,
      StatSummaryHour,
      StatSummaryDaily,
      StatByRegion,
      GoodsSelect,
      ShopSelect,
      VisitBreadcrumb,
      Pagination,
      DatePicker
    },
    watch: {
      multipleSelection (id) {
        // console.error(this.multipleSelection)
      },
      checkList (val) {
        for (let i in this.content.list) {
          const id = this.content.list[i].id
          const e = document.getElementById('num_' + id)
          if (val.indexOf(id) === -1) {
            e.value = 0
          } else {
            if (e.value < 1) {
              e.value = 1
            }
          }
        }
      }
    },
    created () {
      this.$getJson({
        url: '/goodsRemark/find.do',
        data: { goodsId: this.query.goodsId },
        callback (vue, res) {
          vue.goodsRemark = res.data.remark
        }
      })
      if (localStorage.taskShowMinute !== undefined && localStorage.taskShowMinute !== null) {
        this.taskShowMinute = parseInt(localStorage.taskShowMinute)
      }
      this.changeTaskDateBegin()
    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
        let number = 0
        this.multipleSelection.forEach(item => {
          if (this.checkRowList[item.id]) {
            number += this.checkRowList[item.id]
          } else {
            this.checkRowList[item.id] = 1
            number += this.checkRowList[item.id]
          }
          if (this.checkList.indexOf(item.id) === -1) {
            this.checkList.push(item.id)
          }
        })
        this.number = number
        if (!val.length) {
          for (let i in this.content.list) {
            const id = this.content.list[i].id
            this.checkRowList[id] = 0
          }
          this.checkList = []
        }
      },
      handleChangeNum (value, row) {
        this.checkRowList[row.id] = value
        let number = 0
        this.multipleSelection.forEach(item => {
          if (this.checkRowList[item.id]) {
            number += this.checkRowList[item.id]
          }
        })
        this.number = number
      },
      selectAll () {
        for (let i in this.content.list) {
          const id = this.content.list[i].id
          if (this.checkList.indexOf(id) === -1) {
            this.checkList.push(id)
          }
        }
        this.content.list.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
        for (let i in this.content.list) {
          const id = this.content.list[i].id
          if (!this.checkRowList[id]) {
            this.checkRowList[id] = 1
          }
        }
      },
      cancelAll () {
        this.checkList = []
        this.$refs.multipleTable.clearSelection()
        for (let i in this.content.list) {
          const id = this.content.list[i].id
          this.checkRowList[id] = 0
        }
      },
      createTask () {
        if (this.checkList.length === 0) {
          this.$message.error('请选择关键字')
          return
        }
        let keywords = []
        // console.error(this.checkList)
        for (let i = 0, len = this.checkList.length; i < len; i++) {
          const id = this.checkList[i]
          const input = document.querySelector('#num_' + id)
          // console.error(this.checkRowList, this.content)
          const value = this.checkRowList[id]
          if (value < 1) {
            this.$message.error('下发任务数不能为0')
            input.focus()
            return
          }
          for (let n = 0; n < value; n++) {
            this.content.list.forEach(item => {
              if (item.id === id) {
                keywords.push(item.keywordValue)
              }
            })
          }
        }
        if (!this.user) {
          this.$message.error('分配员工未指定')
          return false
        }
        // console.error(keywords)
        this.keywords = keywords.join('\n')
        this.taskTotal = this.taskRest = keywords.length
        this.taskDone = 0
        for (let i = 0, len = this.taskTime.length; i < len; i++) {
          this.taskTime[i] = 0
        }
        this.dialogVisible = true
      },
      changeShop (c) {
        for (let i in this.content.list) {
          const id = this.content.list[i].id
          this.checkRowList[id] = 0
        }
        // if (this.firstLoad) {
        //   for (let i in this.content.list) {
        //     const id = this.content.list[i].id
        //     this.checkRowList[id] = 0
        //   }
        //   this.firstLoad = false
        // }
        this.query.shopId = c.shopId
        this.query.shopName = c.shopName
        this.$refs['goods-select'].queryGoods2(this.query.dateBegin, this.query.dateEnd, c.shopId, this.query.goodsId)
        this.handleSearch()
      },
      dateRangeChange (val) {
        this.query.dateEnd = val.dateEnd
        this.query.dateBegin = this.$route.query.tradeDate ? this.$route.query.tradeDate : val.dateBegin
        this.$refs['goods-select'].queryGoods2(this.query.dateBegin, this.query.dateEnd, this.query.shopId, this.query.goodsId)
        this.handleSearch()
      },
      updateGoods (val) {
        if (this.query.goodsId !== val.goodsId) {
          this.query.goodsId = val.goodsId
          this.query.goodsName = val.goodsName
          this.handleSearch()
        }
        this.goodsInfo = val
      },
      handleSearch () {
        this.$refs['stat-by-source'].fetchData(this.query.goodsId, this.query.dateBegin, this.query.dateEnd)
        this.$refs['stat-by-region'].fetchData(this.query.goodsId, this.query.dateBegin, this.query.dateEnd)
        this.$refs['stat-summary-daily'].fetchData(this.query.goodsId, this.query.dateBegin, this.query.dateEnd)
        if (this.query.goodsId && this.query.shopId && this.query.dateBegin && this.query.dateEnd) {
          this.search()
        }
      },
      updateSummaryDaily (data) {
        if (this.query.dateEnd !== this.query.dateBegin) {
          this.$refs['stat-summary-daily-chart'].showEchart(data)
        } else {
          this.$refs['stat-summary-hour'].updateEchat(true)
        }
      },
      changeUser (val) {
        this.user = val
      },
      searchByKeyword () {
        this.refreshPage()
      },
      saveGoodsRemark () {
        const self = this
        self.$post({
          url: '/goodsRemark/save.do',
          data: {
            goodsId: this.query.goodsId,
            remark: this.goodsRemark
          },
          success () {
            self.$message.success('记录表保存成功')
          }
        })
      },
      submitTask () {
        const self = this
        if (this.query.dateBegin !== this.query.dateEnd) {
          self.$message.error('多时段下不支持发布任务')
          return
        }
        if (this.taskRest > 0) {
          return self.$message.error('还有' + this.taskRest + '单未设置时间')
        }
        const taskDate = DateUtil.format('Y-m-d', this.taskDateBegin.getTime() / 1000)
        const taskTimes = []
        for (let i = 0, len = this.taskTime.length; i < len; i++) {
          const time = i < 10 ? `0${i}` : i
          for (let j = 0; j < this.taskTime[i]; j++) {
            taskTimes.push(taskDate + ' ' + time + ':00')
          }
        }

        this.$post({
          url: '/task/create.do',
          data: {
            userId: this.user,
            keywords: this.keywords.trim(),
            remark: this.remark.trim(),
            goodsId: this.query.goodsId,
            shopId: this.query.shopId,
            tradeDate: this.query.dateBegin,
            taskTimes: JSON.stringify(taskTimes),
            taskShowMinute: this.taskShowMinute
          },
          success () {
            self.dialogVisible = false
            self.$message.success('下发成功')
            localStorage.taskShowMinute = self.taskShowMinute
          }
        })
      },
      setTaskTime () {
        this.taskDone = 0
        for (let i = 0, len = this.taskTime.length; i < len; i++) {
          this.taskDone += this.taskTime[i]
        }
        this.taskRest = this.taskTotal - this.taskDone
      },
      changeTaskDateBegin () {
        const day = DateUtil.format('Ymd', this.taskDateBegin)
        if (today > day) {
          this.$message.error('日期不能早于今天')
          this.taskDateBegin = new Date()
          return
        }
        this.disableHours = {}
        if (today === day) {
          const currHour = new Date().getHours()
          for (let i = 0; i <= 23; i++) {
            if (i < currHour) {
              this.disableHours[i] = true
              this.taskTime[i] = 0
            }
          }
          this.setTaskTime()
        }
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

  .remark {
    display: inline-block;
    width: 380px;
    float: left;
  }

  .time-setting {
    position: relative;
    height: 125px;
    margin-top: 10px;
  }

  .time-label {
    position: absolute;
    left: 0;
  }

  .time-item {
    position: absolute;
    right: 0;
  }

  .time-item > div {
    display: inline-block;
    margin-right: 5px;
  }

  .time-item > div > span {
    display: block;
  }

  .time-item > div > .num {
    width: 100px;
  }

  .time-desc {
    text-align: left;
    padding-left: 60px;
  }

  .time-desc > span {
    padding: 0 3px;
  }

  .time-desc > span.error {
    color: red;
  }
</style>



