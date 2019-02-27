<template>
  <div class="content">
    <!-- 导航 -->
    <nav-bar @sendIndex="getIndex" wait="待指派" success="已指派" cancel="已取消"></nav-bar>
    <!-- 内容 -->
    <scroller lock-x height="100%" @on-scroll-bottom="onScrollBottom" :scroll-bottom-offst="200">
      <ul>
        <li class="clearfix"
            @click="$router.push(`/assignedorderinfo/${index}`)"
            v-for="(item,index) in list" :key="index">
          <div class="item-content">
            <h3>问题：描述</h3>
            <p>客户：{{index+1}}</p>
            <p>地址：农大南路</p>
            <span>2018-01-15</span>
          </div>
          <div class="item-state">
            已查看
          </div>
        </li>
      </ul>
    </scroller>

  </div>
</template>

<script>
export default {
  name: "assignedorder",
  data() {
    return {
      list: [{},{},{},{},{}],
      flag: true,
    }
  },
  created () {

  },
  methods: {
    getIndex(index) {
      console.log(index)
    },
    onScrollBottom() {
      if (!this.flag) return false;
      this.flag = false
      for(var i = 0; i < 5; i++) {
        this.list.push({})
      }
      setTimeout(() => {
        this.flag = true
      }, 2000)
    }
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
