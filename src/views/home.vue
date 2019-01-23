<template>
  <div style="padding: 46px 0 53px;">
    <div class="header">
      e服务
    </div>
    <router-view></router-view>
    <tabbar v-model="index">
      <tabbar-item link="/myorder">
        <i class="iconfont icon-fl-jia" slot="icon"></i>
        <i class="iconfont icon-fl-jia" slot="icon-active" style="color: orange"></i>
        <span slot="label">我的工单</span>
      </tabbar-item>
      <tabbar-item link="/assignedorder">
        <i class="iconfont icon-icon02" slot="icon"></i>
        <i class="iconfont icon-icon02" slot="icon-active" style="color: orange"></i>
        <span slot="label">指派工单</span>
      </tabbar-item>
      <tabbar-item link="/performorder">
        <i class="iconfont icon-fl-banzi" slot="icon"></i>
        <i class="iconfont icon-fl-banzi" slot="icon-active" style="color: orange"></i>
        <span slot="label">执行工单</span>
      </tabbar-item>
      <tabbar-item link="/internalorder">
        <i class="iconfont icon-gongdan" slot="icon"></i>
        <i class="iconfont icon-gongdan" slot="icon-active" style="color: orange"></i>
        <span slot="label">内部工单</span>
      </tabbar-item>
      <tabbar-item link="/personal">
        <i class="iconfont icon-wo1" slot="icon"></i>
        <i class="iconfont icon-wo1" slot="icon-active" style="color: orange"></i>
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
      index: 3,
    }
  },
  created() {
    this.getRouterPath()
  },
  methods: {
    // 判断 进首页时的路由 判断底部tabbar
    getRouterPath() {
      const routerpath = this.$route.path
      switch(routerpath) {
        case '/myorder':
          this.index = 0
        break;
        case '/assignedorder':
          this.index = 1
        break;
        case '/performorder':
          this.index = 2
        break;
        case '/internalorder':
          this.index = 3
        break;
      }
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
  font-size: 22px;
  color: #fff;
}
div.weui-tabbar {
  background-color: #2A91D8;
}
.weui-tabbar__item p.weui-tabbar__label span {
  color: #fff;
}
.weui-tabbar__item.weui-bar__item_on p.weui-tabbar__label span{
  color: orange;
}
</style>
