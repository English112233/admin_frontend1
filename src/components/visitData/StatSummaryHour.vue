<template>
  <div>
    <div class="tip-bar">
      <div class="pull-left">
        <span class="title">终端——访客数</span>
        <span>
        <date-picker
          id="otherDate"
          name="otherDate"
          :max-date="yesterday"
          @update:value="updateTime"
          :value="otherDate"
          readonly="readonly"
          class="el-input__inner date-picker"
        ></date-picker>
      </span>
      </div>
      <div class="pull-right">
        <span>今日</span>
        <span class="today-color">———</span>
        <span>对比日</span>
        <span class="other-color">- - - - -</span>
      </div>
      <div class="clear"></div>
    </div>
    <div id="echarts" style="width: 800px;height: 400px"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import DatePicker from 'bluesdk-vue-datepicker'
  import DateUtil from 'bluesdk-date-util'

  export default {
    name: 'StatSummaryHour',
    data () {
      return {
        yesterday: DateUtil.beforeToday(1),
        otherDate: DateUtil.format('Y-m-d', DateUtil.beforeToday(1).getTime() / 1000),
        otherData: [],
        todayData: []
      }
    },
    props: {
      goodsId: {
        type: String
      },
      tradeDate: {
        type: String
      }
    },
    components: { DatePicker },
    mounted () {
      this.updateEchat(true)
    },
    watch: {
      goodsId (val) {
        console.log(val, 'goodsId')
        this.updateEchat(true)
      },
      otherDate (val) {
        console.log(val, 'otherDate')
        this.updateEchat(false)
      }
    },
    methods: {
      updateEchat (goodsIdChange) {
        if (!this.goodsId) {
          return
        }
        const self = this
        this.fetchData(this.otherDate).then(function (data) {
          self.otherData = data
          if (goodsIdChange) {
            self.fetchData(self.tradeDate).then(function (data) {
              self.todayData = data
              self.showEchart()
            })
          } else {
            self.showEchart()
          }
        })
      },
      updateTime (val) {
        this.otherDate = val
      },
      fetchData (tradeDate) {
        return new Promise((resolve) => {
          this.$getJson({
            url: '/goods/statSummaryHourly.do',
            data: { goodsId: this.goodsId, tradeDate },
            callback (vue, res) {
              const arr = vue.createData(res.data)
              /* let result = []
              for (let i = 0; i <= 23; i++) {
                let uv = arr[i]
                i++
                uv += arr[i]
                result.push(uv)
              } */
              // console.log(result, tradeDate)
              resolve(arr)
            }
          })
        })
      },
      createData (rows) {
        let result = []
        for (let i = 0; i <= 23; i++) {
          let uv = 0
          for (let index in rows) {
            let row = rows[index]
            if (row.tradeHour === i) {
              uv = row.uv
              break
            }
          }
          result.push(uv)
        }
        return result
      },
      showEchart () {
        const self = this
        const e = echarts.init(document.getElementById('echarts'))
        e.setOption({
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
            // data: ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
          },
          yAxis: {
            type: 'value'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          series: [{
            name: '今日',
            data: self.todayData,
            type: 'line',
            lineStyle: {
              color: '#ca8622'
            }
          }, {
            name: '对比日',
            data: self.otherData,
            type: 'line',
            lineStyle: {
              color: '#546570',
              width: 1,
              type: 'dashed'
            }
          }]
        })
      }
    }
  }
</script>

<style scoped>
  .tip-bar {
    line-height: 40px;
  }

  .title {
    font-weight: bold;
    font-size: 16px;
    padding-left: 40px;
    padding-right: 100px;
  }

  .today-color {
    color: #ca8622;
    font-weight: bold;
  }

  .other-color {
    color: #546570;
    font-weight: bold;
  }
</style>
