import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 房屋紧凑结构 展示物业
export function getWyList() {
  return request({
    url: urlPost + '/property/property-list-compact',
    method: 'get'
  })
}

// 房屋完整结构 展示物业
export function getExpandWyList() {
  return request({
    url: urlPost + '/organization/org-get-tree-by-id-except-type3',
    method: 'get'
  })
}

// 新增物业
export function addWy(data) {
  return request({
    url: urlPost + '/property/property-add',
    method: 'post',
    data: data
  })
}
// 删除物业
export function delWy(query) {
  return request({
    url: urlPost + '/property/property-del',
    method: 'delete',
    params: query
  })
}
// 修改物业
export function updateWy(data) {
  return request({
    url: urlPost + '/property/property-update',
    method: 'put',
    data: data
  })
}
// 查询物业
export function checkWy(query) {
  return request({
    url: urlPost + '/property/property-get',
    method: 'get',
    params: query
  })
}

// 列出物业下的楼栋
export function getExpandBuildList(query) {
  return request({
    url: urlPost + '/building/building-list',
    method: 'get',
    params: query
  })
}
// 新增楼栋
export function addBuild(data) {
  return request({
    url: urlPost + '/building/building-add',
    method: 'post',
    data: data
  })
}
// 删除楼栋
export function delBuild(query) {
  return request({
    url: urlPost + '/building/building-del',
    method: 'delete',
    params: query
  })
}
// 修改楼栋
export function updateBuild(data) {
  return request({
    url: urlPost + '/building/building-update',
    method: 'put',
    data: data
  })
}
// 查询楼栋
export function checkBuild(query) {
  return request({
    url: urlPost + '/building/building-get',
    method: 'get',
    params: query
  })
}

// 列出大楼下的所有房屋
export function getExpandHomeList(query) {
  return request({
    url: urlPost + '/house/house-list',
    method: 'get',
    params: query
  })
}
// 新增房屋
export function addHome(data) {
  return request({
    url: urlPost + '/house/house-add',
    method: 'post',
    data: data
  })
}
// 删除房屋
export function delHome(query) {
  return request({
    url: urlPost + '/house/house-del',
    method: 'delete',
    params: query
  })
}
// 修改房屋
export function updateHome(data) {
  return request({
    url: urlPost + '/house/house-update',
    method: 'put',
    data: data
  })
}
// 查询房屋
export function checkHome(query) {
  return request({
    url: urlPost + '/house/house-get',
    method: 'get',
    params: query
  })
}


// 删除冗余房
export function delExcessHouse(query) {
  return request({
    url: urlPost + '/house/house-del-redundancy',
    method: 'delete',
    params: query
  })
}

// 批量生成房屋 - 开始楼层
export function addStartHouse(data) {
  return request({
    url: urlPost + '/house/house-add-batch/beginFloor',
    method: 'post',
    data: data
  })
}

// 批量生成房屋 - 其他楼层
export function addOtherHouse(data) {
  return request({
    url: urlPost + '/house/house-add-batch/follow-up',
    method: 'post',
    data: data
  })
}

// 整栋复制
export function copyBuild(data) {
  return request({
    url: urlPost + '/house/house-add/building-copy',
    method: 'post',
    data: data
  })
}
// 整层复制
export function copyFloor(data) {
  return request({
    url: urlPost + '/house/house-add/floor-copy',
    method: 'post',
    data: data
  })
}
// 房间复制
export function copyHouse(data) {
  return request({
    url: urlPost + '/house/house-add/house-copy',
    method: 'post',
    data: data
  })
}

// 大楼描述相关
// 添加 大楼描述
export function addBuildDesc(data) {
  return request({
    url: urlPost + '/build-description/build-description-add',
    method: 'post',
    data: data
  })
}
// 删除
export function delBuildDesc(query) {
  return request({
    url: urlPost + '/build-description/build-description-del',
    method: 'delete',
    params: query
  })
}
// 修改
export function updateBuildDesc(data) {
  return request({
    url: urlPost + '/build-description/build-description-update',
    method: 'put',
    data: data
  })
}
// 查询单个
export function getBuildDesc(query) {
  return request({
    url: urlPost + '/build-description/build-description-get',
    method: 'get',
    params: query
  })
}
// 展示列表
export function getBuildDescList(query) {
  return request({
    url: urlPost + '/build-description/build-description-list',
    method: 'get',
    params: query
  })
}

// 查看合同
export function getHouseContract(query) {
  return request({
    url: urlPost + '/house/house-get/contract-list',
    method: 'get',
    params: query
  })
}
