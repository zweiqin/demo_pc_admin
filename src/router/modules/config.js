/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const config = {
  // 员工
  path: '/config',
  component: Layout,
  redirect: '/config/pay',
  name: '系统配置',
  meta: {
    title: '系统配置', icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: '/config/pay',
      component: () => import('@/views/pay/index'),
      name: '支付配置',
      meta: { title: '支付配置' }
    }
  ]
}



export default config
