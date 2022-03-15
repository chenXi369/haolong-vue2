<template>
  <el-dropdown trigger="click">
    <div>
      <svg-icon class-name="size-icon" icon-class="commonFunc" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <div class="dropdown-title">常用目录</div>
      <section class="dropdown-content">
        <el-dropdown-item
          class="dropdown-item"
          v-for="item of sizeOptions"
          :key="item.value"
          @click.native="handleCommand(item)"
        >
          <svg-icon class-name="size-icon" :icon-class="item.value"></svg-icon>
          <span style="padding-left: 5px">{{ item.label }}</span>
        </el-dropdown-item>
      </section>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      sizeOptions: [
        { label: "房屋资源", value: "house" },
        { label: "租赁合同", value: "htNotice" },
        { label: "业主登记", value: "xtData" },

        { label: "员工信息", value: "peoples" },
        { label: "权限设置", value: "permissionRange" },
        { label: "组织机构", value: "organization" }
      ],
    };
  },
  methods: {
    // 切换command触发
    handleCommand(e) {
      if (e.value === "house") {
        this.$router.push({
          name: "HouseRes",
        });
      } else if (e.value === "htNotice") {
        this.$router.push({
          name: "RentContract",
        });
      } else if (e.value === "xtData") {
        this.$router.push({
          name: "UserRegister",
        });
      } else if (e.value === "peoples") {
        this.$router.push({
          name: "StaffInfo",
        });
      } else if (e.value === "permissionRange") {
        this.$router.push({
          name: "Permission",
        });
      } else if(e.value === "organization") {
        this.$router.push({
          name: "Organization",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-title {
  height: 30px;
  line-height: 30px;
  padding: 0 12px;
  color: #7d7d7d;
  border-bottom: 1px solid #d0d0d0;
}
.dropdown-content {
  padding-left: 10px;
  width: 375px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .dropdown-item {
    margin: 6px 6px 2px 6px;
    padding: 0px 20px;
    border-radius: 20px;
  }
}
</style>
