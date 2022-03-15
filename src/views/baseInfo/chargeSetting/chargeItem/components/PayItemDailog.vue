<template>
  <el-dialog
    title="可选收费项目"
    :visible.sync="payItemVisible"
    width="60%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-table
      ref="addPayItemTable"
      :data="optionalChargeItems"
      stripe
      size="mini"
      border
      :height="payItemDialogHeight"
      :cell-style="{ padding: '2px' }"
      :header-cell-style="{textAlign: 'center'}"
      @selection-change="handleSelectionChange"
      style="width: 100%; max-height: 100%"
    >
      <el-table-column type="selection" width="55" align="center" fixed>
      </el-table-column>
      <el-table-column prop="计费编号" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="计费名称" label="计费名称" width="180">
      </el-table-column>
      <el-table-column prop="项目编号" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="项目名称" label="项目名称" width="180">
      </el-table-column>
      <el-table-column prop="标准价" label="单价"> </el-table-column>
      <el-table-column label="托收" width="100" align=""center>
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.银行托收"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="备注" label="备注" fixed="right"> </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :disabled="confirmHidden" @click="confirm"
        >添 加</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    optionalChargeItems: {
      type: Array,
      default: () => [],
    },
    payItemVisible: {
      type: Boolean,
      default: false,
    },
    payItemHeight: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      confirmHidden: true,
      selectedItems: [],
    };
  },
  computed: {
    payItemDialogHeight() {
      let dialogHeight = this.payItemHeight.height - 90;
      return dialogHeight;
    },
  },
  methods: {
    handleSelectionChange(val) {
      if (val && val.length > 0) {
        this.confirmHidden = false;
      } else {
        this.confirmHidden = true;
      }
      this.selectedItems = val;
    },
    handleClose() {
      this.$emit("closePayItems");
    },
    cancel() {
      this.$emit("closePayItems");
    },
    confirm() {
      this.$emit("selectedPayItemAdd", this.selectedItems);
      this.$refs.addPayItemTable.clearSelection();
    },
  },
};
</script>

<style>
</style>