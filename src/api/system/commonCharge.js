import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 添加计费项目
export function addChargeItem(data) {
  return request({
    url: urlPost + '/billing-items/insert',
    method: 'post',
    data: data
  })
}

// 删除计费项目
export function delChargeItem(query) {
  return request({
    url: urlPost + '/billing-items/del',
    method: 'delete',
    params: query
  })
}

// 修改计费项目
export function updateChargeItem(data) {
  return request({
    url: urlPost + '/billing-items/update',
    method: 'put',
    data: data
  })
}

// 查询计费项目
export function getChargeItem(query) {
  return request({
    url: urlPost + '/billing-items/get',
    method: 'get',
    params: query
  })
}

// 计费项目的tree-list
export function ChargeAllItem() {
  return request({
    url: urlPost + '/billing-items/list',
    method: 'get'
  })
}

// 添加收费标准
export function addChargeStand(data) {
  return request({
    url: urlPost + '/charging-standard/insert',
    method: 'post',
    data: data
  })
}

// 删除收费标准
export function delChargeStand(query) {
  return request({
    url: urlPost + '/charging-standard/del',
    method: 'delete',
    params: query
  })
}

// 修改收费标准
export function updateChargeStand(data) {
  return request({
    url: urlPost + '/charging-standard/update',
    method: 'put',
    data: data
  })
}

// 查询收费标准
export function getChargeStand(query) {
  return request({
    url: urlPost + '/charging-standard/get',
    method: 'get',
    params: query
  })
}

// 计费项目的tree-list
export function ChargeStandItems(query) {
  return request({
    url: urlPost + '/charging-standard/list-tree',
    method: 'get',
    params: query
  })
}

// 计费项目的tree-list
export function ChargeItemTree(query) {
  return request({
    url: urlPost + '/charging-standard/list-property-billingItems',
    method: 'get',
    params: query
  })
}

// 通知单/票据分类 选项列
export function ChargeStandSource(query) {
  return request({
    url: urlPost + '/charging-standard/list-source',
    method: 'get',
    params: query
  })
}



