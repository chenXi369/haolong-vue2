<template>
  <div :style="bottomHeight">
    <el-divider content-position="center" style="hieght: 40px"
      >已选收费项目（可编辑）</el-divider
    >

    <el-table
      :data="selectedPayItems"
      stripe
      border
      size="mini"
      ref="selectChargeItem"
      :height="tableHeightBot"
      v-loading="selectItemLoading"
      :cell-style="{ padding: '3px' }"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ textAlign: 'center' }"
      style="width: 100%; max-height: 100%"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column prop="date" label="分表" width="80" align="left" fixed>
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-setting"
            @click="setManageRoom(scope.row)"
          >
            设置
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="ID" label="ID" width="70" v-if="hiddenPayItemId">
      </el-table-column>
      <el-table-column
        prop="JFID"
        label="JFID"
        width="70"
        v-if="hiddenPayItemId"
      >
      </el-table-column>
      <el-table-column prop="项目编号" width="100">
        <template slot="header">
          <i
            v-if="!hiddenPayItemId"
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
          <span>项目编号</span>
        </template>
      </el-table-column>

      <el-table-column prop="项目名称" label="项目名称" width="140">
      </el-table-column>
      <el-table-column label="计价面积" width="100" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.计价面积"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.计价面积 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="标准价" label="单价" align="right">
      </el-table-column>
      <el-table-column label="违约金比例" width="100">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.滞纳金比例"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.滞纳金比例 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="有效" align="center" width="55">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.有效性"
            @change="isEffective(scope.row)"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="托收" align="center" width="55">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.银行托收"
            @change="isCollective(scope.row)"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column prop="银行代码" label="托收代码"> </el-table-column>
      <el-table-column prop="银行账号" label="银行账号"> </el-table-column>
      <el-table-column label="开始日期" width="155" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.开始日期"
            type="date"
            size="mini"
            style="width: 140px"
            v-if="scope.row.isEdit"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span v-else>{{ scope.row.开始日期 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" width="155" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.结束日期"
            type="date"
            size="mini"
            style="width: 140px"
            v-if="scope.row.isEdit"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span v-else>{{ scope.row.结束日期 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="月费用" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.月费用"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.月费用 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" width="110" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.车牌号"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.车牌号 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父表号" width="180" align="left">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.父表号"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.父表号 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表号" width="180" align="left">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.表号"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.表号 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="最低用量" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.最低用量"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.最低用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定额用量" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.定额用量"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.定额用量 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="底数" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.底数"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.底数 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="倍率" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.倍率"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.倍率 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抄底日期" width="155" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.抄表日期"
            type="date"
            size="mini"
            style="width: 140px"
            v-if="scope.row.isEdit"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span v-else>{{ scope.row.抄表日期 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template slot-scope="scope">
          <span style="margin-right: 20px">
            <el-button
              type="text"
              size="mini"
              @click="toUpdate(scope.row)"
              v-if="!scope.row.isEdit"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="saveUpdate(scope.row)"
              v-else
              >保存</el-button
            >
          </span>
          <el-dropdown trigger="click" placement="bottom-end">
            <el-button type="primary" plain size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addItem(scope.row)"
                >增加项目</el-dropdown-item
              >
              <el-dropdown-item @click.native="delItem(scope.row)"
                >删除项目</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="checkedPayFee(0, scope.row)"
                divided
                >生成选定项目的【分表项目】</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="checkedPayFee(1, scope.row)"
                divided
                >生成选定项目的【应收款】</el-dropdown-item
              >
              <el-dropdown-item
                :disabled="![1, 2, 5, 7].includes(scope.row.数据来源)"
                @click.native="checkedPayFee(2, scope.row)"
                divided
                >计算选定项目的【附加项目费用】</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    selectedPayItems: {
      type: Array,
      default: () => [],
    },
    bottomHeight: {
      type: Object,
      default: () => {},
    },
    selectItemLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hiddenPayItemId: false,
    };
  },
  computed: {
    tableHeightBot() {
      let tHeight = this.bottomHeight.height - 40;
      return tHeight;
    },
  },
  methods: {
    // 增
    addItem(row) {
      this.$emit("addPayFeeItem", row);
    },
    // 删
    delItem(row) {
      this.$emit("delPayFeeItem", row);
    },
    // 改
    toUpdate(row) {
      row.isEdit = !row.isEdit;
    },
    saveUpdate(row) {
      row.isEdit = !row.isEdit;
      this.$emit("updatePayFeeItem", row);
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
    // 托收
    isCollective(row) {
      if (!row.isEdit) {
        if (!row.银行托收) {
          this.$confirm(`要取消 [${row.项目名称}] 的托收有效性吗?`, "警告", {
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
          this.$confirm(`要设置 [${row.项目名称}] 的托收有效性吗?`, "警告", {
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
      this.hiddenPayItemId = !this.hiddenPayItemId;
      if (this.hiddenPayItemId) {
        this.$nextTick(() => {
          this.$refs.selectChargeItem.doLayout();
        });
      }
    },
  },
};
</script>

<style>
</style>