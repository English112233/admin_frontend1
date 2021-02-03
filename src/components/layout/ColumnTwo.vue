<template>
  <div id="wrapper" v-show="visible">
    <div id="header">

      <router-link :to="{ name: 'home'}" id="logo">
        运营后台
      </router-link>
      <div id="setting-form" v-show="timeShow">
        {{$mTimeToDate(time)}}
        <el-button size="small" type="success" @click="getTimes($event)">手动更新</el-button>
      </div>

      <!--  <div id="setting-form">
          <label>间隔时间：</label>

          <input type="number" value="1" min="1" max="99999"> <span>分钟</span>
          <el-button size="mini">开始采集</el-button>
        </div>
  -->
      <div id="auth-bar">
        <a href="javascript:" @click="loginOut($event)">退出登录</a>
        <router-link v-bind:to="{ name: 'updatePassword'}">
          修改密码
        </router-link>
      </div>
    </div>


    <el-container>
      <el-aside width="200px">
        <el-menu @select="select" :router="true" :default-active="uri">

          <el-submenu v-for="(group,groupIndex) in menuList" :key="group.groupName" :index="groupIndex.toString()">

            <template slot="title">
              <i :class="group.flag" v-if="group.flag"></i>
              <i class="el-icon-location" v-else></i>
              <span slot="title">{{group.moduleName}}</span>
            </template>

            <el-menu-item-group>
              <el-menu-item :index="menu.uri" :key="menu.uri" v-for="menu in group.menus">
                {{menu.menuName}}
              </el-menu-item>
            </el-menu-item-group>

          </el-submenu>

        </el-menu>
      </el-aside>
      <el-container id="content">

        <el-main>


          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>

</template>
<script>
  import $ from 'jquery'
  import {
    ListDownloadBtn
  } from 'cpc-frontend-base'

  export default {
    components: { ListDownloadBtn },
    data: function () {
      return {
        visible: false,
        activeIndex2: '',
        uri: this.$url.getUri(),
        menuList: [],
        menuExpecial: { // 某些特殊菜单不是在一级匹配下，如：account

        },
        time: 0,
        fetchNewTaskJob: null,
        timeShow: false
      }
    },
    created: function () {
      this.getHeaderTime()
      setInterval(() => {
        this.getHeaderTime()
      }, 90000)
      const that = this
      this.$getJson({
        url: '/user/isManager.do',
        callback: function (vue, res) {
          vue.visible = true
          that.timeShow = res.data
          if (res.data) {
            vue.menuList.push(
              {
                'flag': '',
                'menus': [
                  {
                    'menuName': '任务列表',
                    'sort': 200,
                    'uri': '/task/adminList.do'
                  },
                  {
                    'menuName': '完成记录',
                    'sort': 200,
                    'uri': '/task/adminDone.do'
                  }
                ],
                'moduleId': 20,
                'moduleName': '任务中心'
              },
              {
                'flag': '',
                'menus': [
                  {
                    'menuName': '访问明细',
                    'sort': 100,
                    'uri': '/visitLog/list.do'
                  },
                  {
                    'menuName': '商品统计',
                    'sort': 200,
                    'uri': '/goods/listSummaryDaily.do'
                  }
                ],
                'moduleId': 10,
                'moduleName': '访问统计'
              }
            )
            vue.menuList.push({
              'flag': '',
              'menus': [{
                'menuName': '账号列表',
                'sort': 100,
                'uri': '/user/list.do'
              }, {
                'menuName': '新增账号',
                'sort': 200,
                'uri': '/user/create.do'
              }],
              'moduleId': 30,
              'moduleName': '员工账号'
            })
            vue.menuList.push(
              {
                'flag': '',
                'menus': [
                  {
                    'menuName': '用户邮件详情',
                    'sort': 100,
                    'uri': '/user/useremail.do'
                  },
                  {
                    'menuName': '店铺邮件详情',
                    'sort': 200,
                    'uri': '/user/shopemail.do'
                  }
                ],
                'moduleId': 50,
                'moduleName': '邮件管理'
              })
          } else {
            vue.menuList.push({
              'flag': '',
              'menus': [
                {
                  'menuName': '任务列表',
                  'sort': 100,
                  'uri': '/task/userList.do'
                },
                {
                  'menuName': '完成记录',
                  'sort': 200,
                  'uri': '/task/userDone.do'
                }
              ],
              'moduleId': 30,
              'moduleName': '任务中心'
            })
            // vue.fetchNewTask()
          }
        }
      })
      // console.log(this.content)
    },
    methods: {
      getTimes () {
        this.$axios({
          method: 'post',
          url: 'api/shop/manualUpdate.action'
        }).then((response) => {
          if (response.status === 200) {
            this.time = new Date()
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getHeaderTime () {
        if (!this.timeShow) return
        this.$axios({
          method: 'get',
          url: '/api/shop/findTime.do'
        }).then((response) => {
          this.time = response.data.data.updatedAt
        }).catch((error) => {
          console.log(error)
        })
      },
      fetchNewTask () {
        const self = this
        this.fetchNewTaskJob = setInterval(function () {
          self.$getJson({
            url: '/taskItem/newJob.do',
            data: {
              lastTaskId: localStorage.lastTaskId
            }
          })
        }, 60 * 1000)
      },
      handleSelect: function (key, keyPath) {
        // console.log(key + keyPath)
      },
      select: function (groupIndex, uri) {
        this.uri = uri[1]
      },
      loginOut: function (event) {
        let self = this
        let btn = $(event.target)
        this.$post({
          btn: btn,
          url: '/auth/logout.action',
          data: {},
          success: function () {
            self.$router.push({ name: 'userAuthLogin' })
          }
        })
      },
      getFirstPath (path) { // 获取当前返回路径的第一个匹配 如：/payChannel/update.do 返回/payChannel/
        return path.match(/(\/.*?\/)/)[0]
      },
      selectCurrentGroup (uri) {
        for (let groupIndex in this.menuList) { // 查找匹配的项
          let listItem = this.menuList[groupIndex]
          for (let index in listItem.menus) {
            let reStr = listItem.menus[index].uri

            // 特殊菜单，有的菜单不是属于一级匹配路径下，如/account/listConfig.do不在account后面
            for (let x in this.menuExpecial) {
              for (let key in this.menuExpecial[x]) {
                if (uri.indexOf(this.menuExpecial[x][key]) > -1) {
                  return x
                }
              }
            }
            // 正常情况下
            if (uri.indexOf(reStr) > -1 || uri.indexOf(this.getFirstPath(reStr)) > -1) {
              return reStr
            }
          }
        }
        return uri // 没有则返回原来的值
      }
    },
    beforeDestroy () {
      if (this.fetchNewTaskJob) {
        clearInterval(this.fetchNewTaskJob)
        this.fetchNewTaskJob = null
      }
    }
  }
</script>
<style scoped>


  #header {
    background-color: rgb(84, 92, 100);
    height: 60px;
    border-bottom: solid 1px #e6e6e6;
    position: relative;
  }

  #header #logo {
    position: absolute;
    left: 0;


  }

  #header #auth-bar {
    position: absolute;
    right: 0;
  }

  #header a {
    color: rgb(255, 255, 255);
    border-bottom-color: transparent;
    background-color: rgb(84, 92, 100);
    line-height: 60px;
    padding: 0 20px;
    display: inline-block;
    height: 60px;
  }

  #header a:hover {
    background-color: rgb(67, 74, 80);
  }

  #header #setting-form {
    position: absolute;
    left: 300px;
    line-height: 60px;
    color: #fff;
    font-weight: 500;
    font-size: 20px;
  }

  #header #setting-form label, #header #setting-form span {
    line-height: 60px;
    color: rgb(255, 255, 255);
  }
</style>
