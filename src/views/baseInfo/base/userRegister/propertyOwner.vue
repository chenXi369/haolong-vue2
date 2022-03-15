<template>
  <div class="houseList">
    <article>
      <header class="goBack">
        <el-button
          type="text"
          size="medium"
          icon="el-icon-back"
          style="font-size: 16px"
          @click="goBack"
        >
          返回
        </el-button>
        <span class="title">产权人</span>
      </header>

      <main class="main">
        <h2 style="text-align: center; color: #666">产权人信息</h2>
        <el-row>
          <el-col>
            <el-button
              plain
              type="success"
              size="mini"
              icon="el-icon-plus"
              @click="addOwner"
              >新增产权人</el-button
            >
            <el-button
              plain
              type="primary"
              size="mini"
              icon="el-icon-folder-checked"
              :disabled="ownerList.length === 0"
              @click="saveData"
            >
              保存
            </el-button>
          </el-col>
          <el-col style="margin-top: 20px">
            <el-table :data="ownerList" border>
              <el-table-column
                prop="serialNumber"
                label="序 号"
                width="50"
                fixed
                align="center"
              />
              <el-table-column
                prop="owner"
                label="权利人"
                width="100"
                align="center"
              />
              <el-table-column
                prop="certificateName"
                label="证件名称"
                width="100"
                align="center"
              />
              <el-table-column
                prop="idCardNo"
                width="240"
                label="证件号码"
                align="center"
              />
              <el-table-column
                prop="proportionOfPropertyRights"
                width="100"
                label="产权比例"
              />
              <el-table-column
                prop="titleCertificateNo"
                width="240"
                label="产权证号"
                align="center"
              />
              <el-table-column width="160" label="产权日期" align="center">
                <template slot-scope="scope">
                  {{ scope.row.titleCertificateDate.slice(0, 10) }}
                </template>
              </el-table-column>
              <el-table-column prop="remarks" label="备注" align="center" />
              <el-table-column
                label="操作"
                width="200"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    plain
                    type="warning"
                    size="mini"
                    icon="el-icon-edit"
                    @click="updateOwner(scope.row, scope.$index)"
                  >
                    修改
                  </el-button>
                  <el-button
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="delOwner(scope.row, scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </main>

      <el-dialog
        title="新增产权人"
        :visible.sync="addOwnerDialog"
        width="700px"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-row :gutter="24">
          <el-form
            ref="addOwnerForm"
            :model="addOwnerForm"
            :rules="rules"
            label-width="80px"
          >
            <el-col :span="10">
              <el-form-item label="顺 序 号" size="medium" prop="serialNumber">
                <el-input v-model="addOwnerForm.serialNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="权 利 人" size="medium" prop="owner">
                <el-input v-model="addOwnerForm.owner" />
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item
                label="证件名称"
                size="medium"
                prop="certificateName"
              >
                <el-input v-model="addOwnerForm.certificateName" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="证件号码" size="medium" prop="idCardNo">
                <el-input v-model="addOwnerForm.idCardNo" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="产权比例"
                size="medium"
                prop="proportionOfPropertyRights"
              >
                <el-input v-model="addOwnerForm.proportionOfPropertyRights" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item
                label="产权证号"
                size="medium"
                prop="titleCertificateNo"
              >
                <el-input v-model="addOwnerForm.titleCertificateNo" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                label="权证日期"
                size="medium"
                prop="titleCertificateDate"
              >
                <el-date-picker
                  v-model="addOwnerForm.titleCertificateDate"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" size="medium" prop="remarks">
                <el-input
                  v-model="addOwnerForm.remarks"
                  type="textarea"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </span>
      </el-dialog>
    </article>
  </div>
</template>

<script>
import Cookies from "js-cookie";
// 产权人的新增和修改删除接口
import {
  addPropertyOwner,
  delPropertyOwner,
  updatePropertyOwner,
  getPropertyOwnerList,
} from "@/api/system/userRegister";

export default {
  data() {
    return {
      ownerList: [],
      addOwnerDialog: false,
      rules: {
        serialNumber: [
          { required: true, trigger: "blur", message: "请输入顺序号" },
        ],
        owner: [
          { required: true, trigger: "blur", message: "请输入正确的姓名" },
        ],
        proportionOfPropertyRights: [
          { required: true, trigger: "blur", message: "请输入正确的产权比例" },
        ],
      },
      addOwnerForm: {},
      btnState: "",
    };
  },
  activated() {
    if (this.$route.query.htId !== undefined) {
      this.getOwnerList();
    }
    if(Cookies.get('propertyForm') !== undefined) {
      this.ownerList = JSON.parse(Cookies.get('propertyForm'))
    }
  },
  methods: {
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1);
    },
    // 获取产权人列表
    getOwnerList() {
      getPropertyOwnerList({ contractId: this.$route.query.htId }).then(
        (res) => {
          this.ownerList = [...res.data];
        }
      );
    },
    confirm() {
      this.addOwnerForm.contractId = this.$route.query.htId;
      if (this.btnState === "新增") {
        this.$refs["addOwnerForm"].validate((valid) => {
          if (valid) {
            if (this.$route.query.htId !== undefined) {
              addPropertyOwner(this.addOwnerForm).then(() => {
                this.getOwnerList();
              });
            } else {
              this.ownerList = this.ownerList.concat({ ...this.addOwnerForm });
              console.log(this.ownerList);
            }
            this.addOwnerDialog = false;
            this.$message.success("新增产权人成功！");
          }
        });
      } else {
        this.$refs["addOwnerForm"].validate((valid) => {
          if (valid) {
            if (this.$route.query.htId !== undefined) {
              updatePropertyOwner(this.addOwnerForm).then(() => {
                this.getOwnerList();
              });
            } else {
              this.ownerList = this.ownerList.concat({ ...this.addOwnerForm });
            }
            this.addOwnerDialog = false;
            this.$message.success("修改产权人成功！");
          }
        });
      }
    },
    cancel() {
      this.$refs["addOwnerForm"].resetFields();
      this.addOwnerDialog = false;
    },
    // 新增产权人
    addOwner() {
      this.addOwnerForm = {
        serialNumber: "",
        owner: "",
        certificateName: "身份证",
        idCardNo: "",
        proportionOfPropertyRights: "",
        titleCertificateNo: "",
        titleCertificateDate: "",
        remarks: "",
      };
      this.addOwnerDialog = true;
      this.btnState = "新增";
    },
    updateOwner(row, index) {
      this.addOwnerForm = row;
      this.addOwnerDialog = true;
      this.btnState = "修改";
    },
    delOwner(row, index) {
      console.log(index);
      this.$confirm(
        `确定要删除 [${row.serialNumber}] ${row.owner} 的数据`,
        "警告",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          if (this.$route.query.htId !== undefined) {
            return delPropertyOwner({ ownerId: row.ownerId });
          } else {
            this.ownerList.splice(index);
          }
        })
        .then(() => {
          if (this.$route.query.htId !== undefined) {
            this.getOwnerList();
          }
          this.$message.success("删除成功！");
        });
    },
    handleClose() {
      this.$refs["addOwnerForm"].resetFields();
      this.addOwnerDialog = false;
    },
    // 保存数据
    saveData() {
      Cookies.set('propertyForm', JSON.stringify(this.ownerList))
      if(Cookies.get('propertyForm') !== undefined) {
        this.$message.success('产权人信息已保存！')
        this.$router.go(-1)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.houseList {
  position: relative;
  .goBack {
    padding: 8px 16px;
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0px 0px 2px 4px #f5f5f5;
    &:hover {
      background-color: lavender;
    }
    .title {
      font-size: 18px;
      color: #666;
      margin-left: 30px;
      padding-left: 30px;
      border-left: 1px solid #ccc;
    }
  }
  .main {
    padding: 10px 26px;
  }
}
</style>
