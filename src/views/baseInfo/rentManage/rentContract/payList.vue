<template>
  <div class="payList">
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

      <section class="bottom">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-form ref="costForm" :model="costForm" label-width="120px">
            <el-col :span="12">
              <el-form-item label="减免核算方式" size="mini">
                <el-select v-model="ownerName" placeholder="请选择合同人">
                  <el-option
                    v-for="item in checkTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="租金" size="mini" label-width="40px">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="管理费" size="mini" label-width="80px">
                <el-input></el-input>
              </el-form-item>
            </el-col>
          </el-form>

          <el-col :span="12" type="flex" align="right">
            <el-button
              plain
              type="success"
              size="mini"
              icon="el-icon-document-checked"
              :disabled="false"
              @click="addCost()"
            >
              生成费用
            </el-button>
            <el-button
              plain
              type="warning"
              size="mini"
              icon="el-icon-edit"
              :disabled="false"
              @click="updateCost()"
              style="margin: 0px 10px 10px 10px"
            >
              调整费用
            </el-button>
            <el-popover placement="top" width="262" v-model="visible">
              <div>
                <el-button
                  plain
                  type="primary"
                  size="mini"
                  icon="el-icon-plus"
                  :disabled="rentPayList && rentPayList.length === 0"
                  @click="addOnePay()"
                >
                  追加一期
                </el-button>
                <el-button
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  :disabled="false"
                  @click="delLastPay()"
                >
                  删除最后一期
                </el-button>
                <el-button
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  style="margin-left: 0px"
                  :disabled="rentPayList && rentPayList.length === 0"
                  @click="allDel()"
                >
                  全部删除
                </el-button>
                <el-button
                  plain
                  type="success"
                  size="mini"
                  icon="el-icon-date"
                  :disabled="false"
                  @click="updatePayDate()"
                  style="margin: 10px 0px 0px 10px"
                >
                  调整交款日期
                </el-button>

                <!-- <el-button
                  plain
                  type="warning"
                  size="mini"
                  icon="el-icon-takeaway-box"
                  :disabled="false"
                  @click="temporaryPro()"
                  style="margin: 10px 24px 0 0"
                >
                  临时项目
                </el-button>
                <el-button
                  plain
                  type="warning"
                  size="mini"
                  icon="el-icon-printer"
                  :disabled="false"
                  @click="regularPro()"
                >
                  常规项目
                </el-button> -->
              </div>
              <el-button
                size="mini"
                plain
                type="primary"
                slot="reference"
                icon="el-icon-setting"
                style="margin-right: 10px"
                >操作</el-button
              >
            </el-popover>
          </el-col>
        </el-row>
      </section>
    </header>

    <main class="main">
      <h2 style="text-align: center; color: #333">费用明细</h2>
      <el-table
        :data="rentPayList"
        show-summary
        border
        :cell-style="{ padding: '4px' }"
        :summary-method="getSummaries"
      >
        <el-table-column
          fixed
          prop="issueNo"
          label="期号"
          width="60"
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
        <el-table-column
          prop="normalRent"
          label="正常租金"
          width="80"
          align="right"
        />
        <el-table-column label="全额减免租金" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.remissionStatus" :disabled="true" />
          </template>
        </el-table-column>

        <el-table-column prop="rentDiscount" label="租金折扣" align="right" />
        <el-table-column prop="rentActually" label="实际租金" align="right" />
        <el-table-column
          prop="paymentDate"
          label="租金缴款日期"
          width="110"
          align="center"
        />
        <el-table-column
          prop="rentPayable"
          label="应交租金"
          width="80"
          align="right"
        />
        <el-table-column
          prop="normalManageFee"
          label="正常管理费"
          width="90"
          align="right"
        />

        <el-table-column label="全额减免管理费" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.manageFeeReduce" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column
          prop="manageFeeAdjustVal"
          label="管理费调整值"
          width="100"
          align="right"
        >
        </el-table-column>

        <el-table-column
          prop="manageFeeDiscount"
          width="90"
          label="管理费折扣"
          align="right"
        />
        <el-table-column
          prop="manageFeeActually"
          width="90"
          label="实际管理费"
          align="right"
        />
        <el-table-column
          prop="manageFeePaymentDate"
          width="110"
          label="管理费缴款日期"
          align="center"
        />
        <el-table-column
          prop="manageFeePayable"
          label="应交管理费"
          width="90"
          align="right"
        />
        <el-table-column label="调租提醒" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.rentAdjustmentReminder"
              :disabled="true"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="150">
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="editRentOne(scope.row)"
            >
              修改
            </el-button>
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              style="margin-left: 20px; color: red"
              @click="delRentOne(scope.row)"
            >
              删除
            </el-button> -->
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
    <temporary-dialog :visibleTemporary="visibleTemporary"></temporary-dialog>
    <regular-dialog :visibleRegular="visibleRegular"></regular-dialog>
    <pay-rent-dialog
      :dialogPayRent="dialogPayRent"
      :payRentData="payRentData"
      @closePayRent="closePayRent"
      @submintPayRent="submintPayRent"
    ></pay-rent-dialog>
  </div>
</template>

<script>
import temporaryDialog from "./components/temporaryDialog";
import regularDialog from "./components/regularDialog";
import PayRentDialog from "./components/payRentDialog";
import {
  rentGenerate,
  rentAdjust,
  getRentList,
  editRentList,
  deleteRentList,
  addOneRent,
  changePayDate,
} from "@/api/system/rentContract";

export default {
  data() {
    return {
      rentPayList: [],
      ownerName: "",
      checkTypeOptions: [
        {
          label: "费用按非减免月份核算",
          value: 0,
        },
        {
          label: "费用减免后平均核算",
          value: 1,
        },
      ],
      costForm: {},
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      visibleTemporary: false,
      visibleRegular: false,
      visible: false,

      dialogPayRent: false, // 修改单个的月租
      payRentData: {},
      lastPayData: {},
    };
  },
  components: {
    temporaryDialog,
    regularDialog,
    PayRentDialog,
  },
  activated() {
    this.queryParams.contractId = this.$route.query.id;
    this.getRentLists();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    getRentLists() {
      getRentList(this.queryParams).then((res) => {
        this.rentPayList = [...res.records];
        this.total = res.total;
        this.lastPayData = { ...res.lastIssue };
      });
    },
    // 翻页的处理
    getTable() {
      this.getRentLists();
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合 计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (prev * 100 + curr * 100) / 100;
            } else {
              return (prev * 100) / 100;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    addCost() {
      this.$confirm(`一定要重新生成租金么？`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            contractId: this.$route.query.id,
            clearFlag:
              this.rentPayList && this.rentPayList.length === 0 ? false : true,
          };
          return rentGenerate(params);
        })
        .then(() => {
          this.$message.success("用户租金已生成！");
        })
        .then(() => {
          // 掉list的接口
          getRentList(this.queryParams).then((res) => {
            this.rentPayList = [...res.records];
            this.total = res.total;
          });
        });
    },
    updateCost() {
      this.$confirm(
        `有租金分段定义，一定要重新进行租金及管理费调整么？`,
        "警告",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let data = {
            contractId: this.$route.query.id,
          };
          return rentAdjust(data);
        })
        .then(() => {
          this.$message.success("用户租金及管理费调整已调整！");
          // 掉list的接口
          this.getRentLists();
        });
    },
    allDel() {
      this.$confirm(`是否要删除全部的费用明细吗？`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // const rentDetailId = JSON.stringify(this.rentPayList.map(item => { return item.rentDetailId }))
          return deleteRentList({ contractId: this.$route.query.id });
        })
        .then(() => {
          this.$message.success("全部的费用明细已被删除!");
          this.getRentLists();
        });
    },
    // 追加一期
    addOnePay() {
      console.log(this.lastPayData);
      let addPayData = { ...this.lastPayData };
      addPayData.issueNo = this.lastPayData.issueNo + 1;
      addPayData.startDate = this.getNextMonth(addPayData.startDate);
      addPayData.endDate = this.getNextMonth(this.lastPayData.endDate);

      addPayData.manageFeePaymentDate = this.getNextMonth(
        this.lastPayData.manageFeePaymentDate
      );
      addPayData.paymentDate = this.getNextMonth(this.lastPayData.paymentDate);
      addPayData.contractId = this.$route.query.id;
      this.$confirm(`确定要追加一期费用？`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return addOneRent(addPayData);
        })
        .then(() => {
          this.$message.success("已成功为您追加一期!");
          this.getRentLists();
        });
    },
    /**
     * 获取下一个月
     *
     * @date 格式为yyyy-mm-dd的日期
     */
    getNextMonth(date) {
      var arr = date.split("-");
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中的月的天数
      var year2 = year;
      var month2 = parseInt(month) + 1;
      if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }

      var t2 = year2 + "-" + month2 + "-" + day2;
      return t2;
    },
    // 删除最后一期
    delLastPay() {
      this.$confirm(`是否要删除最后一期费用明细？`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return deleteRentList({
            rentDetailIds: this.lastPayData.rentDetailId,
          });
        })
        .then(() => {
          this.$message.success(`最后一期费用明细已被删除!`);
          this.getRentLists();
        });
    },
    // 调整交款周期
    updatePayDate() {
      this.$confirm(`确定要进行交款日期的调整吗？`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return changePayDate({ contractId: this.$route.query.id });
        })
        .then(() => {
          this.$message.success(`调整交款日期成功!`);
          this.getRentLists();
        });
    },
    // 临时项目
    temporaryPro() {
      this.visibleTemporary = true;
    },
    // 常规项目
    regularPro() {
      this.visibleRegular = true;
    },
    editRentOne(row) {
      this.dialogPayRent = true;
      this.payRentData = { ...row };
    },
    // delRentOne(row) {
    //   this.$confirm(`是否要删除第[${row.issueNo}]期的费用明细吗？`, "警告", {
    //     confirmButtonText: "确认",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       return deleteRentList({ rentDetailIds: row.rentDetailId });
    //     })
    //     .then(() => {
    //       this.$message.success(`第[${row.issueNo}]期费用明细已被删除!`);
    //       this.getRentLists();
    //     });
    // },
    closePayRent(val) {
      this.dialogPayRent = val;
    },
    // 提交修改
    submintPayRent(val) {
      editRentList(val).then(() => {
        this.$message.success("租金费用修改成功！");
        this.dialogPayRent = false;
        this.getRentLists();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.payList {
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
    padding: 0px 26px 40px;
  }
}
</style>
