<template>
  <div class="page">
    <div :style="contentStyleObj" class="houseTable">
      <div style="margin: 10px 0; text-align: center; font-size: 18px">房屋列表</div>
      <!-- 房屋列表 -->
      <el-table
        v-loading="loading"
        :data="houseList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :cell-style="{padding: '2px'}"
        element-loading-text="请给我点时间！"
      >

        <el-table-column fixed prop="房号" label="房号" width="80" align="left" />
        <el-table-column
          prop="业主名称"
          label="业主名称"
          width="120"
          align="center"
        />
        <el-table-column
          prop="手机"
          label="手机"
          width="120"
          align="center"
        />
        <el-table-column
          prop="电话"
          label="电话"
          width="120"
          align="center"
        />
        <el-table-column
          prop="建筑面积"
          label="建筑面积"
          width="80"
          align="right"
        />
        <el-table-column
          prop="房屋状态"
          label="房屋状态"
          width="80"
          align="center"
        />
        <el-table-column
          label="出租状态"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.出租状态"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          label="业主出租"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.物业类型"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          label="返租"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.返租状态"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          label="拆分出租"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.拆租状态"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="审核标志"
          label="审核"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isSelfUse" disabled />
          </template>
        </el-table-column>

        <el-table-column
          prop="套内面积"
          label="套内面积"
          width="90"
          align="center"
        />
        <el-table-column
          prop="structure"
          label="托收代码"
          width="80"
          align="center"
        />
        <el-table-column
          prop="银行账号"
          label="银行账号"
          width="130"
          align="center"
        />
        <el-table-column
          prop="银行代码"
          label="银行代码"
          width="90"
          align="center"
        />
        <el-table-column
          prop="开户名"
          label="开户名"
          width="90"
          align="center"
        />
        <el-table-column
          prop="结构"
          label="结构"
          width="90"
          align="center"
        />
        <el-table-column prop="朝向" label="朝向" width="50" align="center" />
        <el-table-column prop="用途" label="用途" width="70" align="center" />

        <el-table-column prop="备注" label="其他说明" width="120" align="center" />

        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="ownerRegister(scope.row)"
            >
              业主登记
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-map-location"
              @click="checkContract(scope.row)"
            >
              产权过户
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
    <!-- 合同列表 -->
    <el-dialog
      title="合同列表"
      :visible.sync="openHtList"
      width="50%"
      append-to-body
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-table
        :data="htListData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="大楼编号" label="栋号" width="60" align="left" />
        <el-table-column prop="单元名称" label="单元名" align="center" />
        <el-table-column prop="房号" label="主房号" align="left" />
        <el-table-column prop="业务类型" label="类型" width="50" align="center" />
        <el-table-column prop="内部房号" label="内部房号" align="left" />
        <el-table-column prop="客户名称" label="客户名称" align="center" />
        <el-table-column prop="合同号" label="合同号" align="right" />
        <el-table-column prop="合同日期" label="合同日期" align="right" width="150" />
        <el-table-column prop="起租日期" label="起租日期" align="center" width="150" />
        <el-table-column prop="到租日期" label="到租日期" align="center" width="150" />
        <el-table-column prop="入住日期" label="入住日期" align="center" width="150" />

        <el-table-column label="终止状态" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.终止状态" disabled />
          </template>
        </el-table-column>
        <el-table-column
          prop="终止日期"
          label="终止日期"
          fixed="right"
          align="center"
          width="150"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    houseList: {
      type: Array,
      default: () => []
    },
    htListData: {
      type: Array,
      default: () => []
    },
    contentStyleObj: {
      type: Object,
      default: () => {}
    },
    queryParams: {
      type: Object,
      default: () => {}
    },
    total: {
      type: Number,
      default: 0
    },
    openHtList: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      decorationOptions: ['报装修', '待装修', '正装修', '已装修']
    }
  },
  methods: {
    ownerRegister(row) {
      const val = {
        row: row,
        state: true
      }
      this.$emit('edit', val)
    },
    // 查看合同
    checkContract(row) {
      this.$emit('openEquityChange', row)
    },
    // 分页的处理
    handleSizeChange() {},
    handleCurrentChange() {},
    // 分页时调接口
    getTable() {
      this.$emit('pageGetTable')
    },
    handleClose() {
      this.$emit('closeHtDialog')
    }
  }
}
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

