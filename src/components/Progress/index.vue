<template>
  <div class="progress">
    <el-progress
      type="dashboard"
      :percentage="percentage"
      :color="colors"
    ></el-progress>
    <section>
      <div class="text" v-if="percentage < 100">资源上传中...</div>
      <div class="text success" v-else>上传完成！</div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      percentage: 10,
      colors: [
        { color: "#f56c6c", percentage: 30 },
        { color: "#e6a23c", percentage: 50 },
        { color: "#6f7ad3", percentage: 70 },
        { color: "#1989fa", percentage: 90 },
        { color: "#67c23a", percentage: 100 },
      ],
    };
  },
  mounted() {
    const timer = setInterval(() => {
      this.increase();
      if (this.percentage === 100) {
        clearInterval(timer);
        let timerTwo = setTimeout(() => {
          this.$emit("closeProgress", false);
          clearTimeout(timerTwo);
        }, 2000);
      }
    }, 800);
  },
  methods: {
    increase() {
      this.percentage += 10;
      if (this.percentage > 100) {
        this.percentage = 100;
      }
    },
  },
};
</script>

<style lang="scss">
.progress {
  width: 190px;
  height: 180px;
  border-radius: 6px;
  background: #f8f8f8;
  position: absolute;
  top: calc(50% - 90px);
  left: calc(50% - 95px);
  .el-progress {
    margin: 12px 32px;
  }
  .text {
    width: 100%;
    text-align: center;
    color: #7d7d7d;
    padding-bottom: 10px;
  }
  .success {
    color: rgb(103, 194, 58);
  }
}
</style>
