<template>
  <div class="chargeContent" :class="{ bottomHeight: isFooter }">
    <article>
      <main class="main">
        <el-row :gutter="20">
          <el-form
            :modal="chargeContForm"
            size="mini"
            label-width="85px"
            :disabled="chargeContFormDisable"
          >
            <el-tabs
              type="border-card"
              style="minheight: 650px; overflow-y: auto"
              :style="{ tableContStyle, 'height': tabHeight }"
            >
              <el-tab-pane>
                <span slot="label"
                  ><svg-icon icon-class="charge1"></svg-icon> 常规</span
                >
                <el-card class="box-card">
                  <el-col :span="8">
                    <el-form-item label="项目编号" prop="no">
                      <el-input v-model="chargeContForm.no"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="计费项目" prop="paymentItems">
                      <el-select
                        v-model="chargeContForm.paymentItems"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="(item, index) in chargeItems"
                          :key="item.no"
                          :label="
                            '[' +
                            item.billingItemsId +
                            ']' +
                            ' ' +
                            item.billingName
                          "
                          :value="index + 1"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="项目名称" prop="projectName">
                      <el-input v-model="chargeContForm.projectName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="英文名称" prop="engName">
                      <el-input v-model="chargeContForm.engName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注说明" prop="remark">
                      <el-input v-model="chargeContForm.remark"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label-width="20px" prop="watchItem">
                      <el-checkbox v-model="chargeContForm.watchItem"
                        >走表项目</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label-width="20px" prop="bankCollect">
                      <el-checkbox v-model="chargeContForm.bankCollect"
                        >银行托收项目</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label-width="20px" prop="alternativeProjects">
                      <el-checkbox v-model="chargeContForm.alternativeProjects"
                        >收费备选项目</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label-width="20px" prop="printWatch">
                      <el-checkbox v-model="chargeContForm.printWatch"
                        >当走表项目打印</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label-width="20px" prop="baseEditFee">
                      <el-checkbox v-model="chargeContForm.baseEditFee"
                        >允许编辑基本费</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label-width="20px" prop="remark">
                      <el-checkbox v-model="chargeContForm.remark"
                        >允许移动支付</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                </el-card>
                <br />
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>用量</span>
                  </div>

                  <el-col :span="12">
                    <el-form-item label="用量单位" prop="consumptionUnit">
                      <el-select
                        v-model="chargeContForm.consumptionUnit"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in dosageOptions"
                          :key="item.no"
                          :label="item.name"
                          :value="item.no"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="面积依据" prop="areaBasis">
                      <el-select
                        v-model="chargeContForm.areaBasis"
                        style="width: 100%"
                        @change="(value) => changeAreaBasis(value)"
                      >
                        <el-option
                          v-for="item in areaOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="最低用量" prop="miniAmount">
                      <el-input v-model="chargeContForm.miniAmount"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="面积公式" prop="areaFormula">
                      <el-input
                        :disabled="disableAreaBasis"
                        v-model="chargeContForm.areaFormula"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="定额用量" prop="fixedAmount">
                      <el-input v-model="chargeContForm.fixedAmount"></el-input>
                    </el-form-item>
                  </el-col>
                </el-card>
                <br />
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>价格</span>
                  </div>

                  <el-col :span="24">
                    <el-form-item label="计价币种" prop="currency">
                      <el-select
                        v-model="chargeContForm.currency"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in currencyOptions"
                          :key="item.no"
                          :label="item.name"
                          :value="item.no"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="标准单价" prop="standardPrice">
                      <el-input
                        v-model="chargeContForm.standardPrice"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="" prop="dayUnitPrice">
                      <el-checkbox v-model="chargeContForm.dayUnitPrice"
                        >日单价</el-checkbox
                      >
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="超额单价" prop="excessPrice">
                      <el-input v-model="chargeContForm.excessPrice"></el-input>
                    </el-form-item>
                  </el-col>
                </el-card>
              </el-tab-pane>

              <el-tab-pane>
                <span slot="label"
                  ><svg-icon icon-class="charge2"></svg-icon> 计算方法</span
                >
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>基数来源</span>
                  </div>

                  <el-col :span="12">
                    <el-form-item label="数据来源" prop="datSource">
                      <el-select
                        v-model="chargeContForm.datSource"
                        style="width: 100%"
                        @change="(value) => changeDatSource(value)"
                      >
                        <el-option
                          v-for="item in originTypeOptions"
                          :key="item.no"
                          :label="item.name"
                          :value="item.no"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label-width="0px" prop="sourceId">
                      <el-select
                        :disabled="[0, 3, 4].includes(chargeContForm.datSource)"
                        v-model="chargeContForm.sourceId"
                        style="width: 100%"
                        @change="(value) => changeDatSourceId(value)"
                      >
                        <el-option
                          v-for="item in projectOptions"
                          :key="item.chargingStandardId"
                          :label="'[' + item.no + ']' + ' ' + item.projectName"
                          :value="item.chargingStandardId"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      plain
                      type="warning"
                      icon="el-icon-delete"
                      size="mini"
                      @click="clear(1)"
                    >
                    </el-button>
                  </el-col>

                  <el-col>
                    <el-form-item label="来源说明" prop="sourceState">
                      <el-input
                        :rows="2"
                        type="textarea"
                        :disabled="true"
                        style="font-size: 14px"
                        v-model="chargeContForm.sourceState"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="chargeContForm.datSource === 5">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>计费用量计算公式</span>
                        <el-button
                          plain
                          style="
                            float: right;
                            padding: 3px 6px;
                            font-size: 12px;
                          "
                          type="danger"
                          @click="checkFormula(0)"
                          >检 查</el-button
                        >
                      </div>
                      <el-col :span="24">
                        <div
                          type="flex"
                          align="right"
                          style="margin: -6px 8px 10px 0px"
                        >
                          <span style="font-size: 13px; color: #1890ff"
                            >来源项目→
                          </span>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="calculateOne(1)"
                            >源净用量
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="calculateOne(2)"
                            >源计费用量
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="calculateOne(3)"
                            >源基本费
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="calculateOne(4)"
                            >源附加费
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="calculateOne(5)"
                            >营业额
                          </el-button>
                        </div>
                        <el-form-item label-width="20px" prop="pricingFormula">
                          <el-input
                            type="textarea"
                            :rows="3"
                            v-model="chargeContForm.pricingFormulaTwo"
                            style="height: 75px; overflow-y: scroll"
                          ></el-input>
                        </el-form-item>
                        <div
                          type="flex"
                          align="right"
                          style="margin: -6px 8px 10px 0px"
                        >
                          <span style="font-size: 13px; color: #1890ff"
                            >本项目→
                          </span>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="calculateOne(6)"
                            >净用量
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="calculateOne(7)"
                            >楼层
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="calculateOne(8)"
                            >计价面积
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="calculateOne(9)"
                            >营业额
                          </el-button>
                        </div>
                      </el-col>
                    </el-card>
                    <br />
                  </el-col>

                  <el-col v-if="chargeContForm.datSource === 7">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>多项目计算</span>
                        <el-button
                          plain
                          style="
                            float: right;
                            padding: 3px 6px;
                            font-size: 12px;
                          "
                          type="danger"
                          @click="checkFormula(1)"
                          >检 查</el-button
                        >
                      </div>
                      <el-col :span="24">
                        <div
                          type="flex"
                          align="right"
                          style="margin: -6px 8px 10px 0px"
                        >
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="formulaThree(1)"
                            >SF 收费项目费用
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="formulaThree(2)"
                            >SJ 收费项目单价
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="formulaThree(3)"
                            >SL 收费项目净用量
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="formulaThree(4)"
                            >SY 收费项目计费用量
                          </el-button>
                        </div>
                        <el-form-item label-width="20px" prop="pricingFormula">
                          <el-input
                            type="textarea"
                            :rows="3"
                            v-model="chargeContForm.pricingFormulaThree"
                            style="height: 75px; overflow-y: scroll"
                          ></el-input>
                        </el-form-item>
                        <div
                          type="flex"
                          align="right"
                          style="margin: -6px 8px 10px 0px"
                        >
                          <span style="float: left; font-size: 13px">
                            <span style="color: red">本项目→ </span>
                            <el-button
                              plain
                              type="primary"
                              size="mini"
                              style="padding: 3px 5px"
                              @click="formulaThree(9)"
                              >月费用
                            </el-button>
                          </span>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="formulaThree(5)"
                            >JF 计费项目费用
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="formulaThree(6)"
                            >JJ 计费项目单价
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="formulaThree(7)"
                            >JL 计费项目净用量
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="formulaThree(8)"
                            >JY 计费项目计费用量
                          </el-button>
                        </div>
                      </el-col>
                    </el-card>
                    <br />
                  </el-col>
                </el-card>

                <br />

                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>附加量或附加费用算法/有源项目基本费算法</span>
                  </div>

                  <el-col :span="24">
                    <el-form-item label="计算方式" prop="valuationMethod">
                      <el-select
                        v-model="chargeContForm.valuationMethod"
                        style="width: 100%"
                        @change="(value) => changeComputed(value)"
                      >
                        <el-option
                          v-for="item in computedOptions"
                          :key="item.no"
                          :label="item.name"
                          :value="item.no"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <transition name="el-zoom-in-top">
                    <el-col
                      v-show="!['hidden', 'show'].includes(computedLabel)"
                    >
                      <el-form-item :label="computedLabel" prop="pricingParams">
                        <el-input
                          v-model="chargeContForm.pricingParams"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </transition>

                  <el-col v-show="computedLabel === 'show'">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>计算公式可用参数名</span>
                        <el-button
                          plain
                          style="
                            float: right;
                            padding: 3px 6px;
                            font-size: 12px;
                          "
                          type="danger"
                          @click="checkFormula(2)"
                          >检 查</el-button
                        >
                      </div>
                      <el-col :span="24">
                        <div
                          type="flex"
                          align="right"
                          style="margin: -6px 8px 10px 0px"
                        >
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="inputFormula(0)"
                            >基本费
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="inputFormula(1)"
                            >附加费
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="inputFormula(2)"
                            >净用量
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="inputFormula(3)"
                            >计费用量
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="inputFormula(4)"
                            >计价面积
                          </el-button>
                          <el-button
                            plain
                            type="primary"
                            size="mini"
                            style="padding: 3px 5px"
                            @click="inputFormula(5)"
                            >楼 层
                          </el-button>
                        </div>
                        <el-form-item label-width="20px" prop="pricingFormula">
                          <el-input
                            type="textarea"
                            :rows="4"
                            v-model="chargeContForm.pricingFormulaOne"
                            style="height: 90px; overflow-y: scroll"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-card>
                    <br />
                  </el-col>
                </el-card>
              </el-tab-pane>

              <el-tab-pane>
                <span slot="label"
                  ><svg-icon icon-class="charge3"></svg-icon>
                  精度/时段/违约金</span
                >
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>其它设置</span>
                  </div>

                  <el-col :span="12">
                    <el-form-item label="计量精度" prop="dosageAccuracy">
                      <el-select
                        v-model="chargeContForm.dosageAccuracy"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in currencyOptions"
                          :key="item.no"
                          :label="item.name"
                          :value="item.no"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="计价精度" prop="pricingAccuracy">
                      <el-select
                        v-model="chargeContForm.pricingAccuracy"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in currencyOptions"
                          :key="item.no"
                          :label="item.name"
                          :value="item.no"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="违约金比例" prop="lateFeeRatio">
                      <el-input
                        v-model="chargeContForm.lateFeeRatio"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-card>

                <br />

                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>收费时段取</span>
                  </div>

                  <el-col :span="16">
                    <el-row :gutter="0">
                      <el-col :span="8">
                        <el-form-item
                          label="收费时段"
                          label-width="70px"
                          prop="startMonth"
                        >
                          <el-select
                            v-model="chargeContForm.startMonth"
                            @change="(value) => changeStartMonth(value)"
                          >
                            <el-option
                              v-for="item in startMonthOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-form-item label-width="5px" prop="startDay">
                          <el-input
                            type="number"
                            v-model="chargeContForm.startDay"
                            min="1"
                            max="28"
                            @input="changeStartDay"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item
                          label="日到"
                          label-width="50px"
                          prop="endMonth"
                        >
                          <el-select
                            v-model="chargeContForm.endMonth"
                            @change="(value) => changeEndMonth(value)"
                          >
                            <el-option
                              v-for="item in startMonthOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-form-item label-width="5px" prop="endDay">
                          <el-input
                            type="number"
                            v-model="chargeContForm.endDay"
                            min="0"
                            max="28"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="计费周期" prop="timeUnit">
                      <el-select
                        v-model="chargeContForm.timeUnit"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in billCycleOptions"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <p class="feeTime">
                      相对于计费月份而言：<span class="feeTimeSpan"
                        >收费时段为 {{ startMonthName }}
                        {{ chargeContForm.startDay }}日 到 {{ endMonthName }}
                        {{
                          chargeContForm.endDay == 0
                            ? "底"
                            : chargeContForm.endDay + "日"
                        }}</span
                      >
                    </p>
                  </el-col>
                </el-card>
                <br />
                <el-card class="box-card">
                  <el-col :span="24">
                    <el-form-item label-width="20px" prop="chargingCycle">
                      <el-checkbox v-model="chargeContForm.chargingCycle"
                        >是否指定</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label-width="20px" prop="specifyMonth">
                      <el-checkbox-group
                        v-model="chargeContForm.specifyMonth"
                        :disabled="!chargeContForm.chargingCycle"
                        @change="handleMonthsChange"
                      >
                        <el-checkbox
                          v-for="month in monthsOptions"
                          :label="month"
                          :key="month"
                          >{{ month }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-card>
              </el-tab-pane>

              <el-tab-pane>
                <span slot="label"
                  ><svg-icon icon-class="charge4"></svg-icon>
                  票据打印/预计抵扣顺序</span
                >
                <el-col :span="12">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>通知单打印选项</span>
                    </div>
                    <el-col :span="20">
                      <el-form-item label="费用计入" prop="notifyPrint">
                        <el-select
                          v-model="chargeContForm.notifyPrint"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in costInsideOptions"
                            :key="item.no"
                            :label="item.name"
                            :value="item.no"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-button
                        plain
                        type="warning"
                        icon="el-icon-delete"
                        size="mini"
                        @click="clear(2)"
                      >
                      </el-button>
                    </el-col>

                    <el-col>
                      <div class="remarkMsg">
                        注：指定本项目可以打印在选定类别的通知单上。
                      </div>
                    </el-col>
                  </el-card>
                  <br />
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>收款票据打印选项</span>
                    </div>
                    <el-col :span="20">
                      <el-form-item label="基本费计入" prop="invoicePrint">
                        <el-select
                          v-model="chargeContForm.invoicePrint"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in printOptions"
                            :key="item.no"
                            :label="item.name"
                            :value="item.no"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-button
                        plain
                        type="warning"
                        icon="el-icon-delete"
                        size="mini"
                        @click="clear(3)"
                      >
                      </el-button>
                    </el-col>

                    <el-col :span="20">
                      <el-form-item label="违约金计入" prop="lateFeePrint">
                        <el-select
                          v-model="chargeContForm.lateFeePrint"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in printOptions"
                            :key="item.no"
                            :label="item.name"
                            :value="item.no"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-button
                        plain
                        type="warning"
                        icon="el-icon-delete"
                        size="mini"
                        @click="clear(4)"
                      >
                      </el-button>
                    </el-col>
                    <el-col>
                      <div class="remarkMsg">
                        注：指定本项目可以打印在选定类别的票据上。
                      </div>
                    </el-col>
                  </el-card>
                  <br />
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>费用分类（广东污水、垃圾处理费专用）</span>
                    </div>
                    <el-col :span="24">
                      <el-form-item label="费用类别" prop="feeType">
                        <el-select
                          v-model="chargeContForm.feeType"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in feeTypeOptions"
                            :key="item.no"
                            :label="item.name"
                            :value="item.no"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-card>
                </el-col>

                <el-col :span="12">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>固定项目序号</span>
                    </div>
                    <el-col :span="24">
                      <el-form-item label="项目序号" prop="itemNo">
                        <el-input v-model="chargeContForm.itemNo"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <div class="remarkMsg">
                        注：默认为-1，表示系统自动编号，一般不要变更！
                      </div>
                    </el-col>
                  </el-card>
                  <br />
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>综合预收款抵扣顺序号</span>
                    </div>
                    <el-col :span="24">
                      <el-form-item label="抵扣序号" prop="deductionOrder">
                        <el-input
                          v-model="chargeContForm.deductionOrder"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <div class="remarkMsg">
                        注：默认为0，表示按计费和和收费项目编号排序。
                      </div>
                    </el-col>
                  </el-card>
                  <br />
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>增值税税率</span>
                    </div>
                    <el-col :span="24">
                      <el-form-item label="基本费税率" prop="principalTaxRate">
                        <el-input
                          v-model="chargeContForm.principalTaxRate"
                        ></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="24">
                      <el-form-item label="滞纳金税率" prop="lateFeeTaxRate">
                        <el-input
                          v-model="chargeContForm.lateFeeTaxRate"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-card>
                </el-col>
              </el-tab-pane>

              <el-tab-pane>
                <span slot="label"
                  ><svg-icon icon-class="charge5"></svg-icon> 峰平谷单价</span
                >
                <el-card class="box-card">
                  <el-col :span="24">
                    <el-form-item label="峰单价" prop="peakUnitPrice">
                      <el-input
                        v-model="chargeContForm.peakUnitPrice"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="尖峰单价" prop="topUnitPrice">
                      <el-input
                        v-model="chargeContForm.topUnitPrice"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="平单价" prop="averageUnitPrice">
                      <el-input
                        v-model="chargeContForm.averageUnitPrice"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="谷单价" prop="valleyUnitPrice">
                      <el-input
                        v-model="chargeContForm.valleyUnitPrice"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-card>
              </el-tab-pane>

              <el-tab-pane>
                <span slot="label"
                  ><svg-icon icon-class="charge6"></svg-icon>
                  空置期费用计算系数</span
                >
                <el-card class="box-card">
                  <div slot="header" class="clearfix" style="padding: 0px 4px">
                    <span>空置期费用计算系数的计算公式</span>
                    <el-button
                      plain
                      style="float: right; padding: 3px 6px; font-size: 12px"
                      type="danger"
                      @click="checkFormula(3)"
                      >校验计算公式</el-button
                    >
                  </div>
                  <el-col :span="24">
                    <div
                      type="flex"
                      align="right"
                      style="margin: -6px 8px 10px 0px"
                    >
                      <el-button
                        plain
                        type="primary"
                        size="mini"
                        style="padding: 3px 5px"
                        @click="inputFormulaNone(1)"
                        >开始日
                      </el-button>
                      <el-button
                        plain
                        type="primary"
                        size="mini"
                        style="padding: 3px 5px"
                        @click="inputFormulaNone(2)"
                        >截止日
                      </el-button>
                      <el-button
                        plain
                        type="primary"
                        size="mini"
                        style="padding: 3px 5px"
                        @click="inputFormulaNone(3)"
                        >空置天数
                      </el-button>
                      <el-button
                        plain
                        type="primary"
                        size="mini"
                        style="padding: 3px 5px"
                        @click="inputFormulaNone(4)"
                        >当月天数
                      </el-button>
                      <el-button
                        plain
                        type="primary"
                        size="mini"
                        style="padding: 3px 5px"
                        @click="inputFormulaNone(5)"
                        >iif(,,)
                      </el-button>
                    </div>
                    <el-form-item
                      label-width="10px"
                      prop="vacantCalculateFormula"
                    >
                      <el-input
                        type="textarea"
                        :rows="4"
                        v-model="chargeContForm.vacantCalculateFormula"
                        style="height: 90px; overflow-y: scroll"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <div class="remarkMsg">
                      注：当公式为空时，不使用空置系数计算方式。
                    </div>
                  </el-col>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-row>
      </main>
    </article>
  </div>
</template>

<script>
import { getDictionary } from "@/api/system/systemData";

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
export default {
  name: "chargeContent",
  props: {
    isFooter: {
      type: Boolean,
      default: false,
    },
    contentStyleObj: {
      type: Object,
      default: () => {},
    },
    tableContStyle: {
      type: Object,
      default: () => {},
    },
    chargeContForm: {
      type: Object,
      default: () => {},
    },
    disableAreaBasis: {
      type: Boolean,
      default: true,
    },
    computedLabel: {
      type: String,
      default: "",
    },
    chargeContFormDisable: {
      type: Boolean,
      default: false,
    },
    projectOptions: {
      type: Array,
      default: () => [],
    },
    chargeItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      months: [],
      dosageOptions: [],
      areaOptions: [
        {
          label: "a = 建筑面积",
          value: 0,
        },
        {
          label: "b = 套内面积",
          value: 1,
        },
        {
          label: "c = 附属面积1",
          value: 2,
        },
        {
          label: "d = 附属面积2",
          value: 3,
        },
        {
          label: "面积公式",
          value: 4,
        },
      ],
      originTypeOptions: [
        {
          name: "默认",
          no: 0,
        },
        {
          name: "依据指定项目计算用量",
          no: 1,
        },
        {
          name: "依据指定项目计算费用",
          no: 2,
        },
        {
          name: "依照上次费用",
          no: 3,
        },
        {
          name: "从文件导入",
          no: 4,
        },
        {
          name: "参考制定项目按公式计算",
          no: 5,
        },
        {
          name: "费用与指定项目关联",
          no: 6,
        },
        {
          name: "来源多项目按公式计算",
          no: 7,
        },
      ],
      originDataOptions: [
        {
          name: "商业水费",
          no: 0,
        },
        {
          name: "商业排水费",
          no: 1,
        },
        {
          name: "加压费",
          no: 2,
        },
        {
          name: "垃圾费",
          no: 3,
        },
        {
          name: "电费",
          no: 4,
        },
        {
          name: "租金",
          no: 5,
        },
        {
          name: "管理费",
          no: 6,
        },
        {
          name: "分摊电费",
          no: 7,
        },
        {
          name: "表维修费",
          no: 8,
        },
      ],
      currencyOptions: [],
      computedOptions: [
        {
          name: "默认",
          no: 0,
        },
        {
          name: "按计算公式",
          no: 1,
        },
        {
          name: "基本费 × 比例",
          no: 2,
        },
        {
          name: "增加费用",
          no: 3,
        },
        {
          name: "用量 × 比例",
          no: 4,
        },
        {
          name: "增加用量",
          no: 5,
        },
        {
          name: "绝对费用",
          no: 6,
        },
        {
          name: "绝对用量",
          no: 7,
        },
      ],
      billCycleOptions: [
        {
          name: "月",
        },
        {
          name: "季",
        },
        {
          name: "半年",
        },
        {
          name: "年",
        },
      ],
      costInsideOptions: [
        {
          name: "第一租赁公司",
          no: 0,
        },
        {
          name: "第二租赁公司",
          no: 1,
        },
        {
          name: "租赁通知",
          no: 2,
        },
      ],
      feeTypeOptions: [
        {
          name: "默认",
          no: 0,
        },
        {
          name: "集体居民",
          no: 1,
        },
        {
          name: "行政",
          no: 2,
        },
        {
          name: "工业",
          no: 3,
        },
        {
          name: "商业建筑",
          no: 4,
        },
        {
          name: "特种行业",
          no: 5,
        },
      ],
      printOptions: [
        {
          name: "广州国税",
          no: 0,
        },
        {
          name: "广州地税",
          no: 1,
        },
        {
          name: "广州收据",
          no: 2,
        },
        {
          name: "深圳国税发票",
          no: 3,
        },
        {
          name: "深圳地税发票",
          no: 4,
        },
        {
          name: "深圳收据",
          no: 5,
        },
        {
          name: "深圳地税机打发票",
          no: 6,
        },
      ],
      datSourceOptions: [
        {
          name: "深圳地税发票",
          no: 0,
        },
        {
          name: "深圳收据",
          no: 1,
        },
        {
          name: "深圳地税机打发票",
          no: 2,
        },
      ],
      startMonthOptions: [
        { label: "上 12月", value: -12 },
        { label: "上 11月", value: -11 },
        { label: "上 10月", value: -10 },
        { label: "上 9月", value: -9 },
        { label: "上 8月", value: -8 },
        { label: "上 7月", value: -7 },
        { label: "上 6月", value: -6 },
        { label: "上 5月", value: -5 },
        { label: "上 4月", value: -4 },
        { label: "上 3月", value: -3 },
        { label: "上 2月", value: -2 },
        { label: "上 1月", value: -1 },
        { label: "当 月", value: 0 },
        { label: "下 1月", value: 1 },
        { label: "下 2月", value: 2 },
        { label: "下 3月", value: 3 },
        { label: "下 4月", value: 4 },
        { label: "下 5月", value: 5 },
        { label: "下 6月", value: 6 },
        { label: "下 7月", value: 7 },
        { label: "下 8月", value: 8 },
        { label: "下 9月", value: 9 },
        { label: "下 10月", value: 10 },
        { label: "下 11月", value: 11 },
        { label: "下 12月", value: 12 },
      ],
      startMonth: "",
      startDay: 0,
      endMonth: "",
      endDay: 0,
      monthArr: [],
      monthsOptions: monthOptions,
    };
  },
  created() {
    // this.getProjectOption()
    this.getDosageOption();
    this.getCurrencyOption();
  },
  computed: {
    startMonthName() {
      const newArr = this.startMonthOptions.filter((item) => {
        if (item.value === this.chargeContForm.startMonth) return item.label;
      });
      if (newArr && newArr.length > 0) {
        return newArr[0].label;
      } else {
        return false;
      }
    },
    endMonthName() {
      const newArr2 = this.startMonthOptions.filter((item) => {
        if (item.value === this.chargeContForm.endMonth) return item.label;
      });
      if (newArr2 && newArr2.length > 0) {
        return newArr2[0].label;
      } else {
        return false;
      }
    },
    tabHeight() {
      let tabHeight = this.contentStyleObj.height.slice(
        0,
        this.contentStyleObj.height.indexOf("p")
      );
      return parseFloat(tabHeight) - 70 + 'px'
    },
  },
  methods: {
    getProjectOption() {
      getDictionary({ nodeName: "" }).then(() => {});
    },
    getDosageOption() {
      getDictionary({ nodeName: "计量单位" }).then((res) => {
        this.dosageOptions = [...res.data];
      });
    },
    getCurrencyOption() {
      getDictionary({ nodeName: "币种" }).then((res) => {
        this.currencyOptions = [...res.data];
      });
    },
    clear(val) {
      this.$emit("clearTabs", val);
    },
    changeAreaBasis(val) {
      this.$emit("changeAreaBasis", val);
    },
    // 修改数据来源
    changeDatSource(val) {
      this.$emit("changeDatSource", val);
    },
    changeDatSourceId(val) {
      this.$emit("changeDatSourceId", val);
    },
    changeComputed(val) {
      this.$emit("changeComputed", val);
    },
    inputFormulaNone(val) {
      this.$emit("pricingInput", val);
    },
    // 校验计算公式
    inputFormula(val) {
      this.$emit("inputFormula", val);
    },
    calculateOne(val) {
      this.$emit("calculateOne", val);
    },
    formulaThree(val) {
      this.$emit("formulaThree", val);
    },
    // 检查计算公式
    checkFormula(e) {
      console.log(this.chargeContForm.pricingFormulaOne)
      switch (e) {
        case 0:
          this.$emit("checkEquation", this.chargeContForm.pricingFormulaTwo)
          break;
        case 1:
          this.$emit("checkEquation", this.chargeContForm.pricingFormulaThree)
          break;
        case 2:
          this.$emit("checkEquation", this.chargeContForm.pricingFormulaOne)
          break;
        case 3:
          this.$emit("checkEquation", this.chargeContForm.vacantCalculateFormula)
          break;
        default:
          this.$emit("checkEquation")
          break;
      }
      this.$emit()
    },
    handleMonthsChange(val) {
      this.$emit("changeMonths", val);
    },
    // 收费时段开始月改变
    changeStartMonth(val) {
      this.$emit("changeStartMonth", val);
    },
    changeEndMonth(val) {
      this.$emit("changeEndMonth", val);
    },
    changeStartDay(val) {
      this.$emit("changeStartDay", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.chargeContent {
  padding: 5px 10px;
  .main {
    .remarkMsg {
      font-size: 12px;
      color: #1890ff;
      padding-left: 20px;
      margin: -4px 0px 8px 0px;
    }
    .feeTime {
      font-size: 14px;
      color: #606266;
      padding-left: 2px;
      .feeTimeSpan {
        color: #1890ff;
      }
    }
  }
}
.bottomHeight {
  margin-bottom: 38px;
}
</style>
