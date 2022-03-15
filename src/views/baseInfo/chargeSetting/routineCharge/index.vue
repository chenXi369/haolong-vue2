<template>
  <article class="routineCharge" v-if="showTree">
    <header class="header">
      <el-row :gutter="24">
        <!-- 用户数据 -->
        <el-col>
          <el-col :span="16">
            <el-button
              plain
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="add()"
              >新增</el-button
            >
            <el-button
              plain
              type="warning"
              icon="el-icon-edit"
              size="mini"
              :disabled="propertyState === 1"
              @click="update()"
              >修改</el-button
            >
            <el-button
              plain
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="
                propertyState === 0 || propertyState === 1 || disabledBtn
              "
              @click="del()"
              >删除</el-button
            >
            <el-button
              plain
              type="success"
              icon="el-icon-search"
              size="mini"
              :disabled="
                propertyState === 0 ||
                propertyState === 1 ||
                disabledBtn ||
                nodeType === 3
              "
              @click="look()"
              >查看</el-button
            >
          </el-col>

          <el-col :span="8" type="flex" align="right">
            <el-button
              plain
              size="mini"
              type="primary"
              icon="el-icon-s-check"
              :disabled="nodeType !== 3"
              @click="check()"
            >
              {{ chargeContForm.auditMark === 0 ? "审核" : "反审核" }}
            </el-button>
          </el-col>
        </el-col>
      </el-row>
    </header>
    <main class="main">
      <section class="leftTree">
        <charge-Tree
          ref="chargeTree"
          :treeList="treeList"
          :showTree="showTree"
          :content-style-obj="contentStyleObj"
          @changeShow="changeShow"
          @transWidth="transWidth"
          @chargeItemOptions="chargeItemOptions"
        />
      </section>
      <section
        v-if="rightContVisible"
        :style="tableContStyle"
        style="margin-top: 20px; border-radius: 4px"
      >
        <section class="header-title">
          <h2 style="color: #666">收费标准</h2>
          <button
            v-if="chargeContForm.auditMark"
            class="checked-hover"
            style="top: 35px; right: 0px; z-index: 999; cursor: pointer"
          >
            <span>已审核</span>
          </button>
        </section>
        <charge-content
          v-if="rightContVisible"
          :isFooter="isFooter"
          :chargeItems="chargeItems"
          :chargeContForm="chargeContForm"
          :tableContStyle="tableContStyle"
          :contentStyleObj="contentStyleObj"
          :disableAreaBasis="disableAreaBasis"
          :computedLabel="computedLabel"
          :chargeContFormDisable="chargeContFormDisable"
          :projectOptions="projectOptions"
          @clearTabs="clearTabs"
          @pricingInput="pricingInput"
          @inputFormula="inputFormula"
          @calculateOne="calculateOne"
          @formulaThree="formulaThree"
          @changeMonths="changeMonths"
          @changeComputed="changeComputed"
          @changeAreaBasis="changeAreaBasis"
          @changeDatSource="changeDatSource"
          @changeDatSourceId="changeDatSourceId"
          @changeStartMonth="changeStartMonth"
          @changeEndMonth="changeEndMonth"
          @changeStartDay="changeStartDay"
          @checkEquation="checkEquation"
        >
        </charge-content>
      </section>
    </main>

    <footer class="footer" v-show="isFooter">
      <el-button
        plain
        type="primary"
        size="mini"
        icon="el-icon-folder-checked"
        @click="confirm"
      >
        确 认
      </el-button>
      <el-button plain size="mini" icon="el-icon-arrow-left" @click="cancel">
        取 消
      </el-button>
    </footer>
    <template v-if="dialogFormVisible">
      <charge-dialog
        :title="title"
        :chargeForm="chargeForm"
        :chargeItemsNo="chargeItemsNo"
        :disableDialog="disableDialog"
        :dialogFormVisible="dialogFormVisible"
        @clearDialog="clearDialog"
        @closeDialog="closeDialog"
        @submitChargeForm="submitChargeForm"
      ></charge-dialog>
    </template>
  </article>
</template>

<script>
import ChargeTree from "./components/chargeTree";

import {
  addChargeItem,
  delChargeItem,
  updateChargeItem,
  getChargeItem,
  ChargeAllItem,
  getChargeStand,
  addChargeStand,
  delChargeStand,
  updateChargeStand,
} from "@/api/system/commonCharge";
import { Loading } from "element-ui";
import { getWyList } from "@/api/system/houseRes";
import { ExpCalculate } from "@/api/system/rentContract";

import Vue from "vue";
const ChargeDialog = Vue.component("charge-dialog", function (resolve) {
  setTimeout(function () {
    require([
      /* webpackChunkName: "chargeDialog" */ "./components/chargeDialog",
    ], resolve);
  }, 1000);
});

export default {
  data() {
    return {
      title: "",
      chargeForm: {},
      chargeContForm: {},
      chargeItems: [],
      projectOptions: [],
      chargeItemsNo: [],
      contentStyleObj: {
        height: "",
      },
      tableContStyle: {
        width: "",
      },
      disableDialog: false,
      dialogFormVisible: false,

      selectedNode: 0,
      propertyState: 0,
      disableAreaBasis: true,
      computedLabel: "hidden",
      disabledBtn: true,
      nodeType: 0,
      rightContVisible: false,
      chargeContFormDisable: true,
      isFooter: false,
      contentFormState: "",
      selectMonths: [],
      selectSourceOptions: {},
      treeList: [],
      showTree: false,
    };
  },
  components: {
    ChargeTree,
    ChargeDialog,
    "charge-content": () =>
      import(
        /* webpackChunkName: "chargeContent" */ "./components/chargeContent"
      ),
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.getWidth();
    this.getChargeItems();
    this.getCategorylist();

    this.$set(this.chargeForm, "category", 0);
  },
  mounted() {
    Loading.service({ fullscreen: true });
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    //获取一级节点
    getCategorylist() {
      getWyList().then((res) => {
        let newTreeList = [];
        this.getWySimpleTree([...res.data], newTreeList);
        this.treeList = newTreeList;
        this.showTree = true;
        let loadingInstance = Loading.service({ fullscreen: true });
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      });
    },
    getWySimpleTree(treeList, newTreeList) {
      treeList.map((c) => {
        let tempData = {
          propertyName: c.propertyName,
          propertyId: c.propertyId,
          propertyState: 1,
        };
        newTreeList.push(tempData);
      });
    },
    // 实时获取屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 250 + "px";
    },
    // 实时获取屏幕宽度
    getWidth() {
      this.tableContStyle.width = window.innerWidth - 540 + "px";
    },
    // 改变el-tree的div宽度继而改变table的div宽度
    transWidth(val) {
      this.tableContStyle.width =
        document.querySelector(".routineCharge").clientWidth - val - 54 + "px";
    },
    getChargeItems() {
      ChargeAllItem().then((res) => {
        this.chargeItems = [...res.data];
        this.chargeItemsNo = this.chargeItems.map((item) => {
          return item.no;
        });
      });
    },
    changeShow(val) {
      this.selectedNode = val.node.propertyId;
      this.propertyState = val.node.propertyState;
      this.nodeType =
        val.node.nodeType === undefined ? undefined : val.node.nodeType;
      if (Object.prototype.hasOwnProperty.call(val.node, "buildingList")) {
        this.disabledBtn = true;
      } else {
        this.disabledBtn = false;
      }
      if (this.nodeType === 3) {
        this.rightContVisible = true;
        this.getChargeStand(this.selectedNode);
      } else {
        this.rightContVisible = false;
      }
    },
    getChargeItem() {
      getChargeItem({ billingItemsId: this.selectedNode }).then((res) => {
        this.chargeForm = { ...res.data };
      });
    },
    getChargeStand(id) {
      getChargeStand({ chargingStandardId: id }).then((res) => {
        this.chargeContForm = { ...res.data };
        if (res.data.sourceId === 0) {
          this.chargeContForm.sourceId = undefined;
        }
        let str = this.chargeContForm.specifyMonth;
        let index = str.indexOf("1");
        let num = 0;
        const monthOptions = [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ];
        const newMonths = [];
        while (index !== -1) {
          newMonths.push(monthOptions[index]);
          num++; //记录出现的次数
          index = str.indexOf("1", index + 1);
        }
        this.chargeContForm.specifyMonth = newMonths;

        // 来源说明和来源id
        this.selectSourceOptions = this.projectOptions.find((item) => {
          return item.chargingStandardId === this.chargeContForm.sourceId;
        });
        this.changeSourceState(this.selectSourceOptions);
        this.changeComputed(this.chargeContForm.valuationMethod);
      });
    },
    changeSourceState(val) {
      switch (this.chargeContForm.datSource) {
        case 0:
          this.chargeContForm.sourceState = "";
          break;
        case 1:
          this.chargeContForm.sourceState = `数据来源于项目[ [${val.no}] ${val.projectName} ]的用量。`;
          break;
        case 2:
          this.chargeContForm.sourceState = `数据来源于项目[ [${val.no}] ${val.projectName} ]的基本费。`;
          break;
        case 3:
          this.chargeContForm.sourceState = "按照项目的上次费用收取。";
          break;
        case 4:
          this.chargeContForm.sourceState = "费用来源于导入文件。";
          break;
        case 5:
          this.chargeContForm.sourceState =
            "来源项目的参数将参与本项目的计算。";
          break;
        case 6:
          this.chargeContForm.sourceState = `费用依据项目[ [${val.no}] ${val.projectName} ]的结转费用抵扣情况计算。`;
          break;
        case 7:
          this.chargeContForm.sourceState = `变量规则：[项目标志+量费价标志+项目代码]。第一位：S为收费项目，J为计费项目；第二位：L为用量，F为费用，J为单价。如编号0201电费变量名为[SF0201]。SD_DFXS为计算有功无功电费系数的固定函数。变量和固定函数采用一对‘[]’区分，如 [SD_DFXS]。`;
          break;
        default:
          this.chargeContForm.sourceState = "";
          break;
      }
    },
    chargeItemOptions(val) {
      this.projectOptions = val;
    },
    // 审核和反审核
    check() {
      // reviewer  审核人
      // auditMark  审核标志
      let data = {
        auditMark: this.chargeContForm.auditMark === 0 ? 1 : 0,
        chargingStandardId: this.selectedNode,
      };
      this.$confirm(
        `一定要进行【${
          this.chargeContForm.auditMark === 0 ? "审核" : "反审核"
        }】吗?`,
        "警告",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确认",
          type: "warning",
        }
      )
        .then(() => {
          return updateChargeStand(data);
        })
        .then(() => {
          this.$message.success(
            `${this.chargeContForm.auditMark === 0 ? "审核" : "反审核"}成功！`
          );
          this.getChargeStand(this.selectedNode);
        });
    },
    // 新增
    add() {
      if (this.nodeType === 2) {
        this.chargeContForm = {};
        this.isFooter = true;
        this.rightContVisible = true;
        this.dialogFormVisible = false;
        this.chargeContFormDisable = false;
        this.contentFormState = "新增";
      } else if (this.nodeType === 3) {
        this.$confirm(`增加的新标准?`, "警告", {
          cancelButtonText: "取消",
          confirmButtonText: "确认",
          type: "warning",
        }).then(() => {
          this.chargeContForm = {};
          this.isFooter = true;
          this.rightContVisible = true;
          this.dialogFormVisible = false;
          this.chargeContFormDisable = false;
          this.contentFormState = "新增";
        });
      } else {
        this.chargeForm = {};
        this.disableDialog = false;
        this.rightContVisible = false;
        this.dialogFormVisible = true;
        this.chargeContFormDisable = false;
      }
      this.title = "计费项目-新增";
    },
    // 修改
    update() {
      if (this.nodeType === 2) {
        this.rightContVisible = false;
        this.dialogFormVisible = true;
        this.disableDialog = false;
        this.getChargeItem();
        this.title = "计费项目-修改";
      } else if (this.nodeType === 3) {
        if (this.chargeContForm.auditMark === 0) {
          this.isFooter = true;
          this.rightContVisible = true;
          this.dialogFormVisible = false;
          this.chargeContFormDisable = false;
          this.contentFormState = "修改";
        } else {
          this.$message.info("审核过的收费标准无法进行修改操作");
        }
      }
    },
    look() {
      this.getChargeItem();
      this.dialogFormVisible = true;
      this.disableDialog = true;
      this.title = "计费项目";
    },
    // 删除
    del() {
      this.$confirm(`是否要删除选定的物业项目?`, "警告", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          let query = {};
          if (this.nodeType === 2) {
            query.billingItemsId = this.selectedNode;
            return delChargeItem(query);
          } else if (this.nodeType === 3) {
            query.chargingStandardId = this.selectedNode;
            return delChargeStand(query);
          }
        })
        .then(() => {
          this.$message.success(`删除成功！`);
        });
    },
    // 清除计费项目的归类统计
    clearDialog() {
      this.$set(this.chargeForm, "statisticsCategory", null);
    },
    // 关闭计费项目
    closeDialog() {
      this.dialogFormVisible = false;
    },
    // 提交计费项目的form
    submitChargeForm(val) {
      // 修改和新增的处理
      if (this.title === "计费项目-新增") {
        addChargeItem(val).then(() => {
          this.$message.success("新增计费项目成功！");
          this.dialogFormVisible = false;
        });
      } else {
        this.chargeItems.chargingStandardId = this.selectedNode;
        updateChargeItem(val).then(() => {
          this.$message.success("修改计费项目成功！");
          this.dialogFormVisible = false;
        });
      }
    },
    clearTabs(val) {
      if (val === 1) {
        if (this.chargeContForm.sourceId !== 0) {
          this.$confirm(`确定要清除来源项目指定吗?`, "警告", {
            cancelButtonText: "取消",
            confirmButtonText: "确认",
            type: "warning",
          }).then(() => {
            this.$set(this.chargeContForm, "sourceId", undefined);
            let newObj = {
              projectName: "",
              no: "",
            };
            this.changeSourceState({ ...newObj });
          });
        }
      } else if (val === 2) {
        if (this.chargeContForm.notifyPrint !== undefined) {
          this.$confirm(`一定要清除费用计入关系吗?`, "警告", {
            cancelButtonText: "取消",
            confirmButtonText: "确认",
            type: "warning",
          }).then(() => {
            this.$set(this.chargeContForm, "notifyPrint", undefined);
          });
        }
      } else if (val === 3) {
        if (this.chargeContForm.invoicePrint !== undefined) {
          this.$confirm(`一定要清除票据计入关系吗?`, "警告", {
            cancelButtonText: "取消",
            confirmButtonText: "确认",
            type: "warning",
          }).then(() => {
            this.$set(this.chargeContForm, "invoicePrint", undefined);
          });
        }
      } else if (val === 4) {
        if (this.chargeContForm.lateFeePrint !== undefined) {
          this.$confirm(`一定要清除票据计入关系吗?`, "警告", {
            cancelButtonText: "取消",
            confirmButtonText: "确认",
            type: "warning",
          }).then(() => {
            this.$set(this.chargeContForm, "lateFeePrint", undefined);
          });
        }
      }
    },
    // 面积依据改变
    changeAreaBasis(val) {
      if (val === 0) {
        this.disableAreaBasis = true;
        this.$set(this.chargeContForm, "areaFormula", "a");
      } else if (val === 1) {
        this.disableAreaBasis = true;
        this.$set(this.chargeContForm, "areaFormula", "b");
      } else if (val === 2) {
        this.disableAreaBasis = true;
        this.$set(this.chargeContForm, "areaFormula", "c");
      } else if (val === 3) {
        this.disableAreaBasis = true;
        this.$set(this.chargeContForm, "areaFormula", "d");
      } else if (val === 4) {
        this.disableAreaBasis = false;
        this.$set(this.chargeContForm, "areaFormula", null);
      }
    },
    // 数据来源改变
    changeDatSource(val) {
      this.changeSourceState(this.selectSourceOptions);
    },
    changeDatSourceId(val) {
      this.selectSourceOptions = this.projectOptions.find((item) => {
        return item.chargingStandardId === val;
      });
      this.changeSourceState(this.selectSourceOptions);
    },
    changeComputed(val) {
      if (val === 0) {
        this.computedLabel = "hidden";
      } else if (val === 1) {
        this.computedLabel = "show";
      } else if (val === 2) {
        this.computedLabel = "费用比例";
      } else if (val === 3) {
        this.computedLabel = "费用增加";
      } else if (val === 4) {
        this.computedLabel = "用量比例";
      } else if (val === 5) {
        this.computedLabel = "用量增加";
      } else if (val === 6) {
        this.computedLabel = "绝对费用";
      } else if (val === 7) {
        this.computedLabel = "绝对用量";
      }
    },
    pricingInput(val) {
      if (val === 1) {
        this.chargeContForm.vacantCalculateFormula += "开始日";
      } else if (val === 2) {
        this.chargeContForm.vacantCalculateFormula += "截止日";
      } else if (val === 3) {
        this.chargeContForm.vacantCalculateFormula += "空置天数";
      } else if (val === 4) {
        this.chargeContForm.vacantCalculateFormula += "当月天数";
      } else if (val === 5) {
        this.chargeContForm.vacantCalculateFormula += "if(,,)";
      }
    },
    inputFormula(val) {
      if (val === 0) {
        this.chargeContForm.pricingFormulaOne += "基本费";
      } else if (val === 1) {
        this.chargeContForm.pricingFormulaOne += "附加费";
      } else if (val === 2) {
        this.chargeContForm.pricingFormulaOne += "净用量";
      } else if (val === 3) {
        this.chargeContForm.pricingFormulaOne += "计费用量";
      } else if (val === 4) {
        this.chargeContForm.pricingFormulaOne += "计价面积";
      } else {
        this.chargeContForm.pricingFormulaOne += "楼层";
      }
    },
    calculateOne(val) {
      if (val === 1) {
        this.chargeContForm.pricingFormulaTwo += "源净用量";
      } else if (val === 2) {
        this.chargeContForm.pricingFormulaTwo += "源计费用量";
      } else if (val === 3) {
        this.chargeContForm.pricingFormulaTwo += "源基本费";
      } else if (val === 4) {
        this.chargeContForm.pricingFormulaTwo += "源附加费";
      } else if (val === 5) {
        this.chargeContForm.pricingFormulaTwo += "营业额";
      } else if (val === 6) {
        this.chargeContForm.pricingFormulaTwo += "净用量";
      } else if (val === 7) {
        this.chargeContForm.pricingFormulaTwo += "楼层";
      } else if (val === 8) {
        this.chargeContForm.pricingFormulaTwo += "计价面积";
      } else if (val === 9) {
        this.chargeContForm.pricingFormulaTwo += "营业额";
      }
    },
    formulaThree(val) {
      if (val === 1) {
        this.chargeContForm.pricingFormulaThree += "[SF]";
      } else if (val === 2) {
        this.chargeContForm.pricingFormulaThree += "[SJ]";
      } else if (val === 3) {
        this.chargeContForm.pricingFormulaThree += "[SL]";
      } else if (val === 4) {
        this.chargeContForm.pricingFormulaThree += "[SY]";
      } else if (val === 5) {
        this.chargeContForm.pricingFormulaThree += "[JF]";
      } else if (val === 6) {
        this.chargeContForm.pricingFormulaThree += "[JJ]";
      } else if (val === 7) {
        this.chargeContForm.pricingFormulaThree += "[JL]";
      } else if (val === 8) {
        this.chargeContForm.pricingFormulaThree += "[JY]";
      } else {
        this.chargeContForm.pricingFormulaThree += "[月费用]";
      }
    },
    changeMonths(val) {
      let monthOptions = [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ];
      this.selectMonths = monthOptions.map((item) => {
        if (val.includes(item)) {
          return 1;
        } else {
          return " ";
        }
      });
    },
    // 开始月份改变
    changeStartMonth(val) {
      if (this.chargeContForm.endMonth < val) {
        this.chargeContForm.endMonth = val;
      }
    },
    changeEndMonth(val) {
      if (this.chargeContForm.startMonth > val) {
        this.chargeContForm.startMonth = val;
      }
    },
    changeStartDay(val) {
      if (this.chargeContForm.endDay < val) {
        this.chargeContForm.endDay = val - 1;
      }
    },
    confirm() {
      this.isFooter = false;
      this.chargeContForm.specifyMonth = this.selectMonths.join("");
      if (this.contentFormState === "新增") {
        addChargeStand(this.chargeContForm).then(() => {
          this.$message.success("新增成功！");
        });
      } else if (this.contentFormState === "修改") {
        updateChargeStand(this.chargeContForm).then(() => {
          this.$message.success("修改成功！");
          this.getChargeStand(this.selectedNode);
        });
      }
    },
    cancel() {
      this.isFooter = false;
      this.chargeContFormDisable = true;
      if (this.nodeType === 2) {
        this.rightContVisible = false;
      }
    },
    checkEquation(val) {
      // let data = `净用量 = 5
      //   print ${val}
      // `;
      let data = `开始日 = 5
        print ${val}
      `;
      ExpCalculate({ expStr: data }).then((res) => {
        console.log(res.data);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.routineCharge {
  padding: 20px 20px 20px 10px;
  position: relative;
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    .header-title {
      text-align: center;
    }
  }
  .footer {
    z-index: 100;
    width: 96%;
    height: 46px;
    padding: 0 2% 20px;
    background: #fffffc;
    position: fixed;
    line-height: 46px;
    bottom: 30px;
    right: 0px;
    text-align: right;
    box-shadow: 2px 0px 5px 0px #cccccc;
  }
}
</style>
