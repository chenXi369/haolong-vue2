<template>
  <div class="ownerTabs">
    <el-row>
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>客户资料</span>
          <!-- <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="toOwnerInfo"
            >点击前往 <i class="el-icon-arrow-right"
          /></el-button> -->

          <span style="float: right; padding: 3px 0">
            <button class="trans-hover" @click="toOwnerInfo">
              <svg-icon icon-class="send"></svg-icon>
              点击前往
            </button>
          </span>
        </div>
        <div>
          <el-col :span="24">
            <el-form
              ref="ownerForm"
              :label-position="labelPosition"
              label-width="85px"
              :model="contractInfo.ownerForm"
              :rules="rules"
            >
              <el-col :span="12">
                <el-form-item label="客户名称" size="mini" prop="customerName">
                  <el-input
                    v-model="contractInfo.ownerForm.customerName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="简 码" size="mini" prop="shortCode">
                  <el-input
                    v-model="contractInfo.ownerForm.shortCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="手 机" size="mini" prop="phone">
                  <el-input
                    v-model="contractInfo.ownerForm.phone"
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
        :model="contractInfo.contractForm"
      >
        <el-col :span="24">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>基本资料</span>
            </div>
            <el-col :span="24">
              <el-form-item
                label="内部房号"
                size="mini"
                prop="internalRoomNumber"
              >
                <el-input
                  v-model="contractInfo.contractForm.internalRoomNumber"
                  clearable
                  :disabled="true"
                />
              </el-form-item>
            </el-col>
          </el-card>
          <br />
        </el-col>
        <!-- 右侧数据 -->
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>购房资料</span>
            </div>
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
            <el-col :span="12">
              <el-form-item label="合同总价" size="mini" prop="contractPrice">
                <el-input
                  v-model="contractInfo.contractForm.contractPrice"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="购房日期" size="mini" prop="purchaseDate">
                <el-date-picker
                  v-model="contractInfo.contractForm.purchaseDate"
                  clearable
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="房产证号"
                size="mini"
                prop="housePropertyCertificateNo"
              >
                <el-input
                  v-model="contractInfo.contractForm.housePropertyCertificateNo"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出证日期" size="mini" prop="dateOfIssue">
                <el-date-picker
                  v-model="contractInfo.contractForm.dateOfIssue"
                  clearable
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
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
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="套内面积" size="mini" prop="insideArea">
                <el-input
                  v-model="contractInfo.contractForm.insideArea"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附属面积1" size="mini" prop="ancillaryArea1">
                <el-input
                  v-model="contractInfo.contractForm.ancillaryArea1"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附属面积2" size="mini" prop="ancillaryArea2">
                <el-input
                  v-model="contractInfo.contractForm.ancillaryArea2"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-card>
          <br />
          <el-card shadow="hover" style="padding-bottom: 4px">
            <div slot="header" class="clearfix">
              <span>费用核算</span>
            </div>
            <el-col :span="12">
              <el-form-item label="入伙日期" size="mini" prop="contractDate">
                <el-input
                  v-model="contractInfo.contractForm.contractDate"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面积依据" size="mini" prop="areaBasis">
                <el-select
                  v-model="contractInfo.contractForm.areaBasis"
                  style="width: 100%"
                  clearable
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
                  v-model="contractInfo.contractForm.areaFormula"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计价面积" size="mini" prop="valuationArea">
                <el-input
                  v-model="contractInfo.contractForm.valuationArea"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-card>
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
              <el-col v-show="isFinishPerm" :span="16">
                <el-form-item
                  label="终止日期"
                  size="mini"
                  prop="terminationDate"
                >
                  <el-date-picker
                    v-model="contractInfo.contractForm.terminationDate"
                    clearable
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
                  clearable
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
                  style="height: 50px; overflow-y: scroll"
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
                  clearable
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
        </el-col>

        <el-col :span="24" style="margin: 20px 0">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>登记说明</span>
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
                  :rows="2"
                  style="height: 50px; overflow-y: scroll"
                />
              </el-form-item>
            </el-col>
          </el-card>
        </el-col>
      </el-form>
    </el-row>
    <section>
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>房屋清单</span>
          <!-- <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="toHouseList"
            >点击前往 <i class="el-icon-arrow-right"
          /></el-button> -->

          <span style="float: right; padding: 3px 0">
            <button class="trans-hover" @click="toHouseList">
              <svg-icon icon-class="send"></svg-icon>
              点击前往
            </button>
          </span>
        </div>
        <div v-if="contractInfo.houseList.roomNo !== undefined">
          <el-col :span="24">
            <el-form
              :label-position="labelPosition"
              label-width="85px"
              :model="contractInfo.houseList"
            >
              <el-col :span="6">
                <el-form-item label="栋 名" size="mini" prop="buildingName">
                  <el-input
                    v-model="contractInfo.houseList.buildingName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单 元 名" size="mini" prop="unitName">
                  <el-input
                    v-model="contractInfo.houseList.unitName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="房号" size="mini" prop="roomNo">
                  <el-input
                    v-model="contractInfo.houseList.roomNo"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="建筑面积" size="mini" prop="buildingArea">
                  <el-input
                    v-model="contractInfo.houseList.buildingArea"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </div>
      </el-card>
      <br />
    </section>
    <section class="propertyOwner" :class="{ footerState: isFooterState }">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>产权人</span>
          <!-- <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="toPropertyOwner"
            >点击前往 <i class="el-icon-arrow-right"
          /></el-button> -->

          <span style="float: right; padding: 3px 0">
            <button class="trans-hover" @click="toPropertyOwner">
              <svg-icon icon-class="send"></svg-icon>
              点击前往
            </button>
          </span>
        </div>
        <div v-if="contractInfo.propertyOwner.owner !== undefined">
          <el-col :span="24">
            <el-form
              :label-position="labelPosition"
              label-width="85px"
              :model="contractInfo.propertyOwner"
            >
              <el-col :span="4">
                <el-form-item label="序 号" size="mini" prop="serialNumber">
                  <el-input
                    v-model="contractInfo.propertyOwner.serialNumber"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="权利人" size="mini" prop="owner">
                  <el-input
                    v-model="contractInfo.propertyOwner.owner"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  label="产权比例"
                  size="mini"
                  prop="proportionOfPropertyRights"
                >
                  <el-input
                    v-model="
                      contractInfo.propertyOwner.proportionOfPropertyRights
                    "
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="证件号码" size="mini" prop="idCardNo">
                  <el-input
                    v-model="contractInfo.propertyOwner.idCardNo"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </div>
      </el-card>
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
    rules: {
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
  },
  data() {
    return {
      activeName: "first",
      bankList: [],
      bankOptions: [],
      loading: false,

      value: [],
      isFinishPerm: false,
      collectionOptions: [],
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
    };
  },
  created() {
    this.getBankList();
    this.getCollectionList();
    if (Cookies.get("ownerForm") !== undefined) {
      this.contractInfo.ownerForm = JSON.parse(Cookies.get("ownerForm"));
    } else {
      this.contractInfo.ownerForm = {};
    }
    if (Cookies.get("propertyForm") !== undefined) {
      this.contractInfo.propertyOwner = JSON.parse(
        Cookies.get("propertyForm")
      )[0];
    }
    if (Cookies.get("houseList") !== undefined) {
      let newObj = JSON.parse(Cookies.get("houseList"))[0];
      this.contractInfo.houseList = {
        buildingName: newObj.大楼名称,
        unitName: newObj.单元名称,
        roomNo: newObj.房号,
        buildingArea: newObj.建筑面积,
      };
    }
    console.log(this.contractInfo.ownerForm);
  },
  methods: {
    // 跳客户资料
    toOwnerInfo() {
      this.$router.push({
        path: "ownerInfo",
        query: {
          customerId: this.contractInfo.ownerForm.customerId,
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
    toHouseList() {
      this.$router.push({
        path: "houseList",
        query: {
          contractId: this.contractInfo.houseList.contractId,
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
  },
};
</script>

<style lang="scss" scoped>
.ownerTabs {
  padding: 5px 16px;
  margin-bottom: 50px;
  .footerState {
    margin-bottom: 40px;
  }
}
</style>
