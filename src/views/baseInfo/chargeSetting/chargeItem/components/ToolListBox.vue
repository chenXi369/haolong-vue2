<template>
  <div>
    <el-form
      ref="toolForm"
      :model="toolForm"
      label-width="70px"
      :inline="true"
      size="mini"
      @submit.native.prevent
    >
      <el-form-item label="查找">
        <el-input
          clearable
          v-model="toolForm.searchVal"
          style="width: 120%"
          placeholder="输入姓名、房号、手机号等"
          @change.native="search"
        ></el-input>
      </el-form-item>
      <el-form-item label=" " label-width="84px">
        <el-select
          v-model="toolForm.region"
          @change="(item) => changeRegion(item)"
        >
          <el-option label="全部客户" :value="0"></el-option>
          <el-option label="仅业主" :value="1"></el-option>
          <el-option label="仅租户" :value="2"></el-option>
          <el-option label="业主+租户" :value="3"></el-option>
          <el-option label="退房客户" :value="4"></el-option>
          <el-option label="退租客户" :value="5"></el-option>
          <el-option label="退房客户+退租客户" :value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" " label-width="96px">
        <el-dropdown trigger="click" placement="bottom-end">
          <el-button type="primary" plain>
            批量处理<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :disabled="!selectedUserData.hasOwnProperty('客户名称')"
              @click.native="handleAllUser"
              >选择全部客户</el-dropdown-item
            >
            <el-dropdown-item
              :disabled="
                !selectedUserData.hasOwnProperty('客户名称') || handleSetting
              "
              @click.native="handleCopyItem"
              >成批复制项目</el-dropdown-item
            >
            <el-dropdown-item
              :disabled="
                !selectedUserData.hasOwnProperty('客户名称') || handleSetting
              "
              @click.native="handleDelItem"
              >成批删除项目</el-dropdown-item
            >
            <template v-if="showMenus">
              <el-dropdown-item command="e" divided
                >生成选定客户的【应收款】</el-dropdown-item
              >
              <el-dropdown-item command="f" divided
                >计算选定客户的【附加项目费用】</el-dropdown-item
              >
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <template v-if="showMenus">
        <el-form-item label=" ">
          <el-button size="mini" icon="el-icon-edit" round @click="toEditPage"
            >浏览编辑</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-document-copy"
            round
            @click="toChargeStr"
            >收费标准</el-button
          >
        </el-form-item>
      </template>

      <el-form-item
        label=" "
        v-if="selectedUserData.hasOwnProperty('客户名称')"
      >
        <button class="nh-hover">
          选定参照客户：{{ selectedUserData.客户名称 }}
        </button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    showMenus: {
      type: Boolean,
      default: false,
    },
    handleSetting: {
      type: Boolean,
      default: true,
    },
    selectedUserData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      toolForm: {
        searchVal: "",
        region: 3,
      },
    };
  },
  methods: {
    search() {
      this.$emit("quickSearch", this.toolForm.searchVal);
    },
    changeRegion(i) {
      this.$emit("changeRegion", i);
    },
    // 去收费标准
    toChargeStr() {
      this.$router.push("/chargeSetting/routineCharge");
    },
    // 去浏览编辑
    toEditPage() {
      this.$emit("toVistAndEdit");
    },
    // 选择全部客户
    handleAllUser() {
      this.$emit("selectAllRefUser");
    },
    // 成批复制项目
    handleCopyItem() {
      this.$emit("copyAllItem");
    },
    // 成批删除项目
    handleDelItem() {
      this.$emit("delAllItem");
    },
  },
};
</script>

<style></style>