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
    >
      <el-table-column
        prop="ID"
        label="WYID"
        width="100"
        align="left"
        v-if="hiddenId"
      >
      </el-table-column>
      <el-table-column
        prop="ID"
        label="HTID"
        width="100"
        align="left"
        v-if="hiddenId"
      >
      </el-table-column>
      <el-table-column prop="内部房号" width="160" align="left">
        <template slot="header">
          <i
            v-if="!hiddenId"
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
      required: true,
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
    }
  },
  data() {
    return {
      hiddenId: false
    }
  },
  computed: {
    tableHeightTop() {
      let tHeight = this.topHeight.height - 50
      return tHeight
    }
  },
  watch: {
    userTableData: function() {
      this.$nextTick(() => {
        this.$refs.userItemTable.setCurrentRow(this.userTableData[0]);
      });
    },
  },
  mounted() {},
  methods: {
    // 分页
    getTable() {
      this.$emit("userPageTurn");
    },
    // 单选用户切换
    handleCurrentChange(val) {
      this.$emit("handleCurrentUser", val)
    },
    showLId() {
      this.hiddenId = !this.hiddenId
      if (this.hiddenId) {
        this.$nextTick(() => {
          this.$refs.userItemTable.doLayout()
        })
      }
    }
  }
};
</script>

<style>
</style>