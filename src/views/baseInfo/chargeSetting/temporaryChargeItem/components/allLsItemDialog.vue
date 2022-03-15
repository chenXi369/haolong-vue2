<template>
  <el-dialog
    title="可选收费项目"
    :visible.sync="lsPayItemVisible"
    width="60%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-table
      ref="addLsPayItemTable"
      :data="optionalLsItems"
      stripe
      size="mini"
      border
      :height="payItemDialogHeight"
      :cell-style="{ padding: '2px' }"
      :header-cell-style="{textAlign: 'center'}"
      @selection-change="handleSelectionChange"
      style="width: 100%; max-height: 100%"
    >
      <el-table-column type="selection" width="45" align="center" fixed>
      </el-table-column>
      <el-table-column
        prop="tempFeeId"
        label="TFID"
        width="100"
        align="left"
        v-if="hiddenBZID"
      >
      </el-table-column>
      <el-table-column prop="no" width="120" align="left">
        <template slot="header">
          <i
            v-if="!hiddenBZID"
            class="el-icon-caret-left"
            @click="showBZId"
            style="cursor: pointer"
          ></i>
          <i
            v-else
            class="el-icon-caret-right"
            @click="showBZId"
            style="cursor: pointer"
          ></i>
          <span>编号</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="项目名称"> </el-table-column>

      <el-table-column label="押金" width="120" align="center">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.depositItem"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="代收" width="120" align="center">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.receivePaymentProjects"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
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
    optionalLsItems: {
      type: Array,
      default: () => [],
    },
    lsPayItemVisible: {
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
      hiddenBZID: false,
    };
  },
  computed: {
    payItemDialogHeight() {
      let dialogHeight = this.payItemHeight.height - 180;
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
      this.$emit("closeLsPayItems");
    },
    cancel() {
      this.$emit("closeLsPayItems");
    },
    confirm() {
      this.$emit("selectedLsPayItemAdd", this.selectedItems);
      this.$refs.addLsPayItemTable.clearSelection();
    },
    showBZId() {
      this.hiddenBZID = !this.hiddenBZID;
      if (this.hiddenBZID) {
        this.$nextTick(() => {
          this.$refs.addLsPayItemTable.doLayout();
        });
      }
    },
  },
};
</script>

<style>
</style>