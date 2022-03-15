<template>
  <div>
    <main class="outbox-center">
      <h2 class="title">发件箱</h2>
      <el-table
        :data="tableData"
        border
        fit
        highlight-current-row
        style="width: 100%; height: 700px"
        v-loading="loading"
        element-loading-text="请给我点时间！"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="45" align="center">
        </el-table-column>
        <el-table-column
          sortable
          prop="date"
          label="发件时间"
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
        :total="tableData.length"
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
      tableData: [
        {
          date: "2016-05-03  08:00",
          addressor: "张三",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
        {
          date: "2016-05-02  12:00",
          addressor: "李四",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
        {
          date: "2016-05-04  15:00",
          addressor: "王五",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
        {
          date: "2016-05-01  20:00",
          addressor: "王大毛",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
        {
          date: "2016-05-08  22:00",
          addressor: "亚瑟",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
      ],
      multipleSelection: []
    };
  },
  methods: {
    checkClick(val) {
      sessionStorage.setItem('msgVal', JSON.stringify(val))
      this.$router.push({
        path: "detail",
        query: {
          type: "发件箱",
        },
      });
    },
    deleteClick(index) {
      this.tableData.splice(index, 1);
    },
    // 全选的处理
    handleSelectionChange(val) {
      // 拷贝新的数组
      this.multipleSelection = val;
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
.outbox-center {
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
