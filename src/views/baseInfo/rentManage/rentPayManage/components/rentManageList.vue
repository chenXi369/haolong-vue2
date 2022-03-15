<template>
  <div class="rentMangeList">
    <div :style="contentStyleObj" class="houseTable">
      <div
        style="
          margin: 10px 0;
          text-align: center;
          font-size: 20px;
          font-family: ;
        "
      >
        房屋列表
      </div>
      <!-- 租赁合同 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="rentList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :cell-style="{ padding: '4px' }"
        element-loading-text="请给我点时间！"
        @select="select"
        @select-all="selectAll"
      >
        <el-table-column type="selection" align="center" width="48"></el-table-column>
        <el-table-column
          fixed
          prop="大楼编号"
          label="栋号"
          width="80"
          align="left"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="大楼名称"
          label="大楼名称"
          width="100"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="内部房号"
          label="房号或铺位号"
          width="120"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop="合同号"
          label="合同号"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="客户名称"
          label="客户名称"
          width="180"
          align="right"
        >
        </el-table-column>

        <el-table-column
          prop="开始日期"
          label="开始日期"
          width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="结束日期"
          label="结束日期"
          width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="核算方式"
          label="核算方式"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="营业额" label="营业额" align="right">
        </el-table-column>
        <el-table-column prop="租金" label="租金" align="right">
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
  </div>
</template>

<script>
export default {
  props: {
    rentList: {
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
    total: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      decorationOptions: ["报装修", "待装修", "正装修", "已装修"],
    };
  },
  methods: {
    // 修改合同
    openEdit(row) {
      console.log(row);
    },
    // 删除合同
    handleDelete(row) {
      console.log(row);
    },
    // 分页时调接口
    getTable() {
      this.$emit("pageGetTable");
    },
    select(selection, row) {
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
      if(this.$refs.multipleTable.selection.length > 0) {
        this.$emit('selectRoom', row)
      }else {
        this.$emit('cancelSelectRoom')
      }
    },
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1;
        this.$emit('selectRoom', selection[0])
      }
    },
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

