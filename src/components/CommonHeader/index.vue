<template>
  <div>
    <el-form
      size="mini"
      :inline="true"
      label-width="70px"
      ref="commonHeaderForm"
      :model="commonHeaderForm"
    >
      <el-form-item label="物业">
        <el-select
          :disabled="disabled"
          v-model="commonHeaderForm.propertyId"
          @change="(item) => wyChange(item)"
          style="width: 140%"
        >
          <el-option
            v-for="item in propertyList"
            :key="item.propertyId"
            :label="item.propertyName"
            :value="item.propertyId"
            :title="item.propertyName"
          ></el-option>
        </el-select>
      </el-form-item>

      <template v-if="isCheckbox">
        <el-form-item label="楼栋" label-width="120px">
          <el-select
            clearable
            multiple
            collapse-tags
            ref="checkBoxbuild"
            v-model="commonHeaderForm.buildingId"
            :disabled="disabled"
            style="width: 90%"
            @change="(item) => checkBoxbuildChange(item)"
          >
            <el-option
              v-for="item in buildingList"
              :key="item.buildingId"
              :label="item.buildingName"
              :value="item.buildingId"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="楼栋" label-width="120px">
          <el-select
            v-model="commonHeaderForm.buildingId"
            :disabled="allChecked || disabled"
            style="width: 90%"
            @change="(item) => buildChange(item)"
          >
            <el-option
              v-for="item in buildingList"
              :key="item.buildingId"
              :label="item.buildingName"
              :value="item.buildingId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isShowMuit" style="margin-left: -15px">
          <el-checkbox v-model="commonHeaderForm.allChecked" @change="allCheck"
            >全部</el-checkbox
          >
        </el-form-item>
      </template>

      <!-- 存在多选的处理 -->
      <span v-if="isShowMuit" style="margin-left: -15px">
        <el-form-item label="">
          <el-switch v-model="isMultiSelect" active-text="多选" size="mini" @change="changeMultiSelect"> </el-switch>
        </el-form-item>
        <span class="divider">|</span>
      </span>

      <el-form-item label="月份" label-width="55px">
        <el-select
          v-model="commonHeaderForm.selectMonth"
          style="width: 106px"
          :disabled="allChecked || disabled"
          @change="(item) => wyMonthChange(item)"
        >
          <el-option
            v-for="item in monthList"
            :key="item.计费月份"
            :label="item.计费月份"
            :value="item.计费月份"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-if="showAllMonthCheck"
          v-model="commonHeaderForm.allMonthCheck"
          @change="handleAllMonth"
          >全部</el-checkbox
        >
      </el-form-item>
      <template v-if="showChargeItem">
        <el-form-item label=" " label-width="18px">
          <el-select
            v-model="commonHeaderForm.itemState"
            style="width: 106px"
            @change="(item) => payItemChange(item)"
          >
            <el-option
              v-for="item in itemStateList"
              :key="item.id"
              :value="item.id"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-if="commonHeaderForm.itemState === 0"
            v-model="commonHeaderForm.itemName"
            :disabled="disabledItemName"
            @change="(item) => itemNameChange(item)"
          >
            <el-option
              v-for="item in itemNameList"
              :key="item.ID"
              :value="item.ID"
              :label="item.项目名称"
            ></el-option>
          </el-select>

          <el-select
            v-else
            v-model="commonHeaderForm.itemName"
            :disabled="disabledItemName"
            @change="(item) => itemNameChange(item)"
          >
            <el-option
              v-for="item in itemNameList"
              :key="item.JFID"
              :value="item.JFID"
              :label="item.计费名称"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="showCurrencyType">
        <el-form-item label="币种" label-width="55px">
          <el-select
            v-model="commonHeaderForm.currencyType"
            style="width: 106px"
            @change="(item) => currencyChange(item)"
          >
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.name"
              :value="item.no"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="commonHeaderForm.allChecked" @change="allCheck"
            >催款单</el-checkbox
          >
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="commonHeaderForm.allChecked" @change="allCheck"
            >不通知租金管理费</el-checkbox
          >
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { getWyList } from "@/api/system/houseRes";
import { getPayItemList } from "@/api/system/payItemEdit";
import { getAllWyChargeMonth } from "@/api/system/payItemGeneral";
import { getDictionary } from "@/api/system/systemData";
import { debounce } from '@/utils'

export default {
  props: {
    isShowMuit: {
      type: Boolean,
      default: false,
    },
    isCheckbox: {
      type: Boolean,
      default: false,
    },
    showChargeItem: {
      type: Boolean,
      default: false,
    },
    showCurrencyType: {
      type: Boolean,
      default: false,
    },
    showAllMonthCheck: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      commonHeaderForm: {
        propertyId: null,
        buildingId: null,
        allChecked: false,
        selectMonth: null,
        currencyType: null,
        allMonthCheck: false,
        itemState: 0,
        itemName: null,
        propertyName: "",
        buildingName: "",
        chargeItemName: ""
      },
      isMultiSelect: true,
      allChecked: false,
      disabled: true,
      disabledItemName: false,
      propertyList: [],
      buildingList: [],
      monthList: [],
      currencyList: [],
      allList: [],
      itemStateList: [
        {
          id: 0,
          label: "收费项目",
        },
        {
          id: 1,
          label: "计费项目",
        },
        {
          id: 2,
          label: "全部项目",
        },
      ],
      itemNameList: [],
    };
  },
  created() {
    this.getWyListInfo();
    let currencyWhiteList = ["CommonAccount"];
    if (currencyWhiteList.includes(this.$route.name)) {
      this.getDictionary();
    }
  },
  methods: {
    // 获取所有物业
    getWyListInfo() {
      getWyList().then((res) => {
        this.disabled = false;
        this.allList = [...res.data];
        this.propertyList = this.flatten(this.allList);
        this.commonHeaderForm.propertyId = this.allList[0].propertyId;
        this.commonHeaderForm.propertyName = this.allList[0].propertyName;
        this.wyChange(this.commonHeaderForm.propertyId);
      });
    },
    // 获取所有币种的方法
    getDictionary() {
      getDictionary({ nodeName: "币种" }).then((res) => {
        this.currencyList = [...res.data];
        this.commonHeaderForm.currencyType = this.currencyList[0].no;
      });
    },
    // 获取物业下的月份
    getAllChargeMonth(id) {
      getAllWyChargeMonth({ wyid: id }).then((res) => {
        this.monthList = [...res.data];
        this.commonHeaderForm.selectMonth = this.monthList[0].计费月份;
      }).then(() => {
        this.getPayItemList(id);
      })
    },
    // 获取收费数据字典
    getPayItemList(id) {
      let query = {
        wyid: id,
        projectType: this.commonHeaderForm.itemState,
      };
      getPayItemList(query).then((res) => {
        this.itemNameList = [...res.data];
        if (this.commonHeaderForm.itemState === 0) {
          this.commonHeaderForm.itemName = this.itemNameList[0].ID;
          this.commonHeaderForm.chargeItemName = this.itemNameList[0].项目名称;
        } else if (this.commonHeaderForm.itemState === 1) {
          this.commonHeaderForm.itemName = this.itemNameList[0].JFID;
          this.commonHeaderForm.chargeItemName = this.itemNameList[0].计费名称;
        }
        this.$emit("changeWyBuild", this.commonHeaderForm);
      });
    },
    // 递归函数
    flatten(data) {
      return data.reduce(
        (arr, { propertyId, propertyName, number }) =>
          arr.concat([
            { propertyId, propertyName: `[${number}] ${propertyName}` },
          ]),
        []
      );
    },
    flatten2(data) {
      return data.reduce(
        (arr, { buildingId, buildingName }) =>
          arr.concat([{ buildingId, buildingName }]),
        []
      );
    },
    // 物业改变
    async wyChange(e) {
      await this.getAllChargeMonth(e);
      
      let selectedWy = this.allList.filter((item) => {
        if (item.propertyId === e) return item;
      });
      this.buildingList = this.flatten2(selectedWy[0].buildingList);
      let selectedWyInfo = this.flatten(selectedWy);
      this.commonHeaderForm.propertyId = selectedWyInfo[0].propertyId;
      this.commonHeaderForm.propertyName = selectedWyInfo[0].propertyName;

      if (this.isCheckbox) {
        this.commonHeaderForm.buildingId = [].concat(
          this.buildingList[0].buildingId
        );
        this.commonHeaderForm.buildingName = [].concat(
          this.buildingList[0].buildingName
        );
      } else {
        this.commonHeaderForm.buildingId = this.buildingList[0].buildingId;
        this.commonHeaderForm.buildingName = this.buildingList[0].buildingName;
      }
    },
    
    // 多选时的楼栋改变
    checkBoxbuildChange: debounce(function() {
      let newArr = this.$refs.checkBoxbuild.value
      let newNameArr = this.buildingList.filter(item => {
        if(newArr.includes(item.buildingId)) return item
      }).map(e => e = e.buildingName)
      this.commonHeaderForm.buildingId = [ ...newArr ];
      this.commonHeaderForm.buildingName = [ ...newNameArr ];
      this.$emit("changeWyBuild", this.commonHeaderForm);
    }, 1000),
    // 单选时楼栋改变
    buildChange(e) {
      this.commonHeaderForm.buildingId = e;
      let selectBuild = this.buildingList.filter(
        (item) => item.buildingId === e
      );
      this.commonHeaderForm.buildingName = selectBuild[0].buildingName;
      this.$emit("changeWyBuild", this.commonHeaderForm);
    },
    // 项目类型改变
    payItemChange(e) {
      if (e === 2) {
        this.disabledItemName = true;
      } else {
        this.disabledItemName = false;
      }
      this.getPayItemList(this.commonHeaderForm.propertyId);
    },
    // 项目名称或者计费名称改变触发的方法
    itemNameChange(val) {
      this.commonHeaderForm.itemName = val;
      let selectChargeItem = [];
      if (this.commonHeaderForm.itemState === 0) {
        selectChargeItem = this.itemNameList.filter((item) => item.ID === val);
        this.commonHeaderForm.chargeItemName = selectChargeItem[0].项目名称;
      } else
        selectChargeItem = this.itemNameList.filter(
          (item) => item.JFID === val
        );
      this.commonHeaderForm.chargeItemName = selectChargeItem[0].计费名称;
      this.$emit("changeWyBuild", this.commonHeaderForm);
    },
    // 月份改变
    wyMonthChange(e) {
      this.commonHeaderForm.selectMonth = e;
      this.$emit("changeWyBuild", this.commonHeaderForm);
    },
    // 楼栋全选的处理
    allCheck() {
      this.allChecked = this.commonHeaderForm.allChecked;
      this.$emit("changeWyBuild", this.commonHeaderForm);
    },
    // 月份全选的处理
    handleAllMonth() {
      this.$emit("changeWyBuild", this.commonHeaderForm);
    },
    // 币种改变
    currencyChange(e) {
      this.commonHeaderForm.currencyType = e;
    },
    // 开关切换单选多选
    changeMultiSelect(val) {
      this.commonHeaderForm.buildingId = null
      if (val) {
        this.commonHeaderForm.buildingId = [].concat(
          this.buildingList[0].buildingId
        );
        this.commonHeaderForm.buildingName = [].concat(
          this.buildingList[0].buildingName
        );
      } else {
        this.commonHeaderForm.buildingId = this.buildingList[0].buildingId;
        this.commonHeaderForm.buildingName = this.buildingList[0].buildingName;
      }
      this.$emit("changeMultiSelect", val)
      this.$emit("changeWyBuild", this.commonHeaderForm);
    }
  },
};
</script>

<style lang="scss" scoped>
.activeItem {
  background: #eaeaea;
  color: #1890ff;
}
.divider {
  height: 16px; color: #aaa;
  line-height: 25px; margin: 0 10px;
}
</style>