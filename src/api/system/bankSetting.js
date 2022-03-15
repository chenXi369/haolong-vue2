import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 添加银行设置
export function addBankSetting(data) {
    return request({
        url: urlPost + '/bank/bank-add',
        method: 'post',
        data
    })
}

// 删除银行设置
export function delBankSetting(data) {
    return request({
        url: urlPost + '/bank/bank-del',
        method: 'delete',
        data
    })
}

// 修改银行设置
export function updateBankSetting(data) {
    return request({
        url: urlPost + '/bank/bank-update',
        method: 'put',
        data
    })
}

// 查看银行设置
export function getBankSetting(query) {
    return request({
        url: urlPost + '/bank/bank-get',
        method: 'get',
        params: query
    })
}

// 所有银行的list
export function getBankList(query) {
    return request({
        url: urlPost + '/bank-code/bankCode-get',
        method: 'get',
        params: query
    })
}