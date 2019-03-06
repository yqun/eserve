<template>
  <div class="content">
    <!-- 导航 -->
    <nav-bar @sendIndex="getIndex" wait="待指派" success="已指派" cancel="已取消" :index="index"></nav-bar>
    <!-- 内容 -->
    <router-view :index="index" :key="this.index"></router-view>
  </div>
</template>

<script>
export default {
  name: "assignedorder",
  data() {
    return {
      index: 0,
    }
  },
  created() {
    this.getquery()
  },
  methods: {
    // 获取参数
    getquery() {
      this.index = this.$route.query.index || 0
    },
    getIndex(index) {
      this.index = index
    },
  },
}
</script>

<style scoped>
@import '../../assets/css/assignedperformlist.css';
.content {
  padding-bottom: 40px;
  box-sizing: border-box;
}
</style>
