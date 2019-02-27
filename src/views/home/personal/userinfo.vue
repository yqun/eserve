<template>
  <div>
    <group>
      <x-input title="　用户名:"　:show-clear="false" text-align="right"></x-input>
      <selector title="　　性别:" :options="list" direction="rtl"></selector>
      <x-input title="　手机号:" disabled text-align="right"></x-input>
      <datetime title="出生日期:" v-model="datetime" :min-year="1950"></datetime>
      <x-input title="　　备注:" :show-clear="false" text-align="right"></x-input>
    </group>
    <!-- 保存  修改手机号  修改密码 -->
    <flexbox :gutter="20" class="content">
      <flexbox-item>
        <div class="flex-demo" style="background-color: #aaa;">
          保存
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="flex-demo" @click="$router.push('/updatephone')">
          修改手机号
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="flex-demo" @click="$router.push('/updatepassword')">
          修改密码
        </div>
      </flexbox-item>
    </flexbox>
    <!-- 退出登录 -->
    <div class="content">
      <x-button class="btn" type="warn" link="/login">退出登录</x-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "userinfo",
  data() {
    return {
      datetime: '',
      list: [{key: 1, value: '男'},{key: 2, value: '女'}],
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.content {
  padding: 0 10px;
  box-sizing: border-box;
}
.flex-demo {
  margin-top: 16px;
  background-color: #2A91D8;
  text-align: center;
  font-size: 14px;
  color: #fff;
  border-radius: 4px;
  padding-top: 4px;
  padding-bottom: 4px;
}
.btn {
  margin-top: 100px;
}
</style>
