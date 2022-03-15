import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 展示树状信息
export function getRoleList(query) {
  return request({
    url: urlPost + '/pm-role/role-list',
    method: 'get',
    params: query
  })
}

// 添加用户-菜单关系  post
export function rolePerm(data) {
  return request({
    url: urlPost + '/pm-user-menu/user-menu-add',
    method: 'post',
    data: data
  })
}

// 删除用户-菜单关系 delete
export function deletePerm(query) {
  return request({
    url: urlPost + '/pm-user-menu/user-menu-del',
    method: 'delete',
    params: query
  })
}

// 修改用户-菜单关系 update
export function updatePerm(data) {
  return request({
    url: urlPost + '/pm-user-menu/user-menu-update',
    method: 'put',
    data: data
  })
}

// 修改
export function updateRole(data) {
  return request({
    url: urlPost + '/pm-role/role-update',
    method: 'put',
    data: data
  })
}

// 查询
export function checkRole(query) {
  return request({
    url: urlPost + 'pm-role/role-get',
    method: 'get',
    params: query
  })
}

// 获取员工的权限信息 get
export function getStaffPerm(query) {
  return request({
    url: urlPost + '/pm-menu/perm-get',
    method: 'get',
    params: query
  })
}

// 获取权限范围
export function getOrange(query) {
  return request({
    url: urlPost + '/organization/org-get-tree-by-id-except-type3',
    method: 'get',
    params: query
  })
}

// 获取权限范围的默认值
export function getRangeVal(query) {
  return request({
    url: urlPost + '/user-data-scope/query-by-ygid',
    method: 'get',
    params: query
  })
}

// 修改新增权限范围
export function editRangeVal(data) {
  return request({
    url: urlPost + '/user-data-scope/save',
    method: 'post',
    data: data
  })
}

// 自定义报表列表
export function ownerReportList() {
  return request({
    url: urlPost + '/rpt-perm/list',
    method: 'get'
  })
}

// 自定义报表权限修改 新增
export function ownerReportUpdate(data) {
  return request({
    url: urlPost + '/rpt-perm/update-perm',
    method: 'post',
    data: data
  })
}

// 自定义报表权限
export function ownerReportPerm(query) {
  return request({
    url: urlPost + '/rpt-perm/get-perm',
    method: 'get',
    params: query
  })
}

// 取消授权
export function cancelPerm(query) {
  return request({
    url: urlPost + '/pm-user-menu/auth-cancel',
    method: 'delete',
    params: query
  })
}
