<template>
  <div class="fixedpadding" style="height: 100%;box-sizing: border-box">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>e服务</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push({path:'/myorder', query:{index: index}})"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <i class="iconfont icon-jiahao" @click="$router.push('/ordersubmit')"></i>
    <div class="content">
      <!-- 导航 -->
      <nav-bar @sendIndex="getIndex" :index="index"></nav-bar>
      <!-- 内容 -->
      <router-view :index="this.index" :id="id" :key="this.index"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "myorderlist",
  data() {
    return{
      index: 0,
      id: 0,
    }
  },
  created() {
    this.getquery()
  },
  methods: {
    // 获取 参数
    getquery() {
      this.id = this.$route.query.id
      this.index = this.$route.query.index
    },
    bankLink() {
      this.$router.push({path:'/myorder', query:{index: index}})
    },
    getIndex(index) {
      this.index = index
    }
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
