<template>
  <div class="permission">
    <el-row :gutter="36" style="display: flex">
      <!-- 部门数据 -->
      <el-col :span="4" :xs="24" style="min-width: 260px">
        <div class="head-input">
          <el-input
            v-model="orgName"
            placeholder="请输入部门名称"
            clearable
            size="mini"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div>
          <el-tree
            :data="orgOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :highlight-current="true"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <svg-icon
                icon-class="compony"
                v-if="data.children && data.children.length > 0"
                style="margin-right: 3px"
              ></svg-icon>
              <svg-icon
                icon-class="department"
                v-else
                style="margin-right: 3px"
              ></svg-icon>
              <span style="font-size: 14px">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>

      <!-- 用户数据 -->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名称"
              clearable
              size="mini"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="queryParams.phone"
              placeholder="请输入手机号"
              clearable
              size="mini"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户状态" prop="isQuit">
            <el-select
              v-model="queryParams.isQuit"
              placeholder="用户状态"
              clearable
              size="mini"
              style="width: 200px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button
              plain
              type="primary"
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" style="margin-bottom: 12px">
          <el-col :span="1.5">
            <el-button
              plain
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getTree"
          ></right-toolbar>
        </el-row>

        <el-table
          border
          stripe
          :data="userList"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" width="50" align="center" />
          <el-table-column
            label="角色编号"
            type="index"
            width="80"
            align="center"
          />
          <el-table-column
            label="用户名称"
            align="center"
            prop="username"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门名称"
            align="center"
            prop="dept.deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="性别" align="center" prop="sex" width="60" />
          <el-table-column
            label="手机号码"
            align="center"
            prop="phone"
            width="120"
          />
          <el-table-column label="状态" align="center" width="60">
            <template slot-scope="scope">
              {{ scope.row.isQuit ? "离职" : "在职" }}
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime.slice(0, 10) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            fixed="right"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.staffId !== 1 && scope.row.level !== 0"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                style="padding: 0; color: red"
                >取消授权</el-button
              >
              <el-button
                v-if="scope.row.staffId !== 0"
                size="mini"
                type="text"
                icon="el-icon-thumb"
                @click="handleMandate(scope.row)"
                style="padding: 0"
                >授权</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getTable"
        />
      </el-col>
    </el-row>

    <permission-Dialog
      ref="permDialog"
      :showPermission="showPermission"
      :title="title"
      :tableData="tableData"
      :roleOptions="roleOptions"
      :permissionForm="permissionForm"
      @closePermission="closePermission"
    ></permission-Dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getStaffList, checkStaff } from "@/api/system/staffInfo"
import { cancelPerm } from "@/api/system/permission"
import { getRouters, getInfo } from "@/api/user";
import { getToken } from "@/utils/auth";
import { getOrg } from "@/api/system/organization";
import PermissionDialog from "./component/permissionDialog";

export default {
  components: { PermissionDialog },
  data() {
    return {
      orgName: "",
      // 是否显示弹出层
      showPermission: false,
      title: "",
      ids: [],
      upload: {
        openExport: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      orgOptions: [],
      defaultProps: {
        children: "children",
        label: "orgName",
      },
      showSearch: true,
      queryParams: {
        groupType: 0,
        groupId: 1,
        username: "",
        isQuit: "",
        phone: "",
        pageNum: 1,
        pageSize: 20,
      },
      statusOptions: [
        {
          label: "在职",
          value: false,
        },
        {
          label: "离职",
          value: true,
        },
      ],
      sexOptions: [
        {
          label: "男",
          value: 1,
        },
        {
          label: "女",
          value: 0,
        },
      ],
      // 角色选项
      roleOptions: [],
      deptOptions: [],
      // 不选中且单个
      single: true,
      // 非多个禁用
      multiple: true,
      loading: true,
      // 用户的table
      userList: [],
      total: 0,
      tableData: [],
      groupId: "",
      staffId: 0,
      permissionForm: {},
      // 权限范围的修改
      wyRangeArr: [], // 默认
      noWyRangeArr: [], // 默认
      newWyIdArr: [], // 新增
      newNoWyIdArr: [], // 新增
    };
  },
  watch: {
    // 根据名称筛选部门树
    orgName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getTree();
    this.getTable();
  },
  methods: {
    closePermission(val) {
      this.showPermission = val;
    },
    getWyIds(val) {
      this.newWyIdArr = val;
    },
    getNoWyIds(val) {
      this.newNoWyIdArr = val;
    },
    // table数据扁平化处理
    flatten (data) {
      return data.reduce((arr, {menuId, menuName, rtype, permList, children = []}) =>
        arr.concat([{menuId, menuName, rtype, permList}], this.flatten(children)), [])
    },
    speadArr (data) {
      return data.reduce((arr, {menuId, menuName, permission, ownership, permList = []}) =>
        arr.concat([{menuId, menuName, permission, ownership}], this.speadArr(permList)), [])
    },
    // 获取菜单
    getMenu() {
      getRouters().then((res) => {
        const menuList = [...res.mcTree];
        this.tableData = [];
        this.getMenuList(menuList, this.tableData);
        const startArr =  this.speadArr(this.flatten(this.tableData)).filter(item => {return item.ownership === true}).map(item => {
          return item.menuId
        })
        Cookies.set('startPerm', JSON.stringify(startArr))
      });
    },
    // 递归授权table树状数据
    getMenuList(menuList, newMenuList) {
      menuList.map((c) => {
        let tempData = {};
        if (c.children && c.children.length === 0) {
          tempData = {
            permList: c.permList,
            menuId: c.menuId,
            menuName: c.menuName,
            rtype: c.rtype,
          };
        } else {
          tempData = {
            menuId: c.menuId,
            menuName: c.menuName,
            rtype: c.rtype,
          };
        }
        if (c.children && c.children.length > 0) {
          tempData.children = [];
          this.getMenuList(c.children, tempData.children);
        }
        newMenuList.push(tempData);
      });
    },
    // 获得树
    getTree() {
      getOrg().then((res) => {
        const newArr = [].concat({ ...res.data });
        this.sortTreeList(newArr);
        this.getTreeList(newArr, this.deptOptions);
      });
    },
    // 递归树状排序
    sortTreeList(treeList) {
      treeList.map((c) => {
        c.children.sort((a, b) => {
          if (a.groupType > b.groupType) {
            return -1;
          }
          this.sortTreeList(c.children);
        });
      });
      this.orgOptions = treeList;
      return this.orgOptions;
    },
    // 递归组织结构树状数据
    getTreeList(treeList, newTreeList) {
      treeList.map((c) => {
        let tempData = {
          label: c.orgName,
          id: c.groupId,
        };
        if (c.children && c.children.length > 0) {
          tempData.children = [];
          this.getTreeList(c.children, tempData.children);
        }
        newTreeList.push(tempData);
      });
    },
    // 获取员工列表
    getTable() {
      this.loading = true;
      let params = {
        groupType: this.queryParams.groupType,
        groupId: this.queryParams.groupId,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      getStaffList(params).then((res) => {
        this.userList = [...res.records];
        this.total = res.total;
        this.loading = false;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.groupId = data.groupId;
      this.queryParams.groupType = data.groupType;
      this.getTable();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.staffId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 查询搜索
    handleQuery() {
      if (
        this.queryParams.username === "" &&
        this.queryParams.isQuit === "" &&
        this.queryParams.phone === ""
      ) {
        this.$message({
          message: "请输入搜索条件",
          type: "warning",
        });
      } else {
        this.loading = true;
        let params = {
          groupId: this.queryParams.groupId,
          username:
            this.queryParams.username === ""
              ? undefined
              : this.queryParams.username,
          username:
            this.queryParams.username === ""
              ? undefined
              : this.queryParams.username,
          isQuit:
            this.queryParams.isQuit === ""
              ? undefined
              : this.queryParams.isQuit,
          phone:
            this.queryParams.phone === "" ? undefined : this.queryParams.phone,
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
        };
        getStaffList(params).then((res) => {
          // 查询成功
          this.userList = [...res.records];
          this.total = res.total;
          this.loading = false;
          if (this.total > 0) {
            this.$message({
              message: "查询成功！",
              type: "success",
              offset: 60,
            });
          } else {
            this.$message({
              message: "您查询的目标不存在",
              type: "warning",
              offset: 60,
            });
          }
        });
      }
    },
    // 删除授权
    handleDelete(row) {
      this.$confirm(`确定删除员工 "${row.username}" 的授权吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        return cancelPerm({staffId: row.staffId})
      }).then(() => {
        this.$message.success(`员工 [${row.username}] 的授权已被删除！`)
        this.getTable();
      })
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        username: "",
        isQuit: "",
        phone: "",
      };
    },
    // 修改
    handleUpdate(row) {
      this.getMenu();
      const userIds = row.staffId || this.ids[0];
      checkStaff({ staffId: userIds }).then((res) => {
        this.permissionForm = {
          loginName: res.data.loginName,
          password: res.data.password,
        };
        this.roleOptions = res.roles;
        this.permissionForm.postIds = res.postIds;
        this.permissionForm.roleIds = res.roleIds;
        this.showPermission = true;
        this.title = "修改授权";
      });
    },
    // 授权按钮
    handleMandate(row) {
      if (row.level === 0) {
        this.$confirm("您还没有该操作权限，请联系上级获取该权限！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {});
      } else {
        this.getMenu();
        checkStaff({ staffId: row.staffId }).then((res) => {
          this.$set(this.permissionForm, 'loginName', res.data.loginName)
          this.$set(this.permissionForm, 'password', res.data.password)

          this.$set(this.permissionForm, 'staffId', res.data.staffId)
          this.$set(this.permissionForm, 'postIds', res.postIds)
          this.$set(this.permissionForm, 'roleIds', res.roleIds)

          this.roleOptions = res.roles;
          this.showPermission = true;
          this.title = "员工授权";
          this.groupId = res.data.groupId;
          this.staffId = res.data.staffId;
          this.$refs['permDialog'].getStaffPerm();
          this.$refs['permDialog'].getOrange(this.groupId, this.staffId);
          this.$refs['permDialog'].getOwnerReportList()
          this.$refs['permDialog'].getOwnerReportPerm()
        });
      }
    },
    // 导出
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        // return exportUser(queryParams);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.permission {
  padding: 24px;
  .table-thead {
    th {
      // border-right: 1px solid #eaeaea;
    }
  }
  .head-container {
    min-width: 300px;
  }
}
</style>
