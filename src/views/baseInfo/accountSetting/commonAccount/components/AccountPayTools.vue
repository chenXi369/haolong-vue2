<template>
  <el-form
    ref="accountToolForm"
    :model="accountToolForm"
    label-width="70px"
    :inline="true"
    size="mini"
    @submit.native.prevent
  >
    <el-form-item label="查找">
      <el-input
        clearable
        v-model="accountToolForm.searchVal"
        style="width: 120%"
        placeholder="输入姓名、房号、手机号等"
        @change.native="search"
      ></el-input>
    </el-form-item>
    <el-form-item label=" " label-width="50px">
      <el-button plain type="primary" size="mini">保存</el-button>
      <el-button plain type="warning" size="mini">删除</el-button>
    </el-form-item>
    <el-form-item label=" " label-width="20px">
      <el-select
        v-model="accountToolForm.region"
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

    <el-form-item label=" " label-width="35px">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button type="primary" plain>
          排 序<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :command="0"
            :class="{ activeItem: accountToolForm.sortType === 0 }"
            >单元，楼层，房号</el-dropdown-item
          >
          <el-dropdown-item
            divided
            :command="1"
            :class="{ activeItem: accountToolForm.sortType === 1 }"
            >单元，房号，楼层</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      accountToolForm: {
        region: 3,
        sortType: 0,
        searchVal: "",
      },
    };
  },
  methods: {
    search() {},
    // 改变客户列表的范围
    changeRegion(item) {
      console.log(item);
    },
    // 排序方式的切换
    handleCommand(e) {
      this.accountToolForm.sortType = e;
      this.$emit("changeWyBuild", this.accountToolForm);
    }
  },
};
</script>

<style lang="scss" scoped>
.activeItem {
  background: #eaeaea;
  color: #1890ff;
}
</style>