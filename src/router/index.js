import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import AdminInfo from '../views/Admin/AdminInfo.vue'
import AdminReport from '../views/Admin/AdminReport.vue'
import AdminPortrait from '../views/Admin/AdminPortrait.vue'
import VolunteerInfo from '../views/Volunteer/VolunteerInfo.vue'
import VolunteerPortrait from '../views/Volunteer/VolunteerPortrait.vue'
import VolunteerReport from '../views/Volunteer/VolunteerReport.vue'
import ElderInfo from '../views/Elder/ElderInfo.vue'
import ElderPortrait from '../views/Elder/ElderPortrait.vue'
import ElderReport from '../views/Elder/ElderReport.vue'

Vue.use(VueRouter)

// 解决重复路由，重复点击导航时，控制台报错的问题NavigationDuplicated
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/login',
    name: '登录界面',
    component: Login
  },
  {
    path: '/index',
    name: '后台',
    component: Index,
    redirect: '/adminInfo',
    children: [
      {
        path: '/adminInfo',
        name: '管理员信息列表',
        component: AdminInfo
      },
      {
        path: '/adminPortrait',
        name: '头像管理',
        component: AdminPortrait
      },
      {
        path: '/adminReport',
        name: '报表统计',
        component: AdminReport
      },
      {
        path: '/volunteerInfo',
        name: '义工信息',
        component: VolunteerInfo
      },
      {
        path: '/volunteerPortrait',
        name: '头像采集',
        component: VolunteerPortrait
      },
      {
        path: '/volunteerReport',
        name: '实时报表',
        component: VolunteerReport
      },
      {
        path: '/elderInfo',
        name: '老年人信息',
        component: ElderInfo
      },
      {
        path: '/elderPortrait',
        name: '头像采集',
        component: ElderPortrait
      },
      {
        path: '/elderReport',
        name: '实时报表',
        component: ElderReport
      }
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router
