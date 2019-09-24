<template>
  <div class="content">
    <!-- 导航 -->
    <nav-bar></nav-bar>
    <!-- 内容 -->
    <router-view :key="$store.state.navIndex"></router-view>
  </div>
</template>

<script>
export default {
  name: "performorder",
  data() {
    return {

    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path != '/performorderinfo') this.$store.commit('changeNavIndex', 0);
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
