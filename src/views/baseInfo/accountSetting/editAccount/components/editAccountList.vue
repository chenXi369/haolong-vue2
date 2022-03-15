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
      
      <el-table-column prop="栋号" label="栋号" width="100" align="center">
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

      <el-table-column prop="客户名称" label="客户名称" width="100" align="center">
      </el-table-column>
      <el-table-column label="业主" align="center" width="80">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.是否业主"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column prop="计费月份" label="计费月份" width="100" align="center">
      </el-table-column>
      <el-table-column prop="收费项目" label="收费项目" width="180">
      </el-table-column>
      <el-table-column prop="基本费" label="基本费"> </el-table-column>
      <el-table-column prop="附加费" label="附加费"> </el-table-column>

      <el-table-column prop="调整应收款" label="调整应收款"> </el-table-column>
      <el-table-column prop="上月欠费" label="上月欠费"> </el-table-column>
      <el-table-column prop="上月减免" label="上月减免"> </el-table-column>

      <el-table-column prop="往月欠费" label="往月欠费"> </el-table-column>
      <el-table-column prop="往月减免" label="往月减免"> </el-table-column>
      <el-table-column prop="应收款合计" label="应收款合计"> </el-table-column>
      <el-table-column prop="上月结转" label="上月结转"> </el-table-column>
      <el-table-column prop="抵扣结转" label="抵扣结转"> </el-table-column>
      <el-table-column prop="抵扣预收" label="抵扣预收"> </el-table-column>

      <el-table-column prop="新增往月滞纳金" label="新增往月滞纳金"> </el-table-column>
      <el-table-column prop="新增滞纳金减免" label="新增滞纳金减免"> </el-table-column>
      <el-table-column prop="往月滞纳金" label="往月滞纳金"> </el-table-column>
      <el-table-column label="本月付清">
        <template slot-scope="scope" align="center" width="120">
          <el-checkbox
            v-model="scope.row.本月付清"
            :disabled="true"
          ></el-checkbox>
        </template> 
      </el-table-column>
      <el-table-column prop="应托收本月滞纳金" label="应托收本月滞纳金"> </el-table-column>
      <el-table-column prop="在调整基本费" label="在调整基本费"> </el-table-column>

      <el-table-column prop="累计实收本月" label="累计实收本月"> </el-table-column>
      <el-table-column prop="累计欠收本月" label="累计欠收本月"> </el-table-column>
      <el-table-column prop="再调整月份2" label="再调整月份2"> </el-table-column>
      <el-table-column prop="再调整滞纳金" label="再调整滞纳金"> </el-table-column>
      <el-table-column prop="累计滞纳金已收" label="累计滞纳金已收"> </el-table-column>
      <el-table-column prop="累计滞纳金欠收" label="累计滞纳金欠收"> </el-table-column>
      <el-table-column prop="再调整月份4" label="再调整月份4"> </el-table-column>

      <el-table-column label="全部付清">
        <template slot-scope="scope" align="center" width="120">
          <el-checkbox
            v-model="scope.row.全部付清"
            :disabled="true"
          ></el-checkbox>
        </template> 
      </el-table-column>
      <el-table-column label="止约">
        <template slot-scope="scope" align="center" width="80">
          <el-checkbox
            v-model="scope.row.止约"
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