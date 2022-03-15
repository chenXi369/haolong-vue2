import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 展示树状信息并搜索
export function getStaffList(query) {
  return request({
    url: urlPost + '/pm-user/user-list',
    method: 'get',
    params: query
  })
}

// 添加
export function staffAdd(data) {
  return request({
    url: urlPost + '/pm-user/user-add',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteStaff(query) {
  return request({
    url: urlPost + '/pm-user/user-del',
    method: 'delete',
    params: query
  })
}

// 修改
export function updateStaff(data) {
  return request({
    url: urlPost + '/pm-user/user-update',
    method: 'put',
    data: data
  })
}

// 查询
export function checkStaff(query) {
  return request({
    url: urlPost + '/pm-user/user-get',
    method: 'get',
    params: query
  })
}
