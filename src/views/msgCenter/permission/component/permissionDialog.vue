<template>
  <div class="permissionDialog">
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="showPermission"
      :close-on-click-modal="false"
      width="1000px"
      :before-close="handleClose"
    >
      <el-tabs type="border-card" v-model="active">
        <el-tab-pane name="a">
          <span slot="label"
            ><svg-icon
              icon-class="addPermission"
              style="width: 17px; height: 17px"
            ></svg-icon>
            权限定义</span
          >
          <el-form
            ref="permissionForm"
            :model="permissionForm"
            :rules="rules"
            label-width="80px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="登录名" prop="loginName">
                  <el-input
                    v-model="permissionForm.loginName"
                    style="width: 300px"
                    placeholder="请输入登录名"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码" prop="password">
                  <el-input
                    clearable
                    v-model="permissionForm.password"
                    style="width: 300px"
                    placeholder="请输入登录密码"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="角色">
                  <el-select
                    v-model="permissionForm.roleIds"
                    multiple
                    style="width: 300px"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.roleId"
                      :label="item.roleName"
                      :value="item.roleId"
                      :disabled="item.isQuit == 1"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="授权权限管理员" label-width="150px">
                  <el-checkbox
                    v-model="permissionForm.isAuth"
                    style="margin-left: 100px"
                  ></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <!-- 角色授权 table -->
                <el-form-item label="角色授权">
                  <el-table
                    stripe
                    border
                    row-key="menuId"
                    default-expand-all
                    :data="tableData"
                    :cell-style="{ padding: '3px' }"
                    :header-cell-style="{ padding: '4px' }"
                    style="width: 100%; margin-bottom: 20px"
                    :tree-props="{
                      children: 'children',
                      hasChildren: 'hasChildren',
                    }"
                  >
                    <!-- 目录列 -->
                    <el-table-column
                      label="菜单名称"
                      width="200"
                      header-align="center"
                    >
                      <template slot-scope="scope">
                        <span style="margin-right: 8px">{{
                          scope.row.menuName
                        }}</span>
                        <el-checkbox
                          v-model="scope.row.allRow"
                          @change="allRow(scope.row)"
                          v-if="
                            !scope.row.hasOwnProperty('children') &&
                            scope.row.rtype === 'M'
                          "
                        ></el-checkbox>
                      </template>
                    </el-table-column>
                    <!-- 新增列 -->
                    <el-table-column align="center">
                      <template slot="header">
                        新增
                        <el-checkbox
                          v-model="addAll"
                          @change="addColumn()"
                        ></el-checkbox>
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.permList[2].ownership"
                          @change="add(scope.row)"
                          v-if="
                            !scope.row.hasOwnProperty('children') &&
                            scope.row.rtype === 'M' &&
                            scope.row.permList.filter(
                              (item) => item.menuName === '新增'
                            ).length > 0
                          "
                        ></el-checkbox>
                      </template>
                    </el-table-column>
                    <!-- 修改列 -->
                    <el-table-column align="center">
                      <template slot="header">
                        修改
                        <el-checkbox
                          v-model="updateAll"
                          @change="updateColumn()"
                        ></el-checkbox>
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.permList[1].ownership"
                          @change="update(scope.row)"
                          v-if="
                            !scope.row.hasOwnProperty('children') &&
                            scope.row.rtype === 'M' &&
                            scope.row.permList.filter(
                              (item) => item.menuName === '修改'
                            ).length > 0
                          "
                        ></el-checkbox>
                      </template>
                    </el-table-column>
                    <!-- 删除列 -->
                    <el-table-column align="center">
                      <template slot="header">
                        删除
                        <el-checkbox
                          v-model="delAll"
                          @change="delColumn()"
                        ></el-checkbox>
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.del"
                          @change="del(scope.row)"
                          v-if="
                            !scope.row.hasOwnProperty('children') &&
                            scope.row.rtype === 'M' &&
                            scope.row.permList.filter(
                              (item) => item.menuName === '删除'
                            ).length > 0
                          "
                        ></el-checkbox>
                      </template>
                    </el-table-column>

                    <el-table-column label="查看" align="center">
                      <template slot="header">
                        查看
                        <el-checkbox
                          v-model="checkAll"
                          @change="checkColumn()"
                        ></el-checkbox>
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.permList[0].ownership"
                          @change="check(scope.row)"
                          v-if="
                            !scope.row.hasOwnProperty('children') &&
                            scope.row.rtype === 'M' &&
                            scope.row.permList.filter(
                              (item) => item.menuName === '查看'
                            ).length > 0
                          "
                        ></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column align="center">
                      <template slot="header">
                        打印
                        <el-checkbox
                          v-model="printAll"
                          @change="printColumn()"
                        ></el-checkbox>
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.print"
                          v-if="
                            !scope.row.hasOwnProperty('children') &&
                            scope.row.rtype === 'M' &&
                            scope.row.permList.filter(
                              (item) => item.menuName === '打印'
                            ).length > 0
                          "
                        ></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column align="center">
                      <template slot="header">
                        导入
                        <el-checkbox
                          v-model="importAll"
                          @change="importColumn()"
                        ></el-checkbox>
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.import"
                          v-if="
                            !scope.row.hasOwnProperty('children') &&
                            scope.row.rtype === 'M' &&
                            scope.row.permList.filter(
                              (item) => item.menuName === '导入'
                            ).length > 0
                          "
                        ></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column align="center">
                      <template slot="header">
                        导出
                        <el-checkbox
                          v-model="exportAll"
                          @change="exportColumn()"
                        ></el-checkbox>
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.export"
                          v-if="
                            !scope.row.hasOwnProperty('children') &&
                            scope.row.rtype === 'M' &&
                            scope.row.permList.filter(
                              (item) => item.menuName === '导出'
                            ).length > 0
                          "
                        ></el-checkbox>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="b">
          <span slot="label"
            ><svg-icon
              icon-class="permissionRange"
              style="width: 16px; height: 16px"
            ></svg-icon>
            权限范围</span
          >
          <template v-if="rangeTree && rangeTree.length > 0">
            <Range-Tree
              :rangeTree="rangeTree"
              :rangeVal="rangeVal"
            ></Range-Tree>
          </template>
        </el-tab-pane>
        <el-tab-pane name="c">
          <span slot="label"
            ><svg-icon
              icon-class="tablePermission"
              style="width: 16px; height: 16px"
            ></svg-icon>
            报表权限</span
          >
          <report-limit></report-limit>
        </el-tab-pane>
        <el-tab-pane name="d">
          <span slot="label"
            ><svg-icon
              icon-class="ownerPermission"
              style="width: 16px; height: 16px"
            ></svg-icon>
            自定义报表权限</span
          >
          <custom-Limit></custom-Limit>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" style="margin-bottom: 30px">
        <el-button type="primary" size="mini" @click="submitForm()"
          >确 定</el-button
        >
        <el-button size="mini" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import RangeTree from "./limitRange";
import ReportLimit from "./reportLimit.vue";
import CustomLimit from "./customLimit.vue";
import {
  getStaffPerm,
  getOrange,
  getRangeVal,
  updatePerm,
  editRangeVal,
  // 自定义报表权限的
  ownerReportList,
  ownerReportUpdate,
  ownerReportPerm,
} from "@/api/system/permission";
import { getInfo } from "@/api/user";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    showPermission: {
      type: Boolean,
      default: false,
    },
    roleOptions: {
      type: Array,
      default: () => [],
    },
    permissionForm: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      active: "a",
      addAll: false,
      delAll: false,
      updateAll: false,
      checkAll: false,
      printAll: false,
      importAll: false,
      exportAll: false,
      // 表单校验
      rules: {
        loginName: [
          { required: true, message: "登录名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "登录密码不能为空", trigger: "blur" },
        ],
      },
      rangeTree: [],
      rangeVal: [],
    };
  },
  components: { RangeTree, ReportLimit, CustomLimit },
  methods: {
    getStaffPerm() {
      getStaffPerm({ userId: this.permissionForm.staffId }).then((res) => {
        console.log(res.data);
      });
    },
    // table数据扁平化处理
    flatten(data) {
      return data.reduce(
        (arr, { menuId, menuName, rtype, permList, children = [] }) =>
          arr.concat(
            [{ menuId, menuName, rtype, permList }],
            this.flatten(children)
          ),
        []
      );
    },
    speadArr(data) {
      return data.reduce(
        (arr, { menuId, menuName, permission, ownership, permList = [] }) =>
          arr.concat(
            [{ menuId, menuName, permission, ownership }],
            this.speadArr(permList)
          ),
        []
      );
    },
    // 两个数组的相同元素
    filterData(arr1, arr2) {
      let newArr = [];
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
          if (arr1[j] === arr2[i]) {
            newArr.push(arr1[j]);
          }
        }
      }
      return newArr;
    },
    // 两个数组的不同元素
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      });
    },
    // 获取用户权限的list
    getUserPerm() {
      getInfo().then((res) => {
        this.$store.state.user.permissions = [...res.permissions]
        // this.$store.commit("SET_PERMISSIONS", [...res.permissions]);
      });
    },
    // 新增和修改的确认按钮
    submitForm() {
      if (this.active === "a") {
        const endPerm = this.speadArr(this.flatten(this.tableData))
          .filter((item) => {
            return item.ownership === true;
          })
          .map((item) => {
            return item.menuId;
          });

        let equalArr = this.filterData(
          endPerm,
          JSON.parse(Cookies.get("startPerm"))
        );
        let menuAddIds = JSON.stringify(
          this.getArrDifference(equalArr, endPerm)
        );
        let menuDelIds = JSON.stringify(
          this.getArrDifference(equalArr, JSON.parse(Cookies.get("startPerm")))
        );

        this.$refs["permissionForm"].validate((valid) => {
          if (valid) {
            let data = {
              staffId: this.permissionForm.staffId,
              menuAddIds: menuAddIds.replace("[", "").replace("]", ""), // 新增的权限menuId，数组
              menuDelIds: menuDelIds.replace("[", "").replace("]", ""), // 删除的权限menuId，数组
              adminFlag:
                this.permissionForm.isAuth === undefined ? false : true,
            };
            console.log(data);
            updatePerm(data).then(() => {
              this.$message.success(
                `用户 [${this.permissionForm.loginName}] 已授权成功！`
              );
              this.getUserPerm();
              this.$emit("closePermission", false);
            });
          }
        });
      } else if (this.active === "b") {
        // 数据处理  addNoWy和delNowy
        var noWyRange = [...this.noWyRangeArr];
        var noWyArr = [...this.newNoWyIdArr];
        let addNoWy = noWyArr
          .filter((v) => {
            return noWyRange.indexOf(v) == -1;
          })
          .map((item) => Number(item.replace("N", "")));
        let delNowy = noWyRange
          .filter((v) => {
            return noWyArr.indexOf(v) == -1;
          })
          .map((item) => Number(item.replace("N", "")));
        // 数据出题  addWy和delWy
        var wyRange = [...this.wyRangeArr];
        var wyArr = [...this.newWyIdArr];
        let addWy = wyArr
          .filter((v) => {
            return wyRange.indexOf(v) == -1;
          })
          .map((item) => Number(item.replace("W", "")));
        let delWy = wyRange
          .filter((v) => {
            return wyArr.indexOf(v) == -1;
          })
          .map((item) => Number(item.replace("W", "")));
        let params = {
          addGroupIds: addNoWy,
          delGroupIds: delNowy,
          addWyids: addWy,
          delWyids: delWy,
          ygid: this.permissionForm.staffId,
        };
        editRangeVal(params).then((res) => {
          console.log(res.data);
        });
      } else if (this.active === "c") {
      } else {
      }
    },
    // 取消按钮
    cancel() {
      this.$emit("closePermission", false);
    },
    handleClose() {
      this.$emit("closePermission", false);
    },
    getOrange(id, staffId) {
      getOrange({ groupId: id }).then((res) => {
        const newArr = [].concat({ ...res.data });
        this.rangeTree = [];
        this.getRangeTree(newArr, this.rangeTree);
        console.log(this.rangeTree);
      });
      getRangeVal({ ygid: staffId }).then((res) => {
        const rangeVal = res.data;
        this.noWyRangeArr = rangeVal
          .filter((item) => item.type === 1)
          .map((c) => `N${c.pid}`);
        this.wyRangeArr = rangeVal
          .filter((item) => item.type === 0)
          .map((c) => `W${c.pid}`);
        this.rangeVal = this.noWyRangeArr.concat(this.wyRangeArr);
      });
    },
    getRangeTree(treeList, newTreeList) {
      treeList.map((c) => {
        let tempData = {
          label: c.orgName || c.propertyName,
          id: c.hasOwnProperty("propertyName")
            ? `W${c.propertyId}`
            : `N${c.groupId}`,
          type: c.hasOwnProperty("propertyName") ? 1 : 0,
        };
        if (c.children) {
          if (c.wuyes && c.wuyes.length === 0) {
            tempData.children = [];
            this.getRangeTree(c.children, tempData.children);
          } else {
            c.wuyes.map((item) => c.children.push(item));
            tempData.children = [];
            this.getRangeTree(c.children, tempData.children);
          }
        }
        newTreeList.push(tempData);
      });
    },
    // 树形结构扁平化
    // 横向全选
    allRow(row) {
      console.log(row);
      if (row.allRow) {
        row.permList.map((item) => (item.ownership = true));
      } else {
        row.permList.map((item) => (item.ownership = false));
      }
    },
    // 新增的竖向全选
    addColumn() {
      console.log();
      if (this.addAll) {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.add = true;
                });
            });
          }
        });
      } else {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.add = false;
                });
            });
          }
        });
      }
    },
    // 删除的竖向全选
    delColumn() {
      if (this.delAll) {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.del = true;
                });
            });
          }
        });
      } else {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.del = false;
                });
            });
          }
        });
      }
    },
    // 修改的竖向全选
    updateColumn() {
      const newArr = [...this.flatten(this.tableData)].filter((item) => {
        return item.permList && item.permList.length > 0;
      });
      console.log(tableData);
      const updateArr = this.speadArr(newArr).filter((item) => {
        return item.menuName === "修改";
      });
      if (this.updateAll) {
        console.log(
          updateArr.map((item) => {
            return (item.ownership = true);
          })
        );
      } else {
        updateArr.map((item) => {
          item.ownership = false;
        });
      }
    },
    // 查看的竖向全选
    checkColumn() {
      if (this.checkAll) {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.check = true;
                });
            });
          }
        });
      } else {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.check = false;
                });
            });
          }
        });
      }
    },
    // 打印的竖向全选
    printColumn() {
      if (this.printAll) {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.print = true;
                });
            });
          }
        });
      } else {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.print = false;
                });
            });
          }
        });
      }
    },
    // 导入的竖向全选
    importColumn() {
      if (this.importAll) {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.import = true;
                });
            });
          }
        });
      } else {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.import = false;
                });
            });
          }
        });
      }
    },
    // 导入的竖向全选
    exportColumn() {
      if (this.exportAll) {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.export = true;
                });
            });
          }
        });
      } else {
        this.tableData.every((item) => {
          if (item.children && item.children.length > 0) {
            item.children.map((c) => {
              if (c.children && c.children.length > 0)
                c.children.map((i) => {
                  i.export = false;
                });
            });
          }
        });
      }
    },
    add(row) {
      if (row.add) {
        let findAddNum = this.permList.find((item) => {
          if (item.menuName === "添加") {
            return item.parentId == row.id;
          }
        });
        console.log(findAddNum.id);
      }
    },
    del(row) {
      if (row.del) {
        let findDelNum = this.permList.find((item) => {
          if (item.menuName === "删除") {
            return item.parentId == row.id;
          }
        });
        console.log(findDelNum.id);
      }
    },
    update(row) {
      if (row.del) {
        let findUpdateNum = this.permList.find((item) => {
          if (item.menuName === "修改") {
            return item.parentId == row.id;
          }
        });
        console.log(findUpdateNum.id);
      }
    },
    check(row) {
      if (row.del) {
        let findCheckNum = this.permList.find((item) => {
          if (item.menuName === "查看") {
            return item.parentId == row.id;
          }
        });
        console.log(findCheckNum.id);
      }
    },

    //自定义报表权限list
    getOwnerReportList() {
      ownerReportList().then((res) => {
        console.log(res.data);
      });
    },
    // 自定义报表权限修改
    ownerReportUpdate(val) {
      ownerReportUpdate(val).then((res) => {
        console.log(res);
      });
    },
    // 获取用户的报表权限
    getOwnerReportPerm() {
      ownerReportPerm().then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style>
</style>
