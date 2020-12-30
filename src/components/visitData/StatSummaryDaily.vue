<template>
  <div>
    <el-row class="title">
      <el-col :span="15">商品名称</el-col>
      <el-col :span="3" class="text-right">访客数</el-col>
      <el-col :span="3" class="text-right">做单数</el-col>
      <el-col :span="3" class="text-right">转化率</el-col>
    </el-row>
    <el-row class="mt20">
      <el-col :span="15">
        <img :src="goodsImg">{{goodsName}}
      </el-col>
      <el-col :span="3" class="text-right">{{content.uv}}</el-col>
      <el-col :span="3" class="text-right">{{content.taskDone}}</el-col>
      <el-col :span="3" class="text-right">{{content.uv?$numToPercent(content.taskDone/content.uv):''}}</el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'StatSummaryDaily',
    data () {
      return {
        content: {}
      }
    },
    props: {
      goodsName: '',
      goodsImg: ''
    },
    methods: {
      fetchData (goodsId, dateBegin, dateEnd) {
        this.$getJson({
          url: '/goods/statSummaryDaily.do',
          data: { goodsId, dateBegin, dateEnd },
          callback (vue, res) {
            let c = {
              uv: 0,
              taskDone: 0
            }
            for (let i in res.data) {
              c.uv += res.data[i].uv
              c.taskDone += res.data[i].taskDone
            }
            vue.content = c
            vue.$emit('update', res.data)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .title {
    font-weight: bolder;
    border-bottom: 1px solid #dcdfe6;
    padding-bottom: 10px;
  }

  img {
    width: 50px;
    height: 50px;
    display: block;
    float: left;
    margin-right: 5px;
  }
</style>
