<template>
  <el-card>
    <header>
      <div class="title">结转应收款</div>
      <el-divider></el-divider>
      <el-button
        plain
        type="primary"
        icon="el-icon-document-checked"
        @click="create"
        size="mini"
        :disabled="btnDisabled"
        >生成</el-button
      >
      <template v-if="checkHidden">
        <el-button
          plain
          type="warning"
          icon="el-icon-delete"
          @click="backlash"
          size="mini"
          :disabled="!allMonths.includes(carryDownPayForm.payMonth)"
          >反冲</el-button
        >
        <el-button
          plain
          type="primary"
          icon="el-icon-circle-check"
          @click="checkInfo"
          size="mini"
          :disabled="btnDisabled"
          >数据校验</el-button
        >
      </template>
      <span style="float: right" v-else>
        <el-button v-if="lockMonthState" title="解锁计费月份" type="warning" icon="el-icon-lock" size="mini" circle @click="lockMonths"></el-button>
        <el-button v-else title="关闭计费月份" type="success" icon="el-icon-unlock" size="mini" circle @click="closeLockMonths"></el-button>
      </span>
    </header>
    <el-divider></el-divider>
    <main>
      <el-form ref="carryDownPayForm" :model="carryDownPayForm" size="mini">
        <el-form-item label="选择物业" label-width="90px">
          <el-select
            :disabled="!disableForce"
            @change="(item) => wyChange(item)"
            v-model="carryDownPayForm.propertyId"
            style="margin-left: 84px; width: 192px"
          >
            <el-option
              v-for="item in propertyList"
              :key="item.propertyId"
              :label="item.propertyName"
              :value="item.propertyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成或反冲的计费月份" label-width="174px">
          <el-select
            :disabled="!disableForce && lockMonthState"
            style="width: 120px"
            v-model="carryDownPayForm.payMonth"
          >
            <el-option
              v-for="item in monthList"
              :key="item.计费月份"
              :label="item.计费月份"
              :value="item.计费月份"
            ></el-option>
          </el-select>
          <el-date-picker
            type="month"
            placeholder="选择月"
            :clearable="false"
            format="yyyy-MM"
            value-format="yyyyMM"
            :disabled="!disableForce && lockMonthState"
            v-model="carryDownPayForm.payMonth"
            style="width: 0px; margin-left: 10px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="强制生成应收款项目" label-width="160px">
          <el-checkbox
            style="margin-left: 14px"
            :disabled="disableForce"
            v-model="carryDownPayForm.isCreatePayItem"
            @change="createPayItem"
          ></el-checkbox>
        </el-form-item>
      </el-form>

      <slot name="buildUserArea"></slot>
      
      <el-divider></el-divider>
      <section class="description">
        <p style="line-height: 22px">
          说明：生成应收款的过程就是按照给客户定义的收费项目结转上月欠款或预收款，核算欠款所产生的滞纳金，生成指定月份的本月费用，即为一个新的计费月份的应收款。反冲则是在指定计费月份没有实际收款记录的前提下，删除该计费月份及其应收款数据。
        </p>
        <p style="text-indent: 28px; line-height: 22px">
          强烈建议生成新的月份的应收款之前，已经做过数据校验并确保没有重大疑问，确保综合预收抵扣操作已经完成，以免造成不必要的业务纠纷。
        </p>
      </section>
    </main>
  </el-card>
</template>

<script>
import Bus from "@/api/Bus";
import { getWyList } from "@/api/system/houseRes";
import { getAllWyChargeMonth } from "@/api/system/payItemGeneral";

export default {
  props: {
    checkHidden: {
      type: Boolean,
      default: false
    },
    disableForce: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      monthList: [],
      allMonths: [],
      selectMonth: "",
      propertyList: [],

      btnDisabled: true,
      carryDownPayForm: {
        propertyId: null,
        payMonth: null,
        isCreatePayItem: false,
      },
      lockMonthState: true
    };
  },
  created() {
    this.getWyListInfo();
  },
  methods: {
    wyChange(id) {
      this.getAllChargeMonth(id);
    },
    getNewPropertyId(id) {
      this.carryDownPayForm.propertyId = id;
    },
    cancelIsCreate() {
      this.carryDownPayForm.isCreatePayItem = false;
    },
    //   获取所有物业
    getWyListInfo() {
      getWyList().then((res) => {
        this.allList = [...res.data];
        this.propertyList = this.flatten(this.allList);
        this.carryDownPayForm.propertyId = this.propertyList[0].propertyId;
        this.wyChange(this.carryDownPayForm.propertyId);
      });
    },
    getAllChargeMonth(id) {
      getAllWyChargeMonth({ wyid: id }).then((res) => {
        this.btnDisabled = false;
        this.monthList = [...res.data];
        this.$emit("overLoading");
        this.allMonths = this.monthList.map((item) => item.计费月份);
        let changeMonth = this.monthList[0].计费月份;
        this.carryDownPayForm.payMonth = this.getNextMonth(changeMonth);
        let data = {
          id,
          changeMonth,
          monthList: this.monthList,
        };
        Bus.$emit("wyMonthObj", data);
      });
    },
    // 函数或者当前年月的下一个月份
    getNextMonth(val) {
      let oldYear = val.slice(0, 4),
        newYear = "";
      let oldMonth = val.slice(4, 6),
        newMonth = "";
      switch (parseInt(oldMonth) + 1) {
        case 13:
          newMonth = "01";
          newYear = `${parseInt(oldYear) + 1}`;
          break;
        case 10:
        case 11:
        case 12:
          newMonth = `${parseInt(oldMonth) + 1}`;
          newYear = oldYear;
          break;
        default:
          newMonth = `0${parseInt(oldMonth) + 1}`;
          newYear = oldYear;
          break;
      }
      return `${newYear}${newMonth}`;
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
    // 生成
    create() {
      if (this.allMonths.includes(this.carryDownPayForm.payMonth))
        this.$emit("createChangePayOne", this.carryDownPayForm);
      else this.$emit("createChangePayTwo", this.carryDownPayForm);
    },
    // 反冲
    backlash() {
      this.$emit("delChangePay", this.carryDownPayForm);
    },
    // 数据校验
    checkInfo() {
      this.$emit("openSymbolCheck");
    },
    // 强制生成应收款
    createPayItem() {
      if (this.carryDownPayForm.isCreatePayItem) {
        this.$alert("请注意：你选择了 [强制生成应收款项目] 的选项！", {
          confirmButtonText: "确定",
          type: "warning",
        });
      }
    },
    lockMonths() {
      this.lockMonthState = false
    },
    closeLockMonths() {
      this.lockMonthState = true
    }
  },
};
</script>

<style scoped>
.description {
  width: 40%;
  color: #1890ff;
  font-size: 14px;
  padding: 4px 20px 0;
}
.title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
}
</style>