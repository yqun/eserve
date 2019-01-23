<template>
  <div class="content">
    <!-- 内容 -->
    <ul>
      <li class="clearfix"
          v-for="(item,i) in list" :key="i"
          @click="$router.push('/addorder')">
        <div class="item-pic">
          <img src="" alt="">
        </div>
        <div class="item-content">
          <h3>售前服务</h3>
          <p>售前服务</p>
          <p>负责人</p>
          <p>负责人</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "internalorder",
  data() {
    return {
      list: [{},{},{},{},{},{},{}]
    }
  },
  methods: {
    getIndex (index) {
      console.log(index)
    }
  }
}
</script>

<style scoped>
li {
  height: 100px;
  box-sizing: border-box;
  border: 1px solid #01AAED;
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
}
li > div {
  float: left;
  box-sizing: border-box;
}
.item-pic {
  width: 30%;
  height: 100%;
  background-color: #ccc;
}
.item-content {
  width: 70%;
  padding-left: 10px;
}
.item-content h3 {
  font-weight: 400;
  color: #000;
}
.item-content p {
  font-size: 14px;
  color: #333;
}
</style>
