import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Myorder from '@/views/home/myorder' // 我的工单
import Myorderlist from '@/views/home/myorder/myorderlist'
import Myorderlistitem from '@/views/home/myorder/myorderlistitem'
import Myorderlistiteminfo from '@/views/home/myorder/myorderlistiteminfo'
import Ordersubmitview from '@/views/home/myorder/ordersubmitview' // 工单提交
import Ordersubmit from '@/views/home/myorder/ordersubmit' // 工单提交
import Oftenaddress from '@/views/home/myorder/oftenaddress' // 常用地址
import Estimate from '@/views/home/myorder/estimate' // 常用地址
import Salesman from '@/views/home/myorder/salesman'  // 业务员

import Internalorder from '@/views/home/internalorder' //内部工单
import Addorder from '@/views/home/internalorder/addorder' // 新建工单

import Assignedorder from '@/views/home/assignedorder' // 指派工单
import ListItem from '@/views/home/assignedorder/listitem'
import Assignedorderinfo from '@/views/home/assignedorder/assignedorderinfo' // assignedorderinfo工单详情
import Savechangeorder from '@/views/home/assignedorder/savechangeorder' // assignedorderinfo工单详情

import Performorder from '@/views/home/performorder' // 执行工单
import Performlist from '@/views/home/performorder/Performlist' // 执行工单
import Performorderinfo from '@/views/home/performorder/performorderinfo' // performorderinfo工单详情
import Writeworkcontent from '@/views/home/performorder/writeworkcontent' // 填写工作内容

import Confirmorder from '@/views/home/confirmorder' // 确认工单
import Confirmlist from '@/views/home/confirmorder/confirmlist' // 确认工单列表
import Confirminfo from '@/views/home/confirmorder/confirminfo' // 确认工单列表


import Personal from '@/views/home/personal' // 个人中心
import Userinfo from '@/views/home/personal/userinfo' // 个人中心 主页
import Updatephone from '@/views/home/personal/updatephone' // 修改手机号
import Updatepassword from '@/views/home/personal/updatepassword' // 修改密码

import Login from '@/views/home/login'  // 登录

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
    {path: '/estimate',     name:'estimate',    component: Estimate},
    {path: '/myorderlistiteminfo/:id', name:'myorderlistiteminfo', component: Myorderlistiteminfo},
    {path: '/assignedorderinfo', name:'assignedorderinfo', component: Assignedorderinfo},
    {path: '/performorderinfo',  name:'performorderinfo', component: Performorderinfo},
    {path: '/login', name:'login', component: Login},
    {path: '/writeworkcontent', name:'writeworkcontent', component: Writeworkcontent},
    {path: '/confirminfo', name:'confirminfo', component: Confirminfo},
  ]
})

// router.beforeEach((to, from, next) => {
//   router.path = from.path
//   next()
//
// })
// 在跳转之前会触发拦截
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  router.path = from.path
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      next()
    }
  }
})

export default router
