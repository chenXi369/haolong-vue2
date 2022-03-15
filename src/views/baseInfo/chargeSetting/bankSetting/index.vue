<template>
  <div>
    <article class="bankSetting">
      <header class="header">
        <h1 style="text-align: center; margin-bottom: 12px">托收银行设置</h1>
      </header>
      <main class="main">
        <section class="leftTree">
          <wy-tree
            :hiddenBuilding="hiddenBuilding"
            :contentStyleObj="contentStyleObj"
            @changeShow="changeShow"
            @transWidth="transWidth"
          >
          </wy-tree>
        </section>
        <section
          v-if="bankInfoVisible"
          :style="tableContStyle"
          style="margin-top: 20px; border-radius: 4px"
        >
          <bank-info
            ref="bankInfo"
            :loading="loading"
            :bankTableData="bankTableData"
            :contentStyleObj="contentStyleObj"
            :bankRegionList="bankRegionList"
            @addBankSetting="addBankSetting"
            @delBankSetting="delBankSetting"
            @updateBankSetting="updateBankSetting"
          ></bank-info>
        </section>
      </main>
    </article>
  </div>
</template>

<script>
import WyTree from "../components/wyTree.vue";
import BankInfo from "./components/bankInfo.vue"
import {
  addBankSetting,
  delBankSetting,
  updateBankSetting,
  getBankSetting,
  getBankList,
} from "@/api/system/bankSetting.js";

import { pageLayout } from "@/mixins/pageLayout.js";

export default {
  mixins: [pageLayout],
  components: {
    WyTree,
    BankInfo
  },
  data() {
    return {
      loading: false,
      showTable: false,
      showDialog: false,
      bankInfoVisible: false,
      hiddenBuilding: true,
      selectedWyData: {},
      bankTableData: [],
      bankRegionList: [],
    };
  },
  created() {
    this.getBankLists();
  },
  methods: {
    transWidth(val) {
      this.tableContStyle.width =
        document.querySelector(".bankSetting").clientWidth - val - 54 + "px";
    },
    // 显示银行设置信息
    changeShow(e) {
      this.selectedWyData = { ...e.node };
      this.bankInfoVisible = e.value;
      this.loading = true;
      this.getBankSettingList(this.selectedWyData.propertyId);
      this.$nextTick(() => {
        this.$refs.bankInfo.handleHiddenFooter()
      })
    },
    // 获取所有的银行列表
    getBankLists() {
      getBankList().then((res) => {
        this.bankRegionList = [...res.data];
      });
    },
    // 获取当前物业下的银行设置list
    getBankSettingList(id) {
      getBankSetting({ propertyId: id }).then((res) => {
        this.bankTableData = [...res.data];
        this.loading = false;
      });
    },
    // 新增
    addBankSetting(row) {
      let data = {propertyId: this.selectedWyData.propertyId, ...row }
      addBankSetting(data).then(() => {
        this.$message.success("新增银行设置成功！");
        this.getBankSettingList(this.selectedWyData.propertyId);
      });
    },
    // 删除某一个银行设置
    delBankSetting(row) {
      delBankSetting({ id: row.id }).then(() => {
        this.$message.success("删除成功！");
        this.getBankSettingList(this.selectedWyData.propertyId);
      });
    },
    // 修改
    updateBankSetting(row) {
      updateBankSetting(row).then(() => {
        this.$message.success(`[${row.bankName}] 设置修改成功！`);
        this.getBankSettingList(this.selectedWyData.propertyId);
      });
    } 
  },
};
</script>

<style lang="scss" scoped>
.bankSetting {
  position: relative;
  .header {
    padding: 10px 30px 0px;
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
}
.el-dialog__body {
  padding: 15px 20px;
}
</style>
