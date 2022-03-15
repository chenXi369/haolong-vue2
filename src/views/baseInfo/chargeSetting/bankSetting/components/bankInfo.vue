<template>
  <div class="bankInfo" :style="contentStyleObj">
    <el-button
      type="primary"
      plain
      size="mini"
      icon="el-icon-plus"
      class="add-btn"
      @click="addBankCollect"
      >新 增</el-button
    >
    <header class="header flex">
      <el-table
        v-loading="loading"
        :data="bankTableData"
        border
        size="small"
        height="150"
        style="width: 100%"
        ref="bankSettingTable"
        :cell-style="{ padding: '2px' }"
        highlight-current-row
        @current-change="handleSelectedBank"
        :header-cell-style="{ textAlign: 'center' }"
      >
        <el-table-column prop="bankType" label="托收代码" width="180">
        </el-table-column>
        <el-table-column prop="bankName" label="托收名称"> </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="saveBankCollect(scope.row)"
              >修改</el-button
            >
            <el-button
              type="text"
              size="small"
              style="color: red; margin-left: 30px"
              @click="delBankCollect(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </header>
    <main class="main" :style="{ height: mainHeight }">
      <el-form
        :model="bankCollectForm"
        ref="bankCollectForm"
        :rules="rules"
        size="mini"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属城市" prop="city">
              <el-input
                v-model.trim="bankCollectForm.city"
                style="width: 90%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label-width="0px">
              <el-radio-group v-model="bankCollectForm.extendedFormat">
                <el-radio :label="0">标准格式</el-radio>
                <el-radio :label="1">扩展格式</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="托收代码" prop="no">
              <el-input
                v-model.trim="bankCollectForm.no"
                style="width: 90%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label-width="0px">
              <el-select
                v-model="bankCollectForm.accountConsolidation"
                style="width: 100%"
              >
                <el-option label="按户托收" :value="0"></el-option>
                <el-option label="合并账号托收" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="托收名称" prop="bankName">
              <el-input v-model.trim="bankCollectForm.bankName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="银行代码" prop="bankType">
              <el-select
                v-model="bankCollectForm.bankType"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in bankRegionList"
                  :key="item.行别"
                  :label="`${item.行别}  ${item.适用城市}  ${item.名称}`"
                  :value="item.行别"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="代办机构号">
              <el-input
                v-model.trim="bankCollectForm.agencyNo"
                style="width: 90%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span style="color: #999; font-size: 13px"
              >（请咨询托收单位/行别）</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位代码">
              <el-input
                v-model.trim="bankCollectForm.unitCode"
                style="width: 90%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span style="color: #999; font-size: 13px"
              >（请咨询托收单位/快付通取后三位）</span
            >
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="单位名称">
              <el-input v-model="bankCollectForm.unitName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="单位帐号">
              <el-input
                v-model.trim="bankCollectForm.companyAccountNumber"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="费用摘要">
              <el-input v-model="bankCollectForm.costSummary"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="业务处理序号">
              <el-input
                v-model.trim="bankCollectForm.processingSequenceNumber"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item label="代理业务种类">
              <el-input
                v-model="bankCollectForm.agencyBusiness"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item label="代理业务编号">
              <el-input
                v-model.trim="bankCollectForm.agencyBusinessNo"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item label="收付代码">
              <el-input
                v-model.trim="bankCollectForm.receiptPaymentCode"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item label="扣款成功标志">
              <el-input
                v-model="bankCollectForm.deductionSuccessFlag"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item label="送盘明细文件">
              <el-input
                v-model.trim="bankCollectForm.deliveryDetails"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item label="送盘汇总文件">
              <el-input
                v-model.trim="bankCollectForm.deliverySummaryDocument"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item label="回盘明细文件">
              <el-input
                v-model.trim="bankCollectForm.returnDetails"
                style="width: 90%"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-divider content-position="left"
              >送盘文件数据字段长度调整</el-divider
            >
            <el-form-item label="帐号" label-width="60px">
              <el-input
                type="number"
                v-model.trim="bankCollectForm.numberAccountNumbers"
                style="width: 35%"
              ></el-input
              ><span class="spanStyle"> 位</span>
            </el-form-item>
            <el-form-item label="金额" label-width="60px">
              <el-input
                type="number"
                v-model.trim="bankCollectForm.amountDigits"
                style="width: 35%"
              ></el-input
              ><span class="spanStyle"> 位</span>
              <el-checkbox
                style="margin-left: 40px"
                v-model="bankCollectForm.zeroFill"
                >不够用0填充</el-checkbox
              >
            </el-form-item>

            <div style="height: 4px"></div>
            <el-divider content-position="left"
              >返回文件数据结构调整</el-divider
            >
            <el-row>
              <el-col :span="10">
                <el-form-item label="数据" label-width="60px">
                  <span class="spanStyle">字段名</span>
                </el-form-item>
                <el-form-item label="帐号" label-width="60px">
                  <el-input
                    v-model.trim="bankCollectForm.accountFieldName"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
                <el-form-item label="金额" label-width="60px">
                  <el-input
                    v-model="bankCollectForm.amountFieldName"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
                <el-form-item label="标志" label-width="60px">
                  <el-input
                    v-model="bankCollectForm.flagFieldName"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="" label-width="30px">
                  <span class="spanStyle">开始位置</span>
                </el-form-item>
                <el-form-item label="" label-width="30px">
                  <el-input
                    type="number"
                    v-model="bankCollectForm.accountStartBit"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
                <!-- 金额开始位置 -->
                <el-form-item label="" label-width="30px">
                  <el-input
                    type="number"
                    v-model="bankCollectForm.amountStartDigit"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
                <el-form-item label="" label-width="30px">
                  <el-input
                    type="number"
                    v-model="bankCollectForm.flagStartBit"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="" label-width="30px">
                  <span class="spanStyle">长度</span>
                </el-form-item>
                <el-form-item label="" label-width="30px">
                  <el-input
                    type="number"
                    v-model="bankCollectForm.accountLength"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
                <!-- 金额长度 -->
                <el-form-item label="" label-width="30px">
                  <el-input
                    type="number"
                    v-model="bankCollectForm.amountLength"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
                <el-form-item label="" label-width="30px">
                  <el-input
                    type="number"
                    v-model="bankCollectForm.signLength"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </main>

    <section class="active-footer" v-if="showFooter">
      <el-button type="primary" plain size="small" @click="confirm"
        >确 认</el-button
      >
      <el-button plain size="small" style="margin: 0 30px" @click="cancel"
        >取 消
      </el-button>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    bankTableData: {
      type: Array,
      default: () => [],
    },
    contentStyleObj: {
      type: Object,
      default: () => {},
    },
    bankRegionList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      btnType: "",
      bankValue: "",
      backOption: [{ label: "", value: "" }],
      bankCollectForm: {},
      showFooter: false,
      copybankCollectForm: {},
      rules: {
        city: [{ required: true, message: "请填写所属城市", trigger: "blur" }],
        no: [{ required: true, message: "请填写托收代码", trigger: "blur" }],
        bankName: [{ required: true, message: "请填写托收名称", trigger: "blur" }],
        bankType: [{ required: true, message: "请选择银行代码", trigger: "blur" }],
      },
    };
  },
  watch: {
    bankTableData () {
      this.$nextTick(() => {
        this.$refs.bankSettingTable.setCurrentRow(this.bankTableData[0]);
      });
    },
  },
  computed: {
    mainHeight() {
      let heightNumber = this.contentStyleObj.height.slice(
        0,
        this.contentStyleObj.height.indexOf("p")
      );
      return Number(heightNumber) - 210 + "px";
    },
  },
  methods: {
    addBankCollect() {
      this.btnType = "add";
      this.showFooter = true;
      this.copybankCollectForm = { ...this.bankCollectForm };
      this.bankCollectForm = {};
    },
    saveBankCollect(row) {
      this.btnType = "update";
      this.showFooter = true;
    },
    delBankCollect(row) {
      this.$confirm(`确认要删除选定的 [${row.bankName}] 的设置吗?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("delBankSetting", row);
        })
        .catch(() => {
          console.log("用户点击了取消");
        });
    },
    confirm() {
      this.$refs.bankCollectForm.validate((valid) => {
        if(valid) {
          this.nextConfirm()
        }
      })
    },
    nextConfirm() {
      this.showFooter = false;
      if (this.btnType === "add") {
        this.$emit("addBankSetting", this.bankCollectForm);
      } else {
        this.$emit("updateBankSetting", this.bankCollectForm);
      }
    },
    cancel() {
      this.showFooter = false;
      this.bankCollectForm = { ...this.copybankCollectForm };
      this.copybankCollectForm = {};
    },
    handleSelectedBank(row) {
      this.bankCollectForm = { ...row };
    },
    handleHiddenFooter() {
      this.showFooter = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.bankInfo {
  width: 100%;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  position: relative;
  .add-btn {
    position: absolute;
    right: 0px;
    top: -60px;
  }
  .header {
    padding: 20px;
    justify-content: space-between;
  }
  .main {
    margin: 0px 20px 18px;
    padding: 20px 20px 10px 20px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    overflow: scroll;
  }
  .active-footer {
    text-align: right;
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    background: #ffffff;
    box-shadow: 0px 0px 4px #eaeaea;
  }
  .spanStyle {
    color: #606266;
    font-size: 14px;
  }
}
</style>