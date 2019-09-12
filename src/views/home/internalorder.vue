<template>
  <div class="content">
    <scroller lock-x height="100%"
              @on-scroll-bottom="onScrollBottom"
              ref="scrollerBottom"
              :scroll-bottom-offst="200"
              style="box-sizing: border-box; padding-top: 10px;padding-bottom: 10px;">
      <ul>
        <li class="clearfix"
            v-for="(item,i) in list" :key="item.id"
            @click="$router.push({path: '/addorder', query: {id: item.id, name: item.f_type_name}})">
          <div class="item-pic">
            <img :src="item.imgUrl" alt="">
          </div>
          <div class="item-content">
            <h3>{{item.f_type_name}}</h3>
            <p>{{item.f_description}}</p>
            <p v-for="name in item.chargers" :key="name.id">负责人:{{name.f_dispatcher_name}} {{name.f_dispatcher_phnum}}</p>
          </div>
        </li>
      </ul>
      <!--<load-more tip="loading"></load-more>-->
    </scroller>
  </div>
</template>

<script>
export default {
  name: "internalorder",
  data() {
    return {
      list: [],
      flag: true
    }
  },
  created() {
    // this.getOrderInfo()
    this.getToken()
  },
  methods: {
    onScrollBottom() {},
    getToken() {
      const token = window.sessionStorage.getItem('token')
      const id = window.sessionStorage.getItem('id')
      const roles = window.sessionStorage.getItem('roles')
      if (token && id && roles) {
        this.getOrderInfo()
      } else {
        const userId = this.$route.query.userId;
        // const userId = window.location.search.split('&')[0].split('=')[1] || 'liwanlong';
        this.axios
          .get(`user/getToken.do?userId=${userId}`)
          .then(res => {
            // console.log(res);
            const {state} = res.data
            if (state !== 1) return this.$vux.toast.text(res.data.info)
            // 成功
            const {id, token, roles} = res.data
            const rolesStr = JSON.stringify(roles)
            window.sessionStorage.setItem('token', token)
            window.sessionStorage.setItem('id', id)
            window.sessionStorage.setItem('roles', rolesStr)

            this.$emit('haveToken') // 监听获取成功token

            this.getOrderInfo()
          })
      }
    },
    // 获取工单信息
    getOrderInfo() {
      this.axios
        .get('/workOrderType/findEntityByPage.do')
        .then(res => {
          console.log(res)
          const {status} = res
          if (status !== 200) return false;
          const {rows} = res.data
          this.list = rows
          // if (!this.list.length) return false;
          // this.list.forEach((item,index) => {
          //   this.list[index].imgUrl = `${this.axiosUrl}system/getImage.do?id=${item.f_image_id}`
          // })
        })
    },
  }
}
</script>

<style scoped>
.content {
  height: 100%;
}
li {
  height: 100px;
  box-sizing: border-box;
  border: 1px solid #01AAED;
  border-radius: 5px;
  margin-bottom: 10px;
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
  overflow: hidden;
  position: relative;
}
.item-pic img {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /*width: 100%;*/
  /*height: 100%;*/
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
