<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单详情</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push('/performorder')"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <!-- 其他类 -->
    <group title="基本信息" v-if="!isStandard && !isPreSale">
      <cell :value="orderInfo.f_description"><div slot="title" style="width: 3em;">问题</div></cell>
      <div>
        <img :src="url.imgUrl" alt="" style="height: 100px;" v-for="url in orderInfo.imgIds" :key="url.id">
      </div>
      <x-input type="text" disabled :value="orderInfo.f_work_order_state" text-align="right" title="工单状态"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_handler_org_name" text-align="right" title="处理单位名称"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_creater_name" text-align="right" title="创建人"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_create_time" text-align="right" title="创建时间"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_customer_name" text-align="right" title="客户名称"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_customer_phnum" text-align="right" title="客户电话"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_customer_org" text-align="right" title="客户单位"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_sn_no" text-align="right" title="SN号码"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_salesman_name" text-align="right" title="业务员"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_project_number" text-align="right" title="项目编号"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_address" text-align="right" title="服务地址"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_work_order_type" text-align="right" title="工单类别"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_equmentType_name" text-align="right" title="资产类别"></x-input>
      <x-input type="text" disabled :value="f_confirmed" text-align="right" title="是否确认"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_confirm_time" text-align="right" title="确认时间"></x-input>
      <x-input type="text" disabled :value="f_name" text-align="right" title="指派人员"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_remark" text-align="right" title="备注"></x-input>
    </group>
    <!-- 标案 -->
    <group title="基本信息" v-if="orderInfo.f_work_order_type == '标案类'">
      <x-input type="text" disabled :value="orderInfo.f_creater_name" text-align="right" title="创建人"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_create_time" text-align="right" title="创建时间"></x-input>
      <div style="padding: 0 10px;">
        <img :src="url.imgUrl" alt="" style="height: 100px;" v-for="url in orderInfo.imgIds" :key="url.id">
      </div>
      <cell :value="orderInfo.f_description"><div slot="title" style="width: 3em;">问题</div></cell>
      <x-input type="text" disabled :value="orderInfo.f_work_order_type" text-align="right" title="工单类别"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_salesman_name" text-align="right" title="业务员"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_project_number" text-align="right" title="项目编号"></x-input>
      <cell :value="orderInfo.f_project_name"><div slot="title" style="width: 5em;">项目名称</div></cell>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_bid_number" title="招标编号"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_purchaser_name"  title="采购人名称"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_purchaser_org_name"  title="采购代理机构名称"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_bid_win_sum"  title="中标金额"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_bid_open_date"  title="开标时间"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_bid_doc_count"  title="标书本数"></x-input>
      <x-input type="text" disabled text-align="right" :value="f_name" title="指派人员"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_remark" title="备注"></x-input>
    </group>
    <!-- 售前服务 -->
    <group title="基本信息" v-if="orderInfo.f_work_order_type == '售前服务'">
      <x-input type="text" disabled :value="orderInfo.f_creater_name" text-align="right" title="创建人"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_create_time" text-align="right" title="创建时间"></x-input>
      <div style="padding: 0 10px;">
        <img :src="url.imgUrl" alt="" style="height: 100px;" v-for="url in orderInfo.imgIds" :key="url.id">
      </div>
      <cell :value="orderInfo.f_description"><div slot="title" style="width: 3em;">问题</div></cell>
      <x-input type="text" disabled :value="orderInfo.f_work_order_type" text-align="right" title="工单类别"></x-input>
      <cell :value="orderInfo.f_presale_type_name"><div slot="title" style="width: 5em;">服务类别</div></cell>
      <x-input type="text" disabled :value="orderInfo.f_salesman_name" text-align="right" title="业务员"></x-input>
      <x-input type="text" disabled :value="orderInfo.f_project_number" text-align="right" title="项目编号"></x-input>
      <cell :value="orderInfo.f_project_name"><div slot="title" style="width: 5em;">项目名称</div></cell>
      <x-input type="text" disabled text-align="right" :value="f_name" title="指派人员"></x-input>
      <x-input type="text" disabled text-align="right" :value="orderInfo.f_remark" title="备注"></x-input>
    </group>

    <group title="进度信息" :style="marginBottom" v-if="count.length">
      <timeline class="timeline-demo"
                v-if="orderInfo.f_work_order_type != '标案类' && orderInfo.f_work_order_type != '售前服务'"
                v-for="(item,index) in count" :key="index" >
        <!--<timeline-item v-for="(i,index) in item" :key="index">-->
        <!--<p :class="[index === 0 ? 'recent' : '']">{{i}}</p>-->
        <!--</timeline-item>-->
        <timeline-item><p class="recent">{{item.name}}</p></timeline-item>
        <timeline-item><p>{{item.f_start}}</p></timeline-item>
        <timeline-item><p>{{item.f_arrive}}</p></timeline-item>
        <timeline-item><p>{{item.f_return}}</p></timeline-item>
        <timeline-item><p>{{item.f_leaveDate}}</p></timeline-item>
        <timeline-item><p>{{item.f_farse}}</p></timeline-item>
        <timeline-item><p>{{item.f_mileage}}</p></timeline-item>
        <timeline-item><p>{{item.f_work_house}}</p></timeline-item>
        <timeline-item><p>{{item.f_remark}}</p></timeline-item>
        <timeline-item><p v-html="item.f_work_content"></p></timeline-item>
        <p v-for="i in item.images" :key="i.id" class="enclosure">
          <a :href="i.imagesUrl" download>{{i.f_name}}</a>
        </p>
      </timeline>
      <timeline class="timeline-demo" v-if="isStandard"
                v-for="(item,index) in count" :key="index" >
        <timeline-item><p class="recent">{{item.name}}</p></timeline-item>
        <timeline-item><p>{{item.f_doc_done_time}}</p></timeline-item>
        <timeline-item><p>{{item.f_bid_doc_count}}</p></timeline-item>
        <timeline-item><p>{{item.f_bid_win}}</p></timeline-item>
        <timeline-item><p v-html="item.f_remark"></p></timeline-item>
        <p v-for="i in item.images" :key="i.id" class="enclosure">
          <a :href="i.imagesUrl" download>{{i.f_name}}</a>
        </p>
      </timeline>
      <timeline class="timeline-demo" v-if="isPreSale"
                v-for="(item,index) in count" :key="index" >
        <timeline-item><p class="recent">{{item.name}}</p></timeline-item>
        <timeline-item><p>{{item.f_cost}}元</p></timeline-item>
        <timeline-item><p v-html="item.f_remark"></p></timeline-item>
        <timeline-item>
          <p v-for="i in item.images" :key="i.id" class="enclosure">
            <a :href="i.imagesUrl" download>{{i.f_name}}</a>
          </p>
        </timeline-item>
      </timeline>
    </group>

    <div class="btnsubmit" v-if="index==0">
      <flexbox style="box-sizing: border-box;" v-if="!isPreSale && !isStandard">
        <flexbox-item><x-button class="flex-btn" :disabled="f_start" @click.native="confirm('f_start')">出发</x-button></flexbox-item>
        <flexbox-item><x-button class="flex-btn" :disabled="f_arrive" @click.native="confirm('f_arrive')">到达</x-button></flexbox-item>
        <flexbox-item><x-button class="flex-btn" :disabled="f_leave" @click.native="confirm('f_leave')">离开</x-button></flexbox-item>
        <flexbox-item><x-button class="flex-btn" :disabled="f_return" @click.native="confirm('f_return')">返回</x-button></flexbox-item>
      </flexbox>
      <x-button :gradients="btncolor"
                style="border-radius: 0"
                @click.native="$router.push({path:'/writeworkcontent', query: {date: finishDate, work_order_type: orderInfo.f_work_order_type}})">
        填报工作内容
      </x-button>
    </div>
    <!-- 弹窗 -->
    <div style="display: none">
      <datetime v-model="hourListValue"
                format="YYYY-MM-DD HH:mm"
                @on-confirm="dateTime()"
                :show.sync="visibility"
                title="请选择时间">
      </datetime>
    </div>
    <confirm v-model="confirmShow"
             @on-confirm="selectTime()"
             @on-cancel="visibility = true"
             :title="confirmTitle">
      <p style="text-align:center;">{{confirmContent}}</p>
    </confirm>
    <!-- toast -->
    <toast v-model="toastShow"
           :text="toastValue"
           type="text"
           :time="1000"
           is-show-mask
           position="middle"
           width="10em">
    </toast>
  </div>
</template>

<script>
export default {
  name: "performorderinfo",
  data () {
    return {
      orderInfo: {},
      f_name: '',
      count: [],
      btncolor: ['dodgerblue', 'dodgerblue'],
      f_start: true,
      f_arrive: true,
      f_leave: true,
      f_return: true,
      userId: 0,
      // 弹窗
      confirmShow: false,
      confirmTitle: '',
      confirmContent: '',
      hourListValue: '', // 时间
      visibility: false, // 默认弹出
      // toast
      toastShow: false,
      toastValue: '',
      marginBottom: {
        'margin-bottom': '0',
      },
      // 预计完成时间
      finishDate: '',
    }
  },
  computed: {
    index() {
      return this.$store.state.navIndex
    },
    orderId() {
      return this.$store.state.orderId;
    },
    f_confirmed() {
      if (this.orderInfo.f_confirmed == true) {
        return '已确认'
      } else {
        return '待确认'
      }
    },
    isStandard() {
      let flag = false;
      const str = this.orderInfo.f_work_order_type
      if (str) {
        const index = str.indexOf("标案");
        if (index != -1) flag = true;
        return flag;
      }
    },
    isPreSale() {
      let flag = false;
      const str = this.orderInfo.f_work_order_type
      if (str) {
        const index= str.indexOf('售前')
        if (index != -1) flag = true;
        return flag;
      }
    },
  },
  mounted() {
    this.getOrderInfo()
    this.getUser()
    this.getSchedule()
    if (this.index == 0) {
      this.marginBottom["margin-bottom"] = '45px'
      this.getbuttonstate()
    }
  },
  methods: {
    // 获取工单详情
    getOrderInfo() {
      this.axios
        .get(`workOrder/findEntityById.do?id=${this.orderId}`)
        .then(res => {
          console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          this.finishDate = data.f_expected_date
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
              // 处理图片路径
              if (item.images) {
                item.images.forEach(item => {
                  item.imagesUrl = `${this.axiosUrl}system/getImage.do?id=${item.id}`
                })
              }

              if (!this.isStandard && !this.isPreSale) {
                this.count.push({
                  name: item.f_handler_name + '　' + item.f_handle_time,
                  f_start: '出发时间：' +item.f_start_date,
                  f_arrive: '到达时间：' +item.f_arrive_date,
                  f_return: '离开时间：' +item.f_leave_date,
                  f_leaveDate: '返回时间：' +item.f_return_date,
                  f_farse: '交通费用：' +item.f_farse,
                  f_mileage: '行驶里程：' +item.f_mileage,
                  f_work_house: '工时：' +item.f_work_house + '(小时)',
                  f_remark: '备注：' +item.f_remark || '',
                  f_work_content: item.f_work_content,
                  images: item.images
                })
              } else if (this.isStandard) {
                this.count.push({
                  name: item.f_handler_name + '　' + item.f_handle_time,
                  f_doc_done_time: `项目完成时间：${item.f_doc_done_time || ''}`,
                  f_bid_doc_count: `标书本数：${item.f_bid_doc_count || ''}`,
                  f_bid_win: `是否中标：${item.f_bid_win || ''}`,
                  f_remark: `备注：${item.f_remark || item.f_work_content}`,
                  images: item.images
                })
              } else if (this.isPreSale) {
                this.count.push({
                  name: item.f_handler_name + '　' + item.f_handle_time,
                  f_cost: `本次费用：${item.f_cost || ''}`,
                  f_remark: `备注：${item.f_remark || item.f_work_content}`,
                  images: item.images
                })
              }
            })
          }// end if
        })
    },
    // 禁用4个按钮
    getbuttonstate() {
      this.axios
        .get(`orderLog/findOrderLogByWorkOrderAndUserToday.do?f_work_order_id=${this.orderId}`)
        .then(res => {
          // console.log(res)
          const {orderLog} = res.data
          this.userId = orderLog.id
          if(!orderLog.f_start_date) this.f_start = false
          if(!orderLog.f_arrive_date) this.f_arrive= false
          if(!orderLog.f_return_date) this.f_return= false
          if(!orderLog.f_leave_date) this.f_leave= false
        })
    },
    // 点击4个按钮弹窗
    confirm(state) {
      this.visibility = true;
      switch(state) {
        case 'f_start':
          this.confirmTitle = '出发'
          break;
        case 'f_arrive':
          this.confirmTitle = '到达'
          break;
        case 'f_return':
          this.confirmTitle = '返回'
          break;
        case 'f_leave':
          this.confirmTitle = '离开'
          break;
      }
    },
    // 选择时间
    dateTime() {
      // `选择:${this.hourListValue}为${this.confirmTitle}时间`
      this.confirmShow = true
      this.confirmContent = `选择:${this.hourListValue}为${this.confirmTitle}时间`
    },
    // 确定选择的时间
    selectTime() {
      if (!this.hourListValue) return false;
      switch(this.confirmTitle) {
        case '出发':
          this.sendTime('f_start_date')
          break;
        case '到达':
          this.sendTime('f_arrive_date')
          break;
        case '返回':
          this.sendTime('f_return_date')
          break;
        case '离开':
          this.sendTime('f_leave_date')
          break;
      }
    },
    // 向后台发送数据
    sendTime(state) {
      // console.log(this.hourListValue)
      this.axios
        .get(`orderLog/saveOrderLog.do?${state}=${this.hourListValue}&id=${this.userId}`)
        .then(res => {
          // console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          this.toastShow = true
          if (data.res == 'true') {
            this.toastValue = '设置成功'
            // 禁用按钮
            switch(state) {
              case 'f_start_date':
                this.f_start = true
                break;
              case 'f_arrive_date':
                this.f_arrive = true
                break;
              case 'f_return_date':
                this.f_return = true
                break;
              case 'f_leave_date':
                this.f_leave = true
                break;
            }
            // 刷新页面
            this.getSchedule()
          } else {
            this.toastValue = res.error
          }
        })
    },
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
  font-size: 20px;
  color: deepskyblue;
}
.flex-btn {
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #606060;
  color: #fff;
}
.btnsubmit {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index:999;
  border-radius: 0px;
  background-color: #fff;
}
.enclosure a {
  text-decoration: underline;
  font-size: 14px;
}
</style>
