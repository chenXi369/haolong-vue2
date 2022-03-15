import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"
// 显示业主的房屋list
export function getOwnerHouse(query) {
  return request({
    url: urlPost + '/house/owner-house-info-by-LYID',
    method: 'get',
    params: query
  })
}

// 房屋对应的合同
export function getOwnerHtList(query) {
  return request({
    url: urlPost + '/contract/contract-list-houseId',
    method: 'get',
    params: query
  })
}

// 托收代码list
export function collectionList(query) {
  return request({
    url: urlPost + '/data-dictionary/collection-code-list',
    method: 'get',
    params: query
  })
}

// 银行代码
export function bankList(query) {
  return request({
    url: urlPost + '/data-dictionary/bank-code-list',
    method: 'get',
    params: query
  })
}

// 新增合同 post
export function addContract(data) {
  return request({
    url: urlPost + '/contract/contract-add',
    method: 'post',
    data: data
  })
}

// 删除合同 delete
export function delContract(query) {
  return request({
    url: urlPost + '/contract/contract-del',
    method: 'delete',
    params: query
  })
}

// 修改合同 put
export function updateContract(data) {
  return request({
    url: urlPost + '/contract/contract-update',
    method: 'put',
    data: data
  })
}

// 展示合同 get
export function getContract(query) {
  return request({
    url: urlPost + '/contract/contract-get',
    method: 'get',
    params: query
  })
}

// 展示历史合同列表 get
export function getContractList(query) {
  return request({
    url: urlPost + '/contract/contract-list-houseId',
    method: 'get',
    params: query
  })
}

// 新增产权人 post
export function addPropertyOwner(data) {
  return request({
    url: urlPost + '/property-owner/add',
    method: 'post',
    data: data
  })
}

// 删除产权人 delete
export function delPropertyOwner(query) {
  return request({
    url: urlPost + '/property-owner/del',
    method: 'delete',
    params: query
  })
}

// 修改产权人信息 put
export function updatePropertyOwner(data) {
  return request({
    url: urlPost + '/property-owner/update',
    method: 'put',
    data: data
  })
}

// 展示产权人信息 get
export function getPropertyOwner(query) {
  return request({
    url: urlPost + '/contract/contract-get',
    method: 'get',
    params: query
  })
}

// 产权人列表
export function getPropertyOwnerList(query) {
  return request({
    url: urlPost + '/property-owner/list',
    method: 'get',
    params: query
  })
}

// 导入客户列表的搜寻
export function importCustomerList(query) {
  return request({
    url: urlPost + '/customer/customer-import',
    method: 'get',
    params: query
  })
}

// 新增房屋清单 post
export function addHouse(data) {
  return request({
    url: urlPost + '/house-list/add',
    method: 'post',
    data: data
  })
}

// 删除合同 delete
export function delHouse(query) {
  return request({
    url: urlPost + '/house-list/del',
    method: 'delete',
    params: query
  })
}

// 展示默认房屋清单详情 get
export function defaultHouseList(query) {
  return request({
    url: urlPost + '/house-list/get-houseId',
    method: 'get',
    params: query
  })
}

// 查询可选房 get
export function checkSelectHouse(query) {
  return request({
    url: urlPost + '/house-list/optional-house',
    method: 'get',
    params: query
  })
}

// 查询已选房 get
export function checkHouse(query) {
  return request({
    url: urlPost + '/house-list/list-selected',
    method: 'get',
    params: query
  })
}

// 过户的接口
export function changeContract(data) {
  return request({
    url: urlPost + '/contract/contract-transfer',
    method: 'post',
    data: data
  })
}

// 租赁合同列表
export function rentContractList(query) {
  return request({
    url: urlPost + '/contract/contract-list-lease',
    method: 'get',
    params: query
  })
}

// 租赁合同关联合同 get
export function rentContracts(query) {
  return request({
    url: urlPost + '/contract/contract-lease-related',
    method: 'get',
    params: query
  })
}

// 大楼下所有合同的审核和反审核 post
export function updateRentContracts(data) {
  return request({
    url: urlPost + '/contract/lease-review-batch',
    method: 'post',
    data: data
  })
}
