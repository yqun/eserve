<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单详情</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push('/confirmlist')"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group title="基本信息" >
      <!--<x-input type="text" disabled :value="orderInfo.f_description" text-align="right" title="问题"></x-input>-->
      <cell :value="orderInfo.f_description"><div slot="title" style="width: 5em;">问题</div></cell>
      <div>
        <img :src="url.imgUrl" alt="" style="height: 100px;" v-for="url in orderInfo.imgIds" :key="url.id">
      </div>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_work_order_state" title="工单状态"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_handler_org_name" title="处理单位名称"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_customer_phnum" title="联系方式"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_creater_name" title="创建人"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_create_time" title="创建时间"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_customer_name" title="客户名称"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_customer_phnum" title="客户电话"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_customer_org" title="客户单位"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_address" title="服务地址"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_work_order_type" title="工单类别"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_equmentType_name" title="资产类别"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_salesman_name" title="业务员"></x-input>
      <x-input type="text" disabled text-align="right" :value="f_confirmed" title="是否确认"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_confirm_time" title="确认时间"></x-input>
      <x-input type="text" disabled text-align="right" :value="f_name" title="指派人员"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_remark" title="备注"></x-input>
      <x-input v-if="false" type="text" disabled :value="orderInfo.f_sn_no" text-align="right" title="SN号码"></x-input>
      <x-input v-if="false" type="text" disabled :value="orderInfo.f_project_number" text-align="right" title="项目编号"></x-input>
    </group>
    <div class="footer" v-if="$store.state.navIndex == 0">
      <x-button style="background-color: dodgerblue;color: #fff;" @click.native="confirmOrder()">确认工单</x-button>
    </div>
    <!--<group title="进度信息" style="margin-bottom: 40px;" v-if="index != 0">-->
      <!--<timeline class="timeline-demo" v-for="(item,index) in count" :key="index">-->
        <!--<timeline-item v-for="(i,index) in item" :key="index">-->
          <!--<p :class="[index === 0 ? 'recent' : '']">{{i}}</p>-->
        <!--</timeline-item>-->
      <!--</timeline>-->
    <!--</group>-->
  </div>
</template>

<script>
export default {
  name: "confirminfo",
  data () {
    return {
      orderInfo: {},
      f_name: '', //指派人员
      count: [],
      btncolor: ['dodgerblue', 'dodgerblue'],
    }
  },
  computed: {
    id() {
      return this.$store.state.orderId
    },
    f_confirmed() {
      if (this.orderInfo.f_confirmed == true) {
        return '已确认'
      } else {
        return '待确认'
      }
    }
  },
  mounted() {
    this.getOrderInfo()
    this.getUser()
  },
  methods: {
    // 获取工单详情
    getOrderInfo() {
      this.axios
        .get(`workOrder/findEntityById.do?id=${this.id}`)
        .then(res => {
          // console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          this.orderInfo = data
          if (data.imgIds) {
            data.imgIds.forEach(item => {
              item.imgUrl = `${this.axiosUrl}system/getImage.do?id=${item.id}`
            })
          } // end if

        })
    },
    // 获取指派人员
    getUser() {
      this.axios
        .get(`workOrder/getWorkersByWorkOrder.do?id=${this.id}`)
        .then(res => {
          // console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          if (data.length != 0) {
            data.forEach(item => {
              this.f_name += "　" + item.f_name
            })
          }
        })
    },
    confirmOrder () {
      this.axios
        .get(`workOrder/confirmOrder.do?id=${this.id}`)
        .then(res => {
          // console.log(res)
          if (!res.data.res) return this.$vux.toast.show('确认失败')
          this.$vux.toast.show('确认成功')
          this.$router.push('/confirmlist')
        })
    },

  }
}
</script>

<style scoped>
.fixedpadding {
  padding-bottom: 44px;
}
.vux-header {
  position:fixed;
  top: 0;
  z-index: 999;
  width: 100%;
}
.timeline-demo p {
  color: #666;
  font-weight: normal;
}
.timeline-demo .recent {
  color: deepskyblue;
}
.footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index:999;
  border-radius: 0px;
}
</style>

