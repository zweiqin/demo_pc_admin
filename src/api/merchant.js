import request_cong from '@/utils/request_ai.js'


//商户查询
export function mer_search(data) {
  return request_cong.get('/api/v1/admin/merchant/', data)
}

//商户新增修改操作
export function mer_operate(data) {
  return request_cong.post('/api/v1/admin/merchant/', data)
}

//后台商户删除/恢复
export function mer_enabled(data) {
  return request_cong.put('/api/v1/admin/merchant/', data)
}

//获取后台所有商户信息列表
export function get_all_mer_list(data) {
  return request_cong.get('/api/v1/admin/merChant/All/', data)
}
