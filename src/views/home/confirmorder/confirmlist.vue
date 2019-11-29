<template>
  <scroller lock-x height="100%"
            ref="scroller"
            @on-scroll-bottom="onScrollBottom"
            :scroll-bottom-offst="200"
            style="box-sizing: border-box; padding-top: 0px;padding-bottom: 15px;">
    <ul>
      <li class="clearfix"
          @click="toConfirmInfo(item)"
          v-for="(item) in list" :key="item.id">
        <div class="item-content">
          <h3>问题：{{item.f_description}}</h3>
          <p>客户：{{item.f_customer_name}}({{item.f_customer_phnum}})</p>
          <p>地址：{{item.f_address}}</p>
          <span>{{item.f_create_time}}</span>
          <div class="dot"></div>
        </div>
        <div class="item-state">
          <div class="state_img1" v-if="item.f_work_order_state.indexOf('查看') > 0"></div>
          <div class="state_img2" v-else-if="item.f_work_order_state.indexOf('取消') > 0"></div>
          <div class="state_img3" v-else></div>
          {{item.f_work_order_state}}
        </div>
      </li>
    </ul>
  </scroller>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "confirmlist",
    props:['index'],
    data() {
      return {
        list: [],
        pageTotal: 0, //总页数
        page: 1, // 第几页
        rows: 10, // 条数
        status: '待确认',
        flag: true,
      }
    },
    beforeRouteLeave(to,form, next) {
      if (to.name !== 'confirminfo') {
        this.$store.commit('changeNavIndex', 0)
      }
      next()
    },
    computed: {
      ...mapState(['navIndex']),
    },
    watch: {
      navIndex(newVal, oldVal) {
        this.getIndex(newVal)
      }
    },
    mounted () {
      this.getWait()
    },
    methods: {
      onScrollBottom() {
        if (!this.flag || this.pageTotal < this.page) return false;
        this.flag = false
        this.getWait()
        setTimeout(() => {this.flag = true}, 2000)
      },
      getIndex(index) {
        this.list.length = 0;
        this.page = 1;
        if (index == 0) {
          this.status = '待确认'
        } else if (index == 1) {
          this.status = '已确认'
        } else if (index == 2) {
          this.status = '已取消'
        }
        this.getWait()
      },
      // 获取带指派
      getWait() {
        // console.log(this.navIndex)
        const data = {page:this.page, rows:this.rows}
        if (this.navIndex == 0) {data.f_confirmed = false}
        else if (this.navIndex == 1) {data.f_confirmed = true}
        else if (this.navIndex == 2) {data.f_work_order_state = '已取消'}
        // console.log(data)
        this.axios
          .get(`workOrder/findWorkOrderBySalesmanPage.do`, {params: data})
          .then(res => {
            console.log(res)
            const {status} = res
            if (status !== 200) return false;
            const {rows, total} = res.data
            rows.forEach(item => {
              this.list.push(item)
            })
            this.pageTotal = Math.ceil(total/10)
            this.page++;
          })
      },
      toConfirmInfo(info) {
        this.$store.commit('changeOrderId', info.id)
        this.$router.push('/confirminfo')
      }
    }
  }
</script>

<style scoped>
@import '../../../assets/css/assignedperformlist.css';
.content {
  padding-bottom: 40px;
  box-sizing: border-box;
}
.dot {
  background: url("../../../../static/img/jingling.png")221px -9px/375px;
}
.state_img1 {
  background: url("../../../../static/img/dzp.png") no-repeat 0 0/40px;
}
.state_img2 {
  background: url("../../../../static/img/yqx.png") no-repeat 0 0/40px;
}
.state_img3 {
  background: url("../../../../static/img/gdclz.png") no-repeat 0 0/40px;
}
</style>
