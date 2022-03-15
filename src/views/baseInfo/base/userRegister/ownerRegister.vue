<template>
  <div class="ownerRegister">
    <article>
      <header class="header">
        <section class="goBack">
          <el-row type="flex">
            <el-col :span="12">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-back"
                style="font-size: 16px"
                @click="goBack"
              >
                返回
              </el-button>
            </el-col>
          </el-row>
        </section>

        <section class="bottom">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="12">
              <!-- <el-button
                plain
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :disabled="isCheck || isFooterState"
                @click="newOwner()"
              >
                新业主
              </el-button> -->
              <el-button
                plain
                type="warning"
                size="mini"
                icon="el-icon-edit"
                :disabled="isCheck || isFooterState"
                v-if="ownerList && ownerList.length > 0 && btnState"
                @click="updateOwner()"
              >
                修改
              </el-button>
              <el-button
                plain
                type="danger"
                size="mini"
                icon="el-icon-delete"
                :disabled="isCheck || isFooterState"
                v-if="ownerList && ownerList.length > 0 && btnState"
                @click="delOwner()"
              >
                删除
              </el-button>
              <el-button
                plain
                type="success"
                size="mini"
                icon="el-icon-upload"
                :disabled="!isFooterState"
                @click="importUser()"
              >
                导入客户
              </el-button>
            </el-col>

            <el-col :span="12" type="flex" align="right">
              <el-button
                plain
                type="success"
                size="mini"
                icon="el-icon-circle-check"
                :disabled="
                  (contractInfo.contractForm.auditMark && isCheck) ||
                  isFooterState
                "
                @click="check()"
              >
                审核
              </el-button>
              <el-button
                plain
                type="warning"
                size="mini"
                icon="el-icon-circle-close"
                :disabled="!contractInfo.contractForm.auditMark"
                style="margin-right: 8px"
                @click="reverseCheck()"
              >
                反审核
              </el-button>

              <el-select
                v-model="ownerName"
                size="mini"
                placeholder="请选择合同人"
                @change="getChangeHtId"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </section>
      </header>

      <main class="main">
        <section class="header-title">
          <h2 style="color: #666">合同信息</h2>
          <button v-if="contractInfo.contractForm.auditMark" class="checked-hover">
            <span>已审核</span>
          </button>
        </section>
        <owner-tabs
          ref="ownerTabs"
          :rules="rules"
          :htId="htId"
          :contractInfo="contractInfo"
          :label-position="labelPosition"
          :is-footer-state="isFooterState"
        />
      </main>

      <footer v-show="isFooterState" class="footer">
        <section>
          <el-button
            plain
            type="primary"
            size="mini"
            icon="el-icon-folder-checked"
            @click="confirm"
          >
            确认
          </el-button>
          <el-button
            plain
            size="mini"
            icon="el-icon-arrow-left"
            @click="cancel"
          >
            取消
          </el-button>
        </section>
      </footer>

      <import-user-dialog
        :dialog-import="dialogImport"
        :userSearchForm="userSearchForm"
        @closeImportOwner="closeImportOwner"
        @confirmImportOwner="confirmImportOwner"
      />
    </article>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import ImportUserDialog from "./components/importUserDialog.vue";
import OwnerTabs from "./components/ownerTabs";
import {
  getContractList,
  getContract,
  delContract,
  updateContract,
  addContract,
  changeContract,
} from "@/api/system/userRegister";
import { delCustomer } from "@/api/system/userManage";
import { checkHome } from "@/api/system/houseRes";
import { getCustomer } from "@/api/system/userManage";
export default {
  components: {
    OwnerTabs,
    ImportUserDialog,
  },
  data() {
    return {
      ownerName: "", // 业主
      options: [],
      rules: {
        customerName: [
          { required: true, trigger: "blur", message: "请输入客户名称" },
        ],
      },
      labelPosition: "right",
      isCheck: false,
      isReverseCheck: true,
      isFooterState: false, // 隐藏确认取消
      dialogImport: false, // 导入客户的弹窗
      htId: 0,
      userSearchForm: {
        propertyId: "",
        ownerOrTenant: 0,
        companyOrPersonal: 0,
      },
      delParams: {
        contractId: 0,
        confirmFlag: 0,
      },
      DelOwnerParams: {},
      ownerList: [],
      contractInfo: {
        contractForm: {},
        ownerForm: {},
        houseList: {},
        propertyOwner: {},
      },
      btnState: false,
      isAddState: "新增",
    };
  },
  activated() {
    if (this.$route.query.equityState === undefined) {
      this.getOwnerList();
      this.getHouseInfo();
      this.isFooterState = false;
    } else {
      this.contractInfo = {
        contractForm: {},
        ownerForm: {},
        houseList: {},
        propertyOwner: {},
      };
      this.isFooterState = true;
      this.getHouseInfo();
      this.getOwnerList();
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        path: "userRegister",
      });
      // 真尼玛好用  先筛选出tags的路由name为这些的  然后遍历删除
      let newArr = this.$store.state.tagsView.visitedViews.filter((item) => {
        return (
          ["HouseList", "PropertyOwner", "OwnerInfo", "OwnerRegister"].indexOf(
            item.name
          ) !== -1
        );
      });
      newArr.map((item) => {
        this.$store.dispatch("tagsView/delView", item);
      });
    },
    getHouseInfo() {
      checkHome({ houseId: this.$route.query.houseId }).then((res) => {
        // 内部房号和建筑面积
        this.$set(
          this.contractInfo.contractForm,
          "internalRoomNumber",
          res.data.roomNo
        );
        this.$set(
          this.contractInfo.contractForm,
          "floorage",
          res.data.buildingArea
        );
      });
    },
    getOwnerList() {
      getContractList({ houseId: this.$route.query.houseId }).then((res) => {
        this.ownerList = [...res.data];
        if (this.ownerList && this.ownerList.length > 0) {
          this.options = this.ownerList.map((item) => {
            return {
              label: item.客户名称,
              value: item.KHID,
            };
          });
          this.ownerName = this.ownerList[0].客户名称;
          this.htId = this.ownerList[0].LID;
          this.getOwnerInfo(this.htId);
          this.btnState = true;
          this.roomState = true;
          if (this.$route.query.liveState === undefined) {
            this.isFooterState = true;
          } else {
            this.isFooterState = false;
          }
          // if (Cookies.get("roomState") === "true") {
          //   this.getOwnerInfo(this.htId);
          //   this.btnState = true;
          //   this.roomState = true;
          // } else {
          //   if (this.$route.query.liveState === undefined) {
          //     this.isFooterState = true;
          //   } else {
          //     this.isFooterState = false;
          //   }
          //   this.btnState = false;
          // }
        } else {
          this.contractInfo = {
            contractForm: {},
            ownerForm: {},
            houseList: {},
            propertyOwner: {},
          };
        }
      });
    },
    getOwnerInfo(id) {
      getContract({ contractId: id }).then((res) => {
        if (this.$route.query.equityState === undefined) {
          this.contractInfo.contractForm = { ...res.contract };
          if(Cookies.get('ownerForm') !== undefined) {
            this.contractInfo.ownerForm = { ...JSON.parse(Cookies.get('ownerForm')) };
          } else {
            this.contractInfo.ownerForm = { ...res.customer };
          }
          this.contractInfo.propertyOwner = { ...res.propertyOwner };
        }
        this.contractInfo.houseList = { ...res.houseList };
        this.delParams.contractId = this.contractInfo.contractForm.contractId;
        this.DelOwnerParams.customerId = this.contractInfo.ownerForm.customerId;
        this.DelOwnerParams.customerName = this.contractInfo.ownerForm.customerName;
        this.DelOwnerParams.contractId = this.delParams.contractId;
      });
    },
    // 客户资料的select值改变
    getChangeHtId(val) {
      console.log(val);
    },
    // 审核
    check() {
      this.$confirm(`一定要对本合同进行审核吗?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          contractId: this.delParams.contractId,
          auditMark: true,
        };
        updateContract(data).then(() => {
          this.$message.success("合同审核成功！");
          this.isCheck = true;
          this.getOwnerInfo(data.contractId);
        });
      });
    },
    // 反审核
    reverseCheck() {
      this.$confirm(`一定要对本合同进行反审核吗?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          contractId: this.delParams.contractId,
          auditMark: false,
        };
        updateContract(data).then(() => {
          this.$message.success("合同反审核成功！");
          this.isCheck = false;
          this.getOwnerInfo(data.contractId);
        });
      });
    },
    // 确认
    confirm() {
      if (this.isAddState === "新增") {
        this.$refs["ownerTabs"].$refs["ownerForm"].validate((valid) => {
          if (valid) {
            this.contractInfo.contractForm.propertyId = Cookies.get(
              "selectPropertyId"
            );
            this.contractInfo.contractForm.buildingId = this.$route.query.buildingId;
            let data = {
              contract: this.contractInfo.contractForm,
              customer:
                Cookies.get("ownerForm") === undefined
                  ? this.contractInfo.ownerForm
                  : JSON.parse(Cookies.get("ownerForm")),
              houseLists:
                Cookies.get("houseLists") === undefined
                  ? [].concat(this.contractInfo.houseList)
                  : JSON.parse(Cookies.get("houseLists")),
              owners:
                Cookies.get("propertyForm") === undefined
                  ? [].concat(this.contractInfo.propertyOwner)
                  : JSON.parse(Cookies.get("propertyForm")),
            };
            if (Cookies.get("termination") !== undefined) {
              data.termination = JSON.parse(Cookies.get("termination"));
            }
            if (Cookies.get("termination") !== undefined) {
              changeContract(data).then(() => {
                this.$message.success("产权过户成功！");
                Cookies.remove("termination");
                Cookies.remove("ownerForm");
                Cookies.remove("houseLists");
                Cookies.remove("houseList");
                Cookies.remove("propertyForm");
              });
            } else {
              addContract(data).then(() => {
                this.$message.success("新增合同成功！");
                Cookies.remove("ownerForm");
                Cookies.remove("houseLists");
                Cookies.remove("houseList");
                Cookies.remove("propertyForm");
              });
            }
          }
        });
      } else if (this.isAddState === "修改") {
        this.$refs["ownerTabs"].$refs["ownerForm"].validate((valid) => {
          if (valid) {
            console.log(this.contractInfo.contractForm);
            let data = { ...this.contractInfo.contractForm };
            updateContract(data).then(() => {
              this.$message.success("修改合同成功！");
            });
          }
        });
      }
    },
    // 取消
    cancel() {
      if (this.$route.query.equityState === undefined) {
        Cookies.remove('ownerForm')
        this.isFooterState = false;
        this.getOwnerList();
      } else {
        if (Cookies.get("ownerForm") !== undefined) {
          Cookies.remove("ownerForm");
        }
        this.$router.push({
          path: "userRegister",
        });
      }
    },
    // 新业主
    // newOwner() {
    //   this.isAddState = "新增";
    //   this.isFooterState = true;
    //   this.contractInfo = {
    //     contractForm: {
    //       internalRoomNumber: this.contractInfo.contractForm.internalRoomNumber,
    //       areaBasis: this.contractInfo.contractForm.areaBasis,
    //       areaFormula: this.contractInfo.contractForm.areaFormula,
    //       valuationArea: this.contractInfo.contractForm.valuationArea,
    //     },
    //     ownerForm: {},
    //     houseList: {},
    //     propertyOwner: {},
    //   };
    // },
    // 编辑
    updateOwner() {
      this.isAddState = "修改";
      this.isFooterState = true;
    },
    delOwner() {
      this.$confirm(`是否确认删除客户与房间的业主关系吗?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let delParams = {
          contractId: this.delParams.contractId,
          confirmFlag: 0,
        };
        delContract(delParams).then(() => {
          this.$message.success("客户与房间的业主关系解绑成功");
          this.getOwnerInfo(this.delParams.contractId);
          if (res.code === 201) {
            this.$message.success("201");
          } else if (res.code === 202) {
            this.$message.success("201");
          }
          this.$confirm(
            `是否要删除业主 [${this.DelOwnerParams.customerName}] 的资料?`,
            "警告",
            {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              delCustomer(this.DelOwnerParams);
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.$message({ type: "info", message: "已取消删除" });
            });
        });
      });
    },
    importUser() {
      this.dialogImport = true;
      this.userSearchForm.region = 0
    },
    closeImportOwner(val) {
      this.dialogImport = val;
    },
    confirmImportOwner(val) {
      this.$set(this.contractInfo.ownerForm, "customerId", val.node.KHID);
      this.$set(this.contractInfo.ownerForm, "customerName", val.node.客户名称);
      this.$set(this.contractInfo.ownerForm, "phone", val.node.手机);
      this.$set(this.contractInfo.ownerForm, "shortCode", val.node.简码);
      this.dialogImport = val.state;
      getCustomer({ customerId: val.node.KHID }).then((res) => {
        Cookies.set("ownerForm", JSON.stringify({ ...res.data }));
        this.$message.success("用户信息导入成功！");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ownerRegister {
  position: relative;
  .header {
    .goBack {
      padding: 8px 16px;
      border-bottom: 1px solid #eaeaea;
      box-shadow: 0px 0px 2px 4px #f5f5f5;
      &:hover {
        background-color: lavenderblush;
        color: yellowgreen;
      }
    }
    .bottom {
      padding: 10px 24px;
    }
  }
  .main {
    padding: 0px 26px;
    position: relative;
    .header-title {
      text-align: center;
      .checked {
        width: 80px;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #ff5f5f;
        display: inline-block;
        position: absolute;
        right: 40px;
        top: -4px;
        font-family: sans-serif;
        border: 3px solid #ff5f5f;
      }
    }
  }
  .footer {
    z-index: 100;
    width: 96%;
    height: 46px;
    padding: 0 2%;
    background: #fffffc;
    position: fixed;
    line-height: 46px;
    bottom: 30px;
    right: 0px;
    text-align: right;
    box-shadow: 2px 0px 5px 0px #cccccc;
  }
}
</style>
