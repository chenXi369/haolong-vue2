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
        @showFinishUser="showFinishUser"
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
        @handleCurrentUser="handleCurrentUser"
      ></dosage-user-table>
      <drag-area
        :mainHeight="mainHeight"
        :topHeight="topHeight"
        @changeHeight="changeHeight"
      ></drag-area>
      <dosage-select-table
        :bottomHeight="bottomHeight"
        :dosageSelectItems="dosageSelectItems"
        :dosageSelectLoading="dosageSelectLoading"
        @sublengthOverFlow="sublengthOverFlow"
      >
      </dosage-select-table>
    </main>
  </div>
</template>

<script>
import DragArea from "@/components/DragArea/index.vue";
import CommonHeader from "@/components/CommonHeader/index.vue";
import DosageTools from "./components/dosageTools.vue";
import DosageUserTable from "./components/dosageUserTable.vue";
import DosageSelectTable from "./components/dosageSelectTable.vue";

import {
  getSummary,
  updateSummary,
  getSubmeter,
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
      subTabLength: 0
    };
  },
  components: {
    DragArea,
    CommonHeader,
    DosageTools,
    DosageUserTable,
    DosageSelectTable,
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
            console.log(this.dosageUserData);
            this.dosageUserTotal = res.data.total;
            this.dosageTableLoading = false;
          })
          .then(() => {
            if (this.dosageUserData && this.dosageUserData.length > 0) {
              this.dosageSelectLoading = true;
            } else {
              this.dosageSelectItems = []
            }
          });
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
          } else {
            this.dosageSelectItems = []
            this.dosageUserData.map((item) => {
              if(item.ID === row.ID) {
                item.isEdit = true
              } else {
                item.isEdit = false
              }
            })
          }
          this.dosageSelectLoading = false
          this.subTabLength = this.dosageSelectItems.length
        })
      }
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