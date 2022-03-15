import request from '@/utils/request'
import importRequest from '@/utils/importRequest'

const urlPost = "/dev-api/pm-system"

// 获取可选月份
export function getSelectMonth(query) {
  return request({
    url: urlPost + '/float-rent/get-charging-month',
    method: 'get',
    params: query
  })
}

// 获取明细数据
export function getRentPayList(query) {
  return request({
    url: urlPost + '/float-rent/list-page',
    method: 'get',
    params: query
  })
}

// 重新计算
export function reCalculate(data) {
  return request({
    url: urlPost + '/float-rent/rent-recalculate',
    method: 'post',
    data: data
  })
}

// 获取物业下的所有租赁合同
export function getWyRentCont (query) {
  return request({
    url: urlPost + '/float-rent/contract-list-lease',
    method: 'get',
    params: query
  })
}

// 导入营业额
export function importTurnover(data) {
  return importRequest({
    url: urlPost + '/float-rent/import-turnover',
    method: 'post',
    data: data,
  })
}
