<template>
  <el-dialog
    title="批量进度"
    top="35vh"
    :visible.sync="dialogProgressVisible"
    :close-on-click-modal="false"
  >
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="percentage"
      status="success"
    ></el-progress>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogProgressVisible: {
      type: Boolean,
      default: false,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style>
</style>