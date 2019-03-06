<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单详情</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push({path: '/myorderlistitem', query: {id: id, index: index}})"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group title="基本信息" >
      <x-input type="text" disabled :value="orderInfo.f_description" text-align="right" title="问题"></x-input>
      <div>
        <img :src="url.imgUrl" alt="" style="height: 100px;" v-for="url in orderInfo.imgIds" :key="url.id">
      </div>
      <x-input type="text" disabled :value="orderInfo.f_work_order_state" text-align="right" title="工单状态"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_handler_org_name" text-align="right" title="处理单位名称"></x-input>
      <x-input v-if="false" type="text" disabled :value="orderInfo.f_creater_name" text-align="right" title="创建人"></x-input>
      <x-input v-if="false" type="text" disabled :value="orderInfo.f_create_time" text-align="right" title="创建时间"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_customer_name" text-align="right" title="客户名称"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_customer_phnum" text-align="right" title="客户电话"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_customer_org" text-align="right" title="客户单位"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_sn_no" text-align="right" title="SN号码"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_salesman_name" text-align="right" title="业务员"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_project_number" text-align="right" title="项目编号"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_address" text-align="right" title="服务地址"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_work_order_type" text-align="right" title="工单类别"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_equmentType_name" text-align="right" title="资产类别"></x-input>
      <x-input v-if="false" type="text" disabled :value="f_confirmed" text-align="right" title="是否确认"></x-input>
      <x-input v-if="false" type="text" disabled :value="orderInfo.f_confirm_time" text-align="right" title="确认时间"></x-input>
      <x-input v-if="false" type="text" disabled :value="f_name" text-align="right" title="指派人员"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_remark" text-align="right" title="备注"></x-input>
    </group>
    <group title="进度信息" style="margin-bottom: 40px;" v-if="index != 0">
      <timeline class="timeline-demo" v-for="(item,index) in count" :key="index">
        <timeline-item v-for="(i,index) in item" :key="index">
          <p :class="[index === 0 ? 'recent' : '']">{{i}}</p>
        </timeline-item>
      </timeline>
    </group>
  </div>
</template>

<script>
export default {
  name: "moorderlistiteminfo",
  data () {
    return {
      id: 0,
      index: 0,
      orderId: 0,
      orderInfo: {},
      f_name: '', //指派人员
      count: [],
      btncolor: ['dodgerblue', 'dodgerblue'],
    }
  },
  computed: {
    f_confirmed() {
      if (this.orderInfo.f_confirmed == true) {
        return '已确认'
      } else {
        return '待确认'
      }
    }
  },
  created() {
    this.getquery()
    this.getOrderInfo()
    this.getUser()
    this.getSchedule()
  },
  methods: {
    // 获取参数
    getquery() {
      this.id = this.$route.query.id
      this.index = this.$route.query.index
      this.orderId = this.$route.params.id
    },
    // 获取工单详情
    getOrderInfo() {
      this.axios
        .get(`workOrder/findEntityById.do?id=${this.orderId}`)
        .then(res => {
          console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          this.orderInfo = data
          if (data.imgIds) {
            data.imgIds.forEach(item => {
              item.imgUrl = `http://10.1.1.44:8080/platform/system/getImage.do?id=${item.id}`
            })
          } // end if

        })
    },
    // 获取指派人员
    getUser() {
      this.axios
        .get(`workOrder/getWorkersByWorkOrder.do?id=${this.orderId}`)
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
    // 获取进度信息
    getSchedule() {
      this.axios
        .get(`workOrder/findWorkOrerLogs.do?id=${this.orderId}`)
        .then(res => {
          console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          if (data.length != 0) {
            data.forEach(item => {
              this.count.push([
                item.f_handler_name +'　'+ item.f_handle_time,
                '出发时间：' + item.f_start_date,
                '到达时间：' + item.f_arrive_date,
                '离开时间：' + item.f_leave_date,
                '返回时间：' + item.f_return_date,
                '交通费用：' + item.f_farse,
                '行驶里程：' + item.f_mileage,
                '工时：' + item.f_work_house + '(小时)',
                '备注：' + item.f_remark,
                item.f_work_content
              ])
            })
          }// end if
        })
    }
  }
}
</script>

<style scoped>
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
.btnsubmit {
  position: fixed;
  bottom: 0;
  z-index:999;
  border-radius: 0px;
}
</style>

