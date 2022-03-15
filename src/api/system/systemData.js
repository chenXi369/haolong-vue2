import request from '@/utils/request'

const urlPost = "/dev-api/pm-system"
// 添加数据字典 post
export function addDictionary(data) {
  return request({
    url: urlPost + '/data-dictionary/data-dictionary-add',
    method: 'post',
    data: data
  })
}

// 删除操作 delete
export function delDictionary(query) {
  return request({
    url: urlPost + '/data-dictionary/data-dictionary-del',
    method: 'delete',
    params: query
  })
}

// 修改数据字典 put
export function updateDictionary(data) {
  return request({
    url: urlPost + '/data-dictionary/data-dictionary-update',
    method: 'put',
    data: data
  })
}

// 展示省份 get
export function getProvince(query) {
  return request({
    url: urlPost + '/data-dictionary/data-dictionary-province-list',
    method: 'get',
    params: query
  })
}

// 展示点击的节点 get
export function getDictionary(query) {
  return request({
    url: urlPost + '/data-dictionary/data-dictionary-list',
    method: 'get',
    params: query
  })
}

// 万能查询接口 get
export function queryGet(query) {
  return request({
    url: urlPost + '/a-query/a-query-get',
    method: 'get',
    params: query
  })
}
