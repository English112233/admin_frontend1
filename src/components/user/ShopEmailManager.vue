<template>
  <div>
    <div class="email-form">
      <el-form ref="form" :model="fuzzyQuery" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
          </el-col>
          <el-col :span="4">
          </el-col>
            <el-form-item label="是否接收邮件" label-width="120px" class="isRight">
              <el-switch
                v-model="fuzzyQuerySwich"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="fuzzyQueryChange">
              </el-switch>
            </el-form-item>
          <el-col :span="6">
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="data" border style="width: 100%" :header-cell-style="{background:'#009688',color:'#fff'}">
      <el-table-column  prop="shopId" label="id" align="center" width="150">
      </el-table-column>
      <el-table-column prop="shopName" label="店铺名" align="center" width="250">
      </el-table-column>
      <el-table-column prop="nowcount" label="当前店铺访问量" align="center" min-width="150">
      </el-table-column>
      <el-table-column prop="regularTime" label="定时任务周期（分钟）" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="最后更新" align="center" min-width="150">
        <template slot-scope="scope">
          {{$mTimeToDate(scope.row.updatedAt)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="80">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="" align="center" label="接收邮件状态" width="150">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="scope.row.state" @change=tableSwichChange(scope.$index,scope.row)>
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      width="35%"
      :close-on-click-modal="false"
      center>
      <el-form :model="dialogContent" label-width="160px">
        <el-form-item label="店铺id">
          <el-input v-model="dialogContent.shopId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="店铺名">
          <el-input v-model="dialogContent.shopName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="当前店铺访问量">
          <el-input v-model="dialogContent.nowcount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="定时任务周期（分钟）">
          <el-input v-model="dialogContent.regularTime"></el-input>
        </el-form-item>
        <el-form-item label="接收邮件状态">
          <el-switch
            v-model="dialogContent.state"
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
    name: 'ShopEmailManager',
    components: {},
    data: function () {
      return {
        title: '店铺邮件详情',
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
      this.getEmailAll()
    },
    methods: {
      getDataList () {
        this.$axios({
          method: 'get',
          url: '/api/shop/list.do'
        }).then((response) => {
          if (response && response.data && response.data.data.length) {
            response.data.data.forEach(item => {
              item.state = !item.state
            })
            this.data = response.data.data
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getEmailAll () {
        this.$axios({
          method: 'post',
          url: '/api/email/findGlobalEmailReminder.do',
          data: this.qs.stringify({})
        }).then((response) => {
          if (response) {
            this.fuzzyQuerySwich = !response.data.data
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      handleEdit (row) {
        this.centerDialogVisible = true
        this.dialogContent = JSON.parse(JSON.stringify(row))
        this.dialogTitle = '编辑'
      },
      determineDialog () {
        this.$axios({
          method: 'get',
          url: '/api/shop/updateShopRegularTime.do',
          params: {
            shopId: this.dialogContent.shopId,
            shopName: this.dialogContent.shopName,
            nowcount: this.dialogContent.nowcount,
            regularTime: this.dialogContent.regularTime,
            state: Number(!this.dialogContent.state)
          }
        }).then((response) => {
          this.getDataList()
          this.centerDialogVisible = false
          this.dialogContent = {}
        }).catch((error) => {
          console.log(error)
        })
      },
      cancelDialog () {
        this.centerDialogVisible = false
        this.dialogContent = {}
      },
      tableSwichChange (value, row) {
        this.$axios({
          method: 'post',
          url: '/api/shop/storeEmailUpdate.do',
          data: this.qs.stringify({
            shopId: row.shopId,
            shopName: row.shopName,
            nowcount: row.nowcount,
            state: Number(!row.state)
          })
        })
      },
      fuzzyQueryChange (value) {
        this.fuzzyQuerySwich = value
        this.$axios({
          method: 'post',
          url: '/api/email/onoffemailreminder.do',
          data: this.qs.stringify({
            emailAlerts: Number(!this.fuzzyQuerySwich)
          })
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
            response.data.data.forEach(item => {
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
.isRight {
  position: absolute;
  right: 100px;
}
</style>
