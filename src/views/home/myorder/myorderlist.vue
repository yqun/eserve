<template>
  <div class="fixedpadding" style="height: 100%;box-sizing: border-box">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>e服务</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push('/myorder')"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <i class="iconfont icon-jiahao" @click="$router.push('/ordersubmit')"></i>
    <div class="content">
      <!-- 导航 -->
      <nav-bar></nav-bar>
      <!-- 内容 -->
      <router-view :key="$store.state.navIndex"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "myorderlist",
  data() {
    return{

    }
  },
  computed: {
    id() {
      return this.$store.state.serviceId
    }
  },
  methods: {

  }
}
</script>

<style scoped>
@import '../../../assets/css/assignedperformlist.css';
.content {
  padding-bottom: 40px;
  box-sizing: border-box;
}
.vux-header {
  position:fixed;
  top: 0;
  z-index: 999;
  width: 100%;
}
i.iconfont.icon-jiahao {
  position: absolute;
  z-index: 1000;
  right: 20px;
  top: 3px;
  font-size: 28px;
  color: #fff;
}
</style>
