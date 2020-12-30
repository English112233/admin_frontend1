<template>
  <div>
    <visit-breadcrumb :title="title"/>
    <div>
      <el-input v-model="user" style="display: inline-block;width: 100px" placeholder="分配员工"/>
      <el-button @click="createTask">下发任务</el-button>

      <router-link v-bind:to="{ name: 'importKeyword'}" class="el-button el-button--default">
        导入关键字
      </router-link>

    </div>

    <el-table
      :data="content.list"
      border
      style="width: 100%" class="mt20">

      <el-table-column label="选择" align="center" width="50">
        <template slot-scope="scope">
          <label><input type="checkbox" name="check" :value="scope.row.id" v-model="checkList"></label>
        </template>
      </el-table-column>

      <el-table-column label="下发任务数" align="center" width="150">
        <template slot-scope="scope">
          <div class="el-input">
            <input type="number" :name="'num['+scope.row.id+']'" :data-word="scope.row.keyword"
                   :id="'num_'+scope.row.id" min="0" max="9999"
                   autocomplete="off" value="0" class="el-input__inner">
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="keyword" label="关键字" align="center"></el-table-column>


      <el-table-column prop="uv" label="UV" header-align="center" align="right"></el-table-column>
      <el-table-column prop="taskTotal" label="任务下发数" header-align="center" align="right"></el-table-column>
      <el-table-column prop="taskDone" label="任务完成数" header-align="center" align="right"></el-table-column>


      <el-table-column label="最后更新" align="center">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.updatedAt)}}
        </template>
      </el-table-column>


    </el-table>

    <pagination :pager="content" :query="query"/>
  </div>

</template>

<script>
  import Pagination from '../common/Pagination.vue'
  import VisitBreadcrumb from './VisitBreadcrumb'

  export default {
    name: 'AdminUserList',
    data: function () {
      return {
        title: '统计汇总',
        usePagePlugin: true,
        content: {},
        query: {
          orderColumn: 'uv',
          orderType: 'DESC'
        },
        checkList: [],
        user: ''
      }
    },
    components: {
      VisitBreadcrumb,
      Pagination
    },
    methods: {
      createTask () {
        if (this.checkList.length === 0) {
          this.$message.error('请选择关键字')
          return
        }
        let config = []
        for (let i = 0, len = this.checkList.length; i < len; i++) {
          const id = this.checkList[i]
          const input = document.querySelector('#num_' + id)
          const value = input.value
          if (value < 1) {
            this.$message.error('下发任务数不能为0')
            input.focus()
            return
          }
          config.push({ id, taskNum: value, keyword: input.dataset.word })
        }
        if (!this.user) {
          this.$message.error('分配员工未指定')
          return false
        }
        const _this = this
        this.$post({
          url: '/task/create.do',
          data: {
            userName: _this.user,
            config: JSON.stringify(config)
          },
          success () {
            _this.$message.success('任务创建成功')
            _this.refreshPage()
          }
        })
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
</style>



