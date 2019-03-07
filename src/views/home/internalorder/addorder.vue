<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单提交</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="routerLink()"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group title="问题描述">
      <x-textarea placeholder="问题描述" v-model="questionvalue"></x-textarea>
    </group>
    <!-- 图片上传 -->
    <group>
      <div v-transfer-dom>
        <previewer :list="filesimg"
                   ref="previewer"
                   :options="options">
        </previewer>
      </div>
      <file-upload v-model="files"
                   name="file"
                   ref="upload"
                   :post-action='uploadUrl'
                   put-action
                   @input-file="inputFile"
                   multiple>
        <i class="iconfont icon-tianjiatupian"></i>
      </file-upload>
      <ul>
        <li class="previewpic" v-for="(file,index) in files" :key="index">
          <img class="previewer-demo-img" :src="file.blob" height="100" width="100" @click="show(index)"/>
          <i class="iconfont icon-quancha" @click.prevent="remove(file,index)"></i>
        </li>
      </ul>
    </group>
    <!-- 客户信息 -->
    <group>
      <x-input title="客户姓名"
               :show-clear="false"
               text-align="right"
               v-model="nameinfo"
               placeholder="请输入客户姓名"
               type="text">
      </x-input>
      <x-input title="客户电话"
               :show-clear="false"
               text-align="right"
               v-model="telinfo"
               placeholder="请输入客户电话"
               type="tel">
      </x-input>
      <x-input title="客户单位"
               :show-clear="false"
               text-align="right"
               v-model="workinfo"
               placeholder="请输入客户单位">
      </x-input>
      <x-input title="设备SN号"
               :show-clear="false"
               text-align="right"
               v-model="snidinfo"
               placeholder="请输入设备SN号">
      </x-input>
      <!-- 业务员 -->
      <x-input title="业务员"
               :show-clear="false"
               v-model="usernameinfo"
               placeholder="选择业务员"
               text-align="right"
               @on-focus="$router.push({path: '/salesman', query: {userId: 1}})"></x-input>
      <selector title="所属项目"
                direction="rtl"
                :options="order"
                v-model="ordervalue"
                placeholder="请选择单位">
      </selector>
    </group>
    <!-- 服务器地址 -->
    <group>
      <div style="float: left; width: 65%">
        <x-textarea placeholder="服务地址" ref="address" v-model="addressvalue" :rows="2" :cols="10"></x-textarea>
      </div>
      <div style="float: left; width: 35%">
        <x-button :gradients="btncolor" style="margin-top: 13px;" link="/oftenaddress">常用地址</x-button>
      </div>
    </group>
    <group style="margin-bottom: 42px;">
      <x-textarea placeholder="备注" v-model="remarksvalue" :rows="2" :cols="10"></x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btn" @click.native="submitBtn()">提交</x-button>
    <!-- toast -->
    <toast v-model="toastShow"
           :text="toastValue"
           type="text" :time="800"
           is-show-mask
           position="middle" width="10em"></toast>
  </div>
</template>

<script>
import { TransferDom } from 'vux'
import bus from '@/eventbus/eventbus'
export default {
  name: "addorder",
  directives: {
    TransferDom,
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  data() {
    return {
      token: '',
      questionvalue: '', // 问题描述
      nameinfo: '',  // 项目基本信息
      telinfo: '', // 客户电话
      workinfo: '',  // 客户单位
      snidinfo: '', // 设备sn号
      usernameinfo: '',  // 业务员
      usernameId: '', // 业务员 姓名id
      order: [], // 所属项目
      ordervalue: '',
      // 服务器地址
      addressvalue: '',
      btncolor: ['dodgerblue', 'dodgerblue'],
      // 备注
      remarksvalue: '',
      // 图片上传
      files: [],
      filesId: [],
      filesimg: [],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[index];

          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;

          let rect = thumbnail.getBoundingClientRect();

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }, // options
      toastShow: false,
      toastValue: '',
    }
  },
  computed: {
    uploadUrl() {
      return `http://10.1.1.44:8080/platform/system/uploadFile.do?token=${this.token}`
    }
  },
  created() {
    this.token = window.sessionStorage.getItem('token')
    this.getporject()
  },
  activated() {
    this.getquery()
    bus.$on('sendAddress', address => {
      this.addressvalue = address
    })
  },
  methods: {
    // 获取参数
    getquery() {
      const userArr = this.$route.query.user
      if (!userArr) return false;
      const jsonData = JSON.parse(userArr)
      this.usernameinfo = jsonData[0].name
      this.usernameId = jsonData[0].id
    },
    // 路由跳转
    routerLink() {
      if (this.$router.path == '/oftenaddress' || this.$router.path == '/salesman') return this.$router.push('/internalorder')
      this.$router.push(this.$router.path)
    },
    // 获取所属项目
    getporject() {
      this.axios
        .get(`project/findEntityByPage.do`)
        .then(res => {
          if (res.data.res == 1) {
            const {rows} = res.data
            rows.forEach(item => {
              this.order.push({
                key: item.id,
                value: item.f_project_name
              })
            })
          } else {
            const {error} = res.data
            this.toastShow = true
            this.toastValue = error
          }
        })
    },
    // 文件上传
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // 开始上传
        if (newFile.active !== oldFile.active) {
          console.log('Start upload', newFile.active, newFile)
          // 获得相应数据
          console.log('response', newFile)
          if (newFile.xhr) {
            //  获得响应状态码
            console.log('status', newFile.xhr.status)
          }
        }
        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile)
        }
        // 上传错误
        if (newFile.error !== oldFile.error) {
          console.log('error', newFile.error, newFile)
        }

        // 上传成功
        if (newFile.success !== oldFile.success) {
          console.log('success', newFile.success, newFile)
          this.filesId.push(newFile.response.id)

          // 过滤非图片文件
          // 不会添加到 files 去
          if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
            return prevent()
          }
          // 创建 `blob` 字段 用于缩略图预览
          newFile.blob = ''
          let URL = window.URL || window.webkitURL
          if (URL && URL.createObjectURL) {
            newFile.blob = URL.createObjectURL(newFile.file)
          }
          this.filesimg.push({
            msrc: URL.createObjectURL(newFile.file),
            src: URL.createObjectURL(newFile.file),
          });
        }
      }

      if (!newFile && oldFile) {
        // 删除文件

        // 自动删除 服务器上的文件
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/file/delete?id=' + oldFile.response.id,
          // });
        }
      }

      // 自动上传
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    // 删除图片
    remove(file,index) {
      this.$refs.upload.remove(file)
      this.filesimg.splice(index, 1)
      this.filesId.splice(index, 1)
    },
    // 展示 图片
    show (index) {
      // console.log(index)
      this.$refs.previewer.show(index)
    },
    // 提交按钮
    submitBtn () {
      const data = {
        ids: this.filesId,
        f_description: this.questionvalue,
        f_customer_name: this.nameinfo,
        f_customer_phnum: this.telinfo,
        f_customer_org: this.workinfo,
        f_sn_no: this.snidinfo,
        f_salesman_id: this.usernameId, // 业务员
        f_salesman_name: this.usernameinfo, // 业务员
        f_project_id: this.ordervalue,
        f_address: this.addressvalue,
        f_remark: this.remarksvalue
      }
      // console.log(data)
      if (!this.addressvalue || !this.telinfo || !this.nameinfo || !this.usernameinfo || !this.questionvalue) {
        this.toastShow = true;
        this.toastValue = '请填写完整的信息'
      } else {
        this.axios
          .post('workOrder/saveInnerWorkOrder.do', data)
          .then(res => {
            console.log(res)
            if (res.data.res == 'true') {
              this.toastShow = true
              this.toastValue = '工单提交成功'
            } else {
              const {error} = res.data
              this.toastShow = true
              this.toastValue = error
            }
          })
      }


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
</style>
