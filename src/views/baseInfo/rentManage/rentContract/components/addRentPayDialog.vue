<template>
  <div class="addRentPayDialog">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <main>
        <el-row :gutter="20">
          <el-form
            ref="rentPayForm"
            :model="rentPayForm"
            label-width="80px"
            :rules="rules"
          >
            <el-col :span="12">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span class="title">租金核算方式</span>
                </div>
                <el-col :span="24">
                  <el-form-item label-width="10px" prop="tlMethod">
                    <el-radio-group
                      v-model="rentPayForm.tlMethod"
                      @change="radioChange"
                    >
                      <section class="radio-group">
                        <el-radio
                          class="radio"
                          :label="1"
                          border
                          style="margin-right: 10px"
                          >固定租金</el-radio
                        >
                        <el-radio class="radio" :label="2" border
                          >固定初始租金，分时段递增</el-radio
                        >
                        <el-radio class="radio" :label="3" border
                          >固定提留比例</el-radio
                        >
                        <el-radio
                          class="radio"
                          :label="5"
                          border
                          style="margin-left: 10px"
                          >保底提留</el-radio
                        >
                        <el-radio class="radio" :label="0" border
                          >按计算公式计算</el-radio
                        >
                        <el-radio class="radio" :label="4" border
                          >固定租金 + 营业额超基数部分按比例提留</el-radio
                        >
                      </section>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-card>
              <br />
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span class="title">固定租金</span>
                </div>
                <div>
                  <el-col :span="24">
                    <el-form-item label="租金单价" size="mini" prop="unitRent">
                      <el-input
                        v-model="rentPayForm.unitRent"
                        :disabled="disabled.disabledOne"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="租金" size="mini" prop="rentVal">
                      <el-input
                        v-model="rentPayForm.rentVal"
                        :disabled="disabled.disabledOne"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      label-width="0px"
                      size="mini"
                      prop="guaranteedRentStatus"
                    >
                      <el-checkbox
                        v-model="rentPayForm.guaranteedRentStatus"
                        :disabled="disabled.disabledTwo"
                        >保底租金</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                </div>
              </el-card>
              <br />
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span class="title">递增设置</span>
                </div>
                <el-col :span="24">
                  <el-form-item
                    label="每"
                    size="mini"
                    label-width="25px"
                    prop="interval"
                  >
                    <section style="display: flex">
                      <el-col :span="16">
                        <el-input v-model="rentPayForm.interval"></el-input>
                      </el-col>
                      <el-col :span="8">
                        <span>个月调租</span>
                      </el-col>
                    </section>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="0" size="mini">
                    <el-checkbox
                      :disabled="disabled.disabledThree"
                      v-model="isAddRate"
                      >{{ isAddRate ? "递增值" : "递增率" }}</el-checkbox
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="10px"
                    size="mini"
                    prop="incrementalParam"
                  >
                    <el-input
                      v-model="rentPayForm.incrementalParam"
                      :disabled="disabled.disabledThree"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="10px"
                    size="mini"
                    prop="incrementalMethod"
                  >
                    <el-checkbox
                      :disabled="disabled.disabledThree"
                      v-model="rentPayForm.incrementalMethod"
                      >按复利递增</el-checkbox
                    >
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span class="title">指定时段</span>
                </div>

                <div>
                  <el-col :span="24">
                    <el-form-item label="开始日期" size="mini" prop="startDate">
                      <el-date-picker
                        v-model="rentPayForm.startDate"
                        type="date"
                        style="width: 100%"
                        placeholder="选择日期"
                        @change="(value) => startChange(value)"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="租期" size="mini" prop="leaseMonths">
                      <section style="display: flex">
                        <el-input
                          style="width: 33%"
                          v-model="rentPayForm.leaseMonths"
                          clearable
                          @change="(value) => monthChange(value)"
                        /><span style="padding: 0 10px">个月</span>
                        <el-input
                          style="width: 27%"
                          v-model="rentPayForm.leaseDays"
                          clearable
                          @change="(value) => dayChange(value)"
                        /><span style="padding: 0 10px">日</span>
                      </section>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="结束日期" size="mini" prop="endDate">
                      <el-date-picker
                        v-model="rentPayForm.endDate"
                        type="date"
                        style="width: 100%"
                        placeholder="选择日期"
                        @change="(value) => arriveChange(value)"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item
                      label="交租周期"
                      size="mini"
                      prop="rentPaymentCycle"
                    >
                      <el-select
                        @change="rentCycleChange"
                        v-model="rentPayForm.rentPaymentCycle"
                      >
                        <el-option
                          v-for="item in rentPaymentCycle"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="每" size="mini" label-width="20px">
                      <el-input
                        :disabled="rentPayForm.rentPaymentCycle !== 0"
                        style="width: 50%; margin: 0 6px"
                        v-model="rentPayMonth"
                        clearable
                      />个月交租
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="每第" size="mini" prop="paymentMonth">
                      <el-input
                        :disabled="true"
                        style="width: 33%; margin: 0 6px 0 0"
                        v-model="rentPayForm.paymentMonth"
                        clearable
                      />个月
                      <el-input
                        :disabled="true"
                        style="width: 27%; margin: 0 6px"
                        v-model="rentPayForm.rentPaymentDate"
                        clearable
                      />日前交租
                    </el-form-item>
                  </el-col>
                </div>
              </el-card>
              <br />
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span class="title">浮动租金</span>
                </div>

                <div>
                  <el-col :span="24">
                    <el-form-item label="营业额数" size="mini" prop="baseVal">
                      <el-input
                        v-model="rentPayForm.baseVal"
                        :disabled="disabled.disabledFour"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="比例" size="mini" prop="tlRatio">
                      <el-input
                        v-model="rentPayForm.tlRatio"
                        :disabled="disabled.disabledFive"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      label=""
                      size="mini"
                      label-width="10px"
                      prop="outOfTlStatus"
                    >
                      <el-checkbox
                        :disabled="disabled.disabledFour"
                        v-model="rentPayForm.outOfTlStatus"
                        >超出部分提留</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                </div>
              </el-card>
              <br />
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span class="title">分段管理费设置</span>
                </div>
                <el-col :span="24">
                  <el-form-item label="管理费" size="mini" prop="manageFee">
                    <el-input v-model="rentPayForm.manageFee"></el-input>
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>
            <el-col :span="24">
              <br />
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span style="line-height: 26px">计算公式（已知数为‘营业额’）</span>
                  <span style="float: right; padding: 3px 0">
                    <el-button style="padding: 4px 10px" plain type="primary" size="mini" :disabled="disabled.disabledSix" @click="defaultVal()">默认值</el-button>
                    <el-button style="padding: 4px 10px" plain type="success" size="mini" :disabled="disabled.disabledSix" @click="checkout()">校 验</el-button>
                  </span>
                </div>
                <el-col :span="24">
                  <el-form-item label-width="0px" prop="calculateFormula">
                    <el-input
                      :disabled="disabled.disabledSix"
                      type="textarea"
                      style="height: 90px; overflow-y: scroll"
                      :rows="4"
                      v-model="rentPayForm.calculateFormula"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>
          </el-form>
        </el-row>
      </main>
      <div slot="footer" style="margin-bottom: 40px">
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
        <el-button @click="cancel" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    rentPayForm: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: "",
    },
    rentPayMonth: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      rentPayCycle: "",
      rentPaymentCycle: [
        {
          label: "指 定",
          value: 0,
        },
        {
          label: "按双月",
          value: 1,
        },
        {
          label: "按季度",
          value: 2,
        },
        {
          label: "每四月",
          value: 3,
        },
        {
          label: "按半年",
          value: 4,
        },
        {
          label: "按一年",
          value: 5,
        },
      ],
      isAddRate: false,
      rules: {
        startDate: [
          { required: true, trigger: "blur", message: "请输入开始日期" },
        ],
        endDate: [
          { required: true, trigger: "blur", message: "请输入结束日期" },
        ],
      },
    };
  },
  methods: {
    confirm() {
      this.$refs["rentPayForm"].validate((valid) => {
        if (valid) {
          this.$emit("submitTl", this.rentPayForm);
        }
      });
    },
    cancel() {
      this.$emit("closeDailog", false);
    },
    handleClose() {
      this.$emit("closeDailog", false);
    },
    rentCycleChange(val) {
      this.$emit("changeRentMonth", val);
    },
    // 租金核算方式改变
    radioChange(val) {
      this.isAddRate = false;
      this.$emit("changeTlType", val);
    },
    // 起租日期改变
    startChange(val) {
      this.$emit("changeStartDay", val);
    },
    // 到租日期改变
    arriveChange(val) {
      this.$emit("changeEndDay", val);
    },
    monthChange(val) {
      this.$emit("changeMonths", val);
    },
    dayChange(val) {
      this.$emit("changeDays", val);
    },
    // 面积依据改变
    changeAreaBasis(val) {
      this.$emit("changeAreaBasis", val);
    },
    defaultVal() {
      this.$emit('getDefaultVal')
    },
    // 校验
    checkout() {
      this.$emit('checkOut', this.rentPayForm.calculateFormula)
    }
  },
};
</script>

<style lang="scss" scoped>
.addRentPayDialog {
  .radio-group {
    // display: flex;
    // flex-direction: column;
    .radio {
      margin: 11px 0px 1px;
      height: 30px;
      padding: 7px 20px 0 10px;
      &:first-child {
        margin-top: 0px;
      }
      &:nth-child(2) {
        margin-top: 0px;
      }
    }
  }
}
.el-card__header {
  padding: 8px 20px;
}
.el-card__body {
  padding: 9px 12px 0px;
}
.el-radio {
  .el-radio__input {
    display: none;
  }
  &.is-checked {
    position: relative;
    &:after {
      content: "";
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      border-top: 15px solid #189fff;
      border-left: 15px solid transparent;
    }
  }
}
</style>
