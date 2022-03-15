<template>
  <div>
    <header class="header">
      <el-form ref="form" :model="sizeForm" :inline="true" label-width="80px">
        <el-form-item label="物业小区">
          <el-select v-model="sizeForm.houseName" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="流程类别">
          <el-select
            v-model="sizeForm.processType"
            placeholder="请选择活动区域"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="紧急程度">
          <el-select
            v-model="sizeForm.urgencyDegree"
            placeholder="请选择活动区域"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工单号">
          <el-input v-model="sizeForm.workNum" clearable></el-input>
        </el-form-item>

        <el-form-item label="报修状态">
          <el-select
            v-model="sizeForm.repairStatus"
            placeholder="请选择活动区域"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="楼栋">
          <el-select v-model="sizeForm.build" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="维修类别">
          <el-select
            v-model="sizeForm.serviceType"
            placeholder="请选择活动区域"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="完成">
          <el-select v-model="sizeForm.finish" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="代办">
          <el-select v-model="sizeForm.commission" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit" size="medium"
            >查询</el-button
          >
        </el-form-item>

        <el-form-item label="日期范围">
          <el-date-picker
            v-model="sizeForm.value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="房号">
          <el-input v-model="sizeForm.houseNum" clearable></el-input>
        </el-form-item>

        <el-form-item label="报修人">
          <el-input v-model="sizeForm.repairPerson" clearable></el-input>
        </el-form-item>

        <el-form-item label="报修内容">
          <el-input v-model="sizeForm.repairContent" clearable></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit" size="medium"
            >导出报表</el-button
          >
        </el-form-item>
      </el-form>
    </header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sizeForm: {
        commission: "",
        finish: "",
        serviceType: "",
        build: "",
        repairStatus: "",
        workNum: "",
        urgencyDegree: "",
        processType: "",
        houseName: "",

        repairContent: "",
        repairPerson: "",
        houseNum: "",
        value1: ""
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin: 1.2rem 0 0 0.8rem;
}
</style>
