<template>
  <div class="content">
    <!-- 导航 -->
    <nav-bar @sendIndex="getIndex"></nav-bar>
    <!-- 内容 -->
    <ul>
      <li class="clearfix"
          @click="$router.push(`/performorderinfo/${i}`)"
          v-for="(item,i) in list" :key="i">
        <div class="item-content">
          <h3>问题：描述</h3>
          <p>客户：123</p>
          <p>地址：农大南路</p>
          <span>2018-01-15</span>
        </div>
        <div class="item-state">
          已查看
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "performorder",
  data() {
    return {
      wait: '待完成',
      index: '',
      list: [{},{},{},{},{},{},{},{}]
    }
  },
  methods: {
    getIndex(index) {
      console.log(index)
    }
  }
}
</script>

<style scoped>
@import '../../assets/css/assignedperformlist.css';
</style>
