<template>
  <div class="chargeItemEdit">
    <header class="header">
      <edit-header
        :showSortType="showSortType"
        @changeWyBuild="changeWyBuild"
      ></edit-header>
      <edit-box-tool
        ref="EditBoxTool"
        :total="total"
        :exportLoading="exportLoading"
        @quickSearch="quickSearch"
        @batchUpdateDate="batchUpdateDate"
        @batchUpdateOther="batchUpdateOther"
        @exportExcelTable="exportExcelTable"
        @exportFileName="exportFileName"
        @handleBankPayInfoUpdate="handleBankPayInfoUpdate"
      ></edit-box-tool>
    </header>
    <main class="main">
      <pay-item-edit-main
        :total="total"
        :loading="loading"
        :mainHeight="mainHeight"
        :queryParams="queryParams"
        :optionalChargeItems="optionalChargeItems"
        @saveUpdatePayItem="saveUpdatePayItem"
        @getTurnPage="getTurnPage"
        @delUserHtItem="delUserHtItem"
      ></pay-item-edit-main>
    </main>
    <section>
      <batch-update-dialog
        ref="batchUpdateDialog"
        :batchUpdateIndex="batchUpdateIndex"
        :batchUpdateVisible="batchUpdateVisible"
        @closeBatchUpdate="closeBatchUpdate"
        @confirmBatchUpdateDate="confirmBatchUpdateDate"
        @confirmBatchUpdateOther="confirmBatchUpdateOther"
      ></batch-update-dialog>
      <other-batch-dialog
        :batchUpdateIndex="batchUpdateIndex"
        :slectedUserQuery="slectedUserQuery"
        :otherBatchUpdateInfo="otherBatchUpdateInfo"
        :otherBatchUpdateVisible="otherBatchUpdateVisible"
        @confirmOtherBatch="confirmOtherBatch"
        @closeOtherBatch="closeOtherBatch"
      ></other-batch-dialog>
    </section>
  </div>
</template>

<script>
import {
  getChageItems,
  batchUpdateTime,
  batchUpdateBankCode,
  batchSupplyBankInfo,
  exportFile,
  reportExcel,
} from "@/api/system/payItemEdit";
import {
  addChargeStandard,
  delChargeStandard,
} from "@/api/system/payItemGeneral";

import EditHeader from "./components/editHeader.vue";
import EditBoxTool from "./components/editBoxTool.vue";
import PayItemEditMain from "./components/payItemEditMain.vue";
import BatchUpdateDialog from "./components/batchUpdateDialog.vue";
import OtherBatchDialog from "./components/otherBatchDialog.vue";

export default {
  data() {
    return {
      slectedUserQuery: {},
      loading: false,
      mainHeight: {
        height: 0,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      optionalChargeItems: [],
      batchUpdateIndex: 0,
      batchUpdateVisible: false,

      otherBatchUpdateInfo: {},
      otherBatchUpdateVisible: false,
      fuzzySearch: "",
      exportLoading: false,
      showSortType: true,
      interval: null
    };
  },
  components: {
    EditHeader,
    EditBoxTool,
    PayItemEditMain,
    BatchUpdateDialog,
    OtherBatchDialog,
  },
  activated() {},
  created() {
    this.getMainHeight();
    window.addEventListener("resize", this.getMainHeight);
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
    window.removeEventListener("resize", this.getMainHeight);
  },
  methods: {
    // 实时获取屏幕高度
    getMainHeight() {
      this.mainHeight.height = window.innerHeight - 312;
    },
    changeWyBuild(row) {
      this.loading = true;
      this.exportLoading = true;
      this.slectedUserQuery = { ...row };
      let query = {
        wyid: row.propertyId,
        projectType: row.itemState,
        sortType: row.sortType,
        typeId: row.itemName,
        fuzzySearch: this.fuzzySearch,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      if (row.allChecked) {
        query.buildingId = null;
      } else {
        query.buildingId = row.buildingId;
      }
      getChageItems(query).then((res) => {
        this.loading = false;
        this.exportLoading = false;
        this.total = res.data.total;
        let optionalChargeItem = [...res.data.records];
        for (let i = 0; i < optionalChargeItem.length; i++) {
          optionalChargeItem[i].isEdit = false;
        }
        this.optionalChargeItems = optionalChargeItem;
      });
    },
    quickSearch(val) {
      this.fuzzySearch = val;
      this.changeWyBuild(this.slectedUserQuery);
    },
    batchUpdateDate(i) {
      this.batchUpdateIndex = i;
      this.batchUpdateVisible = true;
    },
    // 批量更新
    confirmBatchUpdateDate(row) {
      const h = this.$createElement;
      this.$confirm("", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "info",
        title: "提示",
        closeOnClickModal: false,
        message: h("div", null, [
          h("p", null, `当前物业：【${this.slectedUserQuery.propertyName}】`),
          h("p", null, `当前楼栋：【${this.slectedUserQuery.buildingName}】`),
          h(
            "p",
            null,
            `${
              ["收费项目", "计费项目", "【全部项目】"][
                this.slectedUserQuery.itemState
              ]
            }${
              this.slectedUserQuery.itemState === 2
                ? ""
                : `：【${this.slectedUserQuery.chargeItemName}】`
            }`
          ),
          h(
            "p",
            { style: "padding-top: 12px" },
            `一定要将【${
              Object.keys(row)[0] === "startTime" ? "开始日期" : "结束日期"
            }】更新为${Object.values(row)[0]}?`
          ),
        ]),
      })
        .then(() => {
          let data = {
            wyid: this.slectedUserQuery.propertyId,
            projectType: this.slectedUserQuery.itemState,
            typeId: this.slectedUserQuery.itemName,
            buildingId: this.slectedUserQuery.allChecked
              ? null
              : this.slectedUserQuery.buildingId,
            ...row,
          };

          batchUpdateTime(data).then(() => {
            this.batchUpdateVisible = false;
            this.changeWyBuild(this.slectedUserQuery);
            this.$message.success(
              `${
                Object.keys(row)[0] === "startTime" ? "开始日期" : "结束日期"
              }批量更新成功！`
            );
            this.$refs.batchUpdateDialog.clearBatchForm();
          });
        })
        .catch(() => {
          console.log("用户点击取消");
        });
    },
    batchUpdateOther(i) {
      this.batchUpdateIndex = i;
      this.batchUpdateVisible = true;
    },
    // 批量修改银行代码和托收代码
    confirmBatchUpdateOther(row) {
      this.otherBatchUpdateInfo = { ...row };
      this.otherBatchUpdateVisible = true;
    },
    // 关闭批量更新
    closeBatchUpdate() {
      this.batchUpdateVisible = false;
    },
    confirmOtherBatch(val) {
      let data = {
        propertyId: this.slectedUserQuery.propertyId,
        buildingId: !val ? null : this.slectedUserQuery.buildingId,
        type: this.batchUpdateIndex - 1,
        bankCode: null,
        headOfficeCode: null,
        newBankCode: null,
        newHeadOfficeCode: null,
      };
      if (data.type === 1) {
        data.bankCode =
          this.otherBatchUpdateInfo.bankCode == undefined
            ? ""
            : this.otherBatchUpdateInfo.bankCode;
        data.newBankCode =
          this.otherBatchUpdateInfo.newBankCode == undefined
            ? ""
            : this.otherBatchUpdateInfo.newBankCode;
      } else if (data.type === 2) {
        data.headOfficeCode =
          this.otherBatchUpdateInfo.headOfficeCode == undefined
            ? ""
            : this.otherBatchUpdateInfo.headOfficeCode;
        data.newHeadOfficeCode =
          this.otherBatchUpdateInfo.newHeadOfficeCode == undefined
            ? ""
            : this.otherBatchUpdateInfo.newHeadOfficeCode;
      } else if (data.type === 4) {
        data.headOfficeCode =
          this.otherBatchUpdateInfo.headOfficeCode == undefined
            ? ""
            : this.otherBatchUpdateInfo.headOfficeCode;
        data.newBankCode =
          this.otherBatchUpdateInfo.newBankCode == undefined
            ? ""
            : this.otherBatchUpdateInfo.newBankCode;
      } else {
        data.bankCode =
          this.otherBatchUpdateInfo.bankCode == undefined
            ? ""
            : this.otherBatchUpdateInfo.bankCode;
        data.newHeadOfficeCode =
          this.otherBatchUpdateInfo.newHeadOfficeCode == undefined
            ? ""
            : this.otherBatchUpdateInfo.newHeadOfficeCode;
      }
      batchUpdateBankCode(data).then(() => {
        this.otherBatchUpdateVisible = false;
        this.batchUpdateVisible = false;
        this.changeWyBuild(this.slectedUserQuery);
        this.$message.success("更新完毕！");
        this.$refs.batchUpdateDialog.clearBatchForm();
      });
    },
    handleBankPayInfoUpdate() {
      let data = {
        propertyId: this.slectedUserQuery.propertyId,
        buildingId: null,
      };
      batchSupplyBankInfo(data).then((res) => {
        console.log(res.data);
      });
    },
    closeOtherBatch() {
      this.otherBatchUpdateVisible = false;
    },
    getTurnPage() {
      this.loading = true;
      this.changeWyBuild(this.slectedUserQuery);
    },
    // 删除单一项目
    delUserHtItem(row) {
      const h = this.$createElement;
      this.$confirm("警告", {
        message: h("p", null, [
          h("p", null, `客户名称：${row.客户名称}`),
          h("p", null, `确定要删除收费项目 [${row.项目名称}] 吗？`),
        ]),
        title: "请确认",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const delParams = {
            contractId: row.LID,
            chargeItemsId: row.ID,
          };
          return delChargeStandard(delParams);
        })
        .then(() => {
          this.changeWyBuild(this.slectedUserQuery);
          this.$message.success(`${row.项目名称} 删除成功`);
        });
    },
    // 修改单一项目
    saveUpdatePayItem(row) {
      let data = {
        type: "update",
        plateNumber: row.车牌号, // 车牌号
        meterNo: row.表号,
        chargingStandardId: row.BZID,
        monthFee: row.月费用,
        lateFeeRatio: row.滞纳金比例,
        fixedAmount: row.定额用量,
        meterReadDate: row.抄表日期,
        contractId: row.LID,
        baseNum: row.底数,
        valuationArea: row.计价面积,
        bankCollect: row.银行托收,
        miniAmount: row.最低用量,
        parentMeterNo: row.父表号,
        effective: row.有效性,
        magnification: row.倍率,
        endDate: row.结束日期 === null ? '' : row.结束日期,
        startDate: row.开始日期 === null ? '' : row.开始日期
      };
      addChargeStandard(data).then(() => {
        this.$message.success(`${row.项目名称} 修改成功！`);
        this.changeWyBuild(this.slectedUserQuery);
      });
    },
    // 导出table
    exportExcelTable() {
      this.exportLoading = true;
      let userQuery = this.slectedUserQuery;
      let exportTime = this.getNowFormatDate();
      let data = {
        wyid: userQuery.propertyId,
        projectType: userQuery.itemState,
        sortType: userQuery.sortType,
        buildingId: userQuery.allChecked ? null : userQuery.buildingId,
        typeId: userQuery.itemName,
        fuzzySearch: this.fuzzySearch,
        title: "深圳市好邻邦管理科技限公司",
        cTitle: `${["收费项目", "计费项目", "全部项目"][userQuery.itemState]}${
          userQuery.allChecked ? "" : "-" + userQuery.chargeItemName
        }`,
        lTitle: `${userQuery.propertyName}${
          userQuery.allChecked ? "" : "-" + userQuery.buildingName
        }`,
        rTitle: `导出时间: ${exportTime}`,
        tail: "",
      };
      reportExcel(data).then((res) => {
        this.exportLoading = false;
        window.location.href = res.data;
      });
    },
    // 导入文件
    exportFileName(fileData) {
      exportFile(fileData).then((res) => {
        this.$message.success('文件导入成功！')
        this.changeWyBuild(this.slectedUserQuery);
        this.$refs.EditBoxTool.successUpload(fileData.importKey)
        
        this.interval = setTimeout(() => {
          if(res.data && res.data.length > 0) {
            let routeUrl = this.$router.resolve({name: "CheckDataPage"}) 
            sessionStorage.setItem('hlbSAAS-errorData', JSON.stringify(res.data))
            window.open(routeUrl.href, '_blank')
          }
        }, 1000)
      }).catch(() => {
        this.$refs.EditBoxTool.successUpload(fileData.importKey)
      })
    },
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "/";
      let seperator2 = ":";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes();
      return currentdate;
    },
  },
};
</script>

<style lang="scss" scoped>
.chargeItemEdit {
  .header {
    width: 100%;
    margin-top: 20px;
  }
  .main {
    width: 100%;
    padding: 0px 30px 20px;
  }
}
.el-divider {
  margin: 12px 0;
}
</style>