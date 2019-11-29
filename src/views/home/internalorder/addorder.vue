<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单提交</span>
      <x-icon slot="overwrite-left" type="ios-arrow-left" size="30" @click="$router.replace('/internalorder')" style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group title="工单内容<b>*</b>">
      <x-textarea placeholder="工单内容" v-model="questionvalue"></x-textarea>
    </group>
    <wx-voice @voiceStr="getVoiceStr"></wx-voice>
    <!-- 图片上传 -->
    <group v-if="!isStandard && !isPreSale">
      <div v-transfer-dom>
        <previewer :list="filesImg" ref="previewer" :options="options"></previewer>
      </div>
      <!-- vux-uploader 图片上传 -->
      <uploader
        :max="5"
        :handle-click="false"
        :autoUpload="true"
        :show-header="true"
        :upload-url="uploadUrl"
        name="file"
        :images="images"
        size="small"
        :previmg="filesImg"
        @preview="show"
      ></uploader>
    </group>
    <!-- 客户信息 -->
    <group>
      <!--<selector v-if="orderName == '售前服务'" title="服务类别<b>*</b>" direction="rtl" :options="serverCategory"-->
                <!--:value-map="['id','f_value']" v-model="serverCategory_id" placeholder="请选择服务类别">-->
      <!--</selector>-->
      <cell style="padding: 2px 15px;" v-if="isPreSale">
        <span slot="title">服务类别<b>*</b></span>
        <el-select v-model="serverCategory_id" ref="eleSel" multiple placeholder="请选择服务类别" @blur="$refs.eleSel.blur()">
          <el-option
            v-if="isPreSale"
            v-for="item in serverCategory"
            :key="item.id"
            :label="item.f_value"
            :value="item.id">
          </el-option>
        </el-select>
      </cell>
      <!-- 业务员 -->
      <x-input :show-clear="false" text-align="right" v-model="usernameinfo" placeholder="选择业务员" @click.native="toSalesman()">
        <span slot="label">业务员<i>*</i></span>
      </x-input>
      <selector title="项目名称<b>*</b>" direction="rtl" :options="projectInfoList"
                ref="projectInfo" @on-change="getProjectCode" :readonly="!usernameinfo"
                v-model="project_code" placeholder="请选择项目名称"
                @click.native="judgeHaveUserName()"
                :value-map="['code', 'name']">
      </selector>
      <x-input title="项目编号" text-align="right" v-model="project_code" placeholder="项目编号" disabled>
      </x-input>

      <x-input v-if="!isStandard && !isPreSale" :show-clear="false" text-align="right" v-model="nameinfo" placeholder="请输入客户姓名">
        <span slot="label">客户姓名<i>*</i></span>
      </x-input>
      <x-input v-if="!isStandard && !isPreSale" :show-clear="false" text-align="right" v-model="telinfo" placeholder="请输入客户电话" type="tel">
        <span slot="label">客户电话<i>*</i></span>
      </x-input>
      <x-input v-if="!isStandard" :show-clear="false" text-align="right" v-model="workinfo" placeholder="请输入客户单位">
        <span slot="label">客户单位<i>*</i></span>
      </x-input>
      <x-input v-if="!isStandard && !isPreSale" title="设备SN号" :show-clear="false" text-align="right" v-model="snidinfo" placeholder="请输入设备SN号">
      </x-input>

      <datetime v-if="isStandard" v-model="bidingDate" format="YYYY-MM-DD HH:mm">
        <span slot="title">开标时间<i>*</i></span>
      </datetime>
      <x-number v-if="isStandard" title="标书本数<b>*</b>" v-model="bidingCount" :min="0"></x-number>
    </group>

    <!-- 服务器地址 -->
    <group v-if="!isStandard && !isPreSale" title="服务地址<b>*</b>">
      <div style="float: left; width: 65%">
        <x-textarea placeholder="服务地址" ref="address" v-model="addressvalue" :rows="2" :cols="10"></x-textarea>
      </div>
      <div style="float: left; width: 35%">
        <x-button :gradients="btncolor" style="margin-top: 13px;" link="/oftenaddress">常用地址</x-button>
      </div>
    </group>
    <group style="margin-bottom: 42px;" title="备注">
      <x-textarea placeholder="备注" v-model="remarksvalue" :rows="2" :cols="10"></x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btn" @click.native="submitBtn()">提交</x-button>
  </div>
</template>

<script>
// import Uploader from 'vux-uploader'
import Uploader from '../../../components/vux-uploader/src/main'
import { TransferDom } from 'vux'
import bus from '@/eventbus/eventbus'
import axios from 'axios'
import queryString from 'querystring'
import wxVoice from '../../../components/wxVoice'
export default {
  name: "addorder",
  components: {
    Uploader,
    wxVoice,
  },
  directives: {TransferDom},
  data() {
    return {
      token: '',
      orderId: '',
      orderName: '',
      projectInfoList: [], // 项目名称
      project_name: '',
      project_code: '',
      serverCategory: [], //服务类别
      serverCategory_id: [],

      questionvalue: '', // 问题描述
      nameinfo: '',  // 项目基本信息
      telinfo: '', // 客户电话
      workinfo: '',  // 客户单位
      snidinfo: '', // 设备sn号
      usernameinfo: '',  // 业务员
      usernameId: '', // 业务员 姓名id
      qycode: '', //业务员名称拼音
      bidingDate: '',
      bidingCount: 0,
      // 服务器地址
      addressvalue: '',
      btncolor: ['dodgerblue', 'dodgerblue'],
      // 备注
      remarksvalue: '',
      // 图片上传
      filesImg: [],
      filesId: [],
      images: [],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[index];
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }, // options
    }
  },
  computed: {
    uploadUrl() {
      return `${this.axiosUrl}system/uploadFile.do?token=${this.token}`
    },
    isStandard() {
      let flag = false;
      const str = this.orderName
      if (str) {
        const index = str.indexOf("标案");
        if (index != -1) flag = true;
        return flag;
      }
    },
    isPreSale() {
      let flag = false;
      const str = this.orderName
      if (str) {
        const index= str.indexOf('售前')
        if (index != -1) flag = true;
        return flag;
      }
    },
  },
  created() {
    this.token = window.sessionStorage.getItem('token');
    this.orderName = this.$store.state.orderInfo.orderName
    if(this.orderName.indexOf('售前') != -1) {
      this.getServeCategory(); // 服务类别
    };
  },
  activated() {
    this.getOrderData()
    this.getquery()
    bus.$on('sendAddress', address => {
      this.addressvalue = address
    })
  },
  methods: {
    // 获取提交的id和name
    getOrderData() {
      const orderInfo = this.$store.state.orderInfo;
      this.orderId = orderInfo.orderId;
      this.orderName = orderInfo.orderName;
    },
    // 获取业务员参数
    getquery() {
      const userArr = this.$route.query.user;
      if (!userArr) return false;
      const jsonData = JSON.parse(userArr);
      if (jsonData.length > 0) {
        this.usernameinfo = jsonData[0].name;
        this.usernameId = jsonData[0].id;
        this.qycode = jsonData[0].qycode;
        this.getProjectName();
      }
    },
    getProjectName() {
      const data = {loginName: this.qycode};
      console.log(data)
      const url = `http://imp.kingtop.com.cn:8080/platformServer/eService/getProjectListByLoginName`
      // const url = `http://10.1.0.225:8081/platformServer/eService/getProjectListByLoginName`
      axios.post(url, queryString.stringify(data))
        .then(res => {
          // console.log(res);
          this.projectInfoList = res.data
        })
    },
    judgeHaveUserName() {
      if (!this.usernameinfo) return this.$vux.toast.text('请先选择业务员')
    },
    getProjectCode(value) {
      const chooseProject = this.projectInfoList.filter(item => item.code == value)[0]
      // console.log(chooseProject)
      this.project_name = chooseProject.name
      this.workinfo = chooseProject.companyName
      this.nameinfo = chooseProject.contactsName
      this.telinfo = chooseProject.mobilePhone
    },
    getServeCategory() {
      this.axios.get(`dic/getDicValues.do?id=33`)
        .then(res => {
          // console.log(res)
          this.serverCategory = res.data
        })
    },
    // 展示 图片
    show (index) {
      // console.log(index)
      this.$refs.previewer.show(index)
    },
    // 提交按钮
    submitBtn () {
      // 获取图片id
      if (this.images.length) {
        this.images.forEach(item => {
          // console.log(item)
          this.filesId.push(item.id)
        })
      }
      // console.log(this.filesId)
      const data = {
        ids: this.filesId, // imageIds 图片id
        f_description: this.questionvalue, //工单内容
        f_salesman_id: this.usernameId, // 业务员id
        f_salesman_name: this.usernameinfo, // 业务员姓名
        f_project_number: this.project_code, // 项目id
        f_project_name: this.project_name, // 项目名称
        f_remark: this.remarksvalue, // 备注
        f_customer_name: this.nameinfo,
        f_customer_phnum: this.telinfo,
        f_customer_org: this.workinfo,
        f_sn_no: this.snidinfo,
        f_address: this.addressvalue,
        f_work_order_type_id: this.orderId,
        f_work_order_type: this.orderName
      };
      if (!this.questionvalue) return this.$vux.toast.text('请填写工单内容')
      if (!this.usernameinfo) return this.$vux.toast.text('请选择业务员')
      if (!this.project_code) return this.$vux.toast.text('请选择项目名称')
      if (this.isPreSale) {
        if (!this.serverCategory_id.length) return this.$vux.toast.text('请选择服务类别')
        if (!this.workinfo) return this.$vux.toast.text('请填写客户单位')
        // 服务类别
        let serverNameArr = [];
        this.serverCategory_id.forEach(item => {
          this.serverCategory.forEach(item1 => {
            if (item == item1.id) return serverNameArr.push(item1.f_value)
          })
        })
        data.f_presale_type_name = serverNameArr.join(',')
        data.f_presale_type_ids = this.serverCategory_id.join(',')
      }
      else if (!this.isStandard && !this.isPreSale) {
        if (!this.nameinfo) return this.$vux.toast.text('请填写客户姓名')
        if (!this.telinfo) return this.$vux.toast.text('请填写客户电话')
        if (!this.workinfo)return this.$vux.toast.text('请填写客户单位')
        if (!this.addressvalue) return this.$vux.toast.text('请填写服务地址')
      }
      else if (this.isStandard) {
        if (!this.bidingDate) return this.$vux.toast.text('请选择开标时间')
        if (!this.bidingCount) return this.$vux.toast.text('请选择标书本数')

        data.f_bid_open_date = this.bidingDate; // 开标时间
        data.f_bid_doc_count = this.bidingCount; // 标书本数

      }
      console.log(data)
      this.axios.post('workOrder/saveInnerWorkOrder.do', data)
        .then(res => {
          console.log(res)
          if (res.data.res == 'true') return this.$router.push('/internalorder'), this.$vux.toast.text('工单提交成功')
          const {error} = res.data
          this.$vux.toast.text(error)
        })


    },
    // 跳转选择业务员
    toSalesman() {
      this.$store.commit('changeSalesmanBackRouter', this.$route.path)
      this.$router.push({path: '/salesman', query: {userId: 1}})
    },
    getVoiceStr(str) {
      this.questionvalue += str
    }
  }
}
</script>

<style scoped>
.fixedpadding {
  -o-user-select: none;
  -moz-user-select: none; /*火狐 firefox*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10+*/
  -khtml-user-select :none; /*早期的浏览器*/
  user-select: none;
}
.vux-header {
  position:fixed;
  top: 0;
  z-index: 999;
  width: 100%;
}
.btn {
  position: fixed;
  z-index:999;
  bottom: 0;
  border-radius: 0px;
}
/* 文件上传 */
li.previewpic {
  float: left;
  position: relative;
}
li.previewpic i.iconfont.icon-quancha {
  position: absolute;
  right: 4px;
  top: 0;
  color: #ccc;
}
i.iconfont.icon-tianjiatupian {
  font-size: 60px;
}
span > i {
  color: red;
  font-style: normal;
  vertical-align: middle;
}
div.el-select {
  width: 100%;
}
div.el-select >>> input {
  border: 0;
}

  /*!* 语音 *!*/
/*.voice {*/
  /*text-align: center;*/
  /*line-height: 39px;*/
  /*width: 100%;*/
  /*background-color: #f2f2f2;*/

/*}*/
/*.voice i {*/
  /*font-size: 16px;*/
  /*color: #fff;*/
  /*margin-left: 4px;*/
  /*margin-right: 4px;*/
/*}*/
/*.voice span {*/
  /*vertical-align: middle;*/
  /*padding: 4px 30%;*/
  /*border-radius: 4px;*/
  /*color: #fff;*/
/*}*/
</style>

<style>
b {
  font-weight: 400;
  color: red;
  vertical-align: middle;
}
</style>
