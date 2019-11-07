<template>
  <div>
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>常用地址选择</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.replace($router.path)"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <!-- 地址 -->
    <ul>
      <li v-for="(item,index) in list" :key="index" @click="routerLink(item.f_address)">{{item.f_address}}</li>
    </ul>
  </div>
</template>

<script>
import bus from '@/eventbus/eventbus'
export default {
  name: "oftenaddress",
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getOftenAddress()
  },
  methods: {
    routerLink(item) {
      bus.$emit('sendAddress', item)
      this.$router.replace(this.$router.path)
    },
    // 获取常用地址
    getOftenAddress () {
      this.axios
        .get(`/address/getAddressByUser.do`)
        .then(res => {
          // console.log(res)
          const {status, data:{rows}} = res
          if (status == 200) {
            this.list = rows
          }
        })
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
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
}
li::-webkit-scrollbar {
  display: none;
}
</style>
