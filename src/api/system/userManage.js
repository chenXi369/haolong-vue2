import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"
// 新增客户 post
export function addCustomer(data) {
  return request({
    url: urlPost + '/customer/customer-add',
    method: 'post',
    data: data
  })
}

// 删除客户 delete
export function delCustomer(query) {
  return request({
    url: urlPost + '/customer/customer-del',
    method: 'delete',
    params: query
  })
}

// 修改客户 put
export function updateCustomer(data) {
  return request({
    url: urlPost + '/customer/customer-update',
    method: 'put',
    data: data
  })
}

// 展示客户 get
export function getCustomer(query) {
  return request({
    url: urlPost + '/customer/customer-get',
    method: 'get',
    params: query
  })
}

// 客户列表
export function getCustomerList(query) {
  return request({
    url: urlPost + '/customer/customer-list',
    method: 'get',
    params: query
  })
}

// 客户工作类型
export function getCustomerType() {
  return request({
    url: urlPost + '/data-dictionary/customer-type',
    method: 'get'
  })
}


