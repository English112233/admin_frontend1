<template>
  <div>
    <div class="tip-bar">
      <div class="pull-left">
        <span class="title">终端——访客数</span>
      </div>

      <div class="clear"></div>
    </div>
    <div id="echarts" style="width: 800px;height: 400px"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import DateUtil from 'bluesdk-date-util'

  export default {
    name: 'StatSummaryDailyChart',
    methods: {
      showEchart (rows) {
        let date = []
        let uv = []
        for (let i in rows) {
          date.push(DateUtil.format('m-d', rows[i].tradeDate / 1000))
          uv.push(rows[i].uv)
        }
        this.render(date, uv)
      },
      render (date, uv) {
        const e = echarts.init(document.getElementById('echarts'))
        e.setOption({
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
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
            name: 'UV',
            data: uv,
            type: 'line',
            lineStyle: {
              color: '#ca8622'
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
