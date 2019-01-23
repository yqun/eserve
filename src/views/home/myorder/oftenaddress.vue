<template>
  <div>
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>常用地址选择</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push($router.path)"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <!-- 地址 -->
    <ul>
      <li v-for="(item,index) in list" :key="index">{{item}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "oftenaddress",
  data() {
    return {
      list: ['1','2','3']
    }
  }
}
</script>

<style scoped>
ul {
  margin-top: 10px;
}
li {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dfdfdf;
  background-color: #fff;
  box-sizing:border-box;
  padding: 0 10px;
}
</style>
