<template>
  <div>
    <el-table
      :data="optionalLsItems"
      border
      stripe
      size="mini"
      ref="tableBZID"
      :cell-style="{ padding: '3px 6px' }"
      :height="payItemTableHeight"
      style="width: 100%; max-height: 100%"
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center">
      </el-table-column> -->
      <el-table-column
        prop="tempFeeId"
        label="TFID"
        width="100"
        align="left"
        v-if="hiddenBZID"
      >
      </el-table-column>
      <el-table-column prop="no" width="160" align="left">
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

      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="delTpItem(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    payItemHeight: {
      type: Object,
      default: () => {},
    },
    optionalLsItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      hiddenBZID: false
    };
  },
  computed: {
    payItemTableHeight() {
      let payItemHeight = this.payItemHeight.height;
      return payItemHeight;
    },
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val);
    },
    // 删除
    delTpItem(row) {},
    showBZId() {
      this.hiddenBZID = !this.hiddenBZID;
      if (this.hiddenBZID) {
        this.$nextTick(() => {
          this.$refs.tableBZID.doLayout();
        });
      }
    },
  },
};
</script>

<style>
</style>