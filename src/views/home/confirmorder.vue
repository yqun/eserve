<template>
  <div class="content">
    <!-- 导航 -->
    <nav-bar @sendIndex="getIndex" :index="index" wait="待确认" success="已确认"></nav-bar>
    <!-- 内容 -->
    <router-view :key="$store.state.navIndex"></router-view>
  </div>
</template>

<script>
  export default {
    name: "confirmorder",
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
        // console.log(this.$store.state.navIndex)
        this.index = this.$store.state.navIndex
      },
      getIndex(index) {
        // this.index = index
        this.$store.commit('increment', index)
        // console.log(this.$store.state.navIndex)
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
