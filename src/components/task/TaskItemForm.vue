<template>
  <div>
    <el-form :action="$getReqUrl(action)" method="post" id="validateForm"
             onsubmit="return false" label-width="80px" style="margin-right: 30px">


      <el-form-item label="旺旺号" prop="wangwang">

        <el-date-picker
          v-model="model.completedAt"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>

      </el-form-item>

      <el-form-item label="旺旺号" prop="wangwang">
        <el-input name="wangwang" v-model="model.wangwang" placeholder="" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input name="orderNo" v-model="model.orderNo" placeholder="" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input name="mobile" v-model="model.mobile" placeholder="" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input name="remark" v-model="model.remark" placeholder="" :clearable="true"></el-input>
      </el-form-item>


      <el-form-item>
        <input type="hidden" name="taskId" :value="model.taskId">
        <input type="hidden" class="_tip" value="提交成功！">
        <input type="hidden" class="_loading" value="1">
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'TaskItemForm',
    components: {},
    data () {
      return {}
    },
    props: {
      model: {
        type: Object,
        default () {
          return {
            wangwang: '',
            remark: '',
            taskId: '',
            mobile: '',
            orderNo: '',
            completedAt: ''
          }
        }
      },
      action: {
        type: String
      },
      isNew: {
        type: Boolean
      }
    },
    methods: {
      submit () {
        const _this = this
        if (typeof this.model.completedAt === 'object') {
          this.model.completedAt = this.$mTimeToDate(this.model.completedAt.getTime())
        }
        this.$post({
          url: this.action,
          data: _this.model,
          success () {
            _this.$message.success('保存成功')
            _this.$emit('submitItemForm')
          }
        })
      },
      getLabel (item) {
        return '任务ID:' + item.taskId + ',关键字:' + item.keyword + ',商品：' + item.goodsName
      }
    }
  }
</script>
