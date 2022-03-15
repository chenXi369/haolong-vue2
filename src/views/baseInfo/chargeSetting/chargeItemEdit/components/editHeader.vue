<template>
  <div>
    <el-form
      ref="editHeaderForm"
      :model="editHeaderForm"
      :inline="true"
      label-width="70px"
      size="mini"
    >
      <el-form-item label="物业">
        <el-select
          :disabled="disabled"
          v-model="editHeaderForm.propertyId"
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
          v-model="editHeaderForm.buildingId"
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
        <el-checkbox v-model="editHeaderForm.allChecked" @change="allCheck"
          >全部</el-checkbox
        >
      </el-form-item>

      <el-form-item label=" " label-width="35px">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button type="primary" plain>
            排 序<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="0"
              :class="{ activeItem: editHeaderForm.sortType === 0 }"
              >单元，楼层，房号</el-dropdown-item
            >
            <el-dropdown-item
              divided
              :command="1"
              :class="{ activeItem: editHeaderForm.sortType === 1 }"
              >单元，房号，楼层</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <template v-if="showSortType">
        <el-form-item label=" " label-width="55px">
          <el-select
            v-model="editHeaderForm.itemState"
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
            v-if="editHeaderForm.itemState === 0"
            v-model="editHeaderForm.itemName"
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
            v-model="editHeaderForm.itemName"
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
    </el-form>
  </div>
</template>

<script>
import { getWyList } from "@/api/system/houseRes";
import { getPayItemList } from "@/api/system/payItemEdit";

export default {
  props: {
    showSortType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editHeaderForm: {
        propertyId: null,
        buildingId: null,
        allChecked: false,
        itemState: 0,
        sortType: 0,
        itemName: 0,
        propertyName: "",
        buildingName: "",
        chargeItemName: "",
      },
      allChecked: false,
      disabled: true,
      disabledItemName: false,
      propertyList: [],
      buildList: [],
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
  },
  methods: {
    allCheck() {
      this.allChecked = this.editHeaderForm.allChecked;
      this.$emit("changeWyBuild", this.editHeaderForm);
    },
    getWyListInfo() {
      getWyList().then((res) => {
        this.disabled = false;
        this.allList = [...res.data];
        this.propertyList = this.flatten(this.allList);
        this.editHeaderForm.propertyId = this.allList[0].propertyId;
        this.editHeaderForm.propertyName = this.allList[0].propertyName;
        this.wyChange(this.editHeaderForm.propertyId);
      });
    },
    // 获取收费数据字典
    getPayItemList(id) {
      let query = {
        wyid: id,
        projectType: this.editHeaderForm.itemState,
      };
      getPayItemList(query).then((res) => {
        this.itemNameList = [...res.data];
        if (this.editHeaderForm.itemState === 0) {
          this.editHeaderForm.itemName = this.itemNameList[0].ID;
          this.editHeaderForm.chargeItemName = this.itemNameList[0].项目名称;
        } else if (this.editHeaderForm.itemState === 1) {
          this.editHeaderForm.itemName = this.itemNameList[0].JFID;
          this.editHeaderForm.chargeItemName = this.itemNameList[0].计费名称;
        }
        this.$emit("changeWyBuild", this.editHeaderForm);
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
      let selectedWyInfo = this.flatten(selectedWy);
      this.editHeaderForm.propertyId = selectedWyInfo[0].propertyId;
      this.editHeaderForm.propertyName = selectedWyInfo[0].propertyName;

      this.editHeaderForm.buildingId = this.buildList[0].buildingId;
      this.editHeaderForm.buildingName = this.buildList[0].buildingName;
      this.getPayItemList(e);
    },
    // 楼栋改变
    buildChange(e) {
      let selectBuild = this.buildList.filter((item) => item.buildingId === e);
      this.editHeaderForm.buildingId = e;
      this.editHeaderForm.buildingName = selectBuild[0].buildingName;
      this.$emit("changeWyBuild", this.editHeaderForm);
    },
    // 项目类型改变
    payItemChange(e) {
      if (e === 2) {
        this.disabledItemName = true;
      } else {
        this.disabledItemName = false;
      }
      this.getPayItemList(this.editHeaderForm.propertyId);
    },
    itemNameChange(val) {
      this.editHeaderForm.itemName = val;
      let selectChargeItem = [];
      if (this.editHeaderForm.itemState === 0) {
        selectChargeItem = this.itemNameList.filter((item) => item.ID === val);
        this.editHeaderForm.chargeItemName = selectChargeItem[0].项目名称;
      } else
        selectChargeItem = this.itemNameList.filter(
          (item) => item.JFID === val
        );
      this.editHeaderForm.chargeItemName = selectChargeItem[0].计费名称;
      this.$emit("changeWyBuild", this.editHeaderForm);
    },
    handleCommand(e) {
      this.editHeaderForm.sortType = e;
      this.$emit("changeWyBuild", this.editHeaderForm);
    },
  },
};
</script>

<style lang="scss" scoped>
.activeItem {
  background: #eaeaea;
  color: #1890ff;
}
</style>