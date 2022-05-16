/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const merchant = {
  // 员工
  path: '/merchant',
  component: Layout,
  redirect: '/merchant/index',
  name: '商户',
  meta: {
    title: '商户管理', icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: '/merchant/index',
      component: () => import('@/views/merchant/index'),
      name: '商户列表',
      meta: { title: '商户列表' }
    }
  ]
}



export default merchant
