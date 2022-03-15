import { constantRoutes } from '@/router'
import { getRouters } from '@/api/user'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import Cookies from 'js-cookie'

const state = {
  routes: [],
  addRoutes: [],
  sidebarRouters: [],
  topMenu: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_SIDEBAR_ROUTERS: (state, routers) => {
    state.sidebarRouters = constantRoutes.concat(routers)
  },
  SET_TOP_MENU: (state, name) => {
    state.topMenu = [].concat(name)
  }
}

const actions = {
  generateRoutes({ commit }, key) {
    return new Promise(resolve => {
      // 向后端请求路由数据
      getRouters().then(res => {
        let cdata = [...res.mcTree]
        if (cdata.length === 0) {
          cdata = [{
            menuName: '默认目录',
            component: 'Layout',
            children: [
              {
                menuName: '默认菜单', path: '/system', icon: 'noPage', component: 'Layout',
                children: [{
                  menuName: '暂无页面', path: 'noPage', name: 'NoPage', component: 'system/noPage/index'
                }]
              }
            ]
          }]
        }
        const mdata = cdata.map(item => {
          return item.menuName
        })
        if (Cookies.get('activeIndex') !== undefined) {
          key = Cookies.get('activeIndex')
        }
        const mindex = cdata.findIndex((item) => {
          return item.menuName === key
        })
        commit('SET_TOP_MENU', mdata)
        const xdata = cdata[mindex === -1 ? 0 : mindex].children

        let whiteBreadcrumb = ['ChangeAccount']
        xdata.map(item => {
          if (!Object.prototype.hasOwnProperty.call(item, 'meta')) {
            item.redirect = 'noRedirect'
            item.name = item.routerName
            item.meta = {
              icon: item.icon,
              title: item.menuName,
              noCache: false
            }
          }
          if (item.children && item.children.length) {
            item.children.map(el => {
              el.name = el.routerName
              el.meta = {
                icon: el.icon,
                title: el.menuName,
                noCache: false
              }
            })
          }
        })
        const sdata = JSON.parse(JSON.stringify(xdata))
        const rdata = JSON.parse(JSON.stringify(xdata))
        const sidebarRoutes = filterAsyncRouter(sdata)
        const rewriteRoutes = filterAsyncRouter(rdata, true)
        rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', rewriteRoutes)
        commit('SET_SIDEBAR_ROUTERS', sidebarRoutes)
        resolve(rewriteRoutes)
      })
    })
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, isRewrite = false) {
  return asyncRouterMap.filter(route => {
    if (isRewrite && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, isRewrite)
    }
    return true
  })
}

function filterChildren(childrenMap) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (!Object.prototype.hasOwnProperty.call(el, 'meta')) {
      el.name = el.routerName
      el.meta = {
        icon: el.icon,
        title: el.menuName,
        noCache: false
      }
    }
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.name = c.routerName
          c.mata = {
            icon: c.icon,
            title: c.menuName,
            noCache: false
          }
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
