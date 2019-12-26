<template>
  <div class="content">
    <scroller lock-x height="100%"
              @on-scroll-bottom="onScrollBottom"
              ref="scrollerBottom"
              :scroll-bottom-offst="200"
              style="box-sizing: border-box; padding-top: 10px;padding-bottom: 10px;">
      <ul>
        <li class="clearfix" v-for="(item,i) in list" :key="item.id"
            @click="toAddorder(item)">
          <div class="item-pic">
            <img :src="item.imgUrl" alt="">
          </div>
          <div class="item-content">
            <h3>{{item.f_type_name}}</h3>
            <p :style="{color: i%2==0?'#1678ff':'#ff467f'}">{{item.f_description}}</p>
            <p v-for="name in item.chargers" :key="name.id">
              负责人:{{name.f_dispatcher_name}} {{name.f_dispatcher_phnum}}
            </p>
            <div class="dot" style="background: url('../../../static/img/jingling.png')221px -9px/375px;"></div>
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
        const path = this.$route.query.path;
        const dataId = this.$route.query.dataId;
        // const userId = window.location.search.split('&')[0].split('=')[1] || 'liwanlong';
        this.axios.get(`user/getToken.do?userId=${userId}`)
          .then(res => {
            console.log(res);
            const {state} = res.data;
            if (state !== 1) return this.$vux.toast.text(res.data.info)
            // 成功
            const {id, token, roles, f_name} = res.data;
            const rolesStr = JSON.stringify(roles);
            window.sessionStorage.setItem('token', token);
            window.sessionStorage.setItem('id', id);
            window.sessionStorage.setItem('roles', rolesStr);
            window.sessionStorage.setItem('f_name', f_name);
            window.sessionStorage.setItem('f_name_qycode', userId);

            this.$emit('haveToken') // 监听获取成功token

            if (path) {
              this.$store.commit('changeOrderId', dataId)
              this.$router.push(`/${path}`)
            }

            this.getOrderInfo()
          })
      }
    },
    // 获取工单信息
    getOrderInfo() {
      this.axios.get('/workOrderType/findEntityByPage.do')
        .then(res => {
          // console.log(res)
          const {status} = res;
          if (status !== 200) return false;
          const {rows} = res.data;
          this.list = rows;
          this.list.forEach((item,index) => {
            this.list[index].imgUrl = `${this.axiosUrl}system/getImage.do?id=${item.f_image_id}`
          })
        })
    },
    // 跳转到addorder
    toAddorder(item) {
      this.$store.commit('changeOrderInfo', {orderId:item.id, orderName:item.f_type_name});
      this.$router.push({path: '/addorder'})
    }
  }
}
</script>

<style scoped>
.content {
  height: 100%;
}
li {
  box-sizing: border-box;
  padding-left: 30%;
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,0.15);
  position: relative;
}
li > div {
  float: left;
  box-sizing: border-box;
  padding: 10px 0;
}
.item-pic {
  width: 30%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}
.item-pic img {
  width: 70%;
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.item-content {
  width: 100%;
  padding-left: 10px;
  position: relative;
}
.item-content .dot {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 6px;
  height: 27px;
}
.item-content h3 {
  font-weight: 400;
  color: #333;
}
.item-content p {
  font-size: 14px;
  color: #787878;
}
</style>
