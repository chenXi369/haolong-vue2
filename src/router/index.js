import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      menuName: '首页',
      icon: 'dashboard',
      meta: {
        title: '首页',
        icon: 'dashboard',
        affix: true,
        noCache: true
      }
    }]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: false }
      },
      {
        path: 'changePwd',
        component: (resolve) => require(['@/views/system/user/changePwd/index'], resolve),
        name: 'ChangePwd',
        meta: { title: '修改密码', icon: '', noCache: false }
      }
    ]
  },
  {
    path: '/base',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'ownerRegister',
        component: (resolve) => require(['@/views/baseInfo/base/userRegister/ownerRegister'], resolve),
        name: 'OwnerRegister',
        meta: { title: '登记信息', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'houseList',
        component: (resolve) => require(['@/views/baseInfo/base/userRegister/houseList'], resolve),
        name: 'HouseList',
        meta: { title: '房屋清单', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'propertyOwner',
        component: (resolve) => require(['@/views/baseInfo/base/userRegister/propertyOwner'], resolve),
        name: 'PropertyOwner',
        meta: { title: '产权人', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'ownerInfo',
        component: (resolve) => require(['@/views/baseInfo/base/userRegister/ownerInfo'], resolve),
        name: 'OwnerInfo',
        meta: { title: '客户信息', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'equityNewUser',
        component: (resolve) => require(['@/views/baseInfo/base/userRegister/equityNewUser'], resolve),
        name: 'EquityNewUser',
        meta: { title: '产权过户', icon: '', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/rentManage',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'newContract',
        component: (resolve) => require(['@/views/baseInfo/rentManage/rentContract/newContract'], resolve),
        name: 'NewContract',
        meta: { title: '租赁合同', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'rentPaySetting',
        component: (resolve) => require(['@/views/baseInfo/rentManage/rentContract/rentPaySetting'], resolve),
        name: 'RentPaySetting',
        meta: { title: '租金设置', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'payList',
        component: (resolve) => require(['@/views/baseInfo/rentManage/rentContract/payList'], resolve),
        name: 'PayList',
        meta: { title: '应收费用', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'houseRepertoire',
        component: (resolve) => require(['@/views/baseInfo/rentManage/rentContract/houseRepertoire'], resolve),
        name: 'HouseRepertoire',
        meta: { title: '房屋清单', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'rentOwnerInfo',
        component: (resolve) => require(['@/views/baseInfo/rentManage/rentContract/rentOwnerInfo'], resolve),
        name: 'RentOwnerInfo',
        meta: { title: '客户信息', icon: '', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/rentBackManage',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'newRentBack',
        component: (resolve) => require(['@/views/baseInfo/rentBackManage/rentBackContract/newRentBack'], resolve),
        name: 'NewRentBack',
        meta: { title: '返租合同', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'rentBackList',
        component: (resolve) => require(['@/views/baseInfo/rentBackManage/rentBackContract/rentBackList'], resolve),
        name: 'RentBackList',
        meta: { title: '费用明细', icon: '', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/chargeSetting',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'chargeItemEdit',
        component: (resolve) => require(['@/views/baseInfo/chargeSetting/chargeItemEdit/index'], resolve),
        name: 'ChargeItemEdit',
        meta: { title: '收费项目 - 编辑', icon: '', noCache: true },
        hidden: true
      },
    ]
  },
  {
    path: '/checkDataPage',
    component: (resolve) => require(['@/views/baseInfo/accountSetting/checkDataPage/index'], resolve),
    name: 'CheckDataPage',
    meta: { title: '数据校验', icon: '', noCache: true },
    hidden: true
  }
]
const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
