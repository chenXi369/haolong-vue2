import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 获取某个物业下的合同列表
export function getChargeItem(query) {
    return request({
        url: urlPost + '/contract/contract-getListByWyId',
        method: 'get',
        params: query
    })
}

// 可选收费标准
export function allPayStandard(query) {
    return request({
        url: urlPost + '/charging-standard/list-AlternativeTree',
        method: 'get',
        params: query
    })
}

// 获取客户的已选收费项目
export function selectPayStandard(query) {
    return request({
        url: urlPost + '/charge-items/list-byContractId',
        method: 'get',
        params: query
    })
}

// 分表 获取客户的收费项目
export function getUserPayItem(query) {
    return request({
        url: urlPost + '/charge-items/listSetRoom-byXMID',
        method: 'get',
        params: query
    })
}

// 分表 获取客户的可选收费项目
export function getUserAllPayItems(query) {
    return request({
        url: urlPost + '/charge-items/listChooseRoom-byContractId',
        method: 'get',
        params: query
    })
}

// 添加客户收费项目
export function addChargeStandard(data) {
    return request({
        url: urlPost + "/charge-items/add-chargeItems",
        method: 'post',
        data
    })
}

// 删除客户收费项目
export function delChargeStandard(data) {
    return request({
        url: urlPost + '/charge-items/delete-chargeStandard',
        method: 'post',
        data
    })
}

// 分表 添加房屋
export function addChooseRoom(data) {
    return request({
        url: urlPost + '/charge-items/add-chooseRoom',
        method: 'post',
        data
    })
}

// 分表 删除房屋
export function delChooseRoom(data) {
    return request({
        url: urlPost + '/charge-items/delete-chooseRoom',
        method: 'post',
        data
    })
}

// 批量操作客户收费项目
export function operationChargeItems(data) {
    return request({
        url: urlPost + '/charge-items/batch-operationChargeItems',
        method: 'post',
        data
    })
}

// 获取正在请求的任务进度
export function getProgress(data) {
    return request({
        url: urlPost + '/task-progress/get',
        method: 'post',
        data
    })
}

// 删除已完成请求任务的进度
export function delProgress(data) {
    return request({
        url: urlPost + '/task-progress/delete',
        method: 'post',
        data
    })
}

// 生成房间分表项目
export function createRoomFbItem(data) {
    return request({
        url: urlPost + '/charge-items/create-subTableItems',
        method: 'post',
        data
    })
}

// 获取物业的最新计费月份
export function getNewWyChargeMonth(query) {
    return request({
        url: urlPost + '/common-logic/get-latestJFMonth',
        method: 'get',
        params: query
    })
}

// 获取物业的全部的计费月份
export function getAllWyChargeMonth(query) {
    return request({
        url: urlPost + '/common-logic/get-allJFMonth',
        method: 'get',
        params: query
    })
}

// 无房源分表与可选房关联
export function relateFbAndRoom(data) {
    return request({
        url: urlPost + '/charge-items/noRoom-chooseRoom-relation',
        method: 'post',
        data
    })
}