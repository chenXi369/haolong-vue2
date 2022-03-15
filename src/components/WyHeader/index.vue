<template>
  <div>
    <el-form
      ref="wyHeaderForm"
      :model="wyHeaderForm"
      :inline="true"
      label-width="70px"
      size="mini"
    >
      <el-form-item label="物业">
        <el-select
          :disabled="disabled"
          v-model="wyHeaderForm.propertyId"
          @change="(item) => wyChange(item)"
          style="width: 120%"
        >
          <el-option
            v-for="item in propertyList"
            :key="item.propertyId"
            :label="item.propertyName"
            :value="item.propertyId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼栋" label-width="85px">
        <el-select
          v-model="wyHeaderForm.buildingId"
          :disabled="allChecked || disabled"
          @change="(item) => buildChange(item)"
        >
          <el-option
            v-for="item in buildList"
            :key="item.buildingId"
            :label="item.buildingName"
            :value="item.buildingId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="wyHeaderForm.allChecked" @change="allCheck"
          >全部</el-checkbox
        >
      </el-form-item>

      <el-form-item label=" " label-width="32px">
        <el-select v-model="wyHeaderForm.sortType" placeholder="请选择" @change="(item) => handleCommand(item)">
          <el-option
            v-for="item in sortTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getWyList } from "@/api/system/houseRes";

export default {
  data() {
    return {
      wyHeaderForm: {
        propertyId: null,
        buildingId: null,
        sortType: 0,
        allChecked: false,
        propertyName: '',
        buildingName: "",
        isGetWyChargeMonth: false
      },
      allChecked: false,
      disabled: true,
      propertyList: [],
      buildList: [],
      allList: [],
      sortTypeList: [
        {
          value: 0,
          label: '单元，楼层，房号'
        },
        {
          value: 1,
          label: '单元，房号，楼层'
        },
        {
          value: 2,
          label: '楼层，单元，房号，楼栋'
        }
      ]
    };
  },
  created() {
    this.getWyListInfo();
  },
  methods: {
    allCheck() {
      this.allChecked = this.wyHeaderForm.allChecked;
      this.$emit("changeWyBuild", this.wyHeaderForm);
    },
    getWyListInfo() {
      getWyList().then((res) => {
        this.disabled = false;
        this.allList = [...res.data];
        this.propertyList = this.flatten(this.allList);
        this.wyHeaderForm.propertyId = this.allList[0].propertyId;
        this.wyHeaderForm.propertyName = this.propertyList[0].propertyName;
        this.wyChange(this.allList[0].propertyId);
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
    wyChange(e) {
      let selectedWy = this.allList.filter((item) => {
        if (item.propertyId === e) return item;
      });
      this.buildList = this.flatten2(selectedWy[0].buildingList);
      this.wyHeaderForm.buildingId = this.buildList[0].buildingId;
      this.wyHeaderForm.buildingName = this.buildList[0].buildingName;
      let selectWy = this.propertyList.find(item => item.propertyId === e)
      this.wyHeaderForm.propertyName = selectWy.propertyName
      this.wyHeaderForm.isGetWyChargeMonth = true
      this.$emit("changeWyBuild", this.wyHeaderForm);
    },
    // 楼栋改变
    buildChange(e) {
      this.wyHeaderForm.buildingId = e;
      let selectBuild = this.buildList.find(item => item.buildingId === e)
      this.wyHeaderForm.buildingName = selectBuild.buildingName
      this.wyHeaderForm.isGetWyChargeMonth = false
      this.$emit("changeWyBuild", this.wyHeaderForm);
    },
    handleCommand(e) {
      this.$emit("changeSortType", e);
    },
  },
};
</script>

<style>
</style>