<template>
  <div class="page">
    <div :style="contentStyleObj" class="houseTable">
      <div
        style="
          margin: 10px 0;
          text-align: center;
          font-size: 20px;
          font-family: ;
        "
      >
        租赁合同
      </div>
      <!-- 租赁合同 -->
      <el-table
        v-loading="loading"
        :data="houseList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :cell-style="{ padding: '2px' }"
        element-loading-text="请给我点时间！"
      >
        <el-table-column fixed label="状态" width="80" align="center">
          <template slot-scope="scope">{{
            ["新签", "续签", "变更"][scope.row.合同状态]
          }}</template>
        </el-table-column>
        <el-table-column prop="编号" label="栋号" width="80" align="center" />
        <el-table-column label="房号" width="100" align="left">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <span>{{ scope.row.ID }}</span>
              <div slot="reference" class="name-wrapper">
                <span size="medium">{{ scope.row.内部房号 }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="合同号"
          label="合同号"
          width="120"
          align="center"
        />
        <el-table-column
          prop="合同日期"
          label="合同日期"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="业务类型"
          label="客户类型"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="客户代码"
          label="客户代码"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="租户名称"
          label="承租人"
          width="160"
          align="right"
        >
        </el-table-column>
        <el-table-column prop="手机" label="手机" width="120" align="center" />
        <el-table-column label="止约" width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.终止状态" disabled />
          </template>
        </el-table-column>
        <el-table-column
          prop="终止日期"
          label="止约日期"
          width="120"
          align="center"
        />
        <el-table-column label="审核" width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.审核标志" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="电话" label="电话" width="120" align="center" />
        <el-table-column
          prop="计价面积"
          label="计租面积"
          width="80"
          align="right"
        />
        <el-table-column
          prop="关联代码"
          label="关联代码"
          width="100"
          align="center"
        />
        <el-table-column
          prop="银行代码"
          label="托收代码"
          width="80"
          align="center"
        />
        <el-table-column
          prop="银行帐号"
          label="银行帐号"
          width="200"
          align="center"
        />
        <el-table-column
          prop="总行代码"
          label="银行代码"
          width="150"
          align="center"
        />
        <el-table-column
          prop="开户名"
          label="开户名"
          width="120"
          align="right"
        />
        <el-table-column
          prop="起租日期"
          label="起租日期"
          width="120"
          align="center"
        />

        <el-table-column
          prop="到租日期"
          label="到租日期"
          width="120"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="170" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document-delete"
              @click="finishContract(scope.row)"
              :style="{ color: scope.row.终止状态 ? '#ffba00' : '#1890ff' }"
            >
              {{ scope.row.终止状态  ? '已止约' : '止约合同' }}
            </el-button>

            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              style="margin-left: 25px"
              @click="LookContract(scope.row)"
            >
              详情
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
  </div>
</template>

<script>
export default {
  props: {
    houseList: {
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
    // 查看合同
    finishContract(row) {
      this.$emit("finishRentContract", row);
    },
    LookContract(row) {
      this.$emit("openRentContract", row);
    },
    // 分页的处理
    handleSizeChange() {},
    handleCurrentChange() {},
    // 分页时调接口
    getTable() {
      this.$emit("pageGetTable");
    },
    handleClose() {
      this.$emit("closeHtDialog");
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

