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
      <el-table-column prop="楼号" label="楼号"> </el-table-column>
      <el-table-column prop="房号" label="房号"> </el-table-column>
      <el-table-column prop="客户名称" label="客户名称"> </el-table-column>
      <el-table-column label="业主">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.业主"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="计价面积" label="计价面积"> </el-table-column>
      <el-table-column prop="编号" label="编号"> </el-table-column>
      <el-table-column prop="项目名称" label="项目名称"> </el-table-column>
      <el-table-column prop="应交款日期" label="应交款日期"> </el-table-column>
      <el-table-column prop="应交币种" label="应交币种"> </el-table-column>
      <el-table-column prop="应交金额" label="应交金额"> </el-table-column>
      <el-table-column prop="已交金额" label="已交金额"> </el-table-column>
      <el-table-column prop="欠交金额" label="欠交金额"> </el-table-column>

      <el-table-column prop="已退金额" label="已退金额"> </el-table-column>
      <el-table-column prop="欠退金额" label="欠退金额"> </el-table-column>
      <el-table-column prop="滞纳金比例" label="滞纳金比例"> </el-table-column>

      <el-table-column label="押金">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.押金"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="代收付">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.代收付"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="付清">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.付清"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="退清">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.退清"
            :disabled="true"
          ></el-checkbox>
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