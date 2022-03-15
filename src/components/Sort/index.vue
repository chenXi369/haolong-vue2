<template>
  <div>
    <el-popover
      placement="bottom"
      width="400"
      trigger="click"
      @show="showPopover"
    >
      <el-form :inline="true" class="demo-form-inline">
        <!-- 排序条件 -->
        <section class="form-item">
          <el-input
            v-model="inputNum"
            placeholder="输入要四舍五入的值"
            style="width: 240px"
            @input="computedVal"
          ></el-input>
          <el-input-number
            v-model="round"
            @change="inputRound"
            :min="1"
            :max="10"
            label="输入保留的位数"
          ></el-input-number>
        </section>
        <section class="form-item">
          = <span style="color: #1208ff; font-size: 20px">{{ computVal }}</span>
        </section>

        <div style="text-align: right; margin-top: 16px">
          <el-button size="mini" @click="reComputed">重置</el-button>
          <el-button type="primary" size="mini" @click="toComputed"
            >计算</el-button
          >
        </div>
      </el-form>
      <el-button slot="reference" size="mini"
        >排序
        <svg-icon icon-class="sort"></svg-icon
      ></el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputNum: 0,
      round: "",
      computVal: 0,
    };
  },
  methods: {
    showPopover() {
      this.$emit("showShade", true);
    },
    cancel() {
      this.visible = false;
    },
    confirm() {
      this.visible = false;
    },
    onSubmit() {
      console.log("submit!");
    },
    selectOneVal(e) {
      this.conditOneList = [
        { label: "姓名", value: "include" },
        { label: "性别", value: "equal" },
        { label: "年龄", value: "unequal" },
        { label: "收费标准", value: "greater" },
        { label: "客户代码", value: "greatEqual" },
      ];
      this.conditOneList.splice(
        this.conditOneList.findIndex((item) => item.value === e),
        1
      );
    },
    selectTwoVal(e) {
      this.conditOneList.splice(
        this.conditOneList.findIndex((item) => item.value === e),
        1
      );
    },
    selectThreeVal(e) {
      this.conditOneList.splice(
        this.conditOneList.findIndex((item) => item.value === e),
        1
      );
    },
    selectFourVal(e) {
      this.conditOneList.splice(
        this.conditOneList.findIndex((item) => item.value === e),
        1
      );
    },
    selectFiveVal(e) {
      this.conditOneList.splice(
        this.conditOneList.findIndex((item) => item.value === e),
        1
      );
    },
    // 计算
    toComputed() {
      this.computVal = parseFloat(this.inputNum).toFixed(this.round);
    },
    // 重置
    reComputed() {
      this.round = "";
      this.inputNum = 0;
      this.computVal = 0;
    },
    // 输入值的限制 不能输入中文
    computedVal() {
      this.inputNum = this.inputNum.replace(/[^0-9\.]/g, "");
    },
    // 保留位数的输入限制
    inputRound(e) {
      this.round = this.round.replace(/[^0-9]/g, "");
      if (e > 5) {
        this.round = "";
        this.$message.warning("请输入小于6的整数");
      }
      console.log(this.add(1.11, 2.222));
      console.log(this.sub(1.11, 2.222));
    },
    // 两数加减
    add(a, b) {
      var c, d, e;
      try {
        c = a.toString().split(".")[1].length;
      } catch (f) {
        c = 0;
      }
      try {
        d = b.toString().split(".")[1].length;
      } catch (f) {
        d = 0;
      }
      return (
        (e = Math.pow(10, Math.max(c, d))),
        (this.mul(a, e) + this.mul(b, e)) / e
      );
    },

    sub(a, b) {
      var c, d, e;
      try {
        c = a.toString().split(".")[1].length;
      } catch (f) {
        c = 0;
      }
      try {
        d = b.toString().split(".")[1].length;
      } catch (f) {
        d = 0;
      }
      return (
        (e = Math.pow(10, Math.max(c, d))),
        (this.mul(a, e) - this.mul(b, e)) / e
      );
    },

    mul(a, b) {
      var c = 0,
        d = a.toString(),
        e = b.toString();
      try {
        c += d.split(".")[1].length;
      } catch (f) {}
      try {
        c += e.split(".")[1].length;
      } catch (f) {}
      return (
        (Number(d.replace(".", "")) * Number(e.replace(".", ""))) /
        Math.pow(10, c)
      );
    },

    div(a, b) {
      var c,
        d,
        e = 0,
        f = 0;
      try {
        e = a.toString().split(".")[1].length;
      } catch (g) {}
      try {
        f = b.toString().split(".")[1].length;
      } catch (g) {}
      return (
        (c = Number(a.toString().replace(".", ""))),
        (d = Number(b.toString().replace(".", ""))),
        mul(c / d, Math.pow(10, f - e))
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item {
  width: 92%;
  padding: 10px 4%;
  display: flex;
  justify-content: space-between;
}
</style>
