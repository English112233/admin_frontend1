import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

const PopPanel = resolve => require(['@/components/layout/PopPanel'], resolve)
const ColumnTwo = resolve => require(['@/components/layout/ColumnTwo'], resolve)

//  账号相关
const UserAuthLogin = resolve => require(['@/components/userAuth/Login'], resolve)
const UserAuthActive = resolve => require(['@/components/userAuth/Active'], resolve)
const UpdatePasswd = resolve => require(['@/components/user/UpdatePasswd'], resolve)
const UserCreate = resolve => require(['@/components/user/Create'], resolve)
const UserList = resolve => require(['@/components/user/List'], resolve)
const UserUpdate = resolve => require(['@/components/user/Update'], resolve)

// 邮件管理
const EmailManager = resolve => require(['@/components/user/EmailManager'], resolve)
const ShopEmailManager = resolve => require(['@/components/user/ShopEmailManager'], resolve)
// 类别管理
const StatGoods = resolve => require(['@/components/visitData/StatGoods'], resolve)
const LogList = resolve => require(['@/components/visitData/LogList'], resolve)
const ListSummaryDaily = resolve => require(['@/components/visitData/ListSummaryDaily'], resolve)
// 任务中心
const TaskAdminList = resolve => require(['@/components/task/AdminList'], resolve)
const TaskUserList = resolve => require(['@/components/task/UserList'], resolve)
const TaskAdminDone = resolve => require(['@/components/task/AdminDone'], resolve)
const TaskUserDone = resolve => require(['@/components/task/UserDone'], resolve)
const TaskSubmit = resolve => require(['@/components/task/Submit'], resolve)
Vue.use(Router)
export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: '/userAuth',
      component: PopPanel,
      children: [
        { name: 'userAuthLogin', path: 'login', component: UserAuthLogin }
      ]
    },
    {
      path: '/userAuth',
      component: PopPanel,
      children: [
        { name: 'userAuthActive', path: 'active', component: UserAuthActive }
      ]
    },
    {
      path: '/',
      component: ColumnTwo,
      children: [
        { name: 'updatePassword', path: 'user/updatePassword', component: UpdatePasswd },
        // 员工账号
        { name: 'userList', path: 'user/list.do', component: UserList },
        { name: 'userCreate', path: 'user/create.do', component: UserCreate },
        { name: 'userUpdate', path: 'user/update.do/:userId', component: UserUpdate },
        // 邮件管理
        { name: 'emailManager', path: 'user/useremail.do/', component: EmailManager },
        { name: 'emailManager', path: 'user/shopemail.do/', component: ShopEmailManager },
        // 统计数据
        { name: 'statGoods', path: 'goods/stat.do', component: StatGoods },
        { name: 'LogList', path: 'visitLog/list.do', component: LogList },
        { name: 'listSummaryDaily', path: 'goods/listSummaryDaily.do', component: ListSummaryDaily },
        // 任务中心
        { name: 'taskAdminList', path: 'task/adminList.do', component: TaskAdminList },
        { name: 'taskAdminDone', path: 'task/adminDone.do', component: TaskAdminDone },
        { name: 'taskUserDone', path: 'task/userDone.do', component: TaskUserDone },
        { name: 'taskUserList', path: 'task/userList.do', component: TaskUserList },
        { name: 'taskSubmit', path: 'task/submit.do/:taskId', component: TaskSubmit },
        { name: 'home', path: 'home', component: HelloWorld }
      ]
    }
  ]
})
