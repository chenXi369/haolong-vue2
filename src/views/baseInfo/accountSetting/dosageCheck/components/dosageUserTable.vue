<template>
  <div>
    <el-table
      ref="dosageUserData"
      :data="dosageUserData"
      border
      :height="tableHeightTop"
      style="width: 100%; max-height: 100%"
      :cell-style="{ padding: '3px' }"
      size="mini"
      v-loading="dosageTableLoading"
      highlight-current-row
      :header-cell-style="{ textAlign: 'center' }"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column
        prop="ID"
        label="HTID"
        width="100"
        align="center"
        v-if="hiddenLID"
      >
      </el-table-column>
      <el-table-column prop="ID" label="栋号" width="100" v-if="hiddenLID">
      </el-table-column>
      <el-table-column prop="内部房号" fixed width="100">
        <template slot="header">
          <i
            v-if="!hiddenLID"
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
          <span>内部房号</span>
        </template>
      </el-table-column>
      <el-table-column prop="客户名称" label="客户名称" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="业主" align="center" width="50">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.是否业主"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="项目名称" label="收费项目"> </el-table-column>
      <el-table-column prop="表号" label="表号" width="140"> </el-table-column>
      <el-table-column prop="倍率" label="倍率" align="right">
      </el-table-column>

      <!-- 可编辑部分 -->
      <el-table-column label="上次读数" align="right" width="120">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.上次读数"
            size="mini"
            v-if="scope.row.isEdit"
            @input="onlyNumber(scope.row.上次读数, scope.row, '上次读数')"
            @keydown.native="(item) => editTabCol('上次读数', scope.row.上次读数, scope.row, item)"
            v-focus
          ></el-input>
          <div @dblclick="openEditState(scope.row)" v-else>
            {{ scope.row.上次读数 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="本次读数" align="right" width="120">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.本次读数"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.本次读数, scope.row, '本次读数')"
            @keydown.native="(item) => editTabCol('本次读数', scope.row.本次读数, scope.row, item)"
            v-clearZero
          ></el-input>
          <span @dblclick="openEditState(scope.row)"  v-show="!scope.row.isEdit">{{ scope.row.本次读数 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="净用量" align="right" width="120">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.净用量"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.净用量, scope.row, '净用量')"
            @keydown.native="(item) => editTabCol('净用量', scope.row.净用量, scope.row, item)"
            v-clearZero
          ></el-input>
          <span @dblclick="openEditState(scope.row)" v-show="!scope.row.isEdit">{{ scope.row.净用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附加用量" align="right" width="120">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.附加用量"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.附加用量, scope.row, '附加用量')"
            @keydown.native="(item) => editTabCol('附加用量', scope.row.附加用量, scope.row, item)"
            v-clearZero
          ></el-input>
          <span @dblclick="openEditState(scope.row)" v-show="!scope.row.isEdit">{{ scope.row.附加用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计费用量" align="right" width="120">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.计费用量"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.计费用量, scope.row, '计费用量')"
            @keydown.native="(item) => editTabCol('计费用量', scope.row.计费用量, scope.row, item)"
            v-clearZero
          ></el-input>
          <span @dblclick="openEditState(scope.row)" v-show="!scope.row.isEdit">{{ scope.row.计费用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基本费" align="right" width="120">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.基本费"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.基本费, scope.row, '基本费')"
            @keydown.native="(item) => editTabCol('基本费', scope.row.基本费, scope.row, item)"
            v-clearZero
          ></el-input>
          <span @dblclick="openEditState(scope.row)" v-show="!scope.row.isEdit">{{ scope.row.基本费 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附加费" align="right" width="100">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.附加费"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.附加费, scope.row, '附加费')"
            @keydown.native="(item) => editTabCol('附加费', scope.row.附加费, scope.row, item)"
            v-clearZero
          ></el-input>
          <span @dblclick="openEditState(scope.row)" v-show="!scope.row.isEdit">{{ scope.row.附加费 }}</span>
        </template>
      </el-table-column>

      <!-- 不可编辑 -->
      <el-table-column prop="调整应收款" label="调整应收款" align="right">
      </el-table-column>
      <el-table-column prop="本月应收款" label="本月应收款" align="right">
      </el-table-column>
      <el-table-column label="是否付清" align="center" width="80">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.是否付清"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>

      <!-- 可编辑 -->
      <el-table-column label="用量审核" align="center" width="80">
        <template slot-scope="scope">
          <el-checkbox
            :disabled="!scope.row.isEdit"
            v-model="scope.row.用量审核"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        label="上次抄表日期"
        width="142"
        align="center"
      >
        <template slot-scope="scope">
          <el-date-picker
            size="mini"
            v-show="scope.row.isEdit"
            v-model="scope.row.上次抄表"
            type="date"
            style="width: 130px"
            placeholder="选择日期"
            @keydown.native="(item) => editTabCol('上次抄表', scope.row.上次抄表, scope.row, item)"
          >
          </el-date-picker>

          <div v-show="!scope.row.isEdit">{{ scope.row.上次抄表 }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="本次抄表日期"
        width="142"
        align="center"
      >
        <template slot-scope="scope">
          <el-date-picker
            size="mini"
            v-show="scope.row.isEdit"
            v-model="scope.row.本次抄表"
            type="date"
            style="width: 130px"
            placeholder="选择日期"
            @keydown.native="(item) => editTabCol('本次抄表', scope.row.本次抄表, scope.row, item)"
          >
          </el-date-picker>

          <div v-show="!scope.row.isEdit">{{ scope.row.本次抄表 }}</div>
        </template>
      </el-table-column>

      <!-- 不可编辑 -->
      <el-table-column label="止约" align="center" width="60">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.止约" :disabled="true"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="备注" fixed="right"></el-table-column>
    </el-table>
    <section style="height: 50px">
      <pagination
        v-show="dosageUserTotal > 0"
        :total="dosageUserTotal"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getTable"
      />
    </section>
  </div>
</template>

<script>
import { onlyNumOnePoint } from '@/utils/index'

export default {
  props: {
    topHeight: {
      type: Object,
      default: () => {},
    },
    dosageUserData: {
      type: Array,
      default: () => [],
    },
    subTabLength: {
      type: Number,
      required: true
    },
    handleSetting: {
      type: Boolean,
      default: true,
    },
    queryParams: {
      type: Object,
      default: () => {},
    },
    dosageUserTotal: {
      type: Number,
      default: 0,
    },
    dosageTableLoading: {
      type: Boolean,
      default: false,
    },
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector("input").focus();
      },
    },
  },
  data() {
    return {
      hiddenLID: false,
      selectRow: {},
    };
  },
  computed: {
    tableHeightTop() {
      let tHeight = this.topHeight.height - 40;
      return tHeight;
    },
  },
  methods: {
    // 输入框只能输入合法数字的校验
    onlyNumber(num, row, key) {
      row[key] = onlyNumOnePoint(num)
    },
    // 分页
    getTable() {
      this.$emit("userPageTurn");
    },
    // 操作功能列表
    handleUser(val) {
      this.$emit("selectedRefUser", val);
    },
    // 新增收费项目
    handleAddItem(user) {
      this.$emit("handleAddPayItem", user);
    },
    // 生成选定客户的应收款
    createUserCol(row) {
      this.$emit("createUserCol", row);
    },
    // 计算选定客户的【附加项目费用】
    computeUserItemPay(row) {
      this.$emit("computeUserItemPay", row);
    },
    // 单选选中
    handleCurrentChange(row) {
      this.selectRow = { ...row };
      // 传递给父组件
      this.$emit("handleCurrentUser", row);
      this.$refs.dosageUserData.setCurrentRow(row);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.dosageUserData.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.dosageUserData.clearSelection();
      }
    },
    showLId() {
      this.hiddenLID = !this.hiddenLID;
      if (this.hiddenLID) {
        this.$nextTick(() => {
          this.$refs.dosageUserData.doLayout();
        });
      }
    },
    // 过滤总表的选中项
    filterSelected(id) {
      this.dosageSelectItems.map((item) => {
        if (item.ID === id) {
          item.isEdit = true;
        } else {
          item.isEdit = false;
        }
      });
    },

    // 打开编辑状态
    openEditState(row) {
      row.isEdit = true;
      // 双击的处理
      this.$emit('dblClick')
    },
    // 修改的回车处理
    async editTabCol(key, val, row, event) {
      const sortState = this.sortAllTableKey(key, val);
      // 判断是否有分表
      if(event.key === 'Enter' && sortState) {
        if (~~this.subTabLength) {
          await this.showModel(key, val, row, event.key)
        } else {
          this.keyEnterEvent(key, val, row)
        }
      } else if(event.key === 'Tab' && sortState) {
        if (~~this.subTabLength) {
          await this.showModel(key, val, row, event.key)
        } else {
          this.keyTabEvent(key, val, row)
        }
      }
    },
    showModel(key, val, row, type) {
      this.$confirm('有多个分表存在，建议不要直接修改', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(type === 'Enter') {
          this.keyEnterEvent(key, val, row)
        } else {
          this.keyTabEvent(key, val, row)
        }
      }).catch(() => {
        return false
      })
    },
    // 实际回车逻辑处理
    keyEnterEvent(key, val, row) {
      this.checkNowNum(key, val, row) 
      let selectIdx = this.dosageUserData.findIndex(
        (row) => row.ID === this.selectRow.ID
      );
      let data = {
        editField: key,
        sumTable: {...row}
      }
      let totalData = { data: data, selectIdx, type: 0 }
      this.$emit('updateAllTabRow', totalData)
    },
    judgeLength(selectIdx) {
      // 长度判断 是切换到下一行还是隐藏
      if(selectIdx + 1 < this.dosageUserData.length) {
        console.log(this.dosageUserData[selectIdx + 1])
        this.handleCurrentChange(this.dosageUserData[selectIdx + 1]);
      } else {
        this.$refs.dosageUserData.setCurrentRow();
      }
    },
    // 实际的tab逻辑
    keyTabEvent(key, val, row) {
      this.checkNowNum(key, val, row) 
      let selectIdx = this.dosageUserData.findIndex(
        (row) => row.ID === this.selectRow.ID
      );
      let data = {
        editField: key,
        sumTable: {...row}
      }
      let totalData = { data: data, selectIdx, type: 1 }
      this.$emit('updateAllTabRow', totalData)
    },
    // 总表修改值比较函数
    sortAllTableKey(key, val) {
      if (parseFloat(this.selectRow[key]) === parseFloat(val)) {
        return false;
      } else {
        return true;
      }
    },
    // 切换至下一行  兄弟组件间的通讯
    toNextRow() {
      let selectedId = this.dosageUserData.findIndex(
        (row) => row.ID === this.selectRow.ID
      );
      this.handleCurrentChange(this.dosageUserData[selectedId + 1]);
    },
    // 校验本次读数
    checkNowNum(key, val, row) {
      if(key === '本次读数' && parseFloat(row.上次读数) > val) {
        this.$message.warning('本次读数不应小于上次读数！')
        return
      }
    }
  }
}
</script>

<style>
</style>