<template>
  <div>
    <div style="padding: 10px;">
      <el-tree
        :data="data"
        show-checkbox
        lazy
        :load="loadNode"
        @check="chooseCheck"
        @node-click="clicknode"
        node-key="id"
        ref="tree"
        :props="defaultProps">
      </el-tree>
    </div>
    <x-button class="btnsubmit" :gradients="btncolor" @click.native="senduser()">确定选择</x-button>
  </div>
</template>

<script>
var  ElTreeGrid  = require('element-tree-grid')
export default {
  name: "salesman",
  components: {
    'ElTreeGrid': ElTreeGrid
  },
  data() {
    return {
      orderId: 0,
      index: 0,
      userId: 0, // 判断进来的是通过业务员按钮 还是
      btncolor: ['dodgerblue', 'dodgerblue'],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      newData: [],
      chooseUser: [], // 选择的业务员
    }
  },
  created() {
    this.orderId = this.$route.query.id
    this.index = this.$route.query.index
    this.userId = this.$route.query.userId
    this.routerPath = this.$router.path // 跳转进来的路由
  },
  methods: {
    clicknode(obj, node) {
      // console.log(obj, node)
      const tree = this.$refs.tree
      let checkedKeys = tree.getCheckedKeys()
      if (this.userId == 1 && checkedKeys.length > 0 && !node.checked) return this.$vux.toast.text('最多选择一个业务员');
      if (!node.checked) {
        checkedKeys.push(obj.id)
      } else {
        checkedKeys = checkedKeys.filter((item) => item != obj.id)
      }
      tree.setCheckedKeys(checkedKeys)
    },
    // 返回设置
    senduser() {
      this.chooseUser = this.$refs.tree.getCheckedNodes()
      if (this.userId == 1 && this.chooseUser.length > 1) return this.$vux.toast.text('最多选择一个业务员');
      let userArr = [];
      this.chooseUser.forEach(item => {
        if (item.state == "closed") return false;
        userArr.push({name: item.text, id: item.id, qycode: item.attributes.qycode})
      })
      const jsonData = JSON.stringify(userArr)
      // console.log(jsonData)
      // 页面跳转
      // return false;
      this.$router.replace({
        path: this.$store.state.salesmanBackRouter,
        query: {
          id: this.orderId,
          index: this.index,
          user: jsonData,
          userId: this.userId
        }
      })
    },
    loadNode(node, resolve) {
      this.getUser(node, resolve);
    },
    // 获取 业务员
    getUser(node, resolve) {
      let flag = true
      if(this.newData.length) {
        this.newData.forEach((item,i) => {
          if (node.key != item.id) return false;
          if (this.newData[i].state == 'closed') return false;
          node.isLeaf = true
          flag = false;
        })
      }// end if
      if (!flag) return resolve([]);
      let id = node.key || ''
      this.axios
        .get(`org/findOrgsAndUsers.do?id=${id || ''}`)
        .then(res => {
          let {data} = res
          this.newData = data
          if (node.level === 0) {
            return resolve(data);
          } else if (node.level > 1) {
            resolve([]);
          }
          // const Sdata = data
          setTimeout(() => {resolve(data);}, 500);
        })
    },
    // 选择多选框
    chooseCheck() {
      this.chooseUser = this.$refs.tree.getCheckedNodes()
      if (this.chooseUser.length > 1 && this.userId == 1) this.$vux.toast.text('最多选择一个业务员');
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

/* el-tree (小三角，选择框，文字)大小 */
div.el-tree >>> .el-tree-node__expand-icon{
  font-size: 16px;
}
div.el-tree >>> .el-checkbox__inner{
  width: 16px;
  height: 16px;
}
div.el-tree >>> .el-tree-node__label{
  font-size: 16px;
}
</style>
