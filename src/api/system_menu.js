import request from '@/utils/request.js'

/*
**
**菜单相关接口
**
 */

// 菜单新增/修改/demo
export function OperateMenu(data) {
  return request.post('/v1/menu/OperateMenu', data)
}

// 菜单权限信息列表查询/菜单父级列表查询/demo
export function GetMenuList(data) {
  return request.get('/v1/menu/GetMenuList', data)
}

// PC/手机端菜单权限信息列表查询/demo
export function GetMenuByType(data) {
  return request.get('/v1/menu/GetMenuByType', data)
}

// 最高权限角色PC/手机端菜单权限信息列表查询
export function GetHighestRole(data) {
  return request.get('/v1/role/GetHighestRole', data)
}

// 菜单删除del,如果是父级,将删除改所有子级菜单/demo
export function DelMenu(data) {
  return request.delete('/v1/menu/DelMenu', data)
}

