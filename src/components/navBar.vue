<template>
  <div>
    <tab>
      <tab-item @on-item-click="getIndex" :selected="index == 0 || !index">{{wait || '待完成'}}</tab-item>
      <tab-item @on-item-click="getIndex" :selected="index == 1">{{success || '已完成'}}</tab-item>
      <tab-item @on-item-click="getIndex" :selected="index == 2">{{cancel || '已取消'}}</tab-item>
    </tab>
  </div>
</template>

<script>
export default {
  name: "navBar",
  props: ['wait', 'success', 'cancel'],
  data() {
    return {
      index: 0,
    }
  },
  created() {
    this.index = this.$store.state.navIndex
  },
  methods: {
    getIndex (index) {
      this.$store.commit('changeNavIndex', index)
    },
  }
}
</script>

<style scoped>
/* 底部线 */
.vux-tab-wrap >>> .vux-tab {
  background-color: transparent;
}
.vux-tab-wrap >>> .vux-tab-ink-bar { /* 选中的线 */
  display: none !important;
}
.vux-tab .vux-tab-item.vux-tab-selected {
  color: #1678ff;
  position: relative;
}
.vux-tab .vux-tab-item.vux-tab-selected::after {
  content: '';
  display: block;
  height: 2px;
  width: 20px;
  background-color: #1678ff;
  position: absolute;
  margin: auto;
  bottom: 0;
  left: 0;
  right: 0;
}
.vux-tab .vux-tab-item {
  background: none;
}
</style>
