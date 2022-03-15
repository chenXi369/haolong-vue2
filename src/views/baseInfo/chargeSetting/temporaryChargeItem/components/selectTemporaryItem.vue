<template>
  <div :style="bottomHeight">
    <el-divider content-position="center" style="hieght: 40px"
      >已选临时项目（可编辑）</el-divider
    >

    <el-table
      :data="selectedLsPayItems"
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

      <el-table-column
        prop="LSYSID"
        label="LSYSID"
        width="70"
        v-if="hiddenPayItemId"
      >
      </el-table-column>
      <el-table-column
        prop="LSXMID"
        label="LSXMID"
        width="70"
        v-if="hiddenPayItemId"
      >
      </el-table-column>
      <el-table-column prop="序号" width="100">
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
          <span>编号</span>
        </template>
      </el-table-column>

      <el-table-column prop="项目名称" label="项目名称" width="140">
      </el-table-column>

      <el-table-column label="应交款日期" width="155" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.应交日期"
            type="date"
            size="mini"
            style="width: 140px"
            v-if="scope.row.isEdit"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span v-else>{{ scope.row.应交日期 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应交币种" width="100" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.应交币种" v-if="scope.row.isEdit">
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.name"
              :value="item.no"
            ></el-option>
          </el-select>
          <span v-else>{{ currencyList[scope.row.应交币种].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应交金额" width="100" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.应交金额"
            type="number"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.应交金额 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已交金额" width="100" align="right">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.已交金额"
            size="mini"
            type="number"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.已交金额 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="押金" align="center" width="55">
        <template slot-scope="scope">
          <el-checkbox
            :disabled="!scope.row.isEdit"
            v-model="scope.row.押金项目"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="代收付" align="center" width="55">
        <template slot-scope="scope">
          <el-checkbox
            :disabled="!scope.row.isEdit"
            v-model="scope.row.代收付项目"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="付清" align="center" width="55">
        <template slot-scope="scope">
          <el-checkbox
            :disabled="true"
            v-model="scope.row.付清标志"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="退清" align="center" width="55">
        <template slot-scope="scope">
          <el-checkbox
            :disabled="true"
            v-model="scope.row.退清标志"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="计算公式" width="180" align="left">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.计算公式"
            size="mini"
            v-if="scope.row.isEdit"
          ></el-input>
          <span v-else>{{ scope.row.计算公式 }}</span>
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
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDictionary } from "@/api/system/systemData";
export default {
  props: {
    selectedLsPayItems: {
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
      currencyList: [],
    };
  },
  computed: {
    tableHeightBot() {
      let tHeight = this.bottomHeight.height - 40;
      return tHeight;
    },
  },
  created() {
    getDictionary({ nodeName: "币种" }).then((res) => {
      this.currencyList = [...res.data];
    });
  },
  methods: {
    // 增
    addItem(row) {
      this.$emit("addLsPayFeeItem", row);
    },
    // 删
    delItem(row) {
      this.$confirm(`确定要删除收费项目【${row.项目名称}】吗？`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("delLsPayFeeItem", row);
        })
        .catch(() => {
          console.log("用户点击了取消");
        });
    },
    // 改
    toUpdate(row) {
      row.isEdit = !row.isEdit;
    },
    saveUpdate(row) {
      row.isEdit = !row.isEdit;
      this.$emit("updateLsPayFeeItem", row);
    },
    // 多选操作
    handleSelectionChange(val) {
      this.$emit("selectUserLsItems", val);
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