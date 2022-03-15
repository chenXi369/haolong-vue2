<template>
  <div class="rentPaySetting">
    <header class="header">
      <section class="goBack">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-back"
          style="font-size: 16px"
          @click="goBack"
        >
          返回
        </el-button>
        <span class="title">租金设置</span>
      </section>
    </header>

    <main class="main">
      <section class="main-head">
        <el-button
          plain
          size="mini"
          icon="el-icon-plus"
          type="success"
          @click="add"
          class="header-btn"
        >
          新增
        </el-button>
        <h2 style="text-align: center; color: #333">租金结算方式</h2>
      </section>

      <el-table
        :v-loading="loading"
        :data="rentPayTypeData"
        border
        :cell-style="{ padding: '4px' }"
        element-loading-text="请给我点时间！"
      >
        <el-table-column
          fixed
          prop="tlMethod"
          label="结算方式"
          width="100"
          align="center"
        />
        <el-table-column
          prop="startDate"
          label="开始日期"
          width="110"
          align="center"
        />
        <el-table-column
          prop="endDate"
          label="结束日期"
          width="110"
          align="center"
        />
        <el-table-column prop="unitRent" label="租金单价" align="center" />
        <el-table-column prop="rentVal" label="租金" align="center" />
        <el-table-column label="保底租金" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.guaranteedRentStatus"
              :disabled="true"
            />
          </template>
        </el-table-column>
        <el-table-column prop="baseVal" label="基数" align="center" />

        <el-table-column label="保底基数" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.guaranteedBaseStatus"
              :disabled="true"
            />
          </template>
        </el-table-column>
        <el-table-column label="超出提留" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.outOfTlStatus" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column prop="" label="提留比例" align="right" />

        <el-table-column label="按递增额" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.incrementalMethod"
              :disabled="true"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="incrementalParam"
          label="递增参数"
          align="right"
        />

        <el-table-column label="复利算法" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.rentAdjustmentAlgorithm"
              :disabled="true"
            />
          </template>
        </el-table-column>
        <el-table-column prop="manageFee" label="管理费" align="right" />

        <el-table-column
          prop="calculateFormula"
          label="计算公式"
          align="right"
        />
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="edit(scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              style="margin-left: 20px; color: red"
              @click="del(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getTable"
      />
    </main>
    <section>
      <add-rent-pay-dialog
        :title="title"
        :rentPayForm="rentPayForm"
        :dialogVisible="dialogVisible"
        :rentPayMonth="rentPayMonth"
        :disabled="disabled"
        @changeTlType="changeTlType"
        @closeDailog="closeDailog"
        @submitTl="submitTl"
        @changeRentMonth="changeRentMonth"
        @changeStartDay="changeStartDay"
        @changeEndDay="changeEndDay"
        @changeMonths="changeMonths"
        @changeDays="changeDays"
        @getDefaultVal="getDefaultVal"
        @checkOut="checkOut"
      ></add-rent-pay-dialog>
    </section>
  </div>
</template>

<script>
import addRentPayDialog from "./components/addRentPayDialog";
import {
  getTlList,
  addTlDefinition,
  deleteTlDefinition,
  updateTlDefinition,
  ExpCalculate
} from "@/api/system/rentContract";

export default {
  components: { addRentPayDialog },
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      rentPayTypeData: [],
      dialogVisible: false,
      rentPayForm: {},
      title: "",
      rentPayMonth: 1,
      disabled: {
        disabledOne: false,
        disabledTwo: false,
        disabledThree: false,
        disabledFour: false,
        disabledFive: false,
        disabledSix: false,
      }
    };
  },
  activated() {
    this.getTlLists();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取list
    getTlLists() {
      let params = {
        contractId: this.$route.query.id,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      getTlList(params).then((res) => {
        this.rentPayTypeData = [...res.records];
        this.total = res.total;
      });
    },
    // 核算方式的emit
    changeTlType(val) {
      this.radioChange(val)
    },
    // 新增
    add() {
      this.dialogVisible = true;
      this.title = "租金设置-新增";
      this.rentPayMonth = undefined
      this.rentPayForm = {}

      this.$set(this.rentPayForm, 'tlMethod', 1)
      this.radioChange(this.rentPayForm.tlMethod)
      this.$set(this.rentPayForm, 'rentVal', 10000)
      this.$set(this.rentPayForm, 'rentPaymentCycle', 0)
      this.changeRentMonth(this.rentPayForm.rentPaymentCycle)

      this.$set(this.rentPayForm, 'paymentMonth', 1)
      this.$set(this.rentPayForm, 'rentPaymentDate', 15)

      this.$set(this.rentPayForm, 'leaseMonths', 12)
      this.$set(this.rentPayForm, "calculateFormula", "");

      let nowDay = new Date();
      let year = nowDay.getFullYear() + 1;
      let month = nowDay.getMonth() + 1;
      let day = nowDay.getDate() - 1;
      let stratDate = `${year - 1}-${month}-${day + 2}`
      let arrivalDate = `${year}-${month}-${day}`;
      this.$set(this.rentPayForm, "startDate", stratDate);
      this.$set(this.rentPayForm, "endDate", arrivalDate);
    },
    // 新增和修改的提交
    submitTl(val) {
      if (this.title === "租金设置-新增") {
        this.rentPayForm.contractId = Number(this.$route.query.id)
        addTlDefinition(this.rentPayForm).then(() => {
          this.$message.success("租金设置新增提留定义成功!");
        });
      } else if ((this.title = "租金设置-修改")) {
        updateTlDefinition(val).then(() => {
          this.$message.success("租金设置选中的提留定义修改成功!");
        });
      }
      this.getTlLists();
      this.dialogVisible = false;
    },
    // 修改月数
    changeRentMonth(val) {
      if(val === 0) {
        this.rentPayMonth = 1
      } else if(val === 1) {
        this.rentPayMonth = 2
      } else if(val === 2) {
        this.rentPayMonth = 3
      } else if(val === 3) {
        this.rentPayMonth = 4
      } else if(val === 4) {
        this.rentPayMonth = 6
      } else if(val === 5) {
        this.rentPayMonth = 12
      }
    },
    // 修改
    edit(row) {
      this.dialogVisible = true;
      this.rentPayForm = row;
      if(row.rentPaymentCycle === 0) {
        this.rentPayMonth = 1
      } else if(row.rentPaymentCycle === 1) {
        this.rentPayMonth = 2
      } else if(row.rentPaymentCycle === 2) {
        this.rentPayMonth = 3
      } else if(row.rentPaymentCycle === 3) {
        this.rentPayMonth = 4
      } else if(row.rentPaymentCycle === 4) {
        this.rentPayMonth = 6
      } else if(row.rentPaymentCycle === 5) {
        this.rentPayMonth = 12
      }
      this.title = "租金设置-修改";
    },
    // 删除
    del(row) {
      console.log(row);
      this.$confirm(`确定要删除指定的记录？`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return deleteTlDefinition({ tlDefinitionId: row.tlDefinitionId });
        })
        .then(() => {
          this.$message.success("租金设置选中的提留定义删除成功!");
          this.getTlLists();
        });
    },
    closeDailog() {
      this.getTlLists();
      this.dialogVisible = false;
    },
    getTable() {
      this.getTlLists();
    },
    // 计算公式的默认值
    getDefaultVal() {
      this.$set(this.rentPayForm, 'calculateFormula', '营业额')
    },
    // 计算公式的校验
    checkOut(val) {
      ExpCalculate({expStr: val}).then((res) => {
        console.log(res.data)
      })
    },
    // 开始日期改变的 $emit
    changeStartDay(val) {
      let date = val;
      console.log(date)
      if (date !== null) {
        let year = date.getFullYear() + 1;
        let month = date.getMonth() + 1;
        let day = date.getDate() - 1;
        let endDate = `${year}-${month}-${day}`;
        this.$set(this.rentPayForm, "endDate", this.formatDate(endDate));
        this.$set(this.rentPayForm, "leaseMonths", 12);
        this.$set(this.rentPayForm, "leaseDays", null);
      } else {
        this.$set(this.rentPayForm, "endDate", null);
      }
    },
    // 到租日期改变的 $emit
    changeEndDay(val) {
      let date1 = this.formatDate(val);
      let date2 = this.formatDate(this.rentPayForm.startDate);
      this.monthDayDiff(date2, date1);
    },
    // 改变租赁月份的 $emit
    changeMonths(val) {
      console.log(this.rentPayForm)
      let date = this.formatDate(this.rentPayForm.startDate);
      let month = Number(val);
      console.log(date, month)
      this.$set(
        this.rentPayForm,
        "endDate",
        this.formatDate(this.getNewMonth(date, month))
      );
    },
    // 改变租赁天数的 $emit
    changeDays(val) {
      let day = Number(val);
      this.$set(
        this.rentPayForm,
        "endDate",
        this.formatDate(this.getNewDay(day))
      );
    },
    // 日期格式化
    formatDate(date) {
      let standardDate = new Date(date);
      let year = standardDate.getFullYear();
      let month = standardDate.getMonth() + 1;
      let day = standardDate.getDate();

      if(month < 10) {
        month = '0' + month
      }
      if(day < 10) {
        day = '0' + day
      }
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
          this.formatDate(this.rentPayForm.startDate),
          Number(this.rentPayForm.leaseMonths)
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
        this.rentPayForm,
        "leaseMonths",
        12 * year + month
      );
      this.$set(this.rentPayForm, "leaseDays", day + 1);
    },
    // 核算方式更改
    radioChange(val) {
      if (val === 1) {
        this.disabled.disabledOne = false;
        this.disabled.disabledTwo = false;
        this.disabled.disabledThree = true;
        this.disabled.disabledFour = true;
        this.disabled.disabledFive = true;
        this.disabled.disabledSix = true;
      } else if (val === 2) {
        this.disabled.disabledOne = false;
        this.disabled.disabledTwo = false;
        this.disabled.disabledThree = false;
        this.disabled.disabledFour = true;
        this.disabled.disabledFive = true;
        this.disabled.disabledSix = true;
      } else if (val === 3) {
        this.disabled.disabledOne = true;
        this.disabled.disabledTwo = true;
        this.disabled.disabledThree = true;
        this.disabled.disabledFour = true;
        this.disabled.disabledFive = false;
        this.disabled.disabledSix = true;
      } else if (val === 4) {
        this.disabled.disabledOne = false;
        this.disabled.disabledTwo = false;
        this.disabled.disabledThree = true;
        this.disabled.disabledFour = false;
        this.disabled.disabledFive = false;
        this.disabled.disabledSix = true;
      } else if (val === 5) {
        this.disabled.disabledOne = true;
        this.disabled.disabledTwo = true;
        this.disabled.disabledThree = true;
        this.disabled.disabledFour = false;
        this.disabled.disabledFive = false;
        this.disabled.disabledSix = true;
      } else if (val === 0){
        this.disabled.disabledOne = true;
        this.disabled.disabledTwo = true;
        this.disabled.disabledThree = true;
        this.disabled.disabledFour = true;
        this.disabled.disabledFive = true;
        this.disabled.disabledSix = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rentPaySetting {
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
    .title {
      font-size: 18px;
      color: #666;
      margin-left: 30px;
      padding-left: 30px;
      border-left: 1px solid #ccc;
    }
  }
  .main {
    padding: 0px 26px 20px;
    .main-head {
      position: relative;
      .header-btn {
        position: absolute;
        left: 0px;
      }
    }
  }
}
</style>
