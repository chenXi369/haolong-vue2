<template>
  <div>
    <el-table
      :data="optionalChargeItems"
      border
      stripe
      size="mini"
      ref="tableBZID"
      :cell-style="{ padding: '3px' }"
      :height="payItemTableHeight"
      style="width: 100%; max-height: 100%"
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center">
      </el-table-column> -->
      <el-table-column
        prop="ID"
        label="BZID"
        width="100"
        align="left"
        v-if="hiddenBZID"
      >
      </el-table-column>
      <el-table-column prop="计费编号" width="120" align="left">
        <template slot="header">
          <i
            v-if="!hiddenBZID"
            class="el-icon-caret-left"
            @click="showBZId"
            style="cursor: pointer"
          ></i>
          <i
            v-else
            class="el-icon-caret-right"
            @click="showBZId"
            style="cursor: pointer"
          ></i>
          <span>编号</span>
        </template>
      </el-table-column>
      <el-table-column prop="计费名称" label="计费名称" width="180">
      </el-table-column>
      <el-table-column prop="项目编号" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="项目名称" label="项目名称" width="180">
      </el-table-column>
      <el-table-column prop="标准价" label="单价" width="100" align="right"> </el-table-column>
      <el-table-column label="托收" width="70" align="center">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.银行托收"
            :disabled="true"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="备注" label="备注"> </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-dropdown trigger="click" placement="bottom-end">
            <el-button type="primary" plain size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="checkedPayFee(0, scope.row)"
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
    payItemHeight: {
      type: Object,
      default: () => {},
    },
    optionalChargeItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      hiddenBZID: false,
    };
  },
  computed: {
    payItemTableHeight() {
      let payItemHeight = this.payItemHeight.height;
      return payItemHeight;
    },
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val);
    },
    checkedPayFee(i, e) {
      switch (i) {
        case 0:
          this.$emit("createChargeStrItem", e);
          break;
        case 1:
          this.$emit("createChargePay", e);
          break;
        case 2:
          this.$emit("createOtherChargePay", e);
          break;
        default:
          this.$emit("createChargeStrItem", e);
          break;
      }
    },
    showBZId() {
      this.hiddenBZID = !this.hiddenBZID;
      if (this.hiddenBZID) {
        this.$nextTick(() => {
          this.$refs.tableBZID.doLayout();
        });
      }
    },
  },
};
</script>

<style>
</style>