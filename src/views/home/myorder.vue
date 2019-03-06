<template>
  <div class="content">
    <i class="iconfont icon-jiahao" @click="$router.push('/ordersubmit')"></i>
    <!-- 导航 -->
    <nav-bar @sendIndex="getIndex" :index="index"></nav-bar>
    <!-- 内容 -->
    <ul>
      <li class="item-content"
          v-for="item in list" :key="item.id"
          @click="routerLink(item.id)">
        {{item.f_name}}
      </li>
    </ul>
    <!-- 底部加号 -->
    <i class="add" @click="$router.push('/ordersubmit')">+</i>
  </div>
</template>

<script>
export default {
  name: "myorder",
  data() {
    return {
      index: 0,
      list: [],
    }
  },
  created() {
    this.getquery()
    this.getMyorder()
  },
  methods: {
    // 获取参数index
    getquery() {
      this.index = this.$route.query.index || 0
    },
    getIndex(index) {
      this.index = index
    },
    routerLink(id) {
      // console.log(id)
      this.$router.push({
        path: '/myorderlist',
        query: {
          id: id,
          index: this.index
        }
      })
    },
    // 获取我的工单信息
    getMyorder() {
      this.axios
        .get('org/findOrgsInRelation.do')
        .then(res => {
          // console.log(res)
          const {status} = res
          if (status !== 200) return false;
          const {rows} = res.data
          this.list = rows
        })
    }
  }
}
</script>

<style scoped>
i.iconfont.icon-jiahao {
  position: absolute;
  z-index: 1000;
  right: 20px;
  top: 3px;
  font-size: 28px;
  color: #fff;
}
.item-content {
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #01AAED;
  border-radius: 5px;
  margin-top: 6px;
  padding: 0 10px;
  color: #ac5978;
  line-height: 40px;
}
.add {
  display: block;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: lightgreen;
  position: fixed;
  right: 30px;
  bottom: 70px;
  font-style: normal;
  font-size: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
}
</style>
