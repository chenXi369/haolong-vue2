<template>
  <div class="page">
    <div :style="contentStyleObj" class="houseTable">
      <!-- 房屋列表 -->
      <el-table
        v-loading="loading"
        :data="houseList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :cell-style="{padding: '2px'}"
        element-loading-text="请给我点时间！"
      >

        <el-table-column fixed prop="roomNo" label="房号" width="80" align="left">
        </el-table-column>
        <el-table-column
          prop="unitName"
          label="单元名称"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="buildingArea"
          label="建筑面积"
          width="80"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop="insideArea"
          label="套内面积"
          width="80"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop="houseStatus"
          label="房屋状态"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="rentalStatus"
          width="80"
          label="出租状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.rentalStatus"
              disabled
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="rentalStatus"
          label="业主出租"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.rentalStatus"
              disabled
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="rentBackStatus"
          label="返租"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.rentBackStatus"
              disabled
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="leaseBreakdownStatus"
          label="拆租"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.leaseBreakdownStatus"
              disabled
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="repossessionStatus"
          label="收楼"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.repossessionStatus"
              disabled
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkInStatus"
          label="入住"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checkInStatus"
              disabled
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="delegation"
          label="委托"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.delegation" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="isSelfUse"
          label="自用"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isSelfUse" disabled></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column
          prop="structure"
          label="结构"
          width="90"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="towards" label="朝向" width="50" align="center">
        </el-table-column>
        <el-table-column
          label="装修"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            {{ decorationOptions[scope.row.decorationStatus] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="subsidiaryArea1"
          label="附属面积1"
          width="90"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop="subsidiaryArea2"
          label="附属面积2"
          width="90"
          align="right"
        >
        </el-table-column>

        <el-table-column prop="purpose" label="用途" width="70" align="center">
        </el-table-column>

        <el-table-column
          prop="isStatistics"
          label="参与统计"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.isStatistics"
              disabled
            ></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column
          prop="sporadicHouse"
          label="零星房屋"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.sporadicHouse"
              disabled
            ></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column
          prop="manageFeeUnitPrice"
          label="管理费单价"
          width="100"
          align="right"
        >
        </el-table-column>

        <el-table-column
          prop="ontologyFundUnitPrice"
          label="本体基金单价"
          width="100"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop="unitRent"
          label="租金单价"
          width="100"
          align="right"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="210" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="openEdit(scope.row)"
              icon="el-icon-edit"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              icon="el-icon-delete"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="checkContract(scope.row)"
              icon="el-icon-search"
            >
              查看合同
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getTable"
      />
    </div>
    <!-- 合同列表 -->
    <el-dialog
      title="合同列表"
      :visible.sync="openHtList"
      width="50%"
      append-to-body
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-table
        :data="htListData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="大楼编号" label="栋号" width="60" align="left">
        </el-table-column>
        <el-table-column prop="单元名称" label="单元名" align="center">
        </el-table-column>
        <el-table-column prop="房号" label="主房号" align="left">
        </el-table-column>
        <el-table-column prop="业务类型" label="类型" width="50" align="center">
        </el-table-column>
        <el-table-column prop="内部房号" label="内部房号" align="left">
        </el-table-column>
        <el-table-column prop="计价面积" label="计价面积" align="right">
        </el-table-column>
        <el-table-column prop="客户名称" label="客户名称" align="center">
        </el-table-column>
        <el-table-column prop="合同号" label="合同号" align="right">
        </el-table-column>
        <el-table-column prop="合同日期" label="合同日期" align="right" width="150">
        </el-table-column>
        <el-table-column prop="起租日期" label="起租日期" align="center" width="150">
        </el-table-column>
        <el-table-column prop="到租日期" label="到租日期" align="center" width="150">
        </el-table-column>
        <el-table-column prop="入住日期" label="入住日期" align="center" width="150">
        </el-table-column>

        <el-table-column label="终止状态" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.终止状态" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="终止日期"
          label="终止日期"
          fixed="right"
          align="center"
          width="150"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    houseList: {
      type: Array,
      default: () => [],
    },
    htListData: {
      type: Array,
      default: () => [],
    },
    contentStyleObj: {
      type: Object,
      default: () => {},
    },
    queryParams: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
    },
    openHtList: {
      type: Boolean
    }
  },
  data() {
    return {
      decorationOptions: ["报装修", "待装修", "正装修", "已装修"],
    };
  },
  methods: {
    openEdit(row) {
      this.$emit("edit", row);
    },
    // 删除选中项
    handleDelete(row) {
      this.$emit("deleteTabIndex", row);
    },
    // 查看合同
    checkContract(row) {
      this.$emit("openHtDialog", row.houseId);
    },
    // 分页的处理
    handleSizeChange() {},
    handleCurrentChange() {},
    // 分页时调接口
    getTable() {
      this.$emit("pageGetTable");
    },
    handleClose() {
      this.$emit('closeHtDialog')
    }
  },
};
</script>
<style lang="scss" scoped>
.houseTable {
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  .pagination {
    margin: 12px 0;
    text-align: right;
  }
}
</style>

