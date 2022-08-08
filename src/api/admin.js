import request from '@/utils/request.js'

/*
**
**员工相关接口
**
 */

// 登录/demo
export function Login(data) {
  return request.post('/v1/Login', data, { login: false })
}

// 用户查询/demo
export function admin_search(data) {
  return request_cong.get('/api/v1/admin/user/', data)
}
// 修改密码/demo
export function pwd_update(data) {
  return request_cong.put('/api/v1/admin/user/', data)
}
// 删除用户/demo
export function admin_del(data) {
  return request_cong.post('/api/v1/admin/enabled/', data)
}

// 新增用户/demo
export function admin_create(data) {
  return request_cong.post('/api/v1/admin/user/', data)
}

// 查询某个用户的详情/demo
export function admin_details(data) {
  return request_cong.get('/api/v1/admin/user/' + data)
}
