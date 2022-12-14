import request from '@/utils/request.js'

/*
**
**权限管理相关接口
**
 */

// 角色列表查询/demo
export function GetRoleList(data) {
  return request.get('/v1/SysRole/GetRoleList', data)
}

// 后台用户角色新增/修改/删除demo
export function OperateRole(data) {
  return request.post('/v1/SysRole/OperateRole', data)
}

// 角色列表查询路由除根元素/demo
export function GetRoleListNoRoot(data) {
  return request.get('/v1/SysRole/GetRoleListNoRoot', data)
}

