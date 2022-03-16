<template>
  <div class="chargeItem">
    <header class="header">
      <wy-header
        @changeWyBuild="changeWyBuild"
        @changeSortType="changeSortType"
      >
      </wy-header>
      <tool-list-box
        :showMenus="showMenus"
        :selectedUserData="selectedUserData"
        :handleSetting="handleSetting"
        @quickSearch="quickSearch"
        @changeRegion="changeRegion"
        @toVistAndEdit="toVistAndEdit"
        @selectAllRefUser="selectAllRefUser"
        @copyAllItem="copyAllItem"
        @delAllItem="delAllItem"
      ></tool-list-box>
    </header>

    <main class="main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="客户收费项目定义" name="first">
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
            @createUserCol="createUserCol"
            @handleCurrentUser="handleCurrentUser"
            @computeUserItemPay="computeUserItemPay"
            @handleSelection="handleSelection"
          ></user-item-table>
          <drag-area
            :mainHeight="mainHeight"
            :topHeight="topHeight"
            @changeHeight="changeHeight"
          ></drag-area>
          <select-item-table
            :bottomHeight="bottomHeight"
            :selectedPayItems="selectedPayItems"
            :selectItemLoading="selectItemLoading"
            @addPayFeeItem="addPayFeeItem"
            @delPayFeeItem="delPayFeeItem"
            @updatePayFeeItem="updatePayFeeItem"
            @openManageRoom="openManageRoom"
            @selectUserItems="selectUserItems"
            @createUserFbItem="createUserFbItem"
            @createUserPay="createUserPay"
            @computedItemPay="computedItemPay"
            @cacnelUpdatePayFeeItem="cacnelUpdatePayFeeItem"
          >
          </select-item-table>
        </el-tab-pane>
        <el-tab-pane label="可选收费项目" name="second">
          <pay-item-table
            :payItemHeight="payItemHeight"
            :optionalChargeItems="optionalChargeItems"
            @createChargePay="createChargePay"
            @createChargeStrItem="createChargeStrItem"
            @createOtherChargePay="createOtherChargePay"
          ></pay-item-table>
        </el-tab-pane>
      </el-tabs>
    </main>

    <section>
      <pay-item-dialog
        :payItemHeight="payItemHeight"
        :payItemVisible="payItemVisible"
        :optionalChargeItems="optionalChargeItems"
        @closePayItems="closePayItems"
        @selectedPayItemAdd="selectedPayItemAdd"
      ></pay-item-dialog>
      <room-manage
        :loading="loading"
        :fbLoading="fbLoading"
        :roomManDialog="roomManDialog"
        :allHouseList="allHouseList"
        :selectedHouseList="selectedHouseList"
        :roomManageTitle="roomManageTitle"
        @saveUpdateFb="saveUpdateFb"
        @selectedHouse="selectedHouse"
        @closeRoomManage="closeRoomManage"
        @cancelSelectedHouse="cancelSelectedHouse"
      ></room-manage>
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

      <reminder-area
        :dialogTitle="dialogTitle"
        :reminderVisible="reminderVisible"
        @confirmReminder="confirmReminder"
        @closeReminder="closeReminder"
      >
        <template v-slot:reminderTitle>{{reminder.reminderTitle}}</template>
        <template v-slot:reminderContent>
          <p v-for="item in reminder.reminderContent" :key="item">{{item}}</p>
        </template>
        <template v-slot:reminderFooter>{{reminder.reminderFooter}}</template>
      </reminder-area>
    </section>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import {
  getChargeItem,
  allPayStandard,
  selectPayStandard,
  getUserPayItem,
  getUserAllPayItems,
  addChargeStandard,
  delChargeStandard,
  addChooseRoom,
  delChooseRoom,
  operationChargeItems,
  getProgress,
  delProgress,
  createRoomFbItem,
  getNewWyChargeMonth,
} from "@/api/system/payItemGeneral";

import { calPlusItem } from '@/api/chargeManage/dosageUserTable'

import LProgress from "../components/LProgress.vue";

import DragArea from "@/components/DragArea/index.vue";
import RoomManage from "./components/roomManage.vue";
import WyHeader from "@/components/WyHeader/index.vue";
import ToolListBox from "./components/ToolListBox.vue";
import PayItemTable from "./components/PayItemTable.vue";
import UserItemTable from "./components/UserItemTable.vue";
import PayItemDialog from "./components/PayItemDailog.vue";
import SelectItemTable from "./components/selectItemTable.vue";
import BulkAction from "./components/BulkAction.vue";
import ReminderArea from "@/components/Reminder/index.vue";

export default {
  data() {
    return {
      bulkActionTitle: "",
      bulkActionVisible: false,
      bulkActionState: "copy",
      labelWidth: "80px",
      activeName: "first",
      userTableData: [],
      selectedPayItems: [],
      optionalChargeItems: [],
      roomManageTitle: "",
      payItemVisible: false,
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
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      loading: false,
      roomManDialog: false,
      allHouseList: [],
      selectedHouseList: [],
      selectedUserData: {},
      userTableLoading: true,
      handleSetting: true,
      selectedWyBuild: {},
      selectItemLoading: false,
      addContractObj: {},
      selectedSetting: {},
      fbLoading: false,
      taskKey: 0,
      customerType: 3,
      getItemDataObj: {},
      refXMIDList: [],
      selectRefUserList: [],
      // 轮询定时器
      timer: null,
      percentage: 0,
      dialogProgressVisible: false,
      newWyChargeMonth: "",
      userHtTotal: 0,
      showMenus: true,

      // 提示的data
      dialogTitle: "",
      reminderVisible: false,
      reminder: {
        reminderTitle: null,
        reminderFooter: null,
        reminderContent: []
      },
      // 附加项目计算要传的值
      calPlusItemData: {
        taskkey: null,
        XMFlag: null,
        WYID: null,
        LYID: null,
        LID: null,
        JFID: null,
        BZID: null,
        JFYF: null,
        SysTest: 1
      }
    };
  },
  components: {
    LProgress,
    WyHeader,
    DragArea,
    RoomManage,
    ToolListBox,
    PayItemTable,
    UserItemTable,
    PayItemDialog,
    SelectItemTable,
    BulkAction,
    ReminderArea,
  },
  created() {
    this.getMainHeight();
    window.addEventListener("resize", this.getMainHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.getMainHeight);
    // 离开页面销毁轮询器
    this.stopSetInterval();
  },
  methods: {
    // 实时获取屏幕高度
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
    closePayItems() {
      this.payItemVisible = false;
    },
    // 新增项目的确定
    async selectedPayItemAdd(rows) {
      for (let i = 0; i < rows.length; i++) {
        await this.selectedOnePayItemAdd(rows[i]);
      }
      this.selectedPayStandard(this.addContractObj.ID);
    },
    // 新增收费项目单个
    async selectedOnePayItemAdd(row) {
      let data = {
        type: "add",
        lateFeeRatio: row.滞纳金比例, // 滞纳金比例
        fixedAmount: row.定额用量, // 定额用量
        contractId: this.addContractObj.ID, // LID
        effective: 1,
        valuationArea: this.addContractObj.计价面积, // 计价面积
        bankCollect: row.银行托收, // 银行托收
        miniAmount: row.最低用量, // 最低用量
        chargingStandardId: row.ID, // ID
        currency: row.币种, // 币种
      };
      return addChargeStandard(data).then(() => {
        this.$message.success(`${row.计费名称} 添加成功！`);
        this.payItemVisible = false;
      });
    },
    // 新增收费项目
    addPayFeeItem(row) {
      this.addContractObj = {
        ID: row.LID,
        计价面积: row.计价面积,
      };
      this.payItemVisible = true;
    },
    // 删除收费项目
    delPayFeeItem(row) {
      this.$confirm(`确认要删除收费项目 [${row.项目名称}] 吗?`, "警告", {
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
          this.selectedPayStandard(row.LID);
          this.$message.success("删除成功");
        });
    },
    updatePayFeeItem(row) {
      let data = {
        type: "update",
        plateNumber: row.车牌号, // 车牌号
        startDate: row.开始日期,
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
        endDate: row.结束日期,
        magnification: row.倍率,
      };
      addChargeStandard(data).then(() => {
        this.$message.success(`${row.项目名称} 修改成功！`);
        this.selectedPayStandard(row.LID);
      });
    },
    cacnelUpdatePayFeeItem(row) {
      this.selectedPayStandard(row.LID);
    },
    changeWyBuild(val) {
      this.userTableLoading = true;
      this.selectedWyBuild = { ...val };
      this.getUserList(val);
      this.getAllPayStandard(val);
      if (val.isGetWyChargeMonth) this.getWyChargeMonths(val.propertyId);
    },
    getWyChargeMonths(id) {
      getNewWyChargeMonth({ wyid: id }).then((res) => {
        this.newWyChargeMonth = res.msg;
      });
    },
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
    getAllPayStandard(val) {
      allPayStandard({ wyid: val.propertyId }).then((res) => {
        this.optionalChargeItems = [...res.data];
      });
    },
    // 快速查询
    quickSearch(val) {
      this.userTableLoading = true;
      let data = { fuzzySearch: val, ...this.getItemDataObj };
      getChargeItem(data).then((res) => {
        this.userTableData = [...res.data.records];
        this.userHtTotal = res.data.total;
        this.userTableLoading = false;
      });
    },
    // 修改排序方式
    changeSortType(val) {
      this.userTableLoading = true;
      this.getItemDataObj.sortType = val;
      this.getItemDataObj.propertyId = this.getItemDataObj.wyid;
      this.getUserList(this.getItemDataObj);
    },
    // 修改客户类型
    changeRegion(val) {
      this.userTableLoading = true;
      this.customerType = val;
      this.getItemDataObj.customerType = val;
      this.getItemDataObj.propertyId = this.getItemDataObj.wyid;
      this.getUserList(this.getItemDataObj);
    },
    // 已选收费项目里面的设置
    openManageRoom(row) {
      this.loading = true;
      this.selectedSetting = { ...row };
      this.roomManageTitle = `${row.项目名称}所属房间定义`;
      getUserAllPayItems({ contractId: row.LID }).then((res) => {
        this.allHouseList = [...res.data];
        this.roomManDialog = true;
        this.loading = false;
        if (this.allHouseList && this.allHouseList.length > 0) {
          this.fbLoading = true;
          this.getUserPayFbItems(row.ID);
        }
      });
    },
    // 获取当前房屋下的分表列表
    getUserPayFbItems(id) {
      getUserPayItem({ chargeItemsId: id }).then((res) => {
        let selectedHouseList = [...res.data];
        for (let i = 0; i < selectedHouseList.length; i++) {
          selectedHouseList[i].isEdit = false;
        }
        this.fbLoading = false;
        this.selectedHouseList = selectedHouseList;
      });
    },
    // 选定房屋 - 新增分表
    async selectedHouse(row) {
      for (let i = 0; i < row.length; i++) {
        await this.getSelectedHouse(row[i]).then(() => {
          this.getUserPayFbItems(this.selectedSetting.ID);
        });
      }
    },
    // 新增一个分表
    async getSelectedHouse(ele) {
      let addParams = {
        type: "add",
        valuationArea: ele.计价面积, // 计价面积
        areaFormula: ele.面积公式, // 面积公式
        subsidiaryArea2: ele.附属面积2, // 附属面积 2
        subsidiaryArea1: ele.附属面积1, // 附属面积 1
        insideArea: ele.套内面积, // 套内面积
        buildingArea: ele.建筑面积, // 建筑面积
        meterNo: this.selectedSetting.表号, // 表号
        meterName: ele.房号, // 表名
        houseListId: ele.ZFID, // ZFID
        chargeItemsId: this.selectedSetting.ID, // XMID
      };
      // 判断是否要加分表
      if (this.selectedHouseList && this.selectedHouseList.length <= 0) {
        return addChooseRoom(addParams).then(() => {
          this.$message.success("添加成功");
        });
      }
      let isAddFb = ~this.selectedHouseList.findIndex(
        (item) => item.ZFID === ele.ZFID
      );
      if (!isAddFb) {
        return addChooseRoom(addParams).then(() => {
          this.$message.success("添加成功");
        });
      }
      try {
        await this.$confirm(
          `大楼名称：${ele.大楼名称}，房号：${ele.房号}，该房号已经选定，仍要添加吗？`,
          "警告",
          {
            confirmButtonText: "是（Y）",
            cancelButtonText: "否（N）",
            type: "warning",
          }
        );
        return addChooseRoom(addParams).then(() => {
          this.$message.success("添加成功");
        });
      } catch (error) {
        console.log("用户取消");
        return Promise.resolve();
      }
    },
    // 分表的修改
    saveUpdateFb(row) {
      let updateParams = {
        type: "update",
        meterReadDate: row.抄表日期,
        meterNo: row.表号,
        effective: row.有效性,
        subsidiaryArea2: row.附属面积2,
        meterType: row.表类别,
        buildingArea: row.建筑面积,
        houseListId: row.ZFID,
        baseNum: row.底数,
        subsidiaryArea1: row.附属面积1,
        parentMeterNo: row.父表号,
        valuationArea: row.计价面积,
        chargeItemsId: row.XMID,
        magnification: row.倍率,
        areaFormula: row.面积公式,
        meterName: row.表名,
        insideArea: row.套内面积,
        fjxmid: row.FJXMID,
      };
      addChooseRoom(updateParams).then(() => {
        this.getUserPayFbItems(this.selectedSetting.ID);
        this.$message.success("修改成功");
      });
    },
    cancelSelectedHouse(row) {
      this.$confirm(`一定要取消选定的房间吗？`, "警告", {
        confirmButtonText: "是（Y）",
        cancelButtonText: "否（N）",
        type: "warning",
      })
        .then(() => {
          let delData = row.map((item) => {
            item.fjxmid = item.FJXMID;
            return item.fjxmid;
          });
          return delChooseRoom(delData);
        })
        .then(() => {
          this.getUserPayFbItems(this.selectedSetting.ID);
          this.$message.success("删除成功");
        });
    },
    closeRoomManage() {
      this.roomManDialog = false;
    },
    changeHeight(val) {
      this.topHeight.height = val.topHieght;
      this.bottomHeight.height = val.bottomHieght;
    },
    // 批量处理
    selectAllRefUser() {
      this.$refs.userItemTable.toggleSelection(this.userTableData);
    },
    handleSelection(val) {
      this.selectRefUserList = [...val];
    },
    // 成批复制
    copyAllItem() {
      this.bulkActionTitle = "请进行复制确认";
      this.bulkActionState = "copy";
      this.bulkActionVisible = true;
    },
    handleCopyItem(val) {
      let selectRefUserList = this.selectRefUserList.map((item) => item.ID);
      this.taskKey = this.guid();
      let data = {
        taskkey: this.taskKey,
        refe_HTID: String(this.selectedUserData.ID),
        refe_XMIDList: this.refXMIDList.join(","),
        to_LYIDList: this.selectedWyBuild.allChecked
          ? ""
          : String(this.selectedWyBuild.buildingId),
        type: "copy",
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
        data.to_HTIDList = selectRefUserList.join(",");
        console.log(data);
        this.operationChargeItemList(data);
        this.bulkActionVisible = false;
        this.$nextTick(() => {
          this.createSetInterval();
        });
      }
    },
    operationChargeItemList(data) {
      operationChargeItems(data)
        .then((res) => {
          console.log(res);
        })
        .catch(() => {
          this.stopSetInterval();
        });
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
    // 成批删除
    delAllItem() {
      this.bulkActionTitle = "请进行删除确认";
      this.bulkActionState = "del";
      this.bulkActionVisible = true;
    },
    handleDelItem(val) {
      let selectRefUserList = this.selectRefUserList.map((item) => item.ID);
      this.taskKey = this.guid();
      let data = {
        taskkey: this.taskKey,
        refe_HTID: String(this.selectedUserData.ID),
        refe_XMIDList: this.refXMIDList.join(","),
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
    // 选定参照客户
    selectedRefUser(val) {
      this.selectedUserData = { ...val };
      this.$message.success(`已选定客户【${val.客户名称}】作为基本参照`);
      Cookies.set("refXMIDList", JSON.stringify(this.refXMIDList));
    },
    handleAddPayItem(row) {
      this.addContractObj = { ...row };
      this.payItemVisible = true;
    },
    // 生成选定客户的应收款 --> type 1
    createUserCol(row) {
      this.$router.push({
        name: "ChangeAccount",
        params: {
          id: row.WYID,
          type: 1,
          htId: row.ID,
          username: row.客户名称
        }
      })
    },
    // 生成应收款 --> type 2
    createUserPay(row) {
      this.$router.push({
        name: "ChangeAccount",
        params: {
          id: this.selectedWyBuild.propertyId,
          itemName: `<${row.项目编号}> ${row.项目名称}`,
          type: 2,
          XMID: row.ID,
          username: this.selectedUserInfo.客户名称
        }
      })
    },
    // 生成选定项目的应收款 --> type 3 && 4
    createChargePay(row) {
      if(this.selectedWyBuild.allChecked) {
        this.$router.push({
          name: "ChangeAccount",
          params: {
            id: this.selectedWyBuild.propertyId,
            type: 3,
            BZID: row.ID,
            itemName: row.项目名称
          }
        })
      } else {
        this.$router.push({
          name: "ChangeAccount",
          params: {
            id: this.selectedWyBuild.propertyId,
            type: 4,
            BZID: row.ID,
            itemName: row.项目名称,
            LYID: this.selectedWyBuild.buildingId,
            buildName: this.selectedWyBuild.buildingName
          }
        })
      }
    },
    /** 计算附加费的确定 */ 
    confirmReminder() {
      // XMFlag 附加费的计算
      this.calPlusItemData.taskkey = this.guid()
      this.getCalPlusItem(this.calPlusItemData.XMFlag)
      this.calPlusItemData.JFYF = this.newWyChargeMonth
      calPlusItem(this.calPlusItemData).then(() => {
        this.$message.success('附加费计算完成！')
      })
      this.reminderVisible = false
    },
    // 关闭附加费的dialog
    closeReminder() {
      this.reminderVisible = false
    },
    // 根据类型分别送值
    getCalPlusItem(type) {
      switch (type) {
        case 0:
          this.calPlusItemData.WYID = this.selectedWyBuild.propertyId
          break;
        case 3:
          this.calPlusItemData.LYID = this.selectedWyBuild.buildingId
          break;
        default:
          break;
      }
    },
    // 对象置空
    resetObj(obj) {
      Object.keys(obj).forEach(key => obj[key] = null)
    },
    // 计算客户所有收费项目的附加费
    computeUserItemPay(row) {
      this.resetObj(this.calPlusItemData)
      this.calPlusItemData.XMFlag = 6
      this.calPlusItemData.LID = row.ID
      this.reminderVisible = true
      this.dialogTitle = "附加项目费用计算"
      this.reminder.reminderFooter = "确定要开始计算？"
      this.reminder.reminderTitle = `客户：【${row.客户名称}】`
      this.reminder.reminderContent = [`范围：【全部附加项目】    计费月份：【${this.newWyChargeMonth}】`]
    },
    // 计算选定项目的附加项目费用
    computedItemPay(row) {
      console.log(row)
      this.resetObj(this.calPlusItemData)
      this.calPlusItemData.XMFlag = 7
      this.calPlusItemData.LID = row.LID
      this.calPlusItemData.BZID = row.BZID
      this.reminderVisible = true
      this.dialogTitle = "附加项目费用计算"
      this.reminder.reminderFooter = "确定要开始计算？"
      this.reminder.reminderTitle = `客户：【${this.selectedUserInfo.客户名称}】`
      this.reminder.reminderContent = [`范围：【${row.项目名称}】    计费月份：【${this.newWyChargeMonth}】`]
    },
    // 计算当前物业或者楼栋的附加项目费用
    createOtherChargePay(row) {
      this.resetObj(this.calPlusItemData)
      this.calPlusItemData.XMFlag = this.selectedWyBuild.allChecked ? 3 : 0 
      this.reminderVisible = true
      this.dialogTitle = "附加项目费用计算"
      this.reminder.reminderFooter = "确定要开始计算？"
      if(this.selectedWyBuild.allChecked) {
        this.reminder.reminderTitle = `物业：【${this.selectedWyBuild.propertyName}】`
        this.reminder.reminderContent = [`范围：【${row.项目名称}】    计费月份：【${this.newWyChargeMonth}】`]
      } else {
        this.reminder.reminderTitle = `物业: 【${this.selectedWyBuild.propertyName}】`
        this.reminder.reminderContent = [`楼栋：【${this.selectedWyBuild.buildingName}】`,
          `范围：【${row.项目名称}】    计费月份：【${this.newWyChargeMonth}】`]
      }
    },

    /** 合同高亮选中 */ 
    handleCurrentUser(val) {
      if (val === null) {
        this.selectedPayItems = [];
      } else {
        this.selectedUserInfo = val;
        this.selectedPayStandard(val.ID);
      }
    },
    selectedPayStandard(id) {
      this.selectItemLoading = true;
      selectPayStandard({ contractId: id }).then((res) => {
        this.selectItemLoading = false;
        let selectedPayItems = [...res.data];
        for (let i = 0; i < selectedPayItems.length; i++) {
          selectedPayItems[i].isEdit = false;
        }
        this.selectedPayItems = selectedPayItems;
      });
    },
    userPageTurn() {
      this.userTableLoading = true;
      this.getUserList(this.selectedWyBuild);
    },
    // 去浏览编辑
    toVistAndEdit() {
      Cookies.set(
        "chargeItem_selectedWyBuild",
        JSON.stringify(this.selectedWyBuild)
      );
      this.$router.push({ name: "ChargeItemEdit" });
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
      )
    },
    // 批量操作时选中参照客户的参照项目list
    selectUserItems(val) {
      if (val && val.length > 0) {
        this.handleSetting = false;
        this.refXMIDList = val.map((e) => {
          return e.ID;
        });
      } else {
        this.handleSetting = true;
      }
    },
    async createUserFbItem(val) {
      let data = {
        wyid: this.selectedWyBuild.propertyId,
        chargeItemsId: val.ID,
        buildingId: 0,
        chargingStandardId: 0,
      };
      try {
        await this.$confirm(
          `一定要生成 ${this.selectedUserInfo.客户名称} [${val.项目名称}] 的分表项目吗？`,
          "警告",
          {
            confirmButtonText: "是（Y）",
            cancelButtonText: "否（N）",
            type: "warning",
          }
        );
        return createRoomFbItem(data).then(() => {
          this.$message.success("项目生成完成！");
        });
      } catch (error) {
        console.log("用户取消");
        return Promise.resolve();
      }
    },
    async createChargeStrItem(val) {
      let data = {
          chargingStandardId: val.ID,
        },
        name = "";
      if (this.selectedWyBuild.allChecked) {
        data.chargeItemsId = 0;
        data.buildingId = 0;
        (data.wyid = this.selectedWyBuild.propertyId),
          (name = this.selectedWyBuild.propertyName);
      } else {
        data.wyid = 0;
        data.chargeItemsId = 0;
        data.buildingId = this.selectedWyBuild.buildingId;
        name = this.selectedWyBuild.buildingName;
      }
      try {
        await this.$confirm(
          `一定要生成 ${name} [${val.项目名称}] 的分表项目吗？`,
          "警告",
          {
            confirmButtonText: "是（Y）",
            cancelButtonText: "否（N）",
            type: "warning",
          }
        );
        return createRoomFbItem(data).then(() => {
          this.$message.success("项目生成完成！");
        });
      } catch (error) {
        console.log("用户取消");
        return Promise.resolve();
      }
    },
    closeBulkAction() {
      this.bulkActionVisible = false;
    },
    // 复制的
    submitCopyBulkAction(val) {
      this.handleCopyItem(val);
    },
    // 删除的
    submitDelBulkAction(val) {
      this.handleDelItem(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.chargeItem {
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