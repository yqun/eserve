<template>
  <div>
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单详情</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push('/assignedorderinfo')"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group>
      <x-input :show-clear="false" type="text" v-model="f_description" text-align="right" title="问题"></x-input>
      <x-input :show-clear="false" type="text" v-model="f_customer_name" text-align="right" title="客户名称"></x-input>
      <x-input :show-clear="false" type="text" v-model="f_customer_phnum" text-align="right" title="客户电话"></x-input>
      <x-input :show-clear="false" type="text" v-model="f_customer_org" text-align="right" title="客户单位"></x-input>
      <x-input :show-clear="false" type="text" v-model="f_sn_no" text-align="right" title="SN号码"></x-input>
      <!-- 业务员 -->
      <x-input type="text"
               v-model="usernameinfo"
               text-align="right"
               title="业务员"
               @click.native="toSalesman('业务员')"></x-input>
      <x-input type="text" disabled v-model="f_address" text-align="right" title="服务地址"></x-input>
      <selector title="资产类别"
                direction="rtl"
                :options="assets"
                v-model="assestkey"
                placeholder="请选择资产类别">
      </selector>
      <selector title="工单类别"
                direction="rtl"
                :options="service"
                v-model="servicekey"
                placeholder="请选择单位">
      </selector>
      <x-input type="text" v-model="f_remark" text-align="right" title="备注"></x-input>
      <x-input type="text"
               v-model="f_name"
               text-align="right"
               @click.native="toSalesman('指派人员')"
               title="已指派人员">
      </x-input>
    </group>
    <x-button :gradients="btncolor" class="btnsubmit" @click.native="savechange()">保存修改</x-button>
  </div>
</template>

<script>
export default {
  name: "savechangeorder",
  data() {
    return{
      userId: 0,// 判断业务员  还是 指派人员
      btncolor: ['dodgerblue', 'dodgerblue'],
      // 数据
      f_description: '',
      f_customer_name: '',
      f_customer_phnum: '',
      f_customer_org: '',
      usernameinfo: '',  // 业务员
      usernameId: '', // 业务员id
      f_address: '',
      assestkey: null,
      assets: [],
      servicekey: null,
      service: [],
      f_remark: '',
      f_name: '',
      f_sn_no: '',
      f_nameId:[],
    }
  },
  computed: {
    orderId() {
      return this.$store.state.orderId
    }
  },
  mounted() {
    this.getOrderInfo()

    this.getassets()
    this.getservice()
},
  activated() {
    this.userId = this.$route.query.userId
    const userArr = this.$route.query.user
    if (!userArr) return false;
    const jsonData = JSON.parse(userArr)
    // 业务员
    if (this.userId == 1) {
      this.usernameinfo = jsonData[0].name
      this.usernameId = jsonData[0].id
    }
    if (this.userId == 2) {
      this.f_name = '';
      this.f_nameId = [];
      jsonData.forEach(item => {
        this.f_name += "　" + item.name
        this.f_nameId.push(item.id)
      })
    }
  },
  methods: {
    // 获取资产类别
    getassets() {
      this.axios
        .get('equmentType/findEqumentTypeOfOrg.do')
        .then(res => {
          // console.log(res)
          const {rows} = res.data
          if (!rows.length) return false;
          rows.forEach(item => {
            this.assets.push({
              key:item.id,
              value:item.f_name
            })
          })
        })
    },
    // 获取工单类别
    getservice() {
      this.axios
        .get('workOrderType/findEntityByPage.do')
        .then(res => {
          // console.log(res)
          const {rows} = res.data
          if (!rows.length) return false;
          rows.forEach(item => {
            this.service.push({
              key:item.id,
              value:item.f_type_name
            })
          })
        })
    },
    // 获取工单详情
    getOrderInfo() {
      this.axios
        .get(`workOrder/findEntityById.do?id=${this.orderId}`)
        .then(res => {
          console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          this.f_description = data.f_description
          this.f_customer_name = data.f_customer_name
          this.f_customer_phnum = data.f_customer_phnum
          this.f_customer_org = data.f_customer_org
          this.f_address = data.f_address
          this.f_remark = data.f_remark
          this.assestkey = data.f_equmentType_id
          this.servicekey = data.f_work_order_type_id
          this.usernameinfo = data.f_salesman_name
          this.usernameId = data.f_salesman_id
          this.f_sn_no = data.f_sn_no
          if (data.f_worker_count > 0) this.getUser(); // 如果有指派人员，获取指派人员
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
    // 保存修改
    savechange() {
      if (!this.usernameinfo || !this.assestkey || !this.servicekey) return this.$vux.toast.text('请填写完整信息');
      // 获取数据  发送请求  资产类别 value
      let assestval, servicevalue;
      this.assets.forEach(item => {
        if (this.assestkey == item.key) return assestval = item.value
      })
      this.service.forEach(item => {
        if (this.servicekey == item.key) return servicevalue = item.value
      })
      const data = {
        id: this.orderId,
        f_description: this.f_description, // 问题
        f_customer_name: this.f_customer_name, // 客户名称
        f_customer_phnum: this.f_customer_phnum,// 客户电话
        f_customer_org: this.f_customer_org, // 客户单位
        f_sn_no: this.f_sn_no, // sn号
        f_salesman_name: this.usernameinfo, // 业务员
        f_salesman_id: this.usernameId, // 业务员
        f_address: this.f_address, // 服务器地址
        f_equmentType_id: this.assestkey, //资产类别
        f_equmentType_name: assestval,
        f_work_order_type_id: this.servicekey, // 工单类别
        f_work_order_type: servicevalue,
        f_remark: this.f_remark, // 备注
      }
      // console.log(data)
      this.axios
        .post('workOrder/updateWorkOrderByDis.do', data)
        .then(res => {
          // console.log(res)
          if (res.data.res !== 'true') return this.$vux.toast.text('保存失败')
          this.saveF_name()
        })

    },
    // 指派人员 保存
    saveF_name() {
      const data = {id: this.orderId, ids: this.f_nameId}
      this.axios
        .post('workOrder/updateWorkers.do',data)
        .then(res => {
          console.log(res)
          if (res.data.res !== 'true') return this.$vux.toast.text('保存失败')
          this.$vux.toast.text('保存成功')
          setTimeout(() => {this.$router.push('/')}, 800)
        })
    },
    // 跳转选择业务员
    toSalesman(user) {
      let userId = 2
      if (user == '业务员') {
        userId = 1
      }
      this.$store.commit('changeSalesmanBackRouter', this.$route.path)
      this.$router.push({
        path: '/salesman',
        query: {
          userId: userId
        }
      })
    }
  }
}
</script>

<style scoped>
.btnsubmit {
  position: fixed;
  bottom: 0;
  z-index:999;
  border-radius: 0px;
}
</style>
