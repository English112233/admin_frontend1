<template>
  <el-row class="mt20">
    <el-col :span="2" class="text-right label">
      交易总金额：
    </el-col>
    <el-col :span="2">
      {{$moneyFormat(statistics.payMoneyTotal)}}元
    </el-col>
    <template v-if="isProfit">
      <el-col :span="2" class="text-right label">
        分润总金额：
      </el-col>
      <el-col :span="3">
        {{$moneyFormat(statistics.profitMoneyTotal)}}元
      </el-col>
    </template>
    <template v-if="isRefund">
      <el-col :span="2" class="text-right label">
        退款总金额：
      </el-col>
      <el-col :span="3">
        {{$moneyFormat(statistics.refundMoneyTotal)}}元
      </el-col>
    </template>
    <el-col :span="2" class="text-right label">
      总笔数：
    </el-col>
    <el-col :span="3">
      {{statistics.orderNum}}
    </el-col>
    <template v-if="isRefund">
      <el-col :span="3" class="text-right label">
        分润退款总金额：
      </el-col>
      <el-col :span="3">
        {{$moneyFormat(statistics.refundProfitMoneyTotal)}}元
      </el-col>
    </template>
  </el-row>
</template>

<script>
  export default {
    name: 'Statistics',
    props: {
      statistics: Object,
      isProfit: Boolean,
      isRefund: Boolean
    }
  }
</script>
<style scoped>
  .label {
    padding-right: 5px;
  }
</style>