import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 总表数据list  get
export function getSummary(data) {
    return request({
        url: urlPost + '/dosage-register/list-getGeneralTable',
        method: 'post',
        data
    })
}

// 修改总表数据 -> post
export function updateSummary(data) {
  return request({
    url: urlPost + '/dosage-register/list-getGeneralTable',
    method: 'post',
    data
  })
}

// 分表数据list  post
export function getSubmeter(query) {
  return request({
    url: urlPost + '/dosage-register/list-getSubTable',
    method: 'get',
    params: query
  })
}

// 附加项目计算
export function calPlusItem(data) {
  return request({
    url: urlPost + '/dosage-register/sfxmJs',
    method: 'post',
    data
  })
}