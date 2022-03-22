<template>
  <div class="dosageCheck">
    <header class="header">
      <common-header
        :isCheckbox="isCheckbox"
        :isShowMuit="isShowMuit"
        :showChargeItem="showChargeItem"
        @changeWyBuild="changeWyBuild"
        @changeMultiSelect="changeMultiSelect"
      ></common-header>
      <dosage-tools
        :dosageUserTotal="dosageUserTotal"
        @showFinishUser="showFinishUser"
        @dosageCalPlusItem="dosageCalPlusItem"
      ></dosage-tools>
    </header>

    <main class="main">
      <dosage-user-table
        ref="dosageAllTab"
        :topHeight="topHeight"
        :queryParams="queryParams"
        :subTabLength="subTabLength"
        :dosageUserData="dosageUserData"
        :dosageUserTotal="dosageUserTotal"
        :dosageTableLoading="dosageTableLoading"
        @dblClick="dblClick"
        @updateAllTabRow="updateAllTabRow"
        @handleCurrentUser="handleCurrentUser"
      ></dosage-user-table>
      <drag-area
        :mainHeight="mainHeight"
        :topHeight="topHeight"
        @changeHeight="changeHeight"
      ></drag-area>
      <dosage-select-table
        ref="dosageSubTab"
        :bottomHeight="bottomHeight"
        :dosageSelectItems="dosageSelectItems"
        :dosageSelectLoading="dosageSelectLoading"
        @updateSubRow="updateSubRow"
        @subHandleSelect="subHandleSelect"
        @sublengthOverFlow="sublengthOverFlow"
      >
      </dosage-select-table>
    </main>
    <section>
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
import DragArea from "@/components/DragArea/index.vue";
import CommonHeader from "@/components/CommonHeader/index.vue";
import DosageTools from "./components/dosageTools.vue";
import DosageUserTable from "./components/dosageUserTable.vue";
import DosageSelectTable from "./components/dosageSelectTable.vue";
import ReminderArea from "@/components/Reminder/index.vue";

import {
  getSummary,
  updateSummary,
  getSubmeter,
  calPlusItem
} from "@/api/chargeManage/dosageUserTable";

export default {
  data() {
    return {
      isShowMuit: true,
      isCheckbox: true,
      showChargeItem: true,
      mainHeight: {
        height: 0,
      },
      // 组件的data
      topHeight: {
        height: 0,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      dosageUserData: [],
      dosageUserTotal: 0,
      dosageTableLoading: false,

      bottomHeight: {
        height: 0,
      },
      dosageSelectLoading: false,
      dosageSelectItems: [],
      timer: null,
      toolForm: {},
      subTabLength: 0,
      selectedAllTabRow: {},
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
      },

      // 提示的data
      dialogTitle: "",
      reminderVisible: false,
      reminder: {
        reminderTitle: null,
        reminderFooter: null,
        reminderContent: []
      },
      subIndex: 0
    };
  },
  components: {
    DragArea,
    CommonHeader,
    DosageTools,
    DosageUserTable,
    DosageSelectTable,
    ReminderArea
  },
  created() {
    this.getMainHeight();
    window.addEventListener("resize", this.getMainHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.getMainHeight);
    clearTimeout(this.timer)
  },
  methods: {
    // 实时获取屏幕高度
    getMainHeight() {
      this.mainHeight.height = window.innerHeight - 320;
      this.topHeight.height = parseFloat(
        ((window.innerHeight - 320) * 0.67).toFixed(2)
      );
      this.bottomHeight.height = parseFloat(
        ((window.innerHeight - 320) * 0.33).toFixed(2)
      );
    },
    // 拖拽组件的方法 - 给上下两个组件设置高度
    changeHeight(val) {
      this.topHeight.height = val.topHieght;
      this.bottomHeight.height = val.bottomHieght;
    },
    // 物业 楼栋 月份 项目切换触发的方法
    changeWyBuild(obj) {
      this.wyBuildData = { ...obj }
      this.getSummaryList(obj); // 获取总表的list
    },
    // 改变楼栋的单选多选
    changeMultiSelect(val) {
      this.isCheckbox = val;
    },
    // 获取总表
    getSummaryList(e) {
      this.dosageTableLoading = true;
      this.timer = setTimeout(() => {
        let data = {
          wyid: e.propertyId,
          projectType: e.itemState,
          sortType: this.toolForm.sortType === undefined ? 0: 
                      this.toolForm.sortType,
          buildingId: e.buildingId.toString(),
          typeId: e.itemName,
          fuzzySearch: !~~this.toolForm.searchVal ? '': this.toolForm.searchVal,
          fuzzyType: 0,
          showTerminationUser: this.toolForm.showFinishUser === undefined ? 1: 
                                this.toolForm.showFinishUser,
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
        };
        data.jfyf = e.selectMonth
        getSummary(data)
          .then((res) => {
            this.dosageUserData = this.arrSetEdit([...res.data.records]);
            this.dosageUserTotal = res.data.total;
            this.dosageTableLoading = false;
            this.dosageSelectItems = []
          }).then(() => {
            if(this.dosageUserData && this.dosageUserData.length > 0) {
              this.$refs.dosageAllTab.getFirstTabRow(this.dosageUserData[0])
            }
          })
      }, 500);
    },
    // 获取分表的list
    getSubmeterList(row) {
      if(row !== null) {
        let data = {
          ysid: row.ID,
        }
        getSubmeter(data).then((res) => {
          if(res.data !== undefined && res.data.length > 0) {
            this.dosageSelectItems = this.arrSetEdit([...res.data]);
            this.dosageUserData.map((item) => {
              item.isEdit = false
            })
            this.$refs.dosageSubTab.getSubSelectRow(this.dosageSelectItems[this.subIndex]);
          } else {
            this.subIndex = 0
            this.dosageSelectItems = []
            let selectIdx = this.dosageUserData.findIndex(item => 
              item.ID === row.ID
            )
            this.dosageUserData = this.arrSetEdit([...this.dosageUserData])
            this.$set(this.dosageUserData[selectIdx], 'isEdit', true)
          }
          this.dosageSelectLoading = false
          this.subTabLength = this.dosageSelectItems.length
        })
      }
    },
    // 修改分表的选中状态
    subHandleSelect(row) {
      this.dosageSelectItems = this.arrSetEdit([...this.dosageSelectItems])
      const selectSubIdx = this.dosageSelectItems.findIndex(item => {
        return item.FJXMID === row.FJXMID
      })
      this.$set(this.dosageSelectItems[selectSubIdx], 'isEdit', true)
    },
    // 设置可编辑状态
    arrSetEdit(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].isEdit = false;
      }
      return arr;
    },
    // 总表单选选中
    handleCurrentUser(row) {
      console.log(this.dosageUserData)
      this.selectedAllTabRow = {...row}
      this.getSubmeterList(row)
    },
    // 总表双击行的处理
    dblClick() {
      this.dosageSelectItems = this.arrSetEdit(this.dosageSelectItems);
    },
    // 分表长度溢出  切换到总表下一行
    sublengthOverFlow() {
      this.$refs.dosageAllTab.toNextRow()
    },
    // 显示止约客户
    showFinishUser(obj) {
      this.toolForm = { ...obj }
      this.getSummaryList(this.wyBuildData)
    },
    // 修改总表数据
    updateAllTabRow(total) {
      let sumData = {...total.data}
      updateSummary(sumData).then((res) => {
        let sumTableData = {...res.sumTable, isEdit: false}
        this.$set(this.dosageUserData, total.selectIdx, sumTableData)
        if(!total.type) {
          // 回车的处理
          this.$refs.dosageAllTab.judgeLength(total.selectIdx)
        } else {
          // tab的处理
          this.$set(this.dosageUserData[total.selectIdx], 'isEdit', true)
        }
      })
    },
    // 修改分表
    updateSubRow(total) {
      let subData = {...total.data, sumTable: this.selectedAllTabRow}
      updateSummary(subData).then((res) => {
        let subIndex = this.dosageUserData.findIndex(item => {
          return item.ID === this.selectedAllTabRow.ID
        })
        let sumTableData = {...res.sumTable, isEdit: false}
        this.$set(this.dosageUserData, subIndex, sumTableData)
        this.$refs.dosageAllTab.handleSelectedRow(sumTableData)
        if(!total.type) {
          this.subIndex = ++subIndex
          this.dosageSelectItems[total.selectIdx] = res.subTable[total.selectIdx]
          this.$refs.dosageSubTab.judgeLength(total.selectIdx)
        } else {
          this.$set(this.dosageSelectItems, total.selectIdx, {...res.subTable[total.selectIdx]})
          this.$set(this.dosageSelectItems[total.selectIdx], 'isEdit', true)
        }
      })
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
    // 根据类型分别送值
    getCalPlusItem(type, val) {
      switch (type) {
        case 'wy':
          this.calPlusItemData.WYID = this.wyBuildData.propertyId
          this.calPlusItemData.XMFlag = !val ? 0 : !this.wyBuildData.itemState ? 1: 2
          this.getCalPlusData(val, this.wyBuildData.itemState)
          break;
        case 'build':
          this.calPlusItemData.LYID = this.wyBuildData.buildingId.join(',')
          this.calPlusItemData.XMFlag = !val ? 3 : !this.wyBuildData.itemState ? 4: 5
          this.getCalPlusData(val, this.wyBuildData.itemState)
          break;
        case 'user':
          this.calPlusItemData.LID = this.selectedAllTabRow.LID
          this.calPlusItemData.XMFlag = !val ? 6 : !this.wyBuildData.itemState ? 7: 8
          this.getCalPlusData(val, this.wyBuildData.itemState)
          break;
        default:
          break;
      }
    },
    getCalPlusData(val, type) {
      if(!!val) {
        !!type ? this.calPlusItemData.JFID = this.wyBuildData.itemName :
          this.calPlusItemData.BZID = this.wyBuildData.itemName
      }
    },
    // 计算附加费
    dosageCalPlusItem(data) {
      this.getRemindType(data.type, data.val)
      this.reminderVisible = true
      this.dialogTitle = "附加项目的费用计算"
      this.reminder.reminderFooter = "确定要开始计算？"
      this.resetObj(this.calPlusItemData)
      console.log(this.calPlusItemData)
      this.getCalPlusItem(data.type, data.val)
    },
    // 对象置空
    resetObj(obj) {
      Object.keys(obj).forEach(key => obj[key] = null)
    },
    getRemindType(type, val) {
      console.log(this.wyBuildData)
      let itemArr = ['收费项目', '计费项目']
      switch (type) {
        case 'wy':
          this.reminder.reminderTitle = `物业：【${this.wyBuildData.propertyName}】`
          this.reminder.reminderContent = 
            !val ? [`范围：【全部附加项目】`] : 
            [`范围：【${itemArr[this.wyBuildData.itemState]}】 【${this.wyBuildData.chargeItemName}】`]
          break;
        case 'build':
          this.reminder.reminderTitle = `楼栋：【${this.wyBuildData.buildingName}】`
          this.reminder.reminderContent = 
            !val ? [`范围：【全部附加项目】`] : 
            [`范围：【${itemArr[this.wyBuildData.itemState]}】 【${this.wyBuildData.chargeItemName}】`]
          break;
        case 'user':
          this.reminder.reminderTitle = `客户：【${this.selectedAllTabRow.客户名称}】`
          this.reminder.reminderContent = 
            !val ? [`范围：【全部附加项目】`] : 
            [`范围：【${itemArr[this.wyBuildData.itemState]}】 【${this.wyBuildData.chargeItemName}】`]
          break;
        default:
          break;
      }
    },
    // 计算附加费的确认操作
    confirmReminder() {
      // XMFlag 附加费的计算
      this.calPlusItemData.taskkey = this.guid()
      this.calPlusItemData.JFYF = this.selectMonth
      this.calPlusItemData.SysTest = 1
      calPlusItem(this.calPlusItemData).then(() => {
        this.$message.success('附加费计算完成！')
      })
      this.reminderVisible = false
    },
    // 计算附加费的取消操作
    closeReminder() {
      this.reminderVisible = false
    }
  }
};
</script>

<style lang="scss" scoped>
.dosageCheck {
  .header {
    margin-top: 20px;
  }
  .main {
    margin: 16px 24px;
  }
}
</style>