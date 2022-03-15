<template>
  <div class="otherMonthPay">
    <el-form
      ref="form"
      size="mini"
      :model="otherMonthForm"
      label-width="84px"
      class="flex otherMonthForm"
    >
      <section class="oneArea">
        <el-divider content-position="left"><h4>往月欠费</h4></el-divider>
        <el-form-item label="往月欠费">
          <el-input v-model="otherMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="调整费用">
          <el-input v-model="otherMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上月欠费">
          <el-input v-model="otherMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="调整费用">
          <el-input v-model="otherMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="欠款合计">
          <el-input v-model="otherMonthForm.name"></el-input>
        </el-form-item>
      </section>
      
      <section class="oneArea">
        <el-divider content-position="left"><h4>往月滞纳金</h4></el-divider>
        <el-form-item label="往月滞纳金">
          <el-input v-model="otherMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="当月调整">
          <el-input v-model="otherMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="滞纳金合计">
          <el-input v-model="otherMonthForm.name"></el-input>
        </el-form-item>
      </section>
    </el-form>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      otherMonthForm: {},
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.otherMonthPay {
  height: 280px;
  .otherMonthForm {
    width: 100%;
    height: 100%;
    justify-content: space-around;
    .oneArea {
      width: 47%; height: 100%;
      border: 1px solid #eaeaea;
      border-radius: 4px;
      padding: 15px 20px;
    }
  }
}
</style>