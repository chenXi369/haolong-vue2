<template>
  <div>
    <article class="payFeeSetting">
      <header class="header">
        <h1 style="text-align: center; margin-bottom: 12px">物业收费设置</h1>
        <el-button
          type="primary"
          plain
          size="small"
          class="save-btn"
          @click="saveUpdateWy"
          icon='el-icon-success'
          >保 存</el-button
        >
      </header>
      <main class="main">
        <section class="leftTree">
          <wy-tree
            :contentStyleObj="contentStyleObj"
            :hiddenBuilding="hiddenBuilding"
            @changeShow="changeShow"
            @transWidth="transWidth"
          >
          </wy-tree>
        </section>
        <section
          v-if="bankInfoVisible"
          :style="tableContStyle"
          class="main-right"
        >
          <payFee-info
            :loading="loading"
            :contentStyleObj="contentStyleObj"
            :wyPayFeeSettingForm="wyPayFeeSettingForm"
            @handleSettleDay="handleSettleDay"
            @handleCollectDay="handleCollectDay"
          ></payFee-info>
        </section>
      </main>
    </article>
  </div>
</template>

<script>
import { pageLayout } from "@/mixins/pageLayout";
import { checkWy, updateWy } from "@/api/system/houseRes";

import WyTree from "../components/wyTree.vue";
import PayFeeInfo from "./components/payFeeInfo.vue";

export default {
  mixins: [pageLayout],
  components: {
    WyTree,
    PayFeeInfo,
  },
  data() {
    return {
      loading: false,
      showTable: false,
      showDialog: false,
      bankInfoVisible: false,
      hiddenBuilding: true,
      selectedWyInfo: {},
      wyPayFeeSettingForm: {},
    };
  },
  methods: {
    // 显示银行设置信息
    changeShow(e) {
      this.selectedWyInfo = { ...e.node };
      this.bankInfoVisible = e.value;
      this.getCheckWy();
    },
    // 获取对应物业下的信息
    getCheckWy() {
      this.loading = true;
      checkWy({ propertyId: this.selectedWyInfo.propertyId }).then((res) => {
        this.loading = false;
        this.wyPayFeeSettingForm = { ...res.data };
      });
    },
    transWidth(val) {
      this.tableContStyle.width =
        document.querySelector(".payFeeSetting").clientWidth - val - 54 + "px";
    },
    handleSettleDay() {
      this.wyPayFeeSettingForm.closeAccountsBD = -1;
      this.wyPayFeeSettingForm.checkoutED = -1;
    },
    handleCollectDay() {
      this.wyPayFeeSettingForm.collectionBD = -1;
      this.wyPayFeeSettingForm.collectionED = -1;
    },
    saveUpdateWy() {
      let data = {
        propertyId: this.selectedWyInfo.propertyId,
        ...this.wyPayFeeSettingForm,
      };
      updateWy(data).then(() => {
        this.$message.success(
          `${this.selectedWyInfo.label} 收费设置保存成功！`
        );
        this.getCheckWy()
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.payFeeSetting {
  position: relative;
  .header {
    position: relative;
    padding: 10px 30px 0px;
    .save-btn {
      position: absolute;
      right: 20px;
      bottom: 2px;
    }
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
    .main-right {
      margin-top: 20px;
      border-radius: 4px;
    }
  }
}
.el-dialog__body {
  padding: 15px 20px;
}
</style>
