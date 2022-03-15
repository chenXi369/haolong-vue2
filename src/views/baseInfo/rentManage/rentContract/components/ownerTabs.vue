<template>
  <div class="ownerTabs">
    <el-row>
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>客户资料</span>
          <span style="float: right; padding: 3px 0">
            <button class="trans-hover" @click="toOwnerInfo">
              <svg-icon icon-class="send"></svg-icon>
              详 情
            </button>
          </span>
        </div>
        <div>
          <el-col :span="24">
            <el-form
              ref="rentOwnerInfo"
              :label-position="labelPosition"
              label-width="85px"
              :model="contractInfo.rentOwnerInfo"
              :rules="rules"
            >
              <el-col :span="12">
                <el-form-item label="客户名称" size="mini" prop="customerName">
                  <el-input
                    v-model="contractInfo.rentOwnerInfo.customerName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="简 码" size="mini" prop="shortCode">
                  <el-input
                    v-model="contractInfo.rentOwnerInfo.shortCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="手 机" size="mini" prop="mobile">
                  <el-input
                    v-model="contractInfo.rentOwnerInfo.mobile"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </div>
      </el-card>
    </el-row>

    <br />
    <el-row :gutter="24">
      <el-form
        ref="ownerRegisterForm"
        :label-position="labelPosition"
        label-width="85px"
        :rules="rentRules"
        :model="contractInfo.contractForm"
        :disabled="this.$route.query.state !== undefined"
      >
        <el-col :span="24">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>基本资料</span>
            </div>
            <el-col :span="18">
              <el-form-item
                label="内部房号"
                size="mini"
                prop="internalRoomNumber"
              >
                <el-input
                  v-model="contractInfo.contractForm.internalRoomNumber"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="mini" prop="contractStatus">
                <el-select
                  :disabled="this.$route.query.value === 'newRent'"
                  v-model="contractInfo.contractForm.contractStatus"
                >
                  <el-option
                    v-for="item in rentState"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-card>
          <br />
        </el-col>
        <!-- 右侧数据 -->
        <el-col :span="12">
          <el-card shadow="hover" style="padding-bottom: 4px">
            <div slot="header" class="clearfix">
              <span>合同基本信息</span>
            </div>
            <div>
              <el-col :span="12">
                <el-form-item label="合同编号" size="mini" prop="contractNo">
                  <el-input
                    v-model="contractInfo.contractForm.contractNo"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同日期" size="mini" prop="contractDate">
                  <el-date-picker
                    v-model="contractInfo.contractForm.contractDate"
                    clearable
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider></el-divider>
              </el-col>
              <el-col :span="12">
                <el-form-item label="起租日期" size="mini" prop="startingDate">
                  <el-date-picker
                    v-model="contractInfo.contractForm.startingDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                    @change="(value) => startChange(value)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="到租日期"
                  size="mini"
                  prop="rentArrivalDate"
                >
                  <el-date-picker
                    v-model="contractInfo.contractForm.rentArrivalDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                    :picker-options="pickerOptions"
                    @change="(value) => arriveChange(value)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="租 期" size="mini" prop="leaseMonths">
                  <section style="display: flex">
                    <el-input
                      style="width: 30%"
                      maxlength="2"
                      v-model="contractInfo.contractForm.leaseMonths"
                      clearable
                      @change="(value) => monthChange(value)"
                    /><span style="padding: 0 10px">个月</span>
                    <el-input
                      style="width: 30%"
                      maxlength="2"
                      v-model="contractInfo.contractForm.leaseDays"
                      clearable
                      @change="(value) => dayChange(value)"
                    /><span style="padding: 0 10px">日</span>
                  </section>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="交租周期"
                  size="mini"
                  prop="rentPaymentCycle"
                >
                  <el-select
                    style="width: 100%"
                    @change="rentCycleChange"
                    v-model="contractInfo.contractForm.rentPaymentCycle"
                  >
                    <el-option
                      v-for="item in rentPaymentCycles"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" size="mini" label-width="20px" prop="intervalOfEachPeriod">
                  每
                  <el-input
                    :disabled="contractInfo.contractForm.rentPaymentCycle !== 0"
                    style="width: 50%; margin: 0 6px"
                    v-model="contractInfo.contractForm.intervalOfEachPeriod"
                    maxlength="2"
                    clearable
                  />个月交租
                </el-form-item>
              </el-col>
              <el-col>
                <el-divider></el-divider>
              </el-col>
              <el-col :span="12">
                <el-form-item label="交房日期" size="mini" prop="checkInDate">
                  <el-date-picker
                    v-model="contractInfo.contractForm.checkInDate"
                    clearable
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="业 务 员" size="mini" prop="salesman">
                  <el-input
                    v-model="contractInfo.contractForm.salesman"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" size="mini" prop="associationCode">
                  <el-checkbox>企业</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" size="mini" prop="associationCode">
                  <el-checkbox>境外</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="关联代码"
                  size="mini"
                  prop="associationCode"
                >
                  <el-input
                    v-model="contractInfo.contractForm.associationCode"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </div>
          </el-card>
          <br />
          <el-card shadow="hover" style="padding-bottom: 4px">
            <div slot="header" class="clearfix">
              <span>费用核算</span>
            </div>
            <el-col :span="12">
              <el-form-item label="同步类型" prop="leaseSynchronization">
                <el-radio-group
                  v-model="contractInfo.contractForm.leaseSynchronization"
                >
                  <el-radio :label="false">自然月</el-radio>
                  <el-radio :label="true">租期</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="折算类型" prop="conversionMethod">
                <el-radio-group
                  v-model="contractInfo.contractForm.conversionMethod"
                >
                  <el-radio :label="false">自然天</el-radio>
                  <el-radio :label="true">30天</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- <el-divider></el-divider> -->
            <el-col :span="20">
              <el-form-item label="每第" prop="rentMonth">
                <el-input
                  v-model="contractInfo.contractForm.rentMonth"
                  size="mini"
                  style="width: 30%; margin: 0 10px"
                />个月<el-input
                  v-model="contractInfo.contractForm.rentPaymentDate"
                  size="mini"
                  style="width: 30%; margin: 0 10px"
                />日前交租
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="每">
                <el-input
                  v-model="contractInfo.contractForm.rentAdjustmentCycle"
                  size="mini"
                  style="width: 50%; margin: 0 10px"
                />个月调租
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="leaseSynchronization" label-width="10px">
                <el-checkbox
                  v-model="contractInfo.contractForm.leaseSynchronization"
                  >同步管理费</el-checkbox
                >
              </el-form-item>
            </el-col>
            <el-col :span="24" style="position: relative">
              <el-divider></el-divider>
              <el-checkbox
                v-model="isShowAddRate"
                style="position: absolute; top: 32px; left: 30px"
              ></el-checkbox>
              <el-col :span="12">
                <el-form-item
                  :label="isShowAddRate? '递增额':'递增率'"
                  size="mini"
                  prop="incrementalParameter"
                >
                  <el-input
                    :disabled="!isShowAddRate"
                    v-model="contractInfo.contractForm.incrementalParameter"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="调租算法"
                  size="mini"
                  prop="rentAdjustmentAlgorithm"
                >
                  <el-select
                    v-model="contractInfo.contractForm.rentAdjustmentAlgorithm"
                    style="width: 105.5%"
                  >
                    <el-option label="标准算法" :value="false"></el-option>
                    <el-option label="复利算法" :value="true"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>

            <el-col :span="12">
              <el-form-item label="计价精度" size="mini" prop="pricingAccuracy">
                <el-select
                  v-model="contractInfo.contractForm.pricingAccuracy"
                  style="width: 100%"
                >
                  <el-option label="元" :value="0"></el-option>
                  <el-option label="角" :value="1"></el-option>
                  <el-option label="分" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面积依据" size="mini" prop="areaBasis">
                <el-select
                  v-model="contractInfo.contractForm.areaBasis"
                  style="width: 100%"
                  @change="(value) => changeAreaBasis(value)"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面积公式" size="mini" prop="areaFormula">
                <el-input
                  :disabled="disableAreaBasis"
                  v-model="contractInfo.contractForm.areaFormula"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计租面积" size="mini" prop="valuationArea">
                <el-input
                  v-model="contractInfo.contractForm.valuationArea"
                  clearable
                >
                  <span slot="suffix">㎡</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-divider style="margin: 5px 0"></el-divider>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" size="mini" prop="basedOnDailyRent">
                <el-checkbox
                  v-model="contractInfo.contractForm.basedOnDailyRent"
                  >按日租金核算</el-checkbox
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="日租单价"
                size="mini"
                prop="unitPriceOfDailyRent"
              >
                <el-input
                  v-model="contractInfo.contractForm.unitPriceOfDailyRent"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="月租单价"
                size="mini"
                prop="unitPriceOfMonthlyRent"
              >
                <el-input
                  v-model="contractInfo.contractForm.unitPriceOfMonthlyRent"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="月租合价"
                size="mini"
                prop="totalMonthlyRent"
              >
                <el-input
                  v-model="contractInfo.contractForm.totalMonthlyRent"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="管理费单价"
                size="mini"
                prop="unitPriceOfManagementFee"
              >
                <el-input
                  v-model="contractInfo.contractForm.unitPriceOfManagementFee"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="管理费合价"
                size="mini"
                prop="totalManagementFee"
              >
                <el-input
                  v-model="contractInfo.contractForm.totalManagementFee"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider style="margin: 5px 0"></el-divider>
              <el-form-item label="免租期至" size="mini" prop="rentFreePeriod">
                <el-date-picker
                  v-model="contractInfo.contractForm.rentFreePeriod"
                  clearable
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-card>
          <br />
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>止约情况</span>
            </div>
            <el-col :span="8">
              <el-form-item
                label="终止所有权"
                size="mini"
                prop="terminationStatus"
              >
                <el-checkbox
                  v-model="contractInfo.contractForm.terminationStatus"
                  @change="finishPermission()"
                />
              </el-form-item>
            </el-col>
            <transition name="el-zoom-in-center">
              <el-col :span="16">
                <el-form-item
                  label="终止日期"
                  size="mini"
                  prop="terminationDate"
                >
                  <el-date-picker
                    v-model="contractInfo.contractForm.terminationDate"
                    clearable
                    :disabled="!isFinishPerm"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </transition>
            <el-col :span="24">
              <el-form-item label="终止类型" size="mini" prop="terminationType">
                <el-select
                  v-model="contractInfo.contractForm.terminationType"
                  :disabled="!isFinishPerm"
                  style="width: 99%"
                >
                  <el-option
                    v-for="item in finishPermOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="终止原因"
                size="mini"
                prop="reasonsForTermination"
              >
                <el-input
                  v-model="contractInfo.contractForm.reasonsForTermination"
                  :disabled="!isFinishPerm"
                  type="textarea"
                  :rows="2"
                  style="height: 50px; overflow-y: scroll; width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-card>
          <br />

          <el-card shadow="hover" style="padding-bottom: 4px">
            <div slot="header" class="clearfix">
              <span>面积</span>
            </div>
            <el-col :span="12">
              <el-form-item label="建筑面积" size="mini" prop="floorage">
                <el-input
                  v-model="contractInfo.contractForm.floorage"
                  clearable
                >
                  <span slot="suffix">㎡</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="套内面积" size="mini" prop="insideArea">
                <el-input
                  v-model="contractInfo.contractForm.insideArea"
                  clearable
                >
                  <span slot="suffix">㎡</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附属面积1" size="mini" prop="ancillaryArea1">
                <el-input
                  v-model="contractInfo.contractForm.ancillaryArea1"
                  clearable
                >
                  <span slot="suffix">㎡</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附属面积2" size="mini" prop="ancillaryArea2">
                <el-input
                  v-model="contractInfo.contractForm.ancillaryArea2"
                  clearable
                >
                  <span slot="suffix">㎡</span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-card>
          <br />
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>申请电容量</span>
            </div>
            <el-col :span="24">
              <el-form-item label="用电容量" size="mini" prop="capacitance">
                <el-input
                  v-model="contractInfo.contractForm.capacitance"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-card>
          <br />
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>托收银行</span>
            </div>
            <el-col :span="24">
              <el-form-item label="托收代码" size="mini" prop="headOfficeCode">
                <el-select
                  v-model="contractInfo.contractForm.headOfficeCode"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in collectionOptions"
                    :key="item.分理处"
                    :label="item.分理处"
                    :value="item.分理处"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="预留手机"
                size="mini"
                prop="reservedMobilePhone"
              >
                <el-input
                  v-model="contractInfo.contractForm.reservedMobilePhone"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开 户 名" size="mini" prop="accountName">
                <el-input
                  v-model="contractInfo.contractForm.accountName"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="协 议 号" size="mini">
                <el-input
                  v-model="contractInfo.contractForm.number"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="16">
              <el-form-item
                label="证件号码"
                size="mini"
                prop="identificationNumber"
              >
                <el-input
                  v-model="contractInfo.contractForm.identificationNumber"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="证件类型号" size="mini" prop="documentType">
                <el-input
                  v-model="contractInfo.contractForm.documentType"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item
                label="银行账号"
                size="mini"
                prop="bankAccountNumber"
              >
                <el-input
                  v-model="contractInfo.contractForm.bankAccountNumber"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账户类型号" size="mini" prop="accountType">
                <el-input
                  v-model="contractInfo.contractForm.accountType"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="银行代码" size="mini" prop="bankCode">
                <el-select
                  v-model="contractInfo.contractForm.bankCode"
                  filterable
                  :multiple="false"
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请输入你想搜索的银行"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in bankOptions"
                    :key="item.ID"
                    :label="item.代码"
                    :value="item.ID"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="margin-top: 5px"
              ><svg-icon
                icon-class="searchBank"
                style="width: 20px; height: 20px"
              ></svg-icon
            ></el-col>
          </el-card>
          <br />
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>合同备注</span>
            </div>
            <el-col :span="24">
              <el-form-item
                label=""
                size="mini"
                label-width="0px"
                prop="contractRemarks"
              >
                <el-input
                  v-model="contractInfo.contractForm.contractRemarks"
                  type="textarea"
                  :rows="4"
                  style="height: 90px; overflow-y: scroll"
                />
              </el-form-item>
            </el-col>
          </el-card>
        </el-col>
      </el-form>
    </el-row>
    <section :class="{ isActive: isFooterState }">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>房屋清单</span>
          <span style="float: right; padding: 3px 0">
            <button class="trans-hover" @click="torentHouseList">
              <svg-icon icon-class="send"></svg-icon>
              详 情
            </button>
          </span>
        </div>
        <div v-if="contractInfo.rentHouseList.roomNo !== undefined">
          <el-col :span="24">
            <el-form
              :label-position="labelPosition"
              label-width="85px"
              :model="contractInfo.rentHouseList"
            >
              <el-col :span="6">
                <el-form-item label="栋 名" size="mini" prop="buildingName">
                  <el-input
                    v-model="contractInfo.rentHouseList.buildingName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单 元 名" size="mini" prop="unitName">
                  <el-input
                    v-model="contractInfo.rentHouseList.unitName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="房号" size="mini" prop="roomNo">
                  <el-input
                    v-model="contractInfo.rentHouseList.roomNo"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="建筑面积" size="mini" prop="buildingArea">
                  <el-input
                    v-model="contractInfo.rentHouseList.buildingArea"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </div>
      </el-card>
      <template v-if="this.$route.query.id !== undefined">
        <br />
        <el-card shadow="hover">
          <div>
            <span style="font-weight: 600">租金设置</span>
            <span style="float: right">
              <button class="trans-hover" @click="toRentSetting">
                <svg-icon icon-class="send"></svg-icon>
                详 情
              </button>
            </span>
          </div>
        </el-card>
        <br />
        <el-card shadow="hover">
          <div>
            <span style="font-weight: 600">应收费用</span>
            <span style="float: right">
              <button class="trans-hover" @click="toPayList">
                <svg-icon icon-class="send"></svg-icon>
                详 情
              </button>
            </span>
          </div>
        </el-card>
      </template>
    </section>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { collectionList, bankList } from "@/api/system/userRegister";
export default {
  props: {
    contractInfo: {
      type: Object,
      default: () => {},
    },
    labelPosition: {
      type: String,
      default: "",
    },
    isFooterState: {
      type: Boolean,
      default: false,
    },
    htId: {
      type: Number,
      default: 0,
    },
    disableAreaBasis: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeName: "first",
      bankList: [],
      bankOptions: [],
      loading: false,
      isShowAddRate: false,
      isFinishPerm: false,
      collectionOptions: [],
      rules: {
        customerName: [
          { required: true, trigger: "blur", message: "请输入客户名称" },
        ],
      },
      rentRules: {
        startingDate: [
          { required: true, trigger: "blur", message: "请选择起租日期" },
        ],
        rentArrivalDate: [
          { required: true, trigger: "blur", message: "请选择到租日期" },
        ],
        rentPaymentCycle: [
          { required: true, trigger: "blur", message: "请选择交租周期" },
        ],
      },
      finishPermOptions: [
        {
          label: "未终止",
          value: 0,
        },
        {
          label: "正常终止",
          value: 1,
        },
        {
          label: "租户主动终止",
          value: 2,
        },
        {
          label: "租户被动终止",
          value: 3,
        },
        {
          label: "其他原因",
          value: 4,
        },
      ],
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
      rentState: [
        {
          label: "新签",
          value: 0,
        },
        {
          label: "续签",
          value: 1,
        },
        {
          label: "变更",
          value: 2,
        },
      ],
      rentPaymentCycles: [
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

      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < this.contractInfo.contractForm.startingDate;
        },
      },
    };
  },
  activated() {
    this.getBankList();
    this.getCollectionList();
    if (Cookies.get("rentOwnerInfo") !== undefined) {
      this.contractInfo.rentOwnerInfo = JSON.parse(
        Cookies.get("rentOwnerInfo")
      );
    } else {
      this.contractInfo.rentOwnerInfo = {};
    }
    if (Cookies.get("rentHouseList") !== undefined) {
      let newObj = JSON.parse(Cookies.get("rentHouseList"))[0];
      this.contractInfo.rentHouseList = {
        buildingName: newObj.大楼名称,
        unitName: newObj.单元名称,
        roomNo: newObj.房号,
        buildingArea: newObj.建筑面积,
      };
    }
  },
  methods: {
    // 跳客户资料
    toOwnerInfo() {
      this.$router.push({
        path: "rentOwnerInfo",
        query: {
          customerId: this.contractInfo.rentOwnerInfo.customerId,
        },
      });
    },
    // 跳产权人
    toPropertyOwner() {
      this.$router.push({
        path: "propertyOwner",
        query: {
          htId: this.htId === 0 ? undefined : this.htId,
        },
      });
    },
    // 跳房屋清单
    torentHouseList() {
      this.$router.push({
        path: "houseRepertoire",
        query: {
          contractId: this.contractInfo.rentHouseList.contractId,
          houseId: this.$route.query.houseId,
        },
      });
    },
    getCollectionList() {
      const params = {
        propertyId: Cookies.get("selectPropertyId"),
      };
      collectionList(params).then((res) => {
        this.collectionOptions = [...res.data];
      });
    },
    getBankList() {
      bankList().then((res) => {
        this.bankList = [...res.data];
      });
    },
    // 银行的远程搜索功能
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.bankOptions = this.bankList.filter((item) => {
            return item.代码.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.bankOptions = [];
      }
    },
    // 终止所有权
    finishPermission() {
      this.isFinishPerm = this.contractInfo.contractForm.terminationStatus;
    },
    rentCycleChange(val) {
      this.$emit('rentCycleVal', val)
    },
    toRentSetting() {
      if (this.$route.query.value === "newRent") {
        this.$confirm("合同未保存，暂不能进行租金设置操作！", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确认",
          type: "warning",
        })
      } else {
        this.$router.push({
          path: "rentPaySetting",
          query: {
            id: this.$route.query.id
          }
        });
      }
    },
    toPayList() {
      if (this.$route.query.value === "newRent") {
        this.$confirm("合同未保存，暂不能进行应收费用操作！", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确认",
          type: "warning",
        });
      } else {
        this.$router.push({
          path: "payList",
          query: {
            id: this.$route.query.id
          }
        });
      }
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
  },
};
</script>

<style lang="scss" scoped>
.ownerTabs {
  padding: 6px 16px;
  margin-bottom: 50px;
  .isActive {
    margin-bottom: 40px;
  }
}
/* el-divider 修改高度&虚线效果 */
.el-divider--horizontal {
  margin: 5.5px 0px 19.5px 0px;
  background: 0 0;
  border-top: 1px dashed #dddced;
}
</style>
