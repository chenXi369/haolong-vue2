import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 获取所有的临时项目
export function getAllLsItems() {
    return request({
        url: urlPost + '/temp-fee/chooseTempItems-get',
        method: 'get'
    })
}

// 获取选中用户的临时项目
export function getUserLsItems(query) {
    return request({
        url: urlPost + '/temp-fee/selectedItems-get',
        method: 'get',
        params: query
    })
}

// 添加临时项目
export function addUserLsItems(data) {
    return request({
        url: urlPost + '/temporary-receivables/insert',
        method: 'post',
        data
    })
}

// 修改临时项目
export function updateUserLsItems(data) {
    return request({
        url: urlPost + '/temporary-receivables/update',
        method: 'post',
        data
    })
}

// 删除临时项目
export function delUserLsItems(query) {
    return request({
        url: urlPost + '/temporary-receivables/del',
        method: 'delete',
        params: query
    })
}

// 批量操作
export function batchUserLsItems(data) {
    return request({
        url: urlPost + '/temporary-receivables/batch-temporary-receivables',
        method: 'post',
        data
    })
}