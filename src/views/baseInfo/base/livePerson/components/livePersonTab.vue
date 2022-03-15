<template>
  <div class="livePersonTab">
    <div :style="contentStyleObj" class="houseTable">
      <div style="margin: 10px 0; text-align: center; font-size: 18px">客户列表</div>
      <!-- 房屋列表 -->
      <el-table
        v-loading="loading"
        :data="ownerList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :cell-style="{padding: '2px'}"
        element-loading-text="请给我点时间！"
      >
        <el-table-column fixed prop="" label="栋号" width="80" align="left" ></el-table-column>
        <el-table-column prop="" label="房号" width="80" align="left" ></el-table-column>
        <el-table-column
          label="业主"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.业主"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="合同号"
          width="120"
          align="center"
        />
        <el-table-column
          prop=""
          label="面积"
          width="120"
          align="center"
        />
        <el-table-column
          label="租户"
          width="80"
          align="center"
        />
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row"
            disabled
          />
        </template>
        <el-table-column
          prop="出租状态"
          width="80"
          label="国家/地区"
          align="center"
        />
        <el-table-column
          prop="手机"
          label="手机"
          width="80"
          align="center"
        />
        <el-table-column
          prop="证件"
          label="证件"
          width="50"
          align="center"
        />
        <el-table-column
          prop="电话"
          label="电话"
          width="80"
          align="center"
        />
        <el-table-column
          prop="电子邮件"
          label="电子邮件"
          width="50"
          align="center"
        />

        <el-table-column
          prop="单位"
          label="单位"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isSelfUse" disabled />
          </template>
        </el-table-column>
        <el-table-column
          prop="structure"
          label="托收代码"
          width="80"
          align="center"
        />
        <el-table-column
          prop="联系人"
          label="联系人"
          width="130"
          align="center"
        />
        <el-table-column
          prop="联系人手机"
          label="联系人手机"
          width="90"
          align="center"
        />

        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="editOwnerInfo(scope.row)"
            >
              编辑
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
import { fetchList } from '@/api/article'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
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
  },
  data() {
    return {
      currentPage: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create')
    },
    openAdd() {
      this.$emit('addDialog', true)
    },
    openEdit(val) {
      this.$emit('openDialog', val)
    },
    // 删除选中项
    handleDelete(val) {},
    // 分页的处理
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>

<style lang="scss" scoped>
.article {
  height: 730px;
  .add-btn {
    width: 80px;
    margin-bottom: 12px;
  }
}
</style>

