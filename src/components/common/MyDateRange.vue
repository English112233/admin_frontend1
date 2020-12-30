<template>
  <el-date-picker
    v-model="dateRange"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :picker-options="pickerOptions"
  >
  </el-date-picker>
</template>
<script>
  import DateUtil from 'bluesdk-date-util'

  export default {
    name: 'MyDateRange',
    data () {
      return {
        dateRange: '',
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick (picker) {
                const start = new Date()
                picker.$emit('pick', [start, start])
              }
            },
            {
              text: '昨天',
              onClick (picker) {
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', [start, start])
              }
            },
            {
              text: '近7天',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近30天',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
        dateBegin: this.$url.getPara('dateBegin', DateUtil.now('Y-m-d')),
        dateEnd: this.$url.getPara('dateEnd', DateUtil.now('Y-m-d'))
      }
    },
    created () {
      setTimeout(() => {
        if (!this.dateRange) {
          this.dateRange = [new Date(this.$url.getPara('dateBegin')), new Date(this.$url.getPara('dateBegin'))]
        }
      }, 300)
    },
    watch: {
      dateRange (dateRange) {
        if (dateRange) {
          const dateBegin = DateUtil.format('Y-m-d', dateRange[0].getTime() / 1000)
          const dateEnd = DateUtil.format('Y-m-d', dateRange[1].getTime() / 1000)
          this.$emit('change', {
            dateBegin,
            dateEnd,
            dateRange
          })
        }
      }
    }
  }
</script>
<style scoped>
  .date-picker {
    width: 105px;
  }
</style>
