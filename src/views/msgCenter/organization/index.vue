<template>
  <div class="app-container">
    <el-row :gutter="15" style="margin-top: 10px">
      <el-col :span="1.5">
        <el-button
          plain
          type="success"
          icon="el-icon-d-caret"
          size="mini"
          @click="expand"
          >{{ isShow ? "折叠" : "展开" }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="exportTable"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <section class="treeOrg">
      <el-table
        ref="treeOrg"
        v-loading="loading"
        :data="data"
        :row-key="getRowKeys"
        :expand-row-keys="expandAll"
        :cell-style="{ padding: '3px' }"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="部门名称" width="300">
          <template slot-scope="scope">
            <svg-icon
              icon-class="compony"
              v-if="scope.row.children && scope.row.children.length > 0"
              style="margin-right: 3px"
            ></svg-icon>
            <svg-icon
              icon-class="department"
              v-else
              style="margin-right: 3px"
            ></svg-icon>
            <span style="font-size: 14px">{{ scope.row.orgName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">
            <template
              v-if="scope.row.children && scope.row.children.length > 0"
            >
              <el-button
                type="text"
                size="mini"
                icon="el-icon-plus"
                @click.stop="() => handleAdd(scope.row)"
              >
                新增
              </el-button>
            </template>

            <el-button
              type="text"
              style="color: red"
              size="mini"
              icon="el-icon-delete"
              @click.stop="() => del(scope.row)"
              v-if="scope.row.parentId != 0 && scope.row.groupType === 3"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-search"
              @click.stop="() => check(scope.row)"
            >
              查看
            </el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              :disabled="hasPerEdit"
              @click.stop="() => modification(scope.row)"
            >
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <!-- 添加或修改部门对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="!disabled ? rules : {}"
        label-width="90px"
        :disabled="disabled"
      >
        <el-row v-if="form.parentId !== 0">
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect
                :disabled="disabled"
                v-model="form.parentId"
                :options="deptOptions"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="orgName">
              <el-input v-model="form.orgName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别" prop="groupType">
              <el-select
                v-model="form.groupType"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectState"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编" prop="postcode">
              <el-input v-model="form.postcode" placeholder="请输入邮编" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入电话"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="orgId">
              <el-input v-model="form.orgId" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="5" v-model="form.remark" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-else>
          <el-col :span="8">
            <el-form-item label="编号" prop="email">
              <el-input v-model="form.email" placeholder="请输入集团编号" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="名称" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入集团名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="email">
              <el-input v-model="form.email" placeholder="请输入集团地址" />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="营业执照号" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入集团营业执照号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="法人" prop="email">
              <el-input v-model="form.email" placeholder="请输入集团公司法人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="email">
              <el-input v-model="form.email" placeholder="请输入集团公司电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入集团公司传真号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disabled">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrg,
  checkOrg,
  deleteOrg,
  addOrg,
  updateOrg,
} from "@/api/system/organization";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  data() {
    return {
      data: [],
      isShow: false,
      disabled: false,
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orgName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" },
        ],
        groupType: [
          { required: true, message: "级别不能为空", trigger: "blur" },
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
            trigger: "blur",
          },
        ],
      },
      selectState: [],
      expandAll: ["1"],
      getRowKeys(row) {
        return row.groupId;
      },

      hasPerEdit: true,
    };
  },
  activated() {
    this.getList();
    if (this.$store.state.user.permissions.includes("system:org:edit")) {
      this.hasPerEdit = true
    } else {
      this.hasPerEdit = false
    }
  },
  methods: {
    expand() {
      this.isShow = !this.isShow;
      if (this.isShow) {
        this.forArr(this.data, true);
      } else {
        this.forArr(this.data, false);
        this.expandAll = ["1"];
      }
    },
    // 树形节点的展开状态操作 toggleRowExpansion
    forArr(arr, isExpand) {
      arr.forEach((i) => {
        this.$refs.treeOrg.toggleRowExpansion(i, isExpand);
        if (i.children) {
          this.forArr(i.children, isExpand);
        }
      });
    },
    getList() {
      getOrg().then((res) => {
        const newArr1 = [].concat({ ...res.data });
        this.loading = false;
        let newArr = [];
        this.sortTreeList(newArr1);
        this.getTreeList(newArr1, newArr);
        this.deptOptions = [...newArr];
        console.log(this.deptOptions)
      });
    },
    // 递归树状数据
    getTreeList(treeList, newTreeList) {
      treeList.map((c) => {
        if (c.groupType !== 3) {
          let tempData = {
            label: c.orgName,
            id: c.groupId,
            groupType: c.groupType,
          };
          if (c.children && c.children.length > 0 && c.groupType !== 2) {
            tempData.children = [];
            this.getTreeList(c.children, tempData.children);
          }
          newTreeList.push(tempData);
        }
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
      this.data = treeList;
      return this.data;
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.disabled = false;
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.groupId;
        if (row.groupType === 0) {
          this.selectState = [
            { label: "公司", value: 1 },
            { label: "部门", value: 3 },
          ];
        } else if (row.groupType === 1) {
          this.selectState = [
            { label: "管理处", value: 2 },
            { label: "部门", value: 3 },
          ];
        } else {
          this.form.groupType = 3;
          this.selectState = [{ label: "部门", value: 3 }];
        }
      }
      this.open = true;
      this.title = "添加机构";
    },
    // 表单重置
    reset() {
      this.form = {
        groupId: undefined,
        groupType: undefined,
        orgName: undefined,
        parentId: undefined,
        director: undefined,
        phone: undefined,
        email: undefined,
        orgId: "",
      };
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields();
      }
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 判断是修改还是新增
          if (this.form.groupId == undefined) {
            addOrg(this.form).then((res) => {
              this.getList();
              this.$message.success("新增成功");
              this.open = false;
            });
          } else {
            updateOrg(this.form).then((res) => {
              this.getList();
              this.$message.success("修改成功");
              this.open = false;
            });
          }
        }
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 增加
    add(data) {
      this.open = true;
    },
    // 删除
    del(data) {
      this.$confirm(`是否确认删除 "${data.orgName}" 的数据?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const delParams = {
            groupId: data.groupId,
          };
          return deleteOrg(delParams);
        })
        .then(() => {
          this.getList();
          this.$message.success("删除成功");
        });
    },
    modification(val) {
      let parentType = 0;
      if (val.parentId !== 0) {
        this.title = "机构设置";
        checkOrg({ groupId: val.parentId }).then((res) => {
          parentType = res.data.groupType;
          if (parentType === 0 && val.groupType === 3) {
            this.selectState = [
              { label: "公司", value: 1 },
              { label: "部门", value: 3 },
            ];
          } else if (parentType === 0 && val.groupType === 1) {
            this.selectState = [{ label: "公司", value: 1 }];
          } else if (parentType === 1 && val.groupType === 2) {
            this.selectState = [{ label: "管理处", value: 2 }];
          } else if (parentType === 1 && val.groupType === 3) {
            this.selectState = [
              { label: "管理处", value: 2 },
              { label: "部门", value: 3 },
            ];
          } else if (parentType === 2 && val.groupType === 3) {
            this.selectState = [{ label: "部门", value: 3 }];
          }
        });
      } else {
        this.title = "集团公司";
      }
      this.disabled = false;
      this.form = {
        groupId: val.groupId,
        groupType: val.groupType,
        orgName: val.orgName === "" ? "" : val.orgName,
        parentId: val.parentId,
        director: val.director === "" ? "" : val.director,
        phone: val.phone === "" ? "" : val.phone,
        email: val.email === "" ? "" : val.email,
        orgId: val.orgId === "" ? "" : val.orgId,
      };
      this.open = true;
    },
    // 查看
    check(data) {
      // 重置表单,重置校验规则
      this.reset();
      checkOrg({ groupId: data.groupId }).then((res) => {
        this.open = true;
        this.disabled = true;
        const checkData = { ...res.data };
        this.form = {
          groupId: checkData.groupId,
          groupType: checkData.groupType,
          orgName: checkData.orgName === "" ? " " : checkData.orgName,
          parentId: checkData.parentId,
          director: checkData.director === "" ? " " : checkData.director,
          phone: checkData.phone === "" ? " " : checkData.phone,
          email: checkData.email === "" ? " " : checkData.email,
          orgId: checkData.postcode === "" ? " " : checkData.postcode,
        };
        this.title = "组织机构";
      });
    },
    // 导出树形结构
    exportTable() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出组织机构信息?", "警告", {
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
.app-container {
  padding: 24px;
  .treeOrg {
    padding: 20px 5px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  padding-right: 8px;
  .tree-operate {
    width: 240px;
    display: flex;
    justify-content: space-around;
  }
}
.el-button + .el-button {
  margin-left: 15px;
}
</style>
<style lang="scss">
.el-button [class*="el-icon-"] + span {
  margin-left: 3px;
}
.el-input.is-disabled .el-input__inner {
  color: #999999;
}
</style>
