<template>
  <div class="content">
    <!-- 导航 -->
    <nav-bar @sendIndex="getIndex" :index="index"></nav-bar>
    <!-- 内容 -->
    <router-view :index="this.index" :key="this.index"></router-view>
  </div>
</template>

<script>
export default {
  name: "performorder",
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
  }
}
</script>

<style scoped>
@import '../../assets/css/assignedperformlist.css';
.content {
  padding-bottom: 40px;
  box-sizing: border-box;
}
</style>
