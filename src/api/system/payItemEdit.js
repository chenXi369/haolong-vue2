import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 获取某个物业可选的收费项目字典
export function getPayItemList(query) {
    return request({
        url: urlPost + '/charge-items/list-projectDictionaries',
        method: 'get',
        params: query
    })
}

// 可选收费标准
export function getChageItems(query) {
    return request({
        url: urlPost + '/charge-items/list-getChageItems',
        method: 'get',
        params: query
    })
}

// 批量更新收费项目中的开始时间和结束时间
export function batchUpdateTime(data) {
    return request({
        url: urlPost + '/charge-items/batch-updateChargeItems-time',
        method: 'post',
        data
    })
}

// 批量更新收费项目中的银行数据
export function batchUpdateBankCode(data) {
    return request({
        url: urlPost + '/charge-items/batch-updateChargeItems-bankCode',
        method: 'post',
        data
    })
}

// 批量自动补充银行代扣信息
export function batchSupplyBankInfo(data) {
    return request({
        url: urlPost + '/charge-items/batch-supply-bankInfo',
        method: 'post',
        data
    })
}

// 导入文件
export function exportFile(data) {
    return request({
        url: urlPost + `/common-logic/import-data?importKey=${data.importKey}`,
        method: 'post',
        data: data.file
    })
}

// 导出报表
export function reportExcel(data) {
    return request({
        url: urlPost + '/charge-items/report-output',
        method: 'post',
        data
    })
}