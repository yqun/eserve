<template>
  <p class="voice" @touchstart="startSay()" @touchend="stopVoice()">
      <span :style="voiceStyle">
        <i class="iconfont icon-yuyin2"></i>
        {{voiceStr}}
      </span>
  </p>
</template>

<script>
export default {
  name: "wxVoice",
  data() {
    return {
      voiceStr: '按住语音输入',
      voiceStyle: {backgroundColor: 'dodgerblue'}
    }
  },
  mounted() {
    this.axios.get(`/system/getEnJsConfig.do`)
      .then(res => {
        // console.log(res)
        const {appId, timestamp, noticeStr, signature, signatureAgent, agentid} = res.data
        wx.config({
          beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，企业微信的corpID
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: noticeStr, // 必填，生成签名的随机串
          signature: signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
          // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice', 'agentConfig']
        });
        wx.ready(function(){
          // alert('config成功')
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          wx.agentConfig({
            corpid: appId, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid: agentid, // 必填，企业微信的应用id
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: noticeStr, // 必填，生成签名的随机串
            signature: signatureAgent,// 必填，签名，见附录1
            jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'], //必填
            success: function(res) {
              // 回调
              // alert('agentConfig配置成功')
            },
            fail: function(res) {
              if(res.errMsg.indexOf('function not exist') > -1){
                alert('版本过低请升级')
              }
            }
          });
        });
        wx.error(function(res){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      })
  },
  methods: {
    // 语音识别
    startSay() {
      const that = this;
      wx.startRecord();
      this.voiceStr = '松开结束语音';
      this.voiceStyle.backgroundColor = '#ccc'
      wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function (res) {
          var localId = res.localId;
          that.voiceStr = '按住语音输入';
          that.voiceStyle.backgroundColor = 'dodgerblue';
          that.voiceToStr(localId);
        }
      });

    },
    stopVoice() {
      // alert('语音结束')
      this.voiceStr = '按住语音输入';
      this.voiceStyle.backgroundColor = 'dodgerblue';
      const that = this;
      wx.stopRecord({
        success: function (res) {
          var localId = res.localId;
          that.voiceToStr(localId)
        }
      });

    },
    voiceToStr(localId) {
      const that = this
      wx.translateVoice({
        localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得，音频时长不能超过60秒
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          that.$emit('voiceStr', res.translateResult)
          // that.questionvalue += res.translateResult
        }
      });
    },
  }
}
</script>

<style scoped>
/* 语音 */
.voice {
  text-align: center;
  line-height: 39px;
  width: 100%;
  background-color: #f2f2f2;

}
.voice i {
  font-size: 16px;
  color: #fff;
  margin-left: 4px;
  margin-right: 4px;
}
.voice span {
  vertical-align: middle;
  padding: 4px 30%;
  border-radius: 4px;
  color: #fff;
}
</style>
