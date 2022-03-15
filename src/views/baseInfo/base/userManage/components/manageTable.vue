<template>
  <div class="page">
    <div :style="contentStyleObj" class="houseTable">
      <div style="margin: 10px 0; text-align: center; font-size: 18px">
        客户列表
      </div>
      <!-- 房屋列表 -->
      <el-table
        :data="ownerList"
        v-loading="loading"
        element-loading-text="请给我点时间！"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :cell-style="{ padding: '2px' }"
      >
        <el-table-column
          fixed
          prop="customerCode"
          label="客户代码"
          width="80"
          align="left"
        />
        <el-table-column label="核算代码" width="80" align="center" />
        <el-table-column
          prop="shortCode"
          label="简码"
          width="120"
          align="center"
        />
        <el-table-column
          prop="customerName"
          label="客户名称"
          width="250"
          align="center"
        />
        <el-table-column label="业主" width="80" align="right">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isOwner" :disabled="true" />
          </template>
        </el-table-column>

        <el-table-column label="租户" width="80" align="center"
          ><template slot-scope="scope">
            <el-checkbox v-model="scope.row.isTenant" :disabled="true" />
          </template>
        </el-table-column>

        <el-table-column
          prop="nationality"
          width="80"
          label="国家/地区"
          align="center"
        />
        <el-table-column prop="mobile" label="手机" width="150" align="center" />
        <el-table-column
          prop="certificate"
          label="证件"
          width="150"
          align="center"
        />
        <el-table-column prop="phone" label="电话" width="150" align="center" />
        <el-table-column
          prop="email"
          label="电子邮件"
          width="150"
          align="center"
        />

        <el-table-column label="单位" width="90" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isCompany" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column
          prop="contactPerson"
          label="联系人"
          width="130"
          align="center"
        />
        <el-table-column
          prop="contactMobile"
          label="联系人手机"
          width="150"
          align="center"
        />

        <el-table-column fixed="right" label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-search"
              @click="checkContract(scope.row)"
            >
              查看合同
            </el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="editOwnerInfo(scope.row)"
              style="margin: 0 14px"
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="delOwnerInfo(scope.row)"
            >
              删除
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
    ownerList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false
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
    openHtList: {
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
    editOwnerInfo(row) {
      const val = {
        row: row,
        state: true,
      };
      this.$emit('editOwner', val);
    },
    delOwnerInfo(row) {
      this.$emit('delOwner', row)
    },
    // 查看合同
    checkContract(row) {
      this.$emit('openHtDialog', row);
    },
    // 分页时调接口
    getTable(val) {
      this.$emit('pageGetTable', val);
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

