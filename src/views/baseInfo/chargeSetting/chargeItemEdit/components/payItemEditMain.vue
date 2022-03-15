<template>
  <div>
    <el-divider content-position="center">收费项目列表（可编辑）</el-divider>
    <el-table
      :data="optionalChargeItems"
      border
      stripe
      size="mini"
      v-loading="loading"
      :height="editItemTableHeight"
      :cell-style="{ padding: '3px' }"
      :header-cell-style="{ textAlign: 'center' }"
      style="width: 100%; max-height: 100%"
    >
      <el-table-column label="栋号" prop="大楼编号" width="100" fixed> </el-table-column>
      <el-table-column label="内部房号" prop="内部房号" width="100">
      </el-table-column>
      <el-table-column label="客户名称" prop="客户名称" width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="业主" width="55" align="center">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.是否业主"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="项目编号" prop="项目编号" width="80">
      </el-table-column>
      <el-table-column label="项目名称" prop="项目名称" width="130">
      </el-table-column>
      <!-- 可编辑部分 -->
      <el-table-column label="有效" width="55" align="center">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.有效性"
            :disabled="!scope.row.isEdit"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="托收" width="55" align="center">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.银行托收"
            :disabled="!scope.row.isEdit"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="开始日期" width="145" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.开始日期"
            type="date"
            size="mini"
            style="width: 130px"
            v-if="scope.row.isEdit"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span v-else>{{ scope.row.开始日期 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" width="145" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.结束日期"
            type="date"
            size="mini"
            style="width: 130px"
            v-if="scope.row.isEdit"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span v-else>{{ scope.row.结束日期 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月费用" width="80" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.月费用"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.月费用 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="托收代码" width="100" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.总行代码"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.银行代码 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行账号" width="160" align="left">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.银行帐号"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.银行帐号 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行代码" width="120" align="left">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.银行代码"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.总行代码 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="开户名" width="120" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.开户名"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.开户名 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预留手机" width="120">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.预留手机"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.预留手机 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="托收合同号" width="80">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.托收合同号"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.托收合同号 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="滞纳金比例" width="80" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.滞纳金比例"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.滞纳金比例 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计价面积" width="80" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.计价面积"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.计价面积 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最低用量" width="80" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.最低用量"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.最低用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定额用量" width="80" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.定额用量"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.定额用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="底数" width="70" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.底数"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.底数 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="倍率" width="70" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.倍率"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.倍率 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="抄表日期" width="145" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.抄表日期"
            type="date"
            size="mini"
            style="width: 130px"
            v-if="scope.row.isEdit"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span v-else>{{ scope.row.抄表日期 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父表号" width="160" align="left">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.父表号"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.父表号 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表号" prop="表号" width="160" align="left">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.表号"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.表号 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" prop="车牌号" width="110" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.车牌号"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.车牌号 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准价" prop="标准价" width="80">
      </el-table-column>

      <el-table-column label="操作" width="160" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="toUpdate(scope.row)"
            v-if="!scope.row.isEdit"
            >编辑</el-button
          >
          <span v-else>
            <el-button type="text" size="mini" @click="saveUpdate(scope.row)"
              >保存</el-button
            >
            <el-button
              type="text"
              size="mini"
              style="color: red"
              @click="cancelUpdate(scope.row)"
              >取消编辑</el-button
            >
          </span>
          <el-button
            type="text"
            size="mini"
            style="color: red; margin-left: 20px"
            @click="delOneItem(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <section style="height: 40px">
      <pagination
        v-show="total > 0"
        :total="total"
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
    total: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    queryParams: {
      type: Object,
      default: () => {},
    },
    mainHeight: {
      type: Object,
      default: () => {},
    },
    optionalChargeItems: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    editItemTableHeight() {
      let mainHeight = this.mainHeight.height - 30;
      return mainHeight;
    }
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val);
    },
    checkedPayFee(i, e) {
      console.log(i, e);
    },
    // 翻页
    getTable() {
      this.$emit("getTurnPage");
    },
    // 编辑
    toUpdate(row) {
      row.isEdit = !row.isEdit;
    },
    // 保存
    saveUpdate(row) {
      row.isEdit = !row.isEdit;
      this.$emit("saveUpdatePayItem", row);
    },
    cancelUpdate(row) {
      row.isEdit = false;
    },
    // 删除单个
    delOneItem(row) {
      this.$emit("delUserHtItem", row)
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-container {
  margin-top: 6px;
}
</style>