<template>
  <div class="content">
    <!-- 导航 -->
    <nav-bar wait="待指派" success="已指派" cancel="已取消"></nav-bar>
    <!-- 内容 -->
    <router-view :key="$store.state.navIndex"></router-view>
  </div>
</template>

<script>
export default {
  name: "assignedorder",
  data() {
    return {

    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path != '/assignedorderinfo') this.$store.commit('changeNavIndex', 0);
    next()
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
