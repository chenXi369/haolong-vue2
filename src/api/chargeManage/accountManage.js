import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"

// 获取数据校验列表 get
export function getCheckDataList() {
    return request({
        url: urlPost + '/data-verify/list',
        method: 'get'
    })
}

// 单条校验 post
export function checkStrip(data) {
  return request({
    url: urlPost + '/data-verify/verify',
    method: 'post',
    data
  })
}