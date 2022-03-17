<template>
  <div :style="bottomHeight">
    <el-divider content-position="center" style="hieght: 40px"
      >用户分表（可编辑）</el-divider
    >

    <el-table
      border
      size="mini"
      show-summary
      ref="selectChargeItem"
      :data="dosageSelectItems"
      :height="tableHeightBot"
      v-loading="dosageSelectLoading"
      :cell-style="{ padding: '3px' }"
      :header-cell-style="{ textAlign: 'center' }"
      style="width: 100%; max-height: 100%"
      highlight-current-row
      current-row-key="FJYSID"
      @current-change="handleCurrentChange"
    >
      <el-table-column prop="大楼名称" label="栋名" width="100">
      </el-table-column>
      <el-table-column
        prop="单元名称"
        label="单元名称"
        width="70"
        v-if="showDosageItemId"
      >
      </el-table-column>
      <el-table-column prop="" width="100">
        <template slot="header">
          <i
            v-if="!showDosageItemId"
            class="el-icon-caret-left"
            @click="showPayItemId"
            style="cursor: pointer"
          ></i>
          <i
            v-else
            class="el-icon-caret-right"
            @click="showPayItemId"
            style="cursor: pointer"
          ></i>
          <span>房号</span>
        </template>
      </el-table-column>
      <el-table-column label="表类别" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.表类别 }}
        </template>
      </el-table-column>
      <el-table-column prop="表名" label="表名"></el-table-column>
      <el-table-column prop="表号" label="表号" width="160"></el-table-column>
      <el-table-column prop="倍率" label="倍率" width="60" align="right"></el-table-column>

      <!-- 可编辑区域 -->
      <el-table-column label="上次读数" width="120" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.上次读数"
            size="mini"
            v-if="scope.row.isEdit"
            @input="onlyNumber(scope.row.上次读数)"
            @keyup.enter.native="changeSubVal('上次读数' ,scope.row.上次读数, scope.row)"
            @keydown.native="(item) => subInputBlur('上次读数', scope.row.上次读数, scope.row, item)"
            v-focus
          ></el-input>
          <span v-else>{{ scope.row.上次读数 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次读数" width="120" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.本次读数"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.本次读数)"
            @keyup.enter.native="changeSubVal('本次读数' ,scope.row.本次读数, scope.row)"
            @keydown.native="(item) => subInputBlur('本次读数', scope.row.本次读数, scope.row, item)"
            v-clearZero
          ></el-input>
          <span v-show="!scope.row.isEdit">{{ scope.row.本次读数 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="净用量" width="120" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.净用量"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.净用量)"
            @keyup.enter.native="changeSubVal('净用量' ,scope.row.净用量, scope.row)"
            @keydown.native="(item) => subInputBlur('净用量', scope.row.净用量, scope.row, item)"
            v-clearZero
          ></el-input>
          <span v-show="!scope.row.isEdit">{{ scope.row.净用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附加用量" width="120" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.附加用量"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.附加用量)"
            @keyup.enter.native="changeSubVal('附加用量' ,scope.row.附加用量, scope.row)"
            @keydown.native="(item) => subInputBlur('附加用量', scope.row.附加用量, scope.row, item)"
            v-clearZero
          ></el-input>
          <span v-show="!scope.row.isEdit">{{ scope.row.附加用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计费用量" width="120" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.计费用量"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.计费用量)"
            @keyup.enter.native="changeSubVal('计费用量' ,scope.row.计费用量, scope.row)"
            @keydown.native="(item) => subInputBlur('计费用量', scope.row.计费用量, scope.row, item)"
            v-clearZero
          ></el-input>
          <span v-show="!scope.row.isEdit">{{ scope.row.计费用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基本费" width="120" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.基本费"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.基本费)"
            @keyup.enter.native="changeSubVal('基本费' ,scope.row.基本费, scope.row)"
            @keydown.native="(item) => subInputBlur('基本费', scope.row.基本费, scope.row, item)"
            v-clearZero
          ></el-input>
          <span  v-show="!scope.row.isEdit">{{ scope.row.基本费 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附加费" width="120" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.附加费"
            size="mini"
            v-show="scope.row.isEdit"
            @input="onlyNumber(scope.row.附加费)"
            @keyup.enter.native="changeSubVal('附加费' ,scope.row.附加费, scope.row)"
            @keydown.native="(item) => subInputBlur('附加费', scope.row.附加费, scope.row, item)"
            v-clearZero
          ></el-input>
          <span v-show="!scope.row.isEdit">{{ scope.row.附加费 }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="本月应收款" label="本月应收款" width="150" align="right"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { onlyNumOnePoint } from '@/utils/index'

export default {
  props: {
    bottomHeight: {
      type: Object,
      default: () => {},
    },
    dosageSelectItems: {
      type: Array,
      default: () => [],
    },
    dosageSelectLoading: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      showDosageItemId: false,
      tableTypeList: ['', '', '', '', ''],
      selectSubRow: {}
    };
  },
  computed: {
    tableHeightBot() {
      let tHeight = this.bottomHeight.height - 40;
      return tHeight;
    },
  },
  watch: {
    dosageSelectItems() {
      this.$nextTick(() => {
        this.$refs.selectChargeItem.setCurrentRow(this.dosageSelectItems[0]);
      });
    },
  },
  methods: {
    // 输入框只能输入合法数字的校验
    onlyNumber(num) {
      let newNum = num
      num = onlyNumOnePoint(newNum)
    },
    checkedPayFee(i, e) {
      switch (i) {
        case 0:
          this.$emit("createUserFbItem", e);
          break;
        case 1:
          this.$emit("createUserPay", e);
          break;
        case 2:
          this.$emit("computedItemPay", e);
          break;
        default:
          this.$emit("createUserFbItem", e);
          break;
      }
    },
    // 设置项目所属房间定义
    setManageRoom(row) {
      this.$emit("openManageRoom", row);
    },
    handleSelectionChange(val) {
      this.$emit("selectUserItems", val);
    },
    // 有效
    isEffective(row) {
      if (!row.isEdit) {
        if (!row.有效性) {
          this.$confirm(`要取消 [${row.项目名称}] 的有效性吗?`, "警告", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$emit("updatePayFeeItem", row);
            })
            .catch(() => {
              this.$emit("cacnelUpdatePayFeeItem", row);
              console.log("点击取消");
            });
        } else {
          this.$confirm(`要设置 [${row.项目名称}] 的有效性吗?`, "警告", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$emit("updatePayFeeItem", row);
            })
            .catch(() => {
              this.$emit("cacnelUpdatePayFeeItem", row);
              console.log("点击取消");
            });
        }
      }
    },
    showPayItemId() {
      this.showDosageItemId = !this.showDosageItemId;
      if (this.showDosageItemId) {
        this.$nextTick(() => {
          this.$refs.selectChargeItem.doLayout();
        })
      }
    },
    // 单选选中
    handleCurrentChange(row) {
      if(row !== null) {
        this.selectSubRow = { ...row }
        this.$nextTick(() => {
          this.filterSelected(row.FJYSID)
        })
        this.$refs.selectChargeItem.setCurrentRow(row);
      }
    },
    // 过滤分表的选中项
    filterSelected(id) {
      this.dosageSelectItems.map((item) => {
        if(item.FJYSID === id) {
          item.isEdit = true
        } else {
          item.isEdit = false
        }
      })
    },
    // 分表可编辑input的 回车处理
    changeSubVal(key, val, row) {
      this.checkNowNum(key, val, row)
      const sortSubState = this.sortSubTableKey(key, val)
      let selectIdx = this.getSelectIdx() 
      if(sortSubState) {
        let data = {
          subTable: {...row},
          editField: key
        }
        let totalData = { data: data, selectIdx, type: 0 }
        this.$emit('updateSubRow', totalData)
      }
    },
    getSelectIdx() {
      return this.dosageSelectItems.findIndex((row) => 
        row.FJYSID === this.selectSubRow.FJYSID
      )
    },
    // 长度判断 是切换到下一行还是切换总表的下一行
    judgeLength(selectIdx) {
      this.subTableLength(selectIdx)
    },
    // 分表数据的长度判断
    subTableLength(index) {
      let id = index + 1
      if(id < this.dosageSelectItems.length) {
        this.handleCurrentChange(this.dosageSelectItems[id])
      } else {
        this.$emit('sublengthOverFlow')
      }
    },
    // 分表修改值比较函数
    sortSubTableKey(key, val) {
      if(parseFloat(this.selectSubRow[key]) === parseFloat(val)) {
        return false
      } else {
        return true
      }
    },
    // 分表输入框失去焦点
    subInputBlur(key, val, row, event) {
      this.checkNowNum(key, val, row)
      if(event.key === 'Tab') {
        const sortSubState = this.sortSubTableKey(key, val)
        if(sortSubState) {
          let selectIdx = this.getSelectIdx() 
          let data = {
            subTable: {...row},
            editField: key
          }
          let totalData = { data: data, selectIdx, type: 1 }
          this.$emit('updateSubRow', totalData)
        }
      }
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
