<template>
  <div>
    <el-table
      ref="userItemTable"
      :data="userTableData"
      border
      :height="tableHeightTop"
      style="width: 100%; max-height: 100%"
      :cell-style="{ padding: '2px' }"
      size="mini"
      v-loading="userTableLoading"
      highlight-current-row
      :header-cell-style="{ textAlign: 'center' }"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column
        prop="ID"
        label="HTID"
        width="100"
        align="left"
        v-if="hiddenLID"
      >
      </el-table-column>
      <el-table-column prop="内部房号" width="160" align="left">
        <template slot="header">
          <i
            v-if="!hiddenLID"
            class="el-icon-caret-left"
            @click="showLId"
            style="cursor: pointer"
          ></i>
          <i
            v-else
            class="el-icon-caret-right"
            @click="showLId"
            style="cursor: pointer"
          ></i>
          <span>房号</span>
        </template>
      </el-table-column>
      <el-table-column label="业主" align="center" width="80">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.是否业主"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="止约" align="center" width="80">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.终止状态"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column prop="套内面积" label="面积" width="100" align="center">
      </el-table-column>
      <el-table-column prop="客户代码" label="客户代码" width="180">
      </el-table-column>
      <el-table-column prop="客户名称" label="客户名称"> </el-table-column>

      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-dropdown trigger="click" placement="bottom-end">
            <el-button type="primary" plain size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="a"
                :disabled="handleSetting"
                @click.native="handleUser(scope.row)"
                >选定参照客户</el-dropdown-item
              >
              <el-dropdown-item
                command="b"
                divided
                @click.native="handleAddItem(scope.row)"
                >新增收费项目</el-dropdown-item
              >

              <template v-if="showMenus">
                <el-dropdown-item
                  command="e"
                  divided
                  @click.native="createUserCol(scope.row)"
                  >生成选定客户的【应收款】</el-dropdown-item
                >
                <el-dropdown-item
                  command="f"
                  divided
                  @click.native="computeUserItemPay(scope.row)"
                  >计算选定客户的【附加项目费用】</el-dropdown-item
                >
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <section style="height: 50px">
      <pagination
        v-show="userHtTotal > 0"
        :total="userHtTotal"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getTable"
      />
    </section>
  </div>
</template>

<script>
export default {
  props: {
    userTableLoading: {
      type: Boolean,
      default: false,
    },
    topHeight: {
      type: Object,
      default: () => {},
    },
    userTableData: {
      type: Array,
      default: () => [],
    },
    handleSetting: {
      type: Boolean,
      default: true,
    },
    queryParams: {
      type: Object,
      default: () => {},
    },
    userHtTotal: {
      type: Number,
      default: 0,
    },
    showMenus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hiddenLID: false,
    };
  },
  computed: {
    tableHeightTop() {
      let tHeight = this.topHeight.height - 50;
      return tHeight;
    },
  },
  watch: {
    // userTableData: function() {
    //   this.$nextTick(() => {
    //     this.$refs.userItemTable.setCurrentRow(this.userTableData[0]);
    //   });
    // },
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("handleSelection", val);
    },
    // 分页
    getTable() {
      this.$emit("userPageTurn");
    },
    // 操作功能列表
    handleUser(val) {
      this.$emit("selectedRefUser", val);
    },
    // 新增收费项目
    handleAddItem(user) {
      this.$emit("handleAddPayItem", user);
    },
    // 生成选定客户的应收款
    createUserCol(row) {
      this.$emit("createUserCol", row);
    },
    // 计算选定客户的【附加项目费用】
    computeUserItemPay(row) {
      this.$emit("computeUserItemPay", row);
    },
    // 单选选中
    handleCurrentChange(val) {
      this.$emit("handleCurrentUser", val);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.userItemTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.userItemTable.clearSelection();
      }
    },
    showLId() {
      this.hiddenLID = !this.hiddenLID;
      if (this.hiddenLID) {
        this.$nextTick(() => {
          this.$refs.userItemTable.doLayout();
        });
      }
    },
  },
};
</script>

<style>
</style>