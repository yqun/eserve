<template>
  <div class="content">
    <!-- 导航 -->
    <nav-bar @sendIndex="getIndex" wait="待指派" success="已指派" cancel="已取消"></nav-bar>
    <!-- 内容 -->
    <ul>
      <li class="clearfix"
          @click="$router.push(`/assignedorderinfo/${index}`)"
          v-for="(item,index) in list" :key="index">
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
  name: "assignedorder",
  data() {
    return {
      list: ['','','','','','','','','']
    }
  },
  created () {

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
