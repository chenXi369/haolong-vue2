<template>
  <div>
    <main class="inbox-center">
      <h2 class="title">收件箱</h2>
      <el-table
        :data="inTableData"
        border
        fit
        highlight-current-row
        style="width: 100%"
        height="700px"
        v-loading="loading"
        element-loading-text="请给我点时间！"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="45" align="center">
        </el-table-column>
        <el-table-column
          sortable
          prop="date"
          label="收件时间"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="addressor"
          width="120px"
          label="发件人"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="title" label="主题" align="center">
        </el-table-column>
        <el-table-column
          prop="receiver"
          width="120px"
          label="收件人"
          align="center"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button @click="checkClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deleteClick(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="inTableData.length"
      >
      </el-pagination>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      currentPage: 1,
      multipleSelection: []
    };
  },
  props: {
    inTableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    checkClick(val) {
      sessionStorage.setItem('msgVal', JSON.stringify(val))
      this.$router.push({
        path: "detail",
        query: {
          type: "收件箱"
        },
      });
    },
    deleteClick(index) {
      this.$emit('inDeleteClick', index)
    },
    // 全选的处理
    handleSelectionChange(val) {
      // 拷贝新的数组
      this.multipleSelection = val;
      this.$emit('inReduce', val)
      // console.log(val)
    },
    // 分页的处理
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.inbox-center {
  width: 99%;
  padding: 10px 1.5%;
  position: relative;
  .title {
    text-align: center;
    color: #424242;
  }
  .pagination {
    position: absolute;
    bottom: 30px;
    right: 40px;
  }
}
</style>
