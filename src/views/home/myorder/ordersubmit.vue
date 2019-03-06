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
    <group>
      <selector title="资产类别"
                direction="rtl"
                :options="assets"
                v-model="assetskey"
                placeholder="请选择资产类别">
      </selector>
      <selector title="服务单位"
                direction="rtl"
                :options="service"
                v-model="servicekey"
                placeholder="请选择单位">
      </selector>
    </group>
    <p class="person" v-for="item in serviceStaffers" :key="item.id">{{item.f_name}} {{item.f_phone_num}}</p>
    <group>
      <x-textarea :max="100"
                  v-model="questvalue"
                  placeholder="问题描述">
      </x-textarea>
    </group>
    <!-- 上传图片 -->
    <group>
      <!-- 查看图片 -->
      <div v-transfer-dom>
        <previewer :list="filesimg"
                   ref="previewer"
                   :options="options">
        </previewer>
      </div>
      <!-- 上传图片 -->
      <file-upload v-model="files"
                   name="file"
                   ref="upload"
                   :post-action="uploadUrl"
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
    <group>
      <div style="float: left; width: 65%">
        <x-textarea placeholder="服务地址" v-model="addressvalue" :rows="2" :cols="10"></x-textarea>
      </div>
      <div style="float: left; width: 35%">
        <x-button :gradients="btncolor" style="margin-top: 13px;" link="/oftenaddress">常用地址</x-button>
      </div>
    </group>
    <group style="margin-bottom: 42px;">
      <x-textarea placeholder="备注" v-model="remarksvalue" :rows="2" :cols="10"></x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btnsubmit" @click.native="orderinfo()">提交</x-button>
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
  directives: {
    TransferDom
  },
  name: "ordersubmit",
  data() {
    return {
      assetskey: null,
      assets: [],
      servicekey: null,
      service: [],
      serviceStaffers: [], // 公司负责人数组
      questvalue: '',
      btncolor: ['dodgerblue', 'dodgerblue'],
      addressvalue: '',
      remarksvalue: '',
      // 图片上传配置
      filesimg: [],
      filesId: [],
      files: [],
      options: {
        getThumbBoundsFn (index) {
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        }
      },
      toastShow: false,
      toastValue: '',
    }
  },
  watch: {
    assetskey(newVal, oldVal) {
      if (newVal == oldVal) return false;
      this.getservice()
    },
    servicekey(newVal, oldVal) {
      if (newVal == oldVal) return false;
      this.service.forEach(item => {
        if (item.key == newVal) {
          this.serviceStaffers = item.serviceStaffers
        }
      })
    },
  },
  computed: {
    uploadUrl() {
      return `http://10.1.1.44:8080/platform/system/uploadFile.do?token=${this.token}`
    }
  },
  created() {
    this.token = window.sessionStorage.getItem('token')
    this.getassets()
  },
  activated () {
    bus.$on('sendAddress', address => {
      this.addressvalue = address
    })
  },
  methods: {
    routerLink() {
      this.$router.path == '/oftenaddress'? this.$router.push('/myorder'):this.$router.push(this.$router.path)
    },
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // 开始上传
        if (newFile.active !== oldFile.active) {
          console.log('Start upload', newFile.active, newFile)
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
          console.log(this.filesId)
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
            // console.log(newFile)
          }
          // 点击显示的图片
          this.filesimg.push({
            msrc: URL.createObjectURL(newFile.file),
            src: URL.createObjectURL(newFile.file),
          })
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
    show (index) {
      this.$refs.previewer.show(index)
    },
    // 删除文件
    remove(file,index) {
      this.$refs.upload.remove(file)
      this.filesimg.splice(index, 1)
      this.filesId.splice(index, 1)
    },
    // 获取资产类别
    getassets() {
      this.axios
        .get('equmentType/findEntityByPage.do')
        .then(res => {
          // console.log(res)
          const {rows} = res.data
          if (!rows.length) return false;
          rows.forEach(item => {
            this.assets.push({
              key:item.id,
              value:item.f_name,
              f_unit_id: item.f_unit_id
            })
          })
        })
    },
    // 获取服务单位
    getservice() {
      this.service.length = 0;
      this.servicekey = null;
      this.axios
        .get(`equmentType/findSuppliesByEqumentType.do?id=${this.assetskey}`)
        .then(res => {
          // console.log(res)
          const {rows} = res.data
          if (!rows.length) return false;
          rows.forEach(item => {
            this.service.push({
              key:item.id,
              value:item.f_name,
              serviceStaffers: item.serviceStaffers
            })
          })
          if (this.service.length == 1) {
            this.servicekey = this.service[0].key
          }
        })
    },
    // 点击提交按钮
    orderinfo() {
      // service
      // assets
      let servicevalue,assetsvalue;
      this.assets.forEach(item => {
        if (this.assetskey == item.key) return assetsvalue = item.value
      })
      this.service.forEach(item => {
        if (this.servicekey == item.key) return servicevalue = item.value
      })
      const data = {
        ids: this.filesId,
        f_equmentType_id: this.assetskey,
        f_equmentType_name: assetsvalue,
        f_handler_org_id: this.servicekey,
        f_handler_org_name: servicevalue,
        f_description: this.questvalue,
        f_address: this.addressvalue,
        f_remark: this.remarksvalue,
      }
      if (!this.questvalue || !this.assetskey || !this.servicekey) {
        this.toastShow = true
        this.toastValue = '请填写完整的信息'
      } else {
        this.axios
          .post('/workOrder/saveCustomerWorkOrder.do', data)
          .then(res => {
            // console.log(res)
            if(res.data.res = true) {
              this.toastShow = true
              this.toastValue = '提交完成'
              setTimeout(() => {
                this.$router.push('/')
              }, 800)
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
.btnsubmit {
  position: fixed;
  bottom: 0;
  border-radius: 0;
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
.person {
  text-align: center;
}
</style>
