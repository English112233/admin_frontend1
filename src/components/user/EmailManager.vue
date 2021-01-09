<template>
  <div>
    <div class="email-form">
      <el-form ref="form" :model="fuzzyQuery" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
          <el-form-item label="模糊查询" label-width="80px">
            <el-input v-model="fuzzyQuery.fuzzyQueryText"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item >
              <el-button type="primary" @click="search">搜 索</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否接受消息" label-width="120px">
              <el-switch
                v-model="fuzzyQuerySwich"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="fuzzyQueryChange">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item >
              <el-button type="primary" @click="newlyBuild">新 建</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="data" border style="width: 100%">
      <el-table-column  prop="id" label="id" align="center" width="150">
      </el-table-column>
      <el-table-column prop="userName" label="用户名" align="center" width="300">
      </el-table-column>
      <el-table-column prop="userMailAddress" label="邮件地址" align="center" width="300">
      </el-table-column>
      <el-table-column  prop="createdAt" label="创建时间" align="center" width="300">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="" align="center" label="权限状态">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="scope.row.disabled" @change=tableSwichChange(scope.$index,scope.row)>
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      center>
      <el-form :model="dialogContent" label-width="80px">
        <el-form-item label="邮件地址">
          <el-input v-model="dialogContent.userMailAddress"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="dialogContent.userName"></el-input>
        </el-form-item>
        <el-form-item label="活动名称">
          <el-switch
            v-model="dialogContent.disabled"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="determineDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'EmailManager',
    components: {},
    data: function () {
      return {
        data: [],
        centerDialogVisible: false,
        dialogContent: {},
        dialogTitle: '编辑',
        fuzzyQuery: {
          fuzzyQueryText: ''
        },
        fuzzyQuerySwich: false
      }
    },
    created: function () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        this.$axios({
          method: 'post',
          url: '/api/email/list.do',
          data: this.qs.stringify({
            pageNum: 1,
            pageSize: 20
          })
        }).then((response) => {
          if (response && response.data && response.data.data && response.data.data.records) {
            response.data.data.records.forEach(item => {
              item.disabled = !item.disabled
            })
            this.data = response.data.data.records
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      handleEdit (row) {
        console.error(row)
        this.centerDialogVisible = true
        this.dialogContent = row
        this.dialogTitle = '编辑'
      },
      handleClick (row) {
        console.error(row)
      },
      determineDialog () {
        if (this.dialogTitle === '编辑') {
          this.$axios({
            method: 'post',
            url: '/api/email/update.do',
            data: this.qs.stringify({
              id: this.dialogContent.id,
              userMailAddress: this.dialogContent.userMailAddress,
              userName: this.dialogContent.userName,
              disabled: 1
            })
          }).then((response) => {
            this.getDataList()
            this.centerDialogVisible = false
            this.dialogContent = {}
          }).catch((error) => {
            console.log(error)
          })
        }
        if (this.dialogTitle === '新建') {
          this.$axios({
            method: 'post',
            url: '/api/email/createemaileuser.do',
            data: this.qs.stringify({
              id: this.dialogContent.id,
              userMailAddress: this.dialogContent.userMailAddress,
              userName: this.dialogContent.userName,
              disabled: 1
            })
          }).then((response) => {
            this.getDataList()
            this.centerDialogVisible = false
            this.dialogContent = {}
          }).catch((error) => {
            console.log(error)
          })
        }
      },
      cancelDialog () {
        this.centerDialogVisible = false
        this.dialogContent = {}
      },
      tableSwichChange (value, row) {
        this.$axios({
          method: 'post',
          url: '/api/email/update.do',
          data: this.qs.stringify({
            id: row.id,
            userMailAddress: row.userMailAddress,
            userName: row.userName,
            disabled: Number(!row.disabled)
          })
        })
      },
      fuzzyQueryChange (value) {
        this.fuzzyQuerySwich = value
        this.$axios({
          method: 'post',
          url: '/api/email/onoffemailreminder.do',
          data: this.qs.stringify({
            fuzzy: Number(!this.fuzzyQuerySwich)
          })
        }).then((response) => {
          console.error(response)
        }).catch((error) => {
          console.log(error)
        })
      },
      newlyBuild () {
        this.dialogTitle = '新建'
        this.centerDialogVisible = true
        this.dialogContent = {}
      },
      search () {
        if (this.fuzzyQuery.fuzzyQueryText === '') {
          this.getDataList()
          return
        }
        this.fuzzyQuery.fuzzyQueryText = this.fuzzyQuery.fuzzyQueryText.replace(/ /g, '')
        this.$axios({
          method: 'post',
          url: '/api/email/emailFuzzyFind.do',
          data: this.qs.stringify({
            fuzzy: this.fuzzyQuery.fuzzyQueryText
          })
        }).then((response) => {
          if (response && response.data && response.data.data) {
            response.data.data.records.forEach(item => {
              item.disabled = !item.disabled
            })
            this.data = response.data.data
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>
<style scoped>
.email-form {
  width: calc(100% - 40px);
  height: 50px;
  background: #f2f2f2;
  padding: 20px;
  margin-bottom: 30px;
}
</style>
