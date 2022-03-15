<template>
  <div class="temporaryChargeItem">
    <header class="header">
      <pay-item-header
        :showSortType="showSortType"
        @changeWyBuild="changeWyBuild"
      >
      </pay-item-header>
      <tool-list-box
        :showMenus="showMenus"
        :selectedUserData="selectedUserData"
        :handleSetting="handleSetting"
        @quickSearch="quickSearch"
        @changeRegion="changeRegion"
        @selectAllRefUser="selectAllRefUser"
        @copyAllItem="copyAllItem"
        @delAllItem="delAllItem"
      ></tool-list-box>
    </header>

    <main class="main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="客户临时项目定义" name="first">
          <user-item-table
            ref="userItemTable"
            :showMenus="showMenus"
            :topHeight="topHeight"
            :queryParams="queryParams"
            :userHtTotal="userHtTotal"
            :userTableData="userTableData"
            :handleSetting="handleSetting"
            :userTableLoading="userTableLoading"
            @userPageTurn="userPageTurn"
            @selectedRefUser="selectedRefUser"
            @handleAddPayItem="handleAddPayItem"
            @handleCurrentUser="handleCurrentUser"
            @handleSelection="handleSelection"
          ></user-item-table>
          <drag-area
            :mainHeight="mainHeight"
            :topHeight="topHeight"
            @changeHeight="changeHeight"
          ></drag-area>
          <select-tp-item
            :bottomHeight="bottomHeight"
            :selectedLsPayItems="selectedLsPayItems"
            :selectItemLoading="selectItemLoading"
            @addLsPayFeeItem="addLsPayFeeItem"
            @delLsPayFeeItem="delLsPayFeeItem"
            @selectUserLsItems="selectUserLsItems"
            @updateLsPayFeeItem="updateLsPayFeeItem"
          >
          </select-tp-item>
        </el-tab-pane>
        <el-tab-pane label="可选临时项目" name="second">
          <all-tp-item
            :payItemHeight="payItemHeight"
            :optionalLsItems="optionalLsItems"
          ></all-tp-item>
        </el-tab-pane>
      </el-tabs>
    </main>

    <section>
      <all-tp-item-dialog
        :payItemHeight="payItemHeight"
        :optionalLsItems="optionalLsItems"
        :lsPayItemVisible="lsPayItemVisible"
        @closeLsPayItems="closeLsPayItems"
        @selectedLsPayItemAdd="selectedLsPayItemAdd"
      ></all-tp-item-dialog>
      <bulk-action
        :bulkActionTitle="bulkActionTitle"
        :bulkActionVisible="bulkActionVisible"
        :bulkActionState="bulkActionState"
        @closeBulkAction="closeBulkAction"
        @submitCopyBulkAction="submitCopyBulkAction"
        @submitDelBulkAction="submitDelBulkAction"
      ></bulk-action>
    </section>

    <section>
      <l-progress
        :percentage="percentage"
        :dialogProgressVisible="dialogProgressVisible"
      ></l-progress>
    </section>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import {
  getChargeItem,
  getProgress,
  delProgress,
} from "@/api/system/payItemGeneral";
import {
  getAllLsItems,
  getUserLsItems,
  addUserLsItems,
  delUserLsItems,
  updateUserLsItems,
  batchUserLsItems
} from "@/api/system/lsPayItem";

import LProgress from "../components/LProgress.vue";

import DragArea from "@/components/DragArea/index.vue";
import AllTpItem from "./components/allTemporaryItem.vue";
import SelectTpItem from "./components/selectTemporaryItem.vue";
import AllTpItemDialog from "./components/allLsItemDialog.vue";

import BulkAction from "../chargeItem/components/BulkAction.vue";
import PayItemHeader from "../chargeItemEdit/components/editHeader.vue";
import ToolListBox from "../chargeItem/components/ToolListBox.vue";
import UserItemTable from "../chargeItem/components/UserItemTable.vue";

export default {
  components: {
    BulkAction,
    LProgress,
    PayItemHeader,
    ToolListBox,
    UserItemTable,
    SelectTpItem,
    AllTpItem,
    DragArea,
    AllTpItemDialog,
  },
  data() {
    return {
      selectedUserData: {},
      handleSetting: true,
      queryParams: {
        pageSize: 20,
        pageNum: 1,
      },
      mainHeight: {
        height: 0,
      },
      payItemHeight: {
        height: 0,
      },
      topHeight: {
        height: 0,
      },
      bottomHeight: {
        height: 0,
      },
      activeName: "first",
      selectItemLoading: false,
      userTableData: [],
      userHtTotal: 0,
      userTableLoading: false,
      showSortType: false,
      selectedLsPayItems: [],
      optionalLsItems: [],
      showMenus: false,
      getItemDataObj: {},
      addContractObj: {},
      lsPayItemVisible: false,

      bulkActionTitle: "",
      bulkActionVisible: false,
      bulkActionState: "copy",
      refLSYSIDList: [],
      selectRefUserList: [],
      percentage: 0,
      dialogProgressVisible: false
    };
  },
  created() {
    this.getMainHeight();
    this.getAllLsItems();
    window.addEventListener("resize", this.getMainHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.getMainHeight);
    // 离开页面销毁轮询器
    this.stopSetInterval();
  },
  methods: {
    // 实时获取上下两个区域的高度
    getMainHeight() {
      this.mainHeight.height = window.innerHeight - 365;
      this.payItemHeight.height = window.innerHeight - 365;
      this.topHeight.height = parseFloat(
        ((window.innerHeight - 365) * 0.67).toFixed(2)
      );
      this.bottomHeight.height = parseFloat(
        ((window.innerHeight - 365) * 0.33).toFixed(2)
      );
    },
    // 高度改变的处理
    changeHeight(val) {
      this.topHeight.height = val.topHieght;
      this.bottomHeight.height = val.bottomHieght;
    },
    changeWyBuild(val) {
      this.userTableLoading = true;
      this.selectedWyBuild = { ...val };
      this.getUserList(val);
    },
    // 获取所有的临时项目
    getAllLsItems() {
      getAllLsItems().then((res) => {
        this.optionalLsItems = [...res.data];
      });
    },
    // 获取当前的用户列表
    getUserList(val) {
      let getItemData = {
        wyid: val.propertyId,
        sortType: val.sortType,
        customerType: this.customerType,
        pageSize: this.queryParams.pageSize,
        pageNum: this.queryParams.pageNum,
      };
      if (val.allChecked) {
        getItemData.buildingId = null;
      } else {
        getItemData.buildingId = val.buildingId;
      }
      this.getItemDataObj = { ...getItemData };
      getChargeItem(getItemData).then((res) => {
        this.userTableData = [...res.data.records];
        this.userHtTotal = res.data.total;
        this.userTableLoading = false;
      });
    },
    // 翻页
    userPageTurn() {
      this.userTableLoading = true;
      this.getUserList(this.selectedWyBuild);
    },
    // 选中用户
    selectedRefUser(val) {
      console.log(val);
      this.selectedUserData = { ...val };
      this.$message.success(`已选定客户【${val.客户名称}】作为基本参照`);
      Cookies.set("refLSYSIDList", JSON.stringify(this.refLSYSIDList));
    },
    handleCurrentUser(val) {
      if (val === null) {
        this.selectedLsPayItems = [];
      } else {
        this.selectedUserInfo = val;
        this.selectedLsPayStandard(val.ID);
      }
    },
    selectedLsPayStandard(id) {
      this.selectItemLoading = true;
      getUserLsItems({ contractId: id }).then((res) => {
        this.selectItemLoading = false;
        let selectedLsPayItems = [...res.data];
        for (let i = 0; i < selectedLsPayItems.length; i++) {
          selectedLsPayItems[i].isEdit = false;
        }
        this.selectedLsPayItems = selectedLsPayItems;
      });
    },
    // 快速查询
    quickSearch() {},
    // 多选的处理
    handleSelection(val) {
      this.selectRefUserList = [...val];
    },
    // 修改客户类型
    changeRegion(val) {
      this.userTableLoading = true;
      this.customerType = val;
      this.getItemDataObj.customerType = val;
      this.getItemDataObj.propertyId = this.getItemDataObj.wyid;
      this.getUserList(this.getItemDataObj);
    },
    selectAllRefUser() {
      this.$refs.userItemTable.toggleSelection(this.userTableData);
    },
    // 成批复制 - dialog
    copyAllItem() {
      this.bulkActionTitle = "请进行复制确认";
      this.bulkActionState = "copy";
      this.bulkActionVisible = true;
    },
    // 成批删除 - dialog
    delAllItem() {
      this.bulkActionTitle = "请进行删除确认";
      this.bulkActionState = "del";
      this.bulkActionVisible = true;
    },
    // 关闭成批操作弹窗
    closeBulkAction() {
      this.bulkActionVisible = false;
    },
    // 提交批量操作
    // 复制的
    submitCopyBulkAction(val) {
      this.handleCopyItem(val);
    },
    handleCopyItem(val) {
      console.log(this.selectRefUserList)
      let selectRefUserList = this.selectRefUserList.map((item) => item.ID);
      this.taskKey = this.guid();
      let data = {
        taskkey: this.taskKey,
        refe_HTID: String(this.selectedUserData.ID),
        refe_XMIDList: this.refLSYSIDList.join(","),
        to_LYIDList: this.selectedWyBuild.allChecked
          ? ""
          : String(this.selectedWyBuild.buildingId),
        type: "copy",
      };
      if (!val) {
        // 否的处理
        data.to_HTIDList = "";
        console.log(data);
        this.operationChargeItemList(data);
        this.bulkActionVisible = false;
        this.$nextTick(() => {
          this.createSetInterval();
        });
      } else {
        // 是的处理
        data.to_HTIDList = selectRefUserList.join(",");
        console.log(data);
        this.operationChargeItemList(data);
        this.bulkActionVisible = false;
        this.$nextTick(() => {
          this.createSetInterval();
        });
      }
    },
    // 删除的
    submitDelBulkAction(val) {
      this.handleDelItem(val);
    },
    handleDelItem(val) {
      let selectRefUserList = this.selectRefUserList.map((item) => item.ID);
      this.taskKey = this.guid();
      let data = {
        taskkey: this.taskKey,
        refe_HTID: String(this.selectedUserData.ID),
        refe_XMIDList: this.refLSYSIDList.join(","),
        to_LYIDList: this.selectedWyBuild.allChecked
          ? ""
          : String(this.selectedWyBuild.buildingId),
        type: "del",
      };
      if (!val) {
        // 否的处理
        data.to_HTIDList = "";
        this.operationChargeItemList(data);
        this.bulkActionVisible = false;
        this.$nextTick(() => {
          this.createSetInterval();
        });
      } else {
        // 是的处理
        let delSelectList = [this.selectedUserData.ID, ...selectRefUserList];
        data.to_HTIDList = delSelectList.join(",");
        this.operationChargeItemList(data);
        this.bulkActionVisible = false;
        this.$nextTick(() => {
          this.createSetInterval();
        });
      }
    },
    // 批量的接口操作
    operationChargeItemList(data) {
      console.log(data);
      batchUserLsItems(data)
        .then((res) => {
          console.log(res);
        })
        .catch(() => {
          this.stopSetInterval();
        });
    },
    /** 获取 taskKey **/
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    // 批量操作时选中参照客户的参照项目list
    selectUserLsItems(val) {
      console.log(val)
      if (val && val.length > 0) {
        this.handleSetting = false;
        this.refLSYSIDList = val.map((e) => {
          return e.LSYSID;
        });
      } else {
        this.handleSetting = true;
      }
    },

    // 开始进度查询
    getNowProgress() {
      getProgress({ taskkey: this.taskKey }).then((res) => {
        if (res.data.taskvalue === "100") {
          this.percentage = Number(res.data.taskvalue);
          this.stopSetInterval();
          this.delNowProgress();
          this.$message.success("批量操作成功！");
        }
      });
    },
    // 结束进度查询
    delNowProgress() {
      delProgress({ taskkey: this.taskKey }).then((res) => {
        this.percentage = 0;
        this.getUserList(this.selectedWyBuild);
      });
    },
    // 开启轮询  如果存在则先销毁定时器后重新开启
    createSetInterval() {
      this.stopSetInterval();
      let _this = this;
      this.dialogProgressVisible = true;
      this.timer = setInterval(() => {
        _this.getNowProgress();
      }, 1000);
    },
    // 关闭轮询
    stopSetInterval() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
        this.dialogProgressVisible = false;
      }
    },

    // 新增临时项目
    addLsPayFeeItem(row) {
      this.addContractObj = {
        ID: row.LID,
      };
      this.lsPayItemVisible = true;
    },
    handleAddPayItem(row) {
      this.lsPayItemVisible = true;
      this.addContractObj = { ...row };
      console.log(this.addContractObj);
    },
    // 删除
    async delLsPayFeeItem(row) {
      await delUserLsItems({ lsysid: row.LSYSID });
      this.$message.success(`【${row.项目名称}】 删除成功！`);
      this.selectedLsPayStandard(row.LID);
    },
    // 修改
    async updateLsPayFeeItem(row) {
      let data = {
        lid: row.LID,
        lsysid: row.LSYSID,
        lsxmid: row.LSXMID,

        paySign: false, // 付清标志
        returnClearanceSign: false,
        amountPayable: Number(row.应交金额), // 应交金额
        amountOwedAndRefunded:
          parseFloat(row.应交金额) - parseFloat(row.已退金额), // 欠退金额（计算）
        应交币种: row.应交币种,
        payableCurrency: parseFloat(row.应交金额) - parseFloat(row.已交金额), // 欠交金额（计算）
        receivePaymentProjects: row.代收付项目,
        depositItem: row.押金项目,

        refundedAmount: row.已退金额,
        calculateFormula: row.计算公式,
        dueDate: row.应交日期,
        amountPaid: Number(row.已交金额),
        lateFeeRatio: row.滞纳金比例,
      };
      if (data.payableCurrency <= 0) data.paySign = true;
      if (data.amountOwedAndRefunded < 0) data.returnClearanceSign = true;
      await updateUserLsItems(data);
      this.$message.success(`【${row.项目名称}】 修改成功！`);
      this.selectedLsPayStandard(row.LID);
    },

    closeLsPayItems() {
      this.lsPayItemVisible = false;
    },
    // 新增项目的确定
    async selectedLsPayItemAdd(rows) {
      for (let i = 0; i < rows.length; i++) {
        await this.selectedOnePayItemAdd(rows[i]);
      }
      this.selectedLsPayStandard(this.addContractObj.ID);
    },
    // 新增收费项目单个
    async selectedOnePayItemAdd(row) {
      let data = {
        lid: this.addContractObj.ID, // LID
        depositItem: row.depositItem, // 押金项目
        receivePaymentProjects: row.receivePaymentProjects, // 代收付项目
        lateFeeRatio: row.lateFeeRatio, // 滞纳金比例
        lsxmid: row.tempFeeId,
        dueDate: this.getNowFormatDate(),
        paySign: true,
        returnClearanceSign: false,
      };
      return addUserLsItems(data).then(() => {
        this.$message.success(`[${row.name}] 添加成功！`);
        this.lsPayItemVisible = false;
      });
    },
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
  },
};
</script>

<style lang="scss" scoped>
.temporaryChargeItem {
  .header {
    width: 100%;
    margin-top: 20px;
  }
  .main {
    width: 100%;
    padding: 10px 30px 20px;
  }
}
</style>