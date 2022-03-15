<template>
  <div class="ownerRegister">
    <article>
      <header class="header">
        <section class="goBack">
          <el-row type="flex">
            <el-col :span="12">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-back"
                style="font-size: 16px"
                @click="goBack"
              >
                返回
              </el-button>
            </el-col>
          </el-row>
        </section>

        <section class="bottom" v-if="this.$route.query.state !== 'FINISH'">
          <el-row>
            <el-col style="margin-left: 20px" :span="12" v-if="this.$route.query.state === undefined">
              <el-button
                plain
                type="warning"
                size="mini"
                icon="el-icon-edit"
                :disabled="isCheck || isFooterState"
                v-if="this.$route.query.value === undefined"
                @click="updateOwner()"
              >
                修改
              </el-button>
              <el-button
                plain
                type="success"
                size="mini"
                icon="el-icon-upload"
                @click="importUser()"
              >
                导入客户
              </el-button>
            </el-col>

            <el-col style="margin-left: 20px" :span="12" v-else>
              <el-button
                plain
                :type="contractInfo.contractForm.auditMark ? 'warning':'primary'"
                size="mini"
                icon="el-icon-circle-check"
                @click="check(contractInfo.contractForm.auditMark)"
              >
                {{ contractInfo.contractForm.auditMark ? '反审核' : '审核' }}
              </el-button>
            </el-col>
          </el-row>
        </section>
      </header>

      <main class="main">
        <section class="header-title">
          <h2 style="color: #666">合同信息</h2>

          <button
            v-if="contractInfo.contractForm.auditMark"
            class="checked-hover"
          >
            <span>已审核</span>
          </button>
        </section>
        <owner-tabs
          ref="ownerTabs"
          :htId="htId"
          :contractInfo="contractInfo"
          :label-position="labelPosition"
          :is-footer-state="isFooterState"
          :disableAreaBasis="disableAreaBasis"
          @rentCycleVal="rentCycleVal"
          @changeStartDay="changeStartDay"
          @changeEndDay="changeEndDay"
          @changeMonths="changeMonths"
          @changeDays="changeDays"
          @changeAreaBasis="changeAreaBasis"
        />
      </main>

      <footer v-show="isFooterState" class="footer">
        <section>
          <el-button
            plain
            type="primary"
            size="mini"
            icon="el-icon-folder-checked"
            @click="confirm"
          >
            确 认
          </el-button>
          <el-button
            plain
            size="mini"
            icon="el-icon-arrow-left"
            @click="cancel"
          >
            取 消
          </el-button>
        </section>
      </footer>

      <import-user-dialog
        :dialog-import="dialogImport"
        :userSearchForm="userSearchForm"
        @closeImportOwner="closeImportOwner"
        @confirmImportOwner="confirmImportOwner"
      />
    </article>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import ImportUserDialog from "./components/importUserDialog.vue";
import OwnerTabs from "./components/ownerTabs";
import {
  getContract,
  updateRentContracts,
  addContract,
} from "@/api/system/userRegister";
import { getCustomer } from "@/api/system/userManage";
export default {
  components: {
    OwnerTabs,
    ImportUserDialog,
  },
  data() {
    return {
      ownerName: "", // 业主
      options: [],
      labelPosition: "right",
      isCheck: false,
      isReverseCheck: true,
      isFooterState: false, // 隐藏确认取消
      dialogImport: false, // 导入客户的弹窗
      htId: 0,
      userSearchForm: {
        propertyId: "",
        ownerOrTenant: 0,
        companyOrPersonal: 0,
      },
      delParams: {
        contractId: 0,
        confirmFlag: 0,
      },
      DelOwnerParams: {},
      ownerList: [],
      contractInfo: {
        contractForm: {},
        rentOwnerInfo: {},
        rentHouseList: {},
        propertyOwner: {},
      },
      isAddState: "新增",

      disableAreaBasis: true,
    };
  },
  activated() {
    if (this.$route.query.id !== undefined) {
      this.getOwnerInfo();
      this.isFooterState = false;
    } else {
      this.contractInfo = {
        contractForm: {},
        rentOwnerInfo: {},
        rentHouseList: {},
        propertyOwner: {},
      };
      this.isFooterState = true;
      let nowDay = new Date();
      this.$set(this.contractInfo.contractForm, "startingDate", nowDay);
      let year = nowDay.getFullYear() + 1;
      let month = nowDay.getMonth() + 1;
      let day = nowDay.getDate() - 1;
      let arrivalDate = `${year}-${month}-${day}`;
      this.$set(this.contractInfo.contractForm, "rentArrivalDate", arrivalDate);
      this.$set(this.contractInfo.contractForm, "leaseMonths", "12");
      this.$set(this.contractInfo.contractForm, "rentPaymentCycle", 0);
      this.$set(this.contractInfo.contractForm, "contractStatus", 0);

      // 费用核算的七个默认值
      this.$set(this.contractInfo.contractForm, "leaseSynchronization", false);
      this.$set(this.contractInfo.contractForm, "conversionMethod", false);

      this.$set(this.contractInfo.contractForm, "rentMonth", 1);
      this.$set(this.contractInfo.contractForm, "rentAdjustmentAlgorithm", 1);
      this.$set(this.contractInfo.contractForm, "pricingAccuracy", 0);
      this.$set(this.contractInfo.contractForm, "areaBasis", 0);
      this.$set(this.contractInfo.contractForm, "areaFormula", "a");
      let newDate = new Date();
      this.$set(this.contractInfo.contractForm, "contractDate", newDate);
      this.$set(this.contractInfo.contractForm, "checkInDate", newDate);
      if (Cookies.get("rentOwnerInfo") !== undefined) {
        const rentOwnerInfo = JSON.parse(Cookies.get("rentOwnerInfo"));
        this.$set(
          this.contractInfo.rentOwnerInfo,
          "customerName",
          rentOwnerInfo.customerName
        );
        this.$set(
          this.contractInfo.rentOwnerInfo,
          "shortCode",
          rentOwnerInfo.shortCode
        );
        this.$set(
          this.contractInfo.rentOwnerInfo,
          "mobile",
          rentOwnerInfo.mobile
        );
      }
    }
  },
  methods: {
    goBack() {
      let newArr = this.$store.state.tagsView.visitedViews.filter((item) => {
        return (
          [
            "rentHouseList",
            "PropertyOwner",
            "OwnerInfo",
            "OwnerRegister",
          ].indexOf(item.name) !== -1
        );
      })
      if(this.$route.query.state === 'CHECK') {
        this.$router.go(-1)
        newArr.map((item) => {
          this.$store.dispatch("tagsView/delView", item);
        });
      } else if(this.$route.query.state === 'FINISH') {
        this.$router.go(-1)
        newArr.map((item) => {
          this.$store.dispatch("tagsView/delView", item);
        })
      } else {
        this.$router.push({
        path: "rentContract",
      });
      Cookies.remove("rentOwnerInfo");
      Cookies.remove("rentHouseLists");
      Cookies.remove("rentHouseList");
      // 真尼玛好用  先筛选出tags的路由name为这些的  然后遍历删除
      newArr.map((item) => {
        this.$store.dispatch("tagsView/delView", item);
      });
      }
    },
    getOwnerInfo() {
      getContract({ contractId: this.$route.query.id }).then((res) => {
        if (this.$route.query.equityState === undefined) {
          this.contractInfo.contractForm = { ...res.contract };
          this.contractInfo.rentOwnerInfo = { ...res.customer };
          this.contractInfo.propertyOwner = { ...res.propertyOwner };
        }
        this.contractInfo.rentHouseList = { ...res.rentHouseList };
        this.delParams.contractId = this.contractInfo.contractForm.contractId;
      });
    },
    // 审核
    check(val) {
      this.$confirm(`一定要对本合同进行${val ? '反审核':'审核'}吗?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          contractIds: this.delParams.contractId,
          review: val ? 0 : 1,
        };
        updateRentContracts(data).then(() => {
          this.getOwnerInfo()
          this.$message.success(`合同${val ? '反审核':'审核'}成功！`);
        });
      });
    },
    // 确认
    confirm() {
      if (this.$route.query.value === "newRent") {
        this.$refs["ownerTabs"].$refs["rentOwnerInfo"].validate((valid) => {
          if (valid) {
            // 第二层判断
            this.$refs["ownerTabs"].$refs["ownerRegisterForm"].validate((e) => {
              if (e) {
                this.contractInfo.contractForm.propertyId = Number(
                  Cookies.get("selectPropertyId")
                );
                this.contractInfo.contractForm.buildingId = this.$route.query.buildingId;
                let data = {
                  contract: this.contractInfo.contractForm,
                  customer:
                    Cookies.get("rentOwnerInfo") === undefined
                      ? this.contractInfo.rentOwnerInfo
                      : JSON.parse(Cookies.get("rentOwnerInfo")),
                  rentHouseLists:
                    Cookies.get("rentHouseLists") === undefined
                      ? []
                      : JSON.parse(Cookies.get("rentHouseLists")),
                  owners: [],
                };
                if (data.rentHouseLists&&data.rentHouseLists.length === 0) {
                  this.$confirm(`一定要先选房屋才能保存合同！`, "提示", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "info",
                  }).then(() => {
                    this.$router.push({
                      path: "houseRepertoire",
                      query: {
                        contractId: this.contractInfo.rentHouseList.contractId,
                        houseId: this.$route.query.houseId,
                      },
                    });
                  });
                } else {
                  addContract(data).then(() => {
                    this.$message.success("新增合同成功！");
                    Cookies.remove("rentOwnerInfo");
                    Cookies.remove("rentHouseLists");
                    Cookies.remove("rentHouseList");
                  });
                }
              }
            });
          }
        });
      } else {
        this.$refs["ownerTabs"].$refs["rentOwnerInfo"].validate((valid) => {
          if (valid) {
            let data = { ...this.contractInfo.contractForm };
            updateContract(data).then(() => {
              this.$message.success("修改合同成功！");
            });
          }
        });
      }
    },
    // 取消
    cancel() {
      if (this.$route.query.equityState === undefined) {
        Cookies.remove("rentOwnerInfo");
        this.isFooterState = false;
      } else {
        if (Cookies.get("rentOwnerInfo") !== undefined) {
          Cookies.remove("rentOwnerInfo");
        }
        this.$router.push({
          path: "userRegister",
        });
      }
    },
    // 编辑
    updateOwner() {
      this.isAddState = "修改";
      this.isFooterState = true;
    },
    importUser() {
      this.dialogImport = true;
    },
    closeImportOwner(val) {
      this.dialogImport = val;
    },
    // 导入用户信息
    confirmImportOwner(val) {
      this.$set(this.contractInfo.rentOwnerInfo, "customerId", val.node.KHID);
      this.$set(
        this.contractInfo.rentOwnerInfo,
        "customerName",
        val.node.客户名称
      );
      this.$set(this.contractInfo.rentOwnerInfo, "phone", val.node.手机);
      this.$set(this.contractInfo.rentOwnerInfo, "shortCode", val.node.简码);
      this.dialogImport = val.state;
      getCustomer({ customerId: val.node.KHID }).then((res) => {
        Cookies.set("rentOwnerInfo", JSON.stringify({ ...res.data }));
        this.$message.success("用户信息导入成功！");
      });
    },
    rentCycleVal(val) {
      console.log(val)
      if (val === 0) {
        this.contractInfo.contractForm.intervalOfEachPeriod = 1;
      } else if (val === 1) {
        this.contractInfo.contractForm.intervalOfEachPeriod = 2;
      } else if (val === 2) {
        this.contractInfo.contractForm.intervalOfEachPeriod = 3;
      } else if (val === 3) {
        this.contractInfo.contractForm.intervalOfEachPeriod = 4;
      } else if (val === 4) {
        this.contractInfo.contractForm.intervalOfEachPeriod = 6;
      } else {
        this.contractInfo.contractForm.intervalOfEachPeriod = 12;
      }
    },
    // 起租日期改变的 $emit
    changeStartDay(val) {
      let date = val;
      if (date !== null) {
        let year = date.getFullYear() + 1;
        let month = date.getMonth() + 1;
        let day = date.getDate() - 1;
        let endDate = `${year}-${month}-${day}`;
        this.$set(this.contractInfo.contractForm, "rentArrivalDate", this.formatDate(endDate));
        this.$set(this.contractInfo.contractForm, "leaseMonths", 12);
        this.$set(this.contractInfo.contractForm, "leaseDays", null);
      } else {
        this.$set(this.contractInfo.contractForm, "rentArrivalDate", null);
      }
    },
    // 到租日期改变的 $emit
    changeEndDay(val) {
      let date1 = this.formatDate(val);
      let date2 = this.formatDate(this.contractInfo.contractForm.startingDate);
      this.monthDayDiff(date2, date1);
    },
    // 改变租赁月份的 $emit
    changeMonths(val) {
      let date = this.formatDate(this.contractInfo.contractForm.startingDate);
      let month = Number(val);
      this.$set(
        this.contractInfo.contractForm,
        "rentArrivalDate",
        this.formatDate(this.getNewMonth(date, month))
      );
    },
    // 改变租赁天数的 $emit
    changeDays(val) {
      let day = Number(val);
      this.$set(
        this.contractInfo.contractForm,
        "rentArrivalDate",
        this.formatDate(this.getNewDay(day))
      );
    },
    // 日期格式化
    formatDate(date) {
      let standardDate = new Date(date);
      let year = standardDate.getFullYear();
      let month = standardDate.getMonth() + 1;
      let day = standardDate.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      return year + "-" + month + "-" + day;
    },
    // 月份改变获取新的日期
    getNewMonth(date, month) {
      let newDate = date.split("-").map((item) => {
        return Number(item);
      });
      let mon = 0,
        year = 0,
        days = 0;
      if (newDate[1] + month > 12) {
        year = newDate[0] + Math.floor((newDate[1] + month) / 12);
        mon = ((newDate[1] + month) % 12);
      } else {
        year = newDate[0];
        mon = newDate[1] + month;
      }
      days = 0 + newDate[2] - 1;
      if(days === 0) {
        mon = mon - 1
        if([1, 3, 5, 7, 8, 10, 12].includes(mon)) {
          days = 31
        } else if([4, 6, 9, 11].includes(mon)) {
          days = 30
        } else {
          if(year%4!=0 || (year%100==0 && year%400!=0)) {
            days = 28
          }else {
            days = 29
          }
        }
      }
      console.log(year, mon, days)
      return `${year}-${mon}-${days}`;
    },
    // 天数改变得到新的日期
    getNewDay(day) {
      let newDate = new Date(
        this.getNewMonth(
          this.formatDate(this.contractInfo.contractForm.startingDate),
          Number(this.contractInfo.contractForm.leaseMonths)
        )
      );

      var millSeconds = Math.abs(newDate) + day * 24 * 60 * 60 * 1000;
      var rDate = new Date(millSeconds);
      var year = rDate.getFullYear();
      var month = rDate.getMonth() + 1;
      if (month < 10) month = "0" + month;
      var date = rDate.getDate();
      if (date < 10) date = "0" + date;
      return year + "-" + month + "-" + date;
    },
    // 两个具体日期的差值 几个月几天
    monthDayDiff(startDate, endDate) {
      let flag = [1, 3, 5, 7, 8, 10, 12, 4, 6, 9, 11, 2];
      let start = new Date(startDate);
      let end = new Date(endDate);
      let year = end.getFullYear() - start.getFullYear();
      let month = end.getMonth() - start.getMonth();
      let day = end.getDate() - start.getDate();
      if (month < 0) {
        year--;
        month = end.getMonth() + (12 - start.getMonth());
      }
      if (day < 0) {
        month--;
        let index = flag.findIndex((temp) => {
          return temp === start.getMonth() + 1;
        });
        let monthLength;
        if (index <= 6) {
          monthLength = 31;
        } else if (index > 6 && index <= 10) {
          monthLength = 30;
        } else {
          monthLength = 28;
        }
        day = end.getDate() + (monthLength - start.getDate());
      }
      this.$set(
        this.contractInfo.contractForm,
        "leaseMonths",
        12 * year + month
      );
      this.$set(this.contractInfo.contractForm, "leaseDays", day + 1);
    },
    // 面积依据改变导致面积公式改变
    changeAreaBasis(val) {
      if (val === 0) {
        this.disableAreaBasis = true;
        this.$set(this.contractInfo.contractForm, "areaFormula", "a");
      } else if (val === 1) {
        this.disableAreaBasis = true;
        this.$set(this.contractInfo.contractForm, "areaFormula", "b");
      } else if (val === 2) {
        this.disableAreaBasis = true;
        this.$set(this.contractInfo.contractForm, "areaFormula", "c");
      } else if (val === 3) {
        this.disableAreaBasis = true;
        this.$set(this.contractInfo.contractForm, "areaFormula", "d");
      } else if (val === 4) {
        this.disableAreaBasis = false;
        this.$set(this.contractInfo.contractForm, "areaFormula", "");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ownerRegister {
  position: relative;
  .header {
    .goBack {
      padding: 8px 16px;
      border-bottom: 1px solid #eaeaea;
      box-shadow: 0px 0px 2px 4px #f5f5f5;
      &:hover {
        background-color: lavenderblush;
        color: yellowgreen;
      }
    }
    .bottom {
      padding: 10px 24px;
    }
  }
  .main {
    padding: 0px 26px;
    position: relative;
    .header-title {
      text-align: center;
    }
  }
  .footer {
    z-index: 100;
    width: 96%;
    height: 46px;
    padding: 0 2%;
    background: #fffffc;
    position: fixed;
    line-height: 46px;
    bottom: 30px;
    right: 0px;
    text-align: right;
    box-shadow: 2px 0px 5px 0px #cccccc;
  }
}
.el-card__header {
  padding: 12px 16px;
}
</style>
