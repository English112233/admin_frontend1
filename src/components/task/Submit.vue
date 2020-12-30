<template>
  <div>
    <task-breadcrumb :title="title"/>
    <el-form ref="form" method="post" :action="$getReqUrl('/taskItem/create.do')" id="validateForm"
             onsubmit="return false"
             label-width="80px">


      <el-form-item label="任务ID">
        <el-col :span="6">
          {{$route.params.taskId}}
        </el-col>

      </el-form-item>

      <el-form-item label="旺旺">
        <el-col :span="6">
          <el-input name="wangwang" id="wangwang" v-model="model.wangwang" type="text"
                    placeholder="旺旺"></el-input>
        </el-col>

      </el-form-item>

      <el-form-item label="商品名称">
        <el-col :span="6">
          <el-input name="goodsName" id="goodsName" v-model="model.goodsName" type="text"
                    placeholder="商品名称"></el-input>
        </el-col>

      </el-form-item>

      <el-form-item label="关键字">
        <el-col :span="6">
          <el-input name="keyword" id="keyword" v-model="model.keyword" type="text"
                    placeholder="关键字"></el-input>
        </el-col>

      </el-form-item>


      <el-form-item label="订单时间">
        <el-col :span="6">

          <el-date-picker
            v-model="model.orderTime"
            name="orderTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>

        </el-col>
      </el-form-item>

      <el-form-item label="备注">
        <el-col :span="6">
          <el-input name="remark" id="remark" v-model="model.remark" type="text"
                    placeholder="备注"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item>
        <input type="hidden" name="taskId" v-model="$route.params.taskId">
        <input type="hidden" class="_tip" value="提交成功！">
        <input type="hidden" class="_loading" value="1">
        <el-button type="primary" native-type="submit">提交</el-button>
        <el-checkbox v-model="remember">提交后继续录入当前任务完成数据</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import TaskBreadcrumb from './TaskBreadcrumb'

  export default {
    name: 'TaskSubmit',
    components: { TaskBreadcrumb },
    data () {
      return {
        title: '完成任务',
        model: {},
        remember: false
      }
    },
    mounted () {
      let self = this
      this.$formValidate({
        'rules': {
          'wangwang': 'required|maxLength:64',
          'goodsName': 'required|maxLength:128',
          'keyword': 'required|maxLength:128',
          'orderTime': 'required|maxLength:128',
          'remark': 'maxLength:64'
        },
        'focus': true,
        'blockMode': true,
        'form': 'validateForm'
      }, {
        success: function () {
          if (self.remember) {
            document.getElementById('validateForm').reset()
          } else {
            self.$router.back()
          }
        }
      })
    }
  }
</script>
