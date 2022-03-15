<template>
  <div class="badCrop">
    <el-form
      ref="form"
      size="mini"
      :model="badCropForm"
      label-width="114px"
      class="flex badCropForm"
    >
      <section class="oneArea">
        <el-divider content-position="left"><h4>已收款</h4></el-divider>
        <el-form-item label="上月预收结转">
          <el-input v-model="badCropForm.name"></el-input>
        </el-form-item>
        <el-form-item label="综合预收抵扣">
          <el-input v-model="badCropForm.name"></el-input>
        </el-form-item>
        <el-form-item label="本月费用">
          <el-input v-model="badCropForm.name"></el-input>
        </el-form-item>
        <el-form-item label="往月欠费">
          <el-input v-model="badCropForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上月欠费">
          <el-input v-model="badCropForm.name"></el-input>
        </el-form-item>

        <el-form-item label="新增往月滞纳金">
          <el-input v-model="badCropForm.name"></el-input>
        </el-form-item>
        <el-form-item label="往月滞纳金">
          <el-input v-model="badCropForm.name"></el-input>
        </el-form-item>
        <el-form-item label="已收款">
          <el-input v-model="badCropForm.name"></el-input>
        </el-form-item>
        <el-form-item label="本月滞纳金">
          <el-input v-model="badCropForm.name"></el-input>
        </el-form-item>
      </section>
      
      <div class="outArea flex flex-column">
        <section class="oneArea top">
          <el-divider content-position="left"><h4>往月滞纳金</h4></el-divider>
          <el-form-item label="本月费用">
            <el-input v-model="badCropForm.name"></el-input>
          </el-form-item>
          <el-form-item label="往月费用">
            <el-input v-model="badCropForm.name"></el-input>
          </el-form-item>
          <el-form-item label="上月费用">
            <el-input v-model="badCropForm.name"></el-input>
          </el-form-item>

          <el-form-item label="新增往月滞纳金">
            <el-input v-model="badCropForm.name"></el-input>
          </el-form-item>
          <el-form-item label="往月滞纳金">
            <el-input v-model="badCropForm.name"></el-input>
          </el-form-item>
          <el-form-item label="欠款合计">
            <el-input v-model="badCropForm.name"></el-input>
          </el-form-item>
        </section>
        <section class="oneArea bottom">
          <el-divider content-position="left"><h4>往月滞纳金</h4></el-divider>
          <el-form-item label="预收应收款">
            <el-input v-model="badCropForm.name"></el-input>
          </el-form-item>
        </section>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      badCropForm: {},
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.badCrop {
  min-width: 720px;
  height: 452px;
  .badCropForm {
    width: 100%;
    height: 100%;
    justify-content: space-around;
    .oneArea {
      width: 47%;
      height: 100%;
      border: 1px solid #eaeaea;
      border-radius: 4px;
      padding: 15px 20px;
    }
    .outArea {
      width: 47%;
      height: 100%;
      .top {
        width: 100%;
        border-radius: 4px;
        height: 322px;
      }
      .bottom {
        width: 100%;
        border-radius: 4px;
        height: 110px;
        margin-top: 18px;
      }
    }
  }
}
</style>