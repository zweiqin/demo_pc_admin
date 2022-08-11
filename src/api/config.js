import request_cong from '@/utils/request_ai.js'

// 转账配置
// 获取系统所有的支付配置信息
export function getPayType(data) {
  return request_cong.get('/api/v1/admin/settlementCenter/pay_type/', data)
}

// 商户密钥上传
export function uploadKey(data) {
  return request_cong.post('/api/v1/admin/secretKey/upload/', data)
}

// 商户新增支付信息
export function newPayType(data) {
  return request_cong.post('/api/v1/admin/settlementCenter/pay_type/', data)
}
