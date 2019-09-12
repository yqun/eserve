<template>
  <!--<div>{{msg}}</div>-->
  <div>
    <h1>异　常</h1>
    <p>{{msg}}</p>
    <!--<p>系统中未找到当前用户信息，请联系管理员添加</p>-->
  </div>
</template>

<script>
export default {
  name: "error",
  created() {
    // const num = window.location.search.split('&')[0].split('=')[1]
    const num = this.$route.query.no
    switch(num) {
      case '1':
        this.msg = '系统中未找到当前用户信息，请联系管理员添加';
        break;
      case '2':
        this.msg = '系统中存在多个相同的当前用户信息，请联系管理员处理';
        break;
      case '3':
        this.msg = '获取用户信息出错';
        break;
      case '4':
        this.msg = '与企业微信通信获取code失败，请与管理员联系';
        break;
    }
  }
}
</script>

<style scoped>
h1 {
  width: 100%;
  text-align: center;
  margin-top: 100px;
  font-size:40px;
}
p {
  width: 70%;
  height: 100px;
  text-align: center;
  font-size: 20px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
