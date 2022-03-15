<template>
  <div :style="bottomHeight">
    <el-divider content-position="center" style="hieght: 40px"
      >应收款项目</el-divider
    >

    <el-table
      :data="selectedPayItems"
      stripe
      border
      size="mini"
      ref="selectChargeItem"
      :height="tableHeightBot"
      v-loading="selectItemLoading"
      :cell-style="{ padding: '3px' }"
      style="width: 100%; max-height: 100%"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="ID" label="ID" width="70" v-if="hiddenPayItemId">
      </el-table-column>
      <el-table-column
        prop="JFID"
        label="JFID"
        width="70"
        v-if="hiddenPayItemId"
      >
      </el-table-column>
      <el-table-column prop="编号" width="100">
        <template slot="header">
          <i
            v-if="!hiddenPayItemId"
            class="el-icon-caret-left"
            @click="showPayItemId"
            style="cursor: pointer"
          ></i>
          <i
            v-else
            class="el-icon-caret-right"
            @click="showPayItemId"
            style="cursor: pointer"
          ></i>
          <span>编号</span>
        </template>
      </el-table-column>

      <el-table-column prop="项目名称" label="项目名称" width="140">
      </el-table-column>
      <el-table-column prop="计价面积" label="计价面积" width="100" align="right">
      </el-table-column>

      <el-table-column prop="应收金额" label="应收金额" width="120" align="right">
      </el-table-column>
      <el-table-column prop="已收金额" label="已收金额" width="120" align="right">
      </el-table-column>
      <el-table-column prop="预收金额" label="预收金额" width="120" align="right">
      </el-table-column>
      <el-table-column prop="欠收金额" label="欠收金额" width="120" align="right">
      </el-table-column>

      <el-table-column label="付清" width="80" align="right">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.付清" :disabled="true"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column prop="车牌号" label="车牌号" align="right">
      </el-table-column>
      
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-input
            size="mini"
            type="text"
            @click="itemDetail(scope.row)"
          >详情</el-input>
          <el-input
            size="mini"
            type="text"
            @click="historyDetail(scope.row)"
          >历史明细</el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    selectedPayItems: {
      type: Array,
      default: () => [],
    },
    bottomHeight: {
      type: Object,
      default: () => {},
    },
    selectItemLoading: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      hiddenPayItemId: false,
    };
  },
  computed: {
    tableHeightBot() {
      let tHeight = this.bottomHeight.height - 40;
      return tHeight;
    },
  },
  methods: {
    showPayItemId() {
      this.hiddenPayItemId = !this.hiddenPayItemId;
      if (this.hiddenPayItemId) {
        this.$nextTick(() => {
          this.$refs.selectChargeItem.doLayout();
        });
      }
    },
    // 应收款项目详情
    itemDetail(row) {
      this.$emit('toItemDetail', row)
    },
    historyDetail(row) {
      this.$emit('toHistoryDetail', row)
    }
  }
};
</script>

<style>
</style>