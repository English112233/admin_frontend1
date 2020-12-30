<template>
  <div>
    <el-form :inline="true" :action="$getReqUrl(action)" method="post" class="query-form" id="validateForm"
             onsubmit="return false">

      <el-form-item label="员工" prop="userId">
        <input type="hidden" name="userId" v-model="model.userId">
        <user-select :selected-id="model.userId" :show-empty="false"
                     @updateMap="updateUserMap"
                     @change="val => model.userId=val"></user-select>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input name="keyword" v-model="model.keyword" placeholder="关键字"></el-input>
      </el-form-item>
      <el-form-item label="商品名" prop="goodsName">
        <el-input name="goodsName" v-model="model.goodsName" placeholder="商品名" style="width: 350px"></el-input>
      </el-form-item>

      <el-form-item label="任务数" prop="taskTotal">
        <el-input name="taskTotal" v-model="model.taskTotal" placeholder="任务数" style="width: 100px"></el-input>
      </el-form-item>

      <el-form-item>
        <input type="hidden" class="_tip" value="提交成功！">
        <input type="hidden" class="_loading" value="1">
        <input type="hidden" name="taskId" :value="model.taskId">
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
  import UserSelect from '../user/UserSelect'

  export default {
    name: 'TaskInfoForm',
    components: { UserSelect },
    props: {
      model: {
        type: Object,
        default () {
          return {
            taskId: '',
            userId: '',
            keyword: '',
            goodsName: '',
            taskTotal: 1
          }
        }
      },
      action: {
        type: String
      }
    },
    mounted () {
      const _this = this
      this.$formValidate({
        'rules': {
          'userId': 'required',
          'keyword': 'required|maxLength:128',
          'goodsName': 'required|maxLength:128',
          'taskTotal': 'required|integer|minNumeric:1|maxNumeric:1000'
        },
        'focus': true,
        'blockMode': true,
        'form': 'validateForm',
        customErrorMsg: {
          userId: {
            required: '请选择员工'
          }
        }
      }, {
        success: function () {
          _this.$emit('createNewTask')
        }
      })
    },
    methods: {
      updateUserMap (val) {
        this.$emit('updateUserMap', val)
      },
      submit () {
        const _this = this
        this.$post({
          url: this.action,
          data: _this.model,
          success () {
            _this.$message.success('保存成功')
            _this.$emit('createNewTask')
          }
        })
      }
    }
  }
</script>
