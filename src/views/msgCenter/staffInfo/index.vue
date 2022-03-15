<template>
  <div class="staffInfo">
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
        <div class="head-container">
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
              <svg-icon icon-class="compony" v-if="data.children && data.children.length > 0" style="margin-right: 3px"></svg-icon>
              <svg-icon icon-class="department" v-else style="margin-right: 3px"></svg-icon>
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
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="queryParams.mobile"
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
              type="primary"
              icon="el-icon-plus"
              size="mini"
              :disabled="noChildren"
              @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="success"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              plain
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              >批量删除</el-button
            >
          </el-col> -->

          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getTable"
          ></right-toolbar>
        </el-row>

        <el-table
          border
          stripe
          v-loading="loading"
          :data="userList"
          row-key="staffId"
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" width="50" align="center" />
          <el-table-column
            label="角色编号"
            type="index"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="用户名称"
            align="center"
            prop="username"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门名称"
            align="center"
            prop="departureDate"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="性别" align="center" prop="sex" width="60" />
          <el-table-column
            label="手机号码"
            align="center"
            prop="phone"
            width="120"
          />
          <el-table-column label="状态" align="center" width="90">
            <template slot-scope="scope">

              {{ scope.row.isQuit ? "离职" : "在职" }}
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime.slice(0, 10) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
            fixed="right"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button
                v-if="scope.row.staffId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
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

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog
          :title="title"
          :visible.sync="open"
          width="600px"
          append-to-body
          :close-on-click-modal="false"
        >
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="归属部门" prop="groupId">
                  <el-input
                    v-if="title === '新增员工'"
                    :disabled="true"
                    v-model="form.groupId"
                    placeholder="请输入归属部门"
                  />
                  <treeselect
                    v-else
                    v-model="form.groupId"
                    :options="treeOrgOptions"
                    :flat="true"
                    placeholder="请选择归属部门"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item clearable label="用户名称" prop="userName">
                  <el-input
                    clearable
                    v-model="form.username"
                    placeholder="请输入用户名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户性别">
                  <el-select v-model="form.sex" placeholder="请选择">
                    <el-option
                      v-for="dict in sexOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机号码" prop="phone">
                  <el-input
                    clearable
                    v-model="form.phone"
                    placeholder="请输入手机号码"
                    maxlength="11"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    clearable
                    v-model="form.email"
                    placeholder="请输入邮箱"
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="出生日期" prop="brithday">
                  <el-date-picker
                    v-model="form.brithday"
                    type="date"
                    placeholder="选择日期"
                    style="width: 200px"
                    :editable="false"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.isQuit">
                    <el-radio
                      v-for="dict in statusOptions"
                      :key="dict.value"
                      :label="dict.value"
                      >{{ dict.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input
                    v-model="form.remark"
                    type="textarea"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getStaffList,
  staffAdd,
  deleteStaff,
  updateStaff,
  checkStaff,
} from "@/api/system/staffInfo";
import { getToken } from "@/utils/auth";
import { getOrg } from "@/api/system/organization";
import Sortable from "sortablejs";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  data() {
    return {
      orgName: "",
      // 是否显示弹出层
      open: false,
      title: "",
      form: {},
      // ids: [],
      usernames: [],
      upload: {
        open: false,
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
      treeOrgOptions: [],
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
        mobile: "",
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
      // 不选中且单个
      single: true,
      // 非多个禁用
      multiple: true,
      // 不选中部门无法操作
      noChildren: true,
      loading: true,
      // 用户的table
      userList: [],
      total: 0,
      // 表单校验
      rules: {
        username: [
          { required: true, message: "员工名不能为空", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: ["blur", "change"],
          },
        ],
      },
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
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.userList.splice(oldIndex, 1)[0];
          _this.userList.splice(newIndex, 0, currRow);
        },
      });
    },
    // 获得树
    getTree() {
      getOrg().then((res) => {
        const newArr = [].concat({ ...res.data });
        this.sortTreeList(newArr)
        this.getTreeList(newArr, this.treeOrgOptions);
      });
    },
    // 递归树状排序
    sortTreeList(treeList, newTreeList) {
      treeList.map((c) => {
        c.children.sort((a, b) => {
          if (a.groupType > b.groupType) {
            return -1;
          }
          this.sortTreeList(c.children)
        });
      });
      this.orgOptions = treeList;
      return this.orgOptions;
    },
    // 递归树状数据
    getTreeList(treeList, newTreeList) {
      treeList.map((c) => {
        let tempData = {
          label: c.orgName,
          id: c.groupId,
          isDisabled: true,
        };
        if (c.groupType === 3) {
          tempData = {
            label: c.orgName,
            id: c.groupId,
          };
        }
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
        this.rowDrop();
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
      if (data.children && data.children.length === 0) {
        this.noChildren = false;
        this.form.groupId = data.orgName;
      } else {
        this.noChildren = true;
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // this.ids = selection.map((item) => item.staffId);
      this.usernames = selection.map((item) => item.username);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 查询搜索
    handleQuery() {
      if (
        this.queryParams.username === "" &&
        this.queryParams.isQuit === "" &&
        this.queryParams.mobile === ""
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
          loginName:
            this.queryParams.username === ""
              ? undefined
              : this.queryParams.username,
          isQuit:
            this.queryParams.isQuit === ""
              ? undefined
              : this.queryParams.isQuit,
          mobile:
            this.queryParams.mobile === ""
              ? undefined
              : this.queryParams.mobile,
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
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        username: "",
        isQuit: "",
        mobile: "",
      };
    },
    // 表单重置
    reset() {
      this.form = {
        brithday: undefined,
        staffId: undefined,
        groupId: this.form.groupId,
        userName: undefined,
        nickName: undefined,
        mobile: undefined,
        email: undefined,
        sex: undefined,
        isQuit: undefined,
        remark: undefined,
      };
      if (this.$refs["form"] !== undefined) {
        // 重置规则
        this.$refs["form"].resetFields();
      }
    },
    // 增加
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增员工";
    },
    // 修改
    handleUpdate(row) {
      this.reset();
      checkStaff({ staffId: row.staffId }).then((res) => {
        this.open = true;
        this.title = "修改用户";
        this.form = {
          brithday: res.data.brithday,
          staffId: row.staffId,
          groupId: res.data.groupId,
          username: res.data.username,
          phone: res.data.phone,
          email: res.data.email,
          sex: res.data.sex,
          isQuit: res.data.isQuit,
          remark: res.data.remark,
        };
      });
    },
    // 删除
    handleDelete(row) {
      const staffIds = row.staffId || this.ids;
      const names = row.username || this.usernames;
      this.$confirm(`是否确认删除用户名称为 "${names}" 的数据吗?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteStaff({
            userIds: JSON.stringify(staffIds)
              .replace(/\[/, "")
              .replace(/\]/, ""),
          });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
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
    // 新增和修改的确认按钮
    submitForm() {
      console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 修改
          if (this.form.staffId != undefined) {
            updateStaff(this.form).then(() => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.open = false;
              this.getList();
            });
          } else {
            // 新增
            staffAdd(this.form).then((response) => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.staffInfo {
  padding: 24px;
}
</style>
