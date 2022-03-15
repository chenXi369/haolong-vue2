<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  // mounted() {
  //   let _this = this;
  //   window.onbeforeunload = function (e) {
  //     console.log(e)
  //     if (_this.$route.name !== "") {
  //       e = e || window.event;
  //       // 兼容IE8和Firefox 4之前的版本
  //       if (e) {
  //         e.returnValue = "关闭提示1";
  //       }
  //       return "关闭提示2";
  //     } else {
  //       window.onbeforeunload = null;
  //     }
  //   }
  // }
};
</script>

<style>
#app {
  font-family: "微软雅黑";
}
.el-divider {
  margin: 20px 0;
}
.el-card__header {
  font-weight: 700;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  padding: 14.5px 20px;
}
.el-card__body {
  padding-left: 14px;
  padding-right: 16px;
}

.el-form-item--mini.el-form-item {
  margin-bottom: 15px;
}

.el-dialog__body {
  padding: 20px;
}
.el-dialog__header {
  padding: 18px 24px;
  padding-bottom: 15px;
  background: linear-gradient(to right, #189fff, skyblue);
}
.el-dialog__title {
  color: #333;
  font-size: 22px;
  line-height: 22px;
}
.el-dialog__footer {
  padding-bottom: 20px;
}
</style>
