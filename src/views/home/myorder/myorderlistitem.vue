<template>
  <scroller lock-x height="100%"
            ref="scroller"
            @on-scroll-bottom="onScrollBottom"
            :scroll-bottom-offst="200"
            style="box-sizing: border-box; padding-top: 0px;padding-bottom: 15px;">
    <ul>
      <li class="clearfix"
          @click="toMyorderListItemInfo(item)"
          v-for="item in list" :key="item.id">
        <div class="item-content">
          <h3>问题：{{item.f_description}}</h3>
          <p>客户：{{item.f_customer_name}}({{item.f_customer_phnum}})</p>
          <p>地址：{{item.f_address}}</p>
          <span>{{item.f_create_time}}</span>
          <i v-if="index == 1 && item.appraiseCount == 0" @click.stop="evaluate(item)">添加评价</i>
          <i v-if="index == 1 && item.appraiseCount > 0" @click.stop="evaluate(item)">查看评价</i>
        </div>
        <div class="item-state">
          {{item.f_work_order_state}}
        </div>
      </li>
    </ul>
  </scroller>
</template>

<script>
export default {
  name: "myorderlistitem",
  data() {
    return {
      list: [],
      pageTotal: 0, //总页数
      page: 1, // 第几页
      rows: 10, // 条数
      status: '未指派',
      flag: true,
    }
  },
  computed: {
    index() {
      return this.$store.state.navIndex;
    },
    id() { // 服务单位id
      return this.$store.state.serviceId
    }
  },
  watch: {
    index(newVal, oldVal) {
      this.getIndex(newVal)
    }
  },
  mounted () {
    this.getIndex(this.index)
  },
  methods: {
    getIndex(index) {
      this.list.length = 0;
      this.page = 1;
      if (index == 0) {
        this.status = '待完成'
      } else if (index == 1) {
        this.status = '已完成'
      } else if (index == 2) {
        this.status = '已取消'
      }
      this.getWait()
    },
    onScrollBottom() {
      if (!this.flag || this.pageTotal < this.page) return false;
      this.flag = false
      this.getWait()
      setTimeout(() => {
        this.flag = true
      }, 2000)
    },
    // 获取待指派
    getWait() {
      this.axios
        .get(`workOrder/findEntityByPage.do?f_handler_org_id=${this.id}&f_work_order_state=${this.status}&page=${this.page}&rows=${this.rows}`)
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
    toMyorderListItemInfo(info) {
      this.$store.commit('changeOrderId', info.id)
      this.$router.push(`/myorderlistiteminfo`)
    },
    // 评价e
    evaluate(item) {
      this.$router.push({
        path: '/estimate',
        query: {
          appraise:item.appraise || ''
        }
      })
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
</style>
