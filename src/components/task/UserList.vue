<template>
  <div>
    <task-breadcrumb :title="title">
      <!--<template slot="rightPart">
        <el-button @click="$router.back()">返回</el-button>
      </template>-->
    </task-breadcrumb>


    <el-form :inline="true" :model="query" class="query-form ">

      <el-form-item label="商品">
        <goods-select ref="goods-select" @change="updateGoods"></goods-select>
      </el-form-item>


      <el-form-item label="总单数" prop="keyword">
        {{keywords.length}}
      </el-form-item>


      <el-form-item label="模糊查询" prop="fuzzy" class="pull-right">
        <el-input v-model="fuzzy" :clearable="true" @change="fuckSearch"></el-input>
      </el-form-item>
    </el-form>

    <div class="mt10">


      <div class="clear"></div>
    </div>

    <user-select @updateMap="val=>userMap=val" v-if="isManager" v-show="false"></user-select>

    <el-row v-show="goodsInfo.goodsId">
      <el-col :span="8">
        <div><img :src="goodsInfo.goodsImg">{{goodsInfo.goodsName}}</div>
        <div class="clear"></div>
        <div class="mt10">
          备注：
          <template v-if="isManager">
            <el-input v-model="taskInfo.remark" :clearable="true" style="display: inline-block;width:300px"></el-input>
            <el-button @click="updateRemark">修改</el-button>
          </template>
          <template v-else>{{taskInfo.remark?taskInfo.remark:'无'}}</template>
        </div>
        <div class="mt10">
          关键字
          <el-input v-model="keyword" :clearable="true" style="display: inline-block;width: 300px"></el-input>
        </div>


        <el-table
          :data="keywords"
          border
          class="mt10"
          style="width: 100%"

        >


          <el-table-column label="用户" align="center" v-if="isManager" width="100">
            <template slot-scope="scope">
              {{userMap[scope.row.userId]}}
            </template>
          </el-table-column>

          <el-table-column label="下单时间" align="center" width="80">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="$mTimeToDate(scope.row.taskTime, 'Y-m-d H:i')" placement="top">
                <span>{{$mTimeToDate(scope.row.taskTime, 'H:i')}}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="关键词" align="center" >
            <template slot-scope="scope">
              <span :class="scope.row.signed ?'red':'black'" :id="'word_'+scope.row.taskId">
                {{scope.row.keywordValue}}
              </span>
            </template>
          </el-table-column>


          <el-table-column label="操作" align="center" :width="isManager?180:270">
            <template slot-scope="scope">

              <el-button type="button" @click="copyKeyword(scope.row)">复制</el-button>
              <el-button type="button" @click="cancelCopy(scope.row)">取消</el-button>
              <br v-if="isManager">
              <el-button type="button" @click="showSubmitForm(scope.row.taskId)">录入</el-button>
              <el-button type="button" v-if="isManager" @click="remove(scope.row.taskId)">删除</el-button>

            </template>
          </el-table-column>

        </el-table>

      </el-col>
      <el-col :span="16">
        <div class="pull-right">
          旺旺：
          <el-input v-model="wangwang_search" :clearable="true" style="display: inline-block;width: 200px"></el-input>
        </div>
        <div class="clear"></div>
        <el-table
          :data="completed"
          border
          class="mt10"
          style="width: 100%">

          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50">
          </el-table-column>

          <el-table-column prop="taskId" label="任务ID"

                           align="center" width="80"></el-table-column>


          <el-table-column label="录入时间" align="center" width="154">
            <template slot-scope="scope">
              {{$mTimeToDate(scope.row.completedAt)}}
            </template>
          </el-table-column>

          <el-table-column prop="wangwang" label="旺旺号" align="center" width="120">

            <template slot-scope="scope">
              <span :class="scope.row.wangwangSigned ?'red':'black'" :id="'keyword_'+scope.row.taskId">
                {{scope.row.wangwang}}
              </span>
            </template>

          </el-table-column>
          <el-table-column prop="keywordValue" label="关键词" align="center"/>
          <el-table-column prop="mobile" label="手机号" align="center"/>
          <el-table-column prop="orderNo" label="订单号" align="center"/>


          <el-table-column prop="remark" label="备注" align="center" width="240">
            <template slot-scope="scope">
              <span :id="'remark_info_'+scope.row.taskId">{{scope.row.remark}}</span>
              <div :id="'remark_edit_'+scope.row.taskId" style="visibility: hidden;height: 0;">
                <div class="el-input"><!----><input :id="'remark_input_'+scope.row.taskId" type="text"
                                                    autocomplete="off" class="el-input__inner"><!----><!----><!---->
                </div>
                <div>
                  <el-button @click="saveRemark(scope.row.taskId)">保存</el-button>
                  <el-button @click="hideEditRemark(scope.row.taskId)">取消</el-button>
                </div>
              </div>
            </template>

          </el-table-column>


          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">

              <el-button type="button" @click="showEditRemark(scope.row.taskId)">备注</el-button>
              <el-button type="button" v-show="scope.row.wangwangSigned"
                         @click="setWangwangSign(scope.row.taskId, 0)">取消
              </el-button>
              <el-button type="button" v-show="!scope.row.wangwangSigned"
                         @click="setWangwangSign(scope.row.taskId, 1)">标红
              </el-button>

            </template>
          </el-table-column>

        </el-table>


      </el-col>
    </el-row>


    <el-dialog title="完成录入" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false">
      <slot name="top"></slot>

      <div>
        <span>日&nbsp;&nbsp;&nbsp;期：</span>
        <el-date-picker
          v-model="taskCompleted.completedAt"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </div>

      <div class="mt10">
        <span>旺旺号：</span>
        <el-input v-model="taskCompleted.wangwang" :clearable="true"
                  style="display: inline-block;width: 400px"></el-input>
      </div>
      <div class="mt10">
        <span>订单号：</span>
        <el-input v-model="taskCompleted.orderNo" :clearable="true"
                  style="display: inline-block;width: 400px"></el-input>
      </div>
      <div class="mt10">
        <span>手机号：</span>
        <el-input v-model="taskCompleted.mobile" :clearable="true"
                  style="display: inline-block;width: 400px"></el-input>
      </div>
      <div class="mt10">
        <span>备&nbsp;&nbsp;&nbsp;注：</span>
        <el-input v-model="taskCompleted.remark" :clearable="true"
                  style="display: inline-block;width: 400px"></el-input>
      </div>
      <slot name="bottom"></slot>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTask">提交</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Pagination from '../common/Pagination.vue'
  import TaskBreadcrumb from './TaskBreadcrumb'
  import TaskInfoForm from './TaskInfoForm'
  import DatePicker from 'bluesdk-vue-datepicker'
  import UserSelect from '../user/UserSelect'
  import GoodsSelect from '../common/GoodsSelect'
  import copyText from 'tdw-copy-text'
  import DateUtil from 'bluesdk-date-util'

  export default {
    name: 'TaskList',
    data: function () {
      return {
        title: '任务列表',
        completed: [],
        content: [],
        keywords: [],
        goodsInfo: {},
        query: {
          goodsId: this.$url.getPara('goodsId'),
          userId: this.$url.getPara('userId'),
          goodsName: this.$url.getPara('goodsName'),
          pageSize: this.$url.getPara('pageSize', 20)
        },
        dialogVisible: false,
        keyword: '',
        taskInfo: {},
        isManager: false,
        taskCompleted: {
          wangwang: '',
          flag: 1,
          remark: '',
          orderNo: '',
          mobile: '',
          completedAt: DateUtil.now('Y-m-d H:i:s')
        },
        fuzzy: '',
        wangwang_search: '',
        userMap: {}
      }
    },
    components: {
      GoodsSelect,
      UserSelect,
      TaskInfoForm,
      TaskBreadcrumb,
      Pagination,
      DatePicker
    },
    beforeCreate () {
      this.$getJson({
        url: '/user/isManager.do',
        callback: function (vue, res) {
          vue.isManager = res.data
        }
      })
    },
    mounted () {
      this.$refs['goods-select'].queryTaskGoods(this.query.goodsId)
    },
    watch: {
      keyword (val) {
        this.filterKeyword(val)
      },
      wangwang_search (val) {
        this.filterWangwang(val)
      }
    },
    methods: {
      setSign (taskId, signed) {
        const self = this
        self.$post({
          url: '/taskItem/update.do',
          data: { taskId, signed },
          success () {
            self.fetchData()
          }
        })
      },
      setWangwangSign (taskId, wangwangSigned) {
        const self = this
        self.$post({
          url: '/taskItem/update.do',
          data: { taskId, wangwangSigned },
          success () {
            self.fetchData()
          }
        })
      },
      showEditRemark (taskId) {
        const info = document.getElementById('remark_info_' + taskId)
        const remark = info.innerText.trim()
        info.style.visibility = 'hidden'
        const edit = document.getElementById('remark_edit_' + taskId)
        edit.style.visibility = 'visible'
        edit.style.height = '80px'
        const input = document.getElementById('remark_input_' + taskId)
        input.value = remark
        input.focus()
      },
      hideEditRemark (taskId) {
        document.getElementById('remark_info_' + taskId).style.visibility = 'visible'
        const edit = document.getElementById('remark_edit_' + taskId)
        edit.style.visibility = 'hidden'
        edit.style.height = '0'
      },
      saveRemark (taskId) {
        const info = document.getElementById('remark_info_' + taskId)
        const e = document.getElementById('remark_input_' + taskId)
        const remark = e.value.trim()
        const self = this
        self.$post({
          url: '/taskItem/remark.do',
          data: { taskId, remark },
          success () {
            info.innerText = remark
            self.hideEditRemark(taskId)
          }
        })
      },
      filterKeyword (val) {
        val = val.trim()
        let keywords = []
        for (let i in this.keywords) {
          const item = this.keywords[i]
          if (val === '' || item.keywordValue.indexOf(val) !== -1) {
            keywords.push(item)
          }
        }
        this.keywords = keywords
      },
      filterWangwang (val) {
        val = val.trim()
        let completed = []
        for (let i in this.completed) {
          const item = this.completed[i]
          if (val === '' || item.wangwang.indexOf(val) !== -1) {
            completed.push(item)
            if (completed.length >= 15) {
              break
            }
          }
        }
        this.completed = completed
      },
      submitTask () {
        if (this.taskCompleted.wangwang.trim() === '') {
          this.$message.error('请填写旺旺号')
          return
        }
        if (typeof this.taskCompleted.completedAt === 'object') {
          this.taskCompleted.completedAt = DateUtil.format('Y-m-d H:i:s', this.taskCompleted.completedAt.getTime() / 1000)
        }
        this.taskCompleted.mobile = this.taskCompleted.mobile.replace(/ /g, '')
        this.taskCompleted.wangwang = this.taskCompleted.wangwang.replace(/ /g, '')
        this.taskCompleted.orderNo = this.taskCompleted.orderNo.replace(/ /g, '')
        this.taskCompleted.remark = this.taskCompleted.remark.replace(/ /g, '')
        const self = this
        self.$post({
          url: '/taskItem/update.do',
          data: this.taskCompleted,
          success () {
            self.dialogVisible = false
            self.fetchData()
            self.$message.success('录入成功')
          }
        })
      },
      copyKeyword (row) {
        const self = this
        this.updateTaskItem({ taskId: row.taskId, signed: 1 }, function () {
          copyText(row.keywordValue)
          document.getElementById('word_' + row.taskId).style.color = 'red'
          self.$message.success('复制成功')
        })
      },
      cancelCopy (row) {
        const self = this
        this.updateTaskItem({ taskId: row.taskId, signed: 0 }, function () {
          document.getElementById('word_' + row.taskId).style.color = 'black'
          self.$message.success('取消成功')
        })
      },
      updateTaskItem (data, success) {
        this.$post({
          url: '/taskItem/update.do',
          data,
          success () {
            if (success) {
              success()
            }
          }
        })
      },
      fetchData () {
        this.$getJson({
          url: '/task/view.do',
          data: { goodsId: this.query.goodsId, userId: this.query.userId },
          callback (vue, res) {
            vue.taskInfo = res.data
          }
        })
        this.fetchUndo()
        this.fetchCompleted()
      },
      fetchUndo () {
        this.$getJson({
          url: '/taskItem/listByUser.do',
          data: { goodsId: this.query.goodsId, flag: 0 },
          callback (vue, res) {
            vue.keywords = res.data
            vue.filterKeyword(vue.keyword)
          }
        })
      },
      fetchCompleted () {
        this.$getJson({
          url: '/taskItem/listByUser.do',
          data: { goodsId: this.query.goodsId, flag: 1 },
          callback (vue, res) {
            vue.completed = res.data
            vue.filterWangwang(vue.keyword)
          }
        })
      },
      handleSearch () {
        this.$router.push({ path: this.$url.getUri(), query: this.query })
        this.fetchData()
      },
      updateGoods (val) {
        if (!this.goodsInfo.goodsId || this.query.goodsId !== val.goodsId) {
          this.query.goodsId = val.goodsId
          this.query.goodsName = val.goodsName
          this.handleSearch()
        }
        this.goodsInfo = val
      },
      showSubmitForm (taskId) {
        this.dialogVisible = true
        this.taskCompleted.taskId = taskId
      },
      updateRemark () {
        const self = this
        this.$post({
          url: '/task/updateRemark.do',
          data: { id: this.taskInfo.id, remark: this.taskInfo.remark },
          success () {
            self.$message.success('备注修改成功')
          }
        })
      },
      remove (taskId) {
        const self = this
        this.$confirm('该操作不可撤销, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$post({
            url: '/taskItem/remove.do',
            data: { taskId },
            success () {
              self.$message.success('删除成功')
              self.refreshPage()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      fuckSearch () {
        this.$router.push({ name: 'taskUserDone', query: { fuzzy: this.fuzzy } })
      }
    }
  }
</script>


<style scoped>

  img {
    width: 50px;
    height: 50px;
    display: block;
    float: left;
    margin-right: 5px;
  }


</style>
