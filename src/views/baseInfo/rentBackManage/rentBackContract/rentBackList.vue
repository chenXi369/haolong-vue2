<template>
  <div class="rentBackList">
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
        v-loading="loading"
        :data="rentBackList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :cell-style="{padding: '4px'}"
        element-loading-text="请给我点时间！"
      >
        <el-table-column
          fixed
          prop=""
          label="房号"
          width="120"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="业主名称"
          width="180"
          align="right"
        >
        </el-table-column>

        <el-table-column
          prop=""
          label="分理处"
          width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="银行账号"
          width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="总行代码"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="房屋状态"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="返租"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="拆租"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="审核"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="建筑面积"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="套内面积"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="附属面积1"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="附属面积2"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="朝向"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="用途"
          align="right"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="结构"
          align="right"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="170" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              style="margin-left: 25px"
              @click="rentBackUpdate(scope.row)"
            >
              修改合同
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              style="margin-left: 25px"
              @click="rentBackDelete(scope.row)"
            >
              删除合同
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
    rentBackList: {
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
      console.log(row)
    },
    // 删除合同
    handleDelete(row) {
      console.log(row)
    },
    // 分页时调接口
    getTable() {
      this.$emit("pageGetTable");
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

