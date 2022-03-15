<template>
  <div class="newMonthPay">
    <el-form
      ref="form"
      size="mini"
      :model="newMonthForm"
      label-width="84px"
      class="flex newMonthForm"
    >
      <section class="oneArea">
        <el-divider content-position="left"><h4>走表记录</h4></el-divider>
        <el-form-item label="上次读数">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="本次读数">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="净用量">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分摊用量">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="计费用量">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
      </section>
      <section class="oneArea">
        <el-divider content-position="left"><h4>当月费用</h4></el-divider>
        <el-form-item label="基本费">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="附加费">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="当月调整">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="调整日期">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="调整人">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="应收合计">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
      </section>
      <section class="oneArea">
        <el-divider content-position="left"><h4>本月新增往月滞纳金</h4></el-divider>
        <el-form-item label="往月滞纳金">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="当月调整">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="调整日期">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="调整人">
          <el-input v-model="newMonthForm.name"></el-input>
        </el-form-item>
        <el-form-item label="滞纳金合计">
          <el-input v-model="newMonthForm.name"></el-input>
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
      newMonthForm: {},
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.newMonthPay {
  height: 320px;
  .newMonthForm {
    width: 100%;
    height: 100%;
    justify-content: space-around;
    .oneArea {
      width: 30%; height: 100%;
      border: 1px solid #eaeaea;
      border-radius: 4px;
      padding: 15px 20px;
    }
  }
}
</style>