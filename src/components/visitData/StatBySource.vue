<template>

  <div class="sourceDiv">
    <el-row>
      <el-col :span="6" class="title">来源</el-col>
      <el-col :span="18" class="title">访客数</el-col>
    </el-row>
    <el-row v-for="(item,index) in content" :key="index" class="mt10">
      <el-col :span="6">{{item.sourceValue}}</el-col>
      <el-col :span="18">
        <el-row>
          <el-col :span="4" class="num">{{item.uv}}</el-col>
          <el-col :span="20" class="color-bar">
            <div :class="getClassName(index)" :style="{width:$numToPercent(item.uv/uvTotal)}"></div>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'StatBySource',
    data () {
      return { content: [], uvTotal: 0 }
    },
    methods: {
      fetchData (goodsId, dateBegin, dateEnd) {
        this.$getJson({
          url: '/goods/statBySourceDaily.do',
          data: { goodsId, dateBegin, dateEnd },
          callback (vue, res) {
            vue.uvTotal = 0
            let sourceDataMap = {}
            for (let i in res.data) {
              if (!sourceDataMap[res.data[i].sourceValue]) {
                sourceDataMap[res.data[i].sourceValue] = 0
              }
              sourceDataMap[res.data[i].sourceValue] += res.data[i].uv
            }
            let statResult = []
            for (let sourceValue in sourceDataMap) {
              vue.uvTotal += sourceDataMap[sourceValue]
              statResult.push({ uv: sourceDataMap[sourceValue], sourceValue })
            }
            statResult.sort(function (a, b) {
              return b.uv - a.uv
            })
            vue.content = statResult
          }
        })
      },
      getClassName (index) {
        if (index < 3) {
          return 'top-' + index
        } else {
          return 'top-3'
        }
      }
    }
  }
</script>
<style scoped>
  .sourceDiv {
    width: 300px;
    font-size: 12px;
  }

  .title {
    color: #53A6A5;
    font-weight: 800;
  }

  .top-0 {
    background: #ffa60b;
  }

  .top-1 {
    background: #97ce68;
  }

  .top-2 {
    background: #6bcbca;
  }

  .top-3 {
    background: #a3e4e3;
  }

  .color-bar {
    position: relative;
    height: 15px;
  }

  .color-bar > div {
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;

  }

  .num {
    text-align: right;
    padding-right: 5px;
  }
</style>
