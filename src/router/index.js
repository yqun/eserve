import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Myorder from '@/views/home/myorder' // 我的工单
import Internalorder from '@/views/home/internalorder' //内部工单
import Assignedorder from '@/views/home/assignedorder' // 指派工单
import Performorder from '@/views/home/performorder' // 执行工单
import Personal from '@/views/home/personal' // 个人中心
import Userinfo from '@/views/home/personal/userinfo' // 个人中心 主页
import Updatephone from '@/views/home/personal/updatephone' // 修改手机号
import Updatepassword from '@/views/home/personal/updatepassword' // 修改密码
import Ordersubmit from '@/views/home/myorder/ordersubmit' // 工单提交
import Oftenaddress from '@/views/home/myorder/oftenaddress' // 常用地址
import Assignedorderinfo from '@/views/home/assignedorder/assignedorderinfo' // assignedorderinfo工单详情
import Performorderinfo from '@/views/home/performorder/performorderinfo' // performorderinfo工单详情
import Addorder from '@/views/home/internalorder/addorder' // 新建工单

Vue.use(Router)

const router = new Router ({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: {path: '/internalorder', name:'internalorder', component: Internalorder},
      children: [
        {path: '/myorder', name:'myorder', component: Myorder},
        {path: '/internalorder', name:'internalorder', component: Internalorder},
        {path: '/assignedorder', name:'assignedorder', component: Assignedorder},
        {path: '/performorder', name:'performorder', component: Performorder},
      ]
    },
    {
      path: '/personal',
      name:'personal',
      component: Personal,
      redirect: {path: '/userinfo', name:'userinfo', component: Userinfo},
      children: [
        {path: '/userinfo', name:'userinfo', component: Userinfo},
        {path: '/updatephone', name:'updatephone', component: Updatephone},
        {path: '/updatepassword', name:'updatepassword', component: Updatepassword},
      ]
    },
    {path: '/ordersubmit', name:'ordersubmit', component: Ordersubmit},
    {path: '/oftenaddress', name:'oftenaddress', component: Oftenaddress},
    {path: '/assignedorderinfo/:id', name:'assignedorderinfo', component: Assignedorderinfo},
    {path: '/performorderinfo/:id', name:'performorderinfo', component: Performorderinfo},
    {path: '/addorder', name:'addorder', component: Addorder},
  ]
})

router.beforeEach((to, from, next) => {
  router.path = from.path
  next()

})
// 在跳转之前会触发拦截
// router.beforeEach((to, from, next) => {
//   // console.log(to, from)
//   if (to.path === '/') {
//     next()
//   } else {
//     const token = sessionStorage.getItem('token')
//     if (!token) {
//       router.push('/')
//     } else {
//       next()
//     }
//   }
// })

export default router
