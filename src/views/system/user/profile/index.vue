<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" /> 用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" /> 手机号码
                <div class="pull-right">{{ user.phoneNum }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" /> 用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" /> 所属部门
                <div class="pull-right" v-if="user.deptName">
                  {{ user.deptName }} / {{ postGroup }}
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" /> 所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" /> 创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <userInfo :user="user" />
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getInfo } from "@/api/user"
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";

export default {
  name: "Profile",
  components: { userAvatar, userInfo },
  data() {
    return {
      user: {
        userName: "admin",
        sex: "1",
        phoneNum: "15900000000",
        email: "admin@qq.com",
        deptName: "行政部门",
        createTime: "2021-01-20",
      },
      roleGroup: "超级管理员",
      postGroup: "经理",
      activeTab: "userinfo",
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getInfo().then(res => {
        const user = { ...res.user }
        this.user = {
          userName: user.username === "" ? this.user.username : user.username,
          sex: user.sex === "" ? this.user.sex : user.sex,
          phoneNum: user.phone === "" ? this.user.phoneNum : user.phone,
          email: user.email === "" ? this.user.email : user.email,
          deptName: user.deptName === undefined || "" ? this.user.deptName : user.deptName,
          createTime: user.createTime === "" ? this.user.createTime : user.createTime.slice(0, 10),
        }
        this.roleGroup = user.roleGroup === undefined || "" ? this.roleGroup : user.roleGroup;
        this.postGroup = user.postGroup === undefined || "" ? this.postGroup : user.postGroup;
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.list-group {
  list-style: none;
  margin: 0;
  padding: 0;
  .list-group-item {
    border-bottom: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    margin-bottom: -1px;
    padding: 11px 0;
    font-size: 13px;
    .pull-right {
      float: right !important;
    }
  }
}
</style>
