import Vue from 'vue'
import Router from 'vue-router'
const Home  = () => import('@/views/home');
const Myorder  = () => import('@/views/home/myorder'); // 我的工单
const Myorderlist  = () => import('@/views/home/myorder/myorderlist');
const Myorderlistitem  = () => import('@/views/home/myorder/myorderlistitem');
const Myorderlistiteminfo  = () => import('@/views/home/myorder/myorderlistiteminfo');
const Ordersubmitview  = () => import('@/views/home/myorder/ordersubmitview'); // 工单提交
const Ordersubmit  = () => import('@/views/home/myorder/ordersubmit'); // 工单提交
const Oftenaddress  = () => import('@/views/home/myorder/oftenaddress'); // 常用地址
const Estimate  = () => import('@/views/home/myorder/estimate'); // 常用地址
const Salesman  = () => import('@/views/home/myorder/salesman');  // 业务员

const Internalorder  = () => import('@/views/home/internalorder'); //内部工单
const Addorder  = () => import('@/views/home/internalorder/addorder'); // 新建工单

const Assignedorder  = () => import('@/views/home/assignedorder'); // 指派工单
const ListItem  = () => import('@/views/home/assignedorder/listitem');
const Assignedorderinfo  = () => import('@/views/home/assignedorder/assignedorderinfo'); // assignedorderinfo工单详情
const Savechangeorder  = () => import('@/views/home/assignedorder/savechangeorder'); // assignedorderinfo工单详情

const Performorder  = () => import('@/views/home/performorder'); // 执行工单
const Performlist  = () => import('@/views/home/performorder/Performlist'); // 执行工单
const Performorderinfo  = () => import('@/views/home/performorder/performorderinfo'); // performorderinfo工单详情
const Writeworkcontent  = () => import('@/views/home/performorder/writeworkcontent'); // 填写工作内容

const Confirmorder  = () => import('@/views/home/confirmorder'); // 确认工单
const Confirmlist  = () => import('@/views/home/confirmorder/confirmlist'); // 确认工单列表
const Confirminfo  = () => import('@/views/home/confirmorder/confirminfo');// 确认工单列表


const Personal  = () => import('@/views/home/personal'); // 个人中心
const Userinfo  = () => import('@/views/home/personal/userinfo'); // 个人中心 主页
const Updatephone  = () => import('@/views/home/personal/updatephone'); // 修改手机号
const Updatepassword  = () => import('@/views/home/personal/updatepassword'); // 修改密码

import Login from '@/views/home/login'  // 登录
import Error from '@/views/home/error' // 错误


Vue.use(Router)

const router = new Router ({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: {path: '/internalorder', name:'internalorder', component: Internalorder},
      children: [
        {path: '/myorder',name:'myorder',component: Myorder,},
        {path: '/internalorder',name:'internalorder',component: Internalorder},
        {
          path: '/assignedorder',
          name:'assignedorder',
          component: Assignedorder,
          redirect: {path: '/listItem', name:'listitem', component: ListItem},
          children: [
            {path: '/listItem', name: 'listitem', component: ListItem}
          ]
        },
        {
          path: '/performorder',
          name:'performorder',
          component: Performorder,
          redirect: {path: '/performlist', name: 'performlist', component: Performlist},
          children: [
            {path: '/performlist', name: 'performlist', component: Performlist}
          ]
        },
        { // 确认工单
          path: '/confirmorder',
          name:'confirmorder',
          component: Confirmorder,
          redirect: {path: '/confirmlist', name: 'confirmlist', component: Confirmlist},
          children: [
            {path: '/confirmlist', name: 'confirmlist', component: Confirmlist}
          ]
        },
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
    {
      path: '/ordersubmitview',
      name:'ordersubmitview',
      component: Ordersubmitview,
      redirect: {path: '/ordersubmit', name:'ordersubmit', component: Ordersubmit},
      children: [
        {path: '/ordersubmit', name:'ordersubmit', component: Ordersubmit, meta: {keepAlive: true}},
        {path: '/addorder', name:'addorder', component: Addorder, meta: {keepAlive: true}},
        {path: '/savechangeorder', name:'savechangeorder', component: Savechangeorder, meta: {keepAlive: true}},
        {path: '/oftenaddress', name:'oftenaddress',component: Oftenaddress}, // 常用地址
        {path: '/salesman', name:'salesman', component: Salesman}, // 业务员
      ]
    },
    {
      path: '/myorderlist',
      name: 'myorderlist',
      component: Myorderlist,
      redirect: {path: '/myorderlistitem', name: 'myorderlistitem', component: Myorderlistitem},
      children: [
        {path: '/myorderlistitem', name: 'myorderlistitem', component: Myorderlistitem}
      ]
    },
    {path: '/error', name:'error', component: Error},
    {path: '/estimate', name:'estimate', component: Estimate},
    {path: '/myorderlistiteminfo', name:'myorderlistiteminfo', component: Myorderlistiteminfo},
    {path: '/assignedorderinfo', name:'assignedorderinfo', component: Assignedorderinfo},
    {path: '/performorderinfo',  name:'performorderinfo', component: Performorderinfo},
    {path: '/login', name:'login', component: Login},
    {path: '/writeworkcontent', name:'writeworkcontent', component: Writeworkcontent},
    {path: '/confirminfo', name:'confirminfo', component: Confirminfo},
  ]
})

// 在跳转之前会触发拦截
router.beforeEach((to, from, next) => {
  router.path = from.path
  if (to.path === '/internalorder' || to.path === '/error') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/internalorder')
    } else {
      next()
    }
  }
})

export default router
