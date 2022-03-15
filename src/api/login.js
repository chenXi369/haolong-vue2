import request from '@/utils/request'

/* 动态的获取菜单 */
export function getMenus() {
  return request({
    url: "auth/build/menus/",
    method: "get"
  })
}
