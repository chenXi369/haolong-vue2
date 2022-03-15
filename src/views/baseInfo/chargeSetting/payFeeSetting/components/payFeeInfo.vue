<template>
  <div class="payFeeInfo" :style="contentStyleObj">
    <el-tabs type="border-card" v-loading="loading">
      <el-tab-pane label="一般设置">
        <el-divider content-position="left">应收款结算日期为</el-divider>
        <main class="main">
          <el-form :model="wyPayFeeSettingForm" size="mini" label-position="left">
            <el-form-item label="">
              <el-select
                v-model="wyPayFeeSettingForm.settlementMonth"
                style="width: 155px; margin-right: 10px"
                size="mini"
              >
                <el-option
                  v-for="item in wyPayFeeSettingMonths"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                v-model="wyPayFeeSettingForm.settlementDate"
                size="mini"
                min="0"
                type="number"
                style="width: 80px"
              ></el-input>
              <span class="spanStyle"> 日结算。（月底结算输 0）</span>
            </el-form-item>

            <el-form-item label="本月费用违约金计算宽限">
              <el-input
                v-model="wyPayFeeSettingForm.graceDays"
                size="mini"
                min="0"
                type="number"
                style="width: 80px"
              ></el-input>
              <span class="spanStyle"> 天。</span>
            </el-form-item>

            <el-form-item label="往月费用违约金计算宽限">
              <el-input
                v-model="wyPayFeeSettingForm.daysOfGraceInPreviousMonths"
                size="mini"
                min="0"
                type="number"
                style="width: 80px"
              ></el-input>
              <span class="spanStyle"> 天。</span>
            </el-form-item>
            <el-form-item label="违约金计算方式采用" label-width="165px">
              <el-select
                v-model="wyPayFeeSettingForm.simpleOverdueFine"
                style="width: 130px"
                size="mini"
              >
                <el-option
                  v-for="item in debtComputedMethods"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-divider></el-divider>
            <el-form-item label="">
              <el-checkbox
                v-model="wyPayFeeSettingForm.synchronizationOfOtherTenancies"
              >
                租户的租金、管理费以外的收费项目结算与租金同步结算
              </el-checkbox>
              <div style="color: #999999; font-size: 12px">
                注：对于租户，可以选择下面的选项，以确定租户的租金、管理费之外的收费项目
                的结算和收费时段是否与租金结算同步，否则，就统一遵循上面选项的结算约定。
              </div>
            </el-form-item>
          </el-form>
        </main>
        <el-divider></el-divider>
        <!-- 说明 -->
        <section style="margin-bottom: 18px">
          <el-select v-model="selectExplain" size="mini">
            <el-option-group
              v-for="group in options"
              :key="group.label"
              label=""
            >
              <el-option
                v-for="item in group.explainList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </section>
        <div v-for="(item, index) in explainModelList" :key="item">
          <template v-if="index === selectExplain">
            <el-input
              v-model="wyPayFeeSettingForm[item]"
              type="textarea"
              :rows="7"
            >
            </el-input>
          </template>
        </div>
      </el-tab-pane>

      <el-tab-pane label="移动支付操作">
        <main class="main">
          <section class="" style="color: rgb(128, 128, 255); font-size: 12px">
            <p>特别注意：</p>
            <p>
              1.结账保护期：一般在结结转后到计量抄表期间，应收款还没完全确定的时期。
            </p>
            <p>2.托收保护期：银行托收期间，避免重复缴费。</p>
            <p>
              保护期内，系统将暂停移动支付缴费，但可以查询费用。避免但不强制各类现场缴费，系统会警告提醒！
            </p>
          </section>
          <el-divider></el-divider>
          <el-form :model="wyPayFeeSettingForm" size="mini">
            <el-form-item label="移动支付结账保护期">
              <el-select
                v-model="wyPayFeeSettingForm.closeAccountsBD"
                style="width: 100px"
              >
                <el-option
                  v-for="item in monthList"
                  :key="item"
                  :value="item"
                  :label="item == -1 ? ' ' : !item ? '月底' : item + '号'"
                >
                </el-option>
              </el-select>
              <span class="spanStyle"> 到 </span>
              <el-select
                v-model="wyPayFeeSettingForm.checkoutED"
                style="width: 100px; margin-right: 20px"
              >
                <el-option
                  v-for="item in monthList"
                  :key="item"
                  :value="item"
                  :label="item == -1 ? ' ' : !item ? '月底' : item + '号'"
                >
                </el-option>
              </el-select>
              <el-button
                type="primary"
                plain
                size="mini"
                icon="el-icon-close"
                @click="delSettleDay"
                >清 除</el-button
              >
            </el-form-item>
            <el-form-item label="移动支付托收保护期">
              <el-select
                v-model="wyPayFeeSettingForm.collectionBD"
                style="width: 100px"
              >
                <el-option
                  v-for="item in monthList"
                  :key="item"
                  :value="item"
                  :label="item == -1 ? ' ' : !item ? '月底' : item + '号'"
                >
                </el-option>
              </el-select>
              <span class="spanStyle"> 到 </span>
              <el-select
                v-model="wyPayFeeSettingForm.collectionED"
                style="width: 100px; margin-right: 20px"
              >
                <el-option
                  v-for="item in monthList"
                  :key="item"
                  :value="item"
                  :label="item == -1 ? ' ' : !item ? '月底' : item + '号'"
                >
                </el-option>
              </el-select>
              <el-button
                type="primary"
                plain
                size="mini"
                icon="el-icon-close"
                @click="delCollectDay"
                >清 除</el-button
              >
            </el-form-item>
          </el-form>
          <br />
          <el-divider content-position="left"
            >移动支付时的相关业务设置</el-divider
          >
          <section style="padding: 8px 16px">
            <el-radio-group v-model="wyPayFeeSettingForm.paymentOfOverdueFine">
              <el-radio :label="0" style="display: block"
                >计算到支付时的本次滞纳金，若有就一起支付</el-radio
              >
              <el-radio :label="1" style="margin: 15px 0"
                >不计算本次滞纳金</el-radio
              >
            </el-radio-group>
            <el-checkbox
              style="display: block"
              v-model="wyPayFeeSettingForm.withdraw"
              >车牌与常规费用项目绑定</el-checkbox
            >
          </section>
        </main>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    contentStyleObj: {
      type: Object,
      default: () => {},
    },
    wyPayFeeSettingForm: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      wyPayFeeSettingMonths: [
        { label: "计费月份的当月", value: 0 },
        { label: "计费月份的下月", value: 1 },
      ],
      selectExplain: 0,
      options: [
        {
          label: "0",
          explainList: [
            { label: "常规通知单说明", id: 0 }, //1
            { label: "常规催款单说明", id: 1 }, // 2
            { label: "临时通知单说明", id: 4 }, // 3
          ],
        },
        {
          label: "1",
          explainList: [
            { label: "常规单据说明", id: 2 }, // 4
            { label: "临时单据说明", id: 5 },
            { label: "零星单据说明", id: 7 },
            { label: "综合预收单据说明", id: 8 },
          ],
        },
        {
          label: "2",
          explainList: [
            { label: "租金管理费说明", id: 6 },
            { label: "其他说明", id: 3 },
          ],
        },
      ],
      ExplainContent: "",
      debtComputedMethods: [
        { label: "精确计算", value: 0 },
        { label: "简约计算", value: 1 },
      ],
      monthList: [
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      ],
      isComputeLatePay: 0,
      explainModelList: [
        "noticeDescription",
        "reminderNote",
        "receiptDescription",
        "otherInstructions",
        "interimNotice", // 4
        "descriptionOfTemporaryReceipt",
        "rentNoticeDescription", // 6
        "descriptionOfSporadicReceipt", // 7
        "advanceReceiptInstructions", // 8
      ],
      explainModel: "",
    };
  },
  methods: {
    delSettleDay() {
      this.$confirm("确定将结转期设置为默认值吗？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("handleSettleDay");
        })
        .catch(() => {
          console.log("点击取消");
        });
    },
    delCollectDay() {
      this.$confirm("确定将托收期设置为默认值吗？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("handleCollectDay");
        })
        .catch(() => {
          console.log("点击取消");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.payFeeInfo {
  width: 100%;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  .header {
    padding: 20px 24px;
    justify-content: space-between;
  }
  .main {
    margin: 0px 30px;
    border-radius: 5px;
  }
  .spanStyle {
    color: #606266;
  }
}
</style>