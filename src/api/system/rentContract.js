import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 租金生成
export function rentGenerate(query) {
  return request({
    url: urlPost + '/rent-detail/rent-generation',
    method: 'get',
    params: query
  })
}

// 租金调整
export function rentAdjust(query) {
  return request({
    url: urlPost + '/rent-detail/rent-adjust',
    method: 'get',
    params: query
  })
}

// 租金的list
export function getRentList(query) {
  return request({
    url: urlPost + '/rent-detail/list-contractId',
    method: 'get',
    params: query
  })
}

// 修改租金明细
export function editRentList(data) {
  return request({
    url: urlPost + '/rent-detail/update',
    method: 'put',
    data: data
  })
}

// 添加一期租金
export function addOneRent(data) {
  return request({
    url: urlPost + '/rent-detail/insert',
    method: 'post',
    data: data
  })
}

// 删除租金明细
export function deleteRentList(query) {
  return request({
    url: urlPost + '/rent-detail/del',
    method: 'delete',
    params: query
  })
}

// 调整交款日期
export function changePayDate(query) {
  return request({
    url: urlPost + '/rent-detail/pay-date-adjust',
    method: 'get',
    params: query
  })
}

// 调整交款日期
export function ExpCalculate(query) {
  return request({
    url: urlPost + '/rent-detail/exp-calculate',
    method: 'get',
    params: query
  })
}

// 提留定义列表
export function getTlList(query) {
  return request({
    url: urlPost + '/tl-definition/list-contractId',
    method: 'get',
    params: query
  })
}

// 添加提留定义
export function addTlDefinition(data) {
  return request({
    url: urlPost + '/tl-definition/insert',
    method: 'post',
    data: data
  })
}

// 删除tl
export function deleteTlDefinition(query) {
  return request({
    url: urlPost + '/tl-definition/del',
    method: 'delete',
    params: query
  })
}

// 修改租金明细
export function updateTlDefinition(data) {
  return request({
    url: urlPost + '/tl-definition/update',
    method: 'put',
    data: data
  })
}

