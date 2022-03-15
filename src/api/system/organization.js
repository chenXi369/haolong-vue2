import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 展示树状信息
export function getOrg() {
  return request({
    url: urlPost + '/organization/org-tree-list',
    method: 'get'
  })
}

// 添加
export function addOrg(data) {
  return request({
    url: urlPost + '/organization/org-add',
    method: 'post',
    data: data
  })
}

export function deleteOrg(query) {
  return request({
    url: urlPost + '/organization/org-del',
    method: 'delete',
    params: query
  })
}

// 修改
export function updateOrg(data) {
  return request({
    url: urlPost + '/organization/org-update',
    method: 'put',
    data: data
  })
}

// 查询
export function checkOrg(query) {
  return request({
    url: urlPost + '/organization/org-get',
    method: 'get',
    params: query
  })
}
