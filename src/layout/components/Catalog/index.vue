<template>
  <div class="menuList">
    <el-menu
      :default-active="activeIndex"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="true"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="true"
      @select="handleSelect"
      mode="horizontal"
    >
      <el-menu-item
        style="height: 50px; line-height: 50px"
        v-for="item in menuList"
        :key="item"
        :index="item"
        >{{ item }}</el-menu-item
      >
    </el-menu>

    <el-button
      size="mini"
      round
      type="primary"
      icon="el-icon-refresh"
      @click="refresh"
      >刷新菜单</el-button
    >
  </div>
</template>

<script>
import variables from "@/styles/variables.scss";
import Cookies from "js-cookie";
import { mapGetters } from "vuex";
import { getRouters, refreshMenu } from "@/api/user";

export default {
  data() {
    return {
      activeIndex: "默认目录",
    };
  },
  computed: {
    menuList() {
      return this.$store.state.permission.topMenu;
    },
    variables() {
      return variables;
    },
  },
  mounted() {
    if (Cookies.get("activeIndex") !== undefined) {
      this.activeIndex = Cookies.get("activeIndex");
    }
    if (this.menuList && this.menuList.length > 0) {
      this.activeIndex = this.menuList[0];
    }
  },
  methods: {
    handleSelect(key) {
      Cookies.set("activeIndex", key);
      this.$store.dispatch("permission/generateRoutes", key);
    },
    refresh() {
      refreshMenu().then(() => {
        this.$message({
          message: "菜单刷新成功！",
          type: "success"
        })
        this.$store.dispatch("permission/generateRoutes");
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.menuList {
  height: 50px;
  padding-right: 24px;
  color: rgb(191, 203, 217);
  background-color: rgb(48, 65, 86);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
