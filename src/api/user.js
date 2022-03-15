import request from '@/utils/request'
import batchRequest from '@/utils/batchRequest'

// const urlPost = ""

// 登录
export function login(data) {
  return batchRequest({
    url: '/pm-system/auth-token/login',
    method: 'post',
    data: data
  })
}

// 获取信息
export function getInfo() {
  return batchRequest({
    url: '/pm-system/pm-user/getInfo',
    method: 'get'
  })
}

// 获取菜单
export function getRouters() {
  return batchRequest({
    url: '/pm-system/pm-menu/getMenu',
    method: 'get'
  })
}

// 刷新菜单
export function refreshMenu() {
  return batchRequest({
    url: '/pm-system/pm-menu/flushMenu',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return batchRequest({
    url: '/pm-system/auth-token/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/pro-api/pm-verifyCode',
    method: 'get'
  })
}



