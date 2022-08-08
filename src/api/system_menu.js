import request from '@/utils/request.js'

/*
**
**菜单相关接口
**
 */

// 菜单父级信息列表查询/demo
export function menu_pid_search() {
  return request_cong.get('/api/v1/admin/role/menu/pid/search/')
}

// 菜单新增/修改/demo
export function menu_operate(data) {
  return request_cong.post('/api/v1/admin/role/menu/operate/', data)
}

// 菜单权限信息列表查询u/search/{is_mer}/demo
export function menu_search(data) {
  return request_cong.get('/api/v1/admin/role/menu/all/search/', data)
}

// 菜单权限信息列表查询u/search/{is_mer}
export function menu_search_type(data) {
  return request_cong.get('/api/v1/admin/role/menu/search/', data)
}

// 最高权限角色PC/手机端菜单权限信息列表查询
export function GetHighestRole(data) {
  return request.get('/v1/role/GetHighestRole', data)
}

// 菜单删除del/{menu_id} 如果是父级,将删除改所有子级菜单/demo
export function menu_del(data) {
  return request_cong.get('/api/v1/admin/role/menu/del/' + data)
}

