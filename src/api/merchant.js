import request from '@/utils/request.js'

// 商户查询/demo
export function GetMerchantList(data) {
  return request.get('/v1/SysMer/GetMerchantList', data)
}

// 商户新增修改操作/demo
export function OperateMerchant(data) {
  return request.post('/v1/SysMer/OperateMerchant', data)
}

// 后台商户禁用/恢复/demo
export function UpdateMerStatus(data) {
  return request.put('/v1/SysMer/UpdateMerStatus', data)
}
