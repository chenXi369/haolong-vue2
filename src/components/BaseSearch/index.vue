<template>
  <div style="margin-top: 20px">
    <el-form
      size="small"
      :inline="true"
      ref="searchListForm"
      :model="searchObj"
      :label-width="labelWidth"
    >
      <el-form-item
        v-for="item in titleList"
        :key="item.label"
        :label="item.label"
      >
        <el-input
          v-model="item.value"
          :type="item.type"
          :placeholder="item.placeholder"
          style="width: 100%"
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="resetCondition">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "BaseSearch",
  props: {
    titleList: {
      type: Array,
      default: () => [],
    },
    searchObj: {
      type: Object,
      default: () => {},
    },
    labelWidth: {
      type: String,
    },
  },
  methods: {
    onSubmit() {
      let itemsValue = this.titleList.map((item) => item.value);
      if (itemsValue.findIndex((item) => item !== "") !== -1) {
        this.$emit("searchStart", itemsValue);
      } else {
        this.$message.warning("请输入合理的搜索条件")
      }
    },
    resetCondition() {
      this.$emit("resetConditionVal");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>