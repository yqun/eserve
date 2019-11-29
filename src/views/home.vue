<template>
  <div style="padding: 46px 0 53px; height: 100%; box-sizing: border-box;">
    <div class="header">
      e服务
    </div>
    <router-view @haveToken="getToken"></router-view>
    <tabbar v-model="index">
      <tabbar-item @on-item-click="$router.replace('/myorder')">
        <i class="iconfont myorder" slot="icon" style="background-position: 305px 0"></i>
        <!-- background: url('../../static/img/jingling.png') 264px 0/375px -->
        <i class="iconfont myorder" slot="icon-active" style="background-position: 264px 0;"></i>
        <span slot="label">我的工单</span>
      </tabbar-item>
      <tabbar-item @on-item-click="$router.replace('/assignedorder')" v-if="assignedorder">
        <!--<i class="iconfont icon-icon02" slot="icon"></i>-->
        <!--<i class="iconfont icon-icon02" slot="icon-active" style="color: orange"></i>-->
        <i class="iconfont" slot="icon" style="background-position: 305px -22px"></i>
        <i class="iconfont" slot="icon-active" style="background-position: 264px -22px"></i>
        <span slot="label">指派工单</span>
      </tabbar-item>
      <tabbar-item @on-item-click="$router.replace('/confirmorder')" v-if="confirmorder">
        <i class="iconfont" slot="icon" style="background-position: 305px -44px"></i>
        <i class="iconfont" slot="icon-active" style="background-position: 264px -44px"></i>
        <span slot="label">确认工单</span>
      </tabbar-item>
      <tabbar-item @on-item-click="$router.replace('/performorder')" v-if="performorder">
        <i class="iconfont" slot="icon" style="background-position: 305px -67px"></i>
        <i class="iconfont" slot="icon-active" style="background-position: 264px -67px"></i>
        <span slot="label">执行工单</span>
      </tabbar-item>
      <tabbar-item @on-item-click="$router.replace('/internalorder')">
        <i class="iconfont" slot="icon" style="background-position: 305px -89px"></i>
        <i class="iconfont" slot="icon-active" style="background-position: 264px -89px"></i>
        <span slot="label">内部工单</span>
      </tabbar-item>
      <tabbar-item @on-item-click="$router.push('/personal')">
        <i class="iconfont" slot="icon" style="background-position: 305px -111px"></i>
        <i class="iconfont" slot="icon-active" style="background-position: 264px -111px"></i>
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      index: -1,
      roles: [], // 用户权限
      assignedorder: false,
      performorder: false,
      confirmorder: false
    }
  },
  mounted() {
    if (window.sessionStorage.getItem('token')) {
      this.getUser()
      this.getRouterPath()
    }
  },
  methods: {
    getToken() {
      this.getUser()
      this.getRouterPath()
    },
    // 获取  用户权限
    getUser() {
      const rolesStr = window.sessionStorage.getItem('roles')
      this.roles = JSON.parse(rolesStr)
      this.roles.forEach(item => {
        if (item.id == 6 || item.id == 4) {
          this.assignedorder = true
        }
        if (item.id == 8) {
          this.performorder = true
        }
        if (item.id == 7) {
          this.confirmorder = true
        }
      })
    },
    // 判断 进首页时的路由 判断底部tabbar
    getRouterPath() {
      let arr = []
      // assignedorder performorder confirmorder
      if (this.assignedorder) arr.push(true)
      if (this.performorder) arr.push(true)
      if (this.confirmorder) arr.push(true)
      const routerpath = this.$route.path
      // console.log(routerpath)
      switch(routerpath) {
        case '/myorder':
          this.index = 0
        break;
        case '/internalorder':
          this.index = 1
        break;
        case '/listItem':
          if (!this.assignedorder) {
            this.index = 1
          } else {
            this.index = 3
          }
        break;
        case '/confirmlist':
          // 如果两个中  有正确的 this.index = 2
          if(this.assignedorder == true || this.confirmorder == true) {
            this.index = 4
            // 如果两个都正确  this.index = 3
            if (this.assignedorder == true && this.confirmorder == true)  {
              this.index = 4
            }
          } else {
            // 如果两个都不正确 this.index = 1
            this.index = 1
          }
        break;
        case '/performlist':
          // 判断之前几个存在
          this.index=arr.length+2
        break;
      }
      // console.log(this.index)
    },
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 46px;
  background-color: dodgerblue;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  line-height: 46px;
}
/* 底部导航 */
.weui-tabbar {
  position: fixed;
  bottom: 0;
}
i.iconfont {
  display: block;
  width: 18px;
  height: 19px;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url("../../static/img/jingling.png");
  background-size: 375px;
}
div.weui-tabbar {
  background-color: #fcfdff;
  /*background-color: #ccc;*/
}
.weui-tabbar__item p.weui-tabbar__label span {
  color: #696969;
}
.weui-tabbar__item.weui-bar__item_on p.weui-tabbar__label span{
  color: #1678ff;
}
</style>
