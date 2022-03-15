<template>
  <el-dialog
    title="历史欠款明细"
    :visible.sync="hisDetailVisible"
    width="1080px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    v-drag
  >
    <el-row>
      <el-col :span="3" style="line-height: 28px; padding: 0px 10px 0px 4px">
        <el-checkbox v-model="allDetail">全部明细</el-checkbox>
      </el-col>
      <el-col :span="3">
        <el-button plain size="mini" type="primary" @click="changeFee">调整费用</el-button>
      </el-col>
      <el-col :span="3">
        <el-button plain size="mini" type="primary" @click="batchReduceLateFee">批量减免滞纳金</el-button>
      </el-col>
      <el-col :span="15"></el-col>
    </el-row>

    <el-table
      :data="tableData"
      border
      show-summary
      style="width: 100%; margin-top: 20px"
      :cell-style="{ padding: '3px 5px' }"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="" label="月份" width="80" fixed></el-table-column>
      <el-table-column prop="" label="编号" width="130"></el-table-column>
      <el-table-column prop="" label="项目名称" width="140"></el-table-column>
      <el-table-column prop="" label="应收款" width="100"></el-table-column>

      <el-table-column prop="" label="预收抵扣" width="100"></el-table-column>
      <el-table-column prop="" label="累计已收" width="100"></el-table-column>
      <el-table-column prop="" width="80">
        <template slot="header">
          <span style="color: red">欠收</span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="滞纳金" width="100"></el-table-column>
      <el-table-column prop="" label="累计已收" width="100"></el-table-column>
      <el-table-column prop="" width="80">
        <template slot="header">
          <span style="color: red">欠收</span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="再调整月份" width="110"></el-table-column>
      <el-table-column prop="" label="再调整基本费" width="110"></el-table-column>
      <el-table-column prop="" label="再调整月份" width="110"></el-table-column>
      <el-table-column prop="" label="再调整滞纳金" width="110" fixed="right"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    hisDetailVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      allDetail: false,

    }
  },
  methods: {
    handleClose() {
      this.$emit('closeHisDetail', false)
    },
    changeFee() {

    },
    batchReduceLateFee() {

    }
  }
};
</script>

<style lang="scss" scoped>
</style>
