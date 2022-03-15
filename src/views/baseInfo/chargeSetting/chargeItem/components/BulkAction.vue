<template>
  <el-dialog
    :title="bulkActionTitle"
    :visible.sync="bulkActionVisible"
    width="450px"
    top="35vh"
    :close-on-click-modal="false"
    :before-close="handleCloseBulkAction"
  >
    <section style="padding: 0 20px">
      <template v-if="bulkActionState === 'copy'">
        <p>请选择！</p>
        <div style="line-height: 26px; padding: 4px 8px">
          <el-radio v-model="copyBulkAct" :label="1">复制选定客户的收费项目</el-radio>
          <el-radio v-model="copyBulkAct" :label="0">复制全部客户的收费项目</el-radio>
        </div>
      </template>
      <template v-else>
        <p>请选择！</p>
        <el-radio v-model="delBulkAct" :label="1">删除选定客户的收费项目</el-radio>
        <el-radio v-model="delBulkAct" :label="0">删除全部客户的收费项目</el-radio>
      </template>
    </section>
    <span slot="footer" class="dialog-footer">
      <template v-if="bulkActionState === 'copy'">
        <el-button type="primary" plain size="mini" @click="selectedCopyBulkAct"
          >确 认</el-button
        >
      </template>
      <template v-else>
        <el-button type="primary" plain size="mini" @click="selectedDelBulkAct"
          >确 认</el-button
        >
      </template>
      <el-button plain size="mini" @click="cancelBulkAction">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    bulkActionTitle: {
      type: String,
    },
    bulkActionVisible: {
      type: Boolean,
      default: false,
    },
    bulkActionState: {
      type: String,
      default: "copy",
    },
  },
  data() {
    return {
      copyBulkAct: 1,
      delBulkAct: 1
    }
  },
  methods: {
    handleCloseBulkAction() {
      this.$emit("closeBulkAction");
    },
    cancelBulkAction() {
      this.$emit("closeBulkAction");
    },
    selectedCopyBulkAct() {
      this.$emit("submitCopyBulkAction", this.copyBulkAct);
    },
    selectedDelBulkAct() {
      this.$emit("submitDelBulkAction", this.delBulkAct);
    }
  },
};
</script>

<style>
</style>