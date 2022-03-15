<template>
  <div class="rentHouseList">
    <article>
      <header class="goBack">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-back"
          style="font-size: 16px"
          @click="goBack"
        >
          返回
        </el-button>
        <span class="title">客户信息</span>
      </header>

      <main class="main">
        <section class="main-head">
          <el-button
            plain
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="editOwnerInfo()"
            v-if="this.$route.query.customerId !== undefined"
            class="edit"
          >
            修改
          </el-button>
          <h2 style="text-align: center; color: #666">客户资料</h2>
        </section>

        <el-form
          ref="rentOwnerInfo"
          :model="ownerInfoForm"
          label-width="85px"
          :rules="rules"
        >
          <el-row :gutter="24">
            <el-col :span="12">
              <el-card shadow="hover">
                <div slot="header" class="clearfix">
                  <i class="el-icon-tickets" /> <span>客户基本资料</span>
                </div>

                <el-col :span="12">
                  <el-form-item
                    label="客户代码"
                    size="mini"
                    prop="customerCode"
                  >
                    <el-input v-model="ownerInfoForm.customerCode" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="类别"
                    size="mini"
                    prop="industryCategory"
                  >
                    <el-select
                      v-model="ownerInfoForm.industryCategory"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in businessOptions"
                        :key="item.ID"
                        :label="item.名称"
                        :value="item.ID"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    label="客户名称"
                    size="mini"
                    prop="customerName"
                  >
                    <el-input
                      v-model="ownerInfoForm.customerName"
                      clearable
                      @change="getShortCode()"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="简 码" size="mini" prop="shortCode">
                    <el-input v-model="ownerInfoForm.shortCode" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手 机" size="mini" prop="mobile">
                    <el-input v-model="ownerInfoForm.mobile" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="国家地区" size="mini" prop="nationality">
                    <el-select
                      v-model="ownerInfoForm.nationality"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in cityOptions"
                        :key="item.no"
                        :label="item.name"
                        :value="item.no"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" size="mini" prop="phone">
                    <el-input v-model="ownerInfoForm.phone" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="证件号码" size="mini" prop="certificate">
                    <el-input v-model="ownerInfoForm.certificate" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电子邮件" size="mini" prop="email">
                    <el-input v-model="ownerInfoForm.email" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="证件地址" size="mini" prop="certifyAddr">
                    <el-input v-model="ownerInfoForm.certifyAddr" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="工作单位" size="mini" prop="employer">
                    <el-input v-model="ownerInfoForm.employer" clearable />
                  </el-form-item>
                </el-col>
              </el-card>
              <br />
              <el-card shadow="hover">
                <div slot="header" class="clearfix">
                  <i class="el-icon-s-custom" /> <span>联系人</span>
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="importTwo"
                    ><i class="el-icon-upload" /> 从客户导入</el-button
                  >
                  <!-- <span style="float: right; padding: 3px 0">
                    <button class="border-hover" @click.native.prevent="importTwo"><i class="el-icon-upload" /> 从客户导入</button>
                  </span> -->
                </div>
                <el-col :span="12">
                  <el-form-item label="姓 名" size="mini" prop="contactPerson">
                    <el-input v-model="ownerInfoForm.contactPerson" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="联系电话"
                    size="mini"
                    prop="contactPhone"
                  >
                    <el-input v-model="ownerInfoForm.contactPhone" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手 机" size="mini" prop="contactMobile">
                    <el-input v-model="ownerInfoForm.contactMobile" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮政编码" size="mini" prop="postalCode">
                    <el-input v-model="ownerInfoForm.postalCode" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="证件号码"
                    size="mini"
                    prop="contactCertify"
                  >
                    <el-input
                      v-model="ownerInfoForm.contactCertify"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="通讯地址" size="mini" prop="addr">
                    <el-input v-model="ownerInfoForm.addr" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="20">
                  <el-form-item
                    label="电子邮件"
                    size="mini"
                    prop="contactEmail"
                  >
                    <el-input v-model="ownerInfoForm.contactEmail" clearable />
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card shadow="hover">
                <div slot="header" class="clearfix">
                  <i class="el-icon-document-add" /> <span>客户其他资料</span>
                </div>
                <el-col :span="18">
                  <el-form-item label="邮政编码" size="mini">
                    <el-input v-model="ownerInfoForm.postalCode" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="importOne"
                    ><i class="el-icon-upload" /> 从客户导入</el-button
                  >
                </el-col>
                <el-col :span="24">
                  <el-form-item label="通讯地址" size="mini" prop="mailingAddr">
                    <el-input v-model="ownerInfoForm.mailingAddr" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="法人代表" size="mini" prop="legalPerson">
                    <el-input v-model="ownerInfoForm.legalPerson" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    label="法人证件"
                    size="mini"
                    prop="legalPersonCertify"
                  >
                    <el-input
                      v-model="ownerInfoForm.legalPersonCertify"
                      clearable
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    label="税务登记证"
                    size="mini"
                    prop="taxRegistrationCertify"
                  >
                    <el-input
                      v-model="ownerInfoForm.taxRegistrationCertify"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="主营产品"
                    size="mini"
                    prop="mainProducts"
                  >
                    <el-input v-model="ownerInfoForm.mainProducts" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="企业类型"
                    size="mini"
                    prop="enterpriseNature"
                  >
                    <el-select v-model="ownerInfoForm.enterpriseNature">
                      <el-option
                        v-for="item in componyTypeOptions"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="员工人数" prop="workersNum">
                    <el-input v-model="ownerInfoForm.workersNum" size="mini" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="注册资金" size="mini" prop="currency">
                    <el-select v-model="ownerInfoForm.currency">
                      <el-option
                        v-for="item in moneyOptions"
                        :key="item.no"
                        :label="item.name"
                        :value="item.no"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label=""
                    label-width="20px"
                    size="mini"
                    prop="registeredCapital"
                  >
                    <el-input
                      v-model="ownerInfoForm.registeredCapital"
                      placeholder="请输入万元"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位购房" size="mini" prop="isCompany">
                    <el-checkbox v-model="ownerInfoForm.isCompany" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="境外客户" size="mini" prop="isAbroad">
                    <el-checkbox v-model="ownerInfoForm.isAbroad" />
                  </el-form-item>
                </el-col>
              </el-card>
              <br />
              <el-card shadow="hover">
                <div slot="header" class="clearfix">
                  <i class="el-icon-paperclip" /> <span>备注</span>
                </div>
                <el-col :span="24">
                  <el-form-item label="备注" size="mini" prop="remark">
                    <el-input
                      v-model="ownerInfoForm.remark"
                      type="textarea"
                      :rows="5"
                      style="height: 115px; overflow-y: scroll"
                    />
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>
          </el-row>
        </el-form>
      </main>

      <footer class="footer" v-show="visibleBtn">
        <section>
          <el-button
            plain
            type="primary"
            size="mini"
            icon="el-icon-folder-checked"
            @click="confirm"
          >
            保存
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
    </article>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { pinyin } from "@/utils/pinyin";
import { getDictionary } from "@/api/system/systemData";
import {
  getCustomer,
  getCustomerType,
  updateCustomer,
} from "@/api/system/userManage";
export default {
  data() {
    return {
      ownerInfoForm: {},
      activeName: "",
      visibleBtn: false,
      editState: "",
      typeOptions: [],
      moneyOptions: [],
      cityOptions: [],
      businessOptions: [],
      rules: {
        customerName: [
          { required: true, trigger: "blur", message: "请输入正确的客户名称" },
        ],
      },
      componyTypeOptions: [
        {
          label: "民营企业",
          value: 0,
        },
        {
          label: "私营企业",
          value: 1,
        },
        {
          label: "国营企业",
          value: 2,
        },
        {
          label: "合资企业",
          value: 3,
        },
        {
          label: "外资企业",
          value: 4,
        },
        {
          label: "股份制企业",
          value: 5,
        },
        {
          label: "上市企业",
          value: 6,
        },
        {
          label: "其他",
          value: 6,
        },
      ],
    };
  },
  activated() {
    getDictionary({ nodeName: "币种" }).then((res) => {
      this.moneyOptions = [...res.data];
    });
    getDictionary({ nodeName: "国籍" }).then((res) => {
      this.cityOptions = [...res.data];
    });
    getCustomerType().then((res) => {
      this.businessOptions = [...res.data];
    });
    if (this.$route.query.customerId !== undefined) {
      this.getCustomerInfo();
    } else {
      this.visibleBtn = true;
      if (Cookies.get("rentOwnerInfo") !== undefined) {
        this.ownerInfoForm = JSON.parse(Cookies.get("rentOwnerInfo"));
      }
    }
  },
  methods: {
    goBack() {
      this.$refs["rentOwnerInfo"].resetFields();
      this.$router.go(-1);
      this.$store.dispatch("tagsView/delView", this.$route);
    },
    confirm() {
      if (this.editState === "修改") {
        this.$refs["rentOwnerInfo"].validate((valid) => {
          if (valid) {
            updateCustomer(this.ownerInfoForm).then(() => {
              this.$message.success("客户信息修改成功！");
              Cookies.set("rentOwnerInfo", JSON.stringify(this.ownerInfoForm));
              this.editState = "";
              this.visibleBtn = false;
            });
          }
        });
      } else {
        this.$refs["rentOwnerInfo"].validate((valid) => {
          if (valid) {
            Cookies.set("rentOwnerInfo", JSON.stringify(this.ownerInfoForm));
          }
        });
      }
    },
    cancel() {
      this.$refs["rentOwnerInfo"].resetFields();
      this.editState = "";
      this.visibleBtn = false;
    },
    editOwnerInfo() {
      (this.visibleBtn = true), (this.editState = "修改");
    },
    // 获取客户资料
    getCustomerInfo() {
      getCustomer({ customerId: this.$route.query.customerId }).then((res) => {
        this.ownerInfoForm = { ...res.data };
      });
    },
    // 用户信息导入
    importTwo() {
      this.$confirm("是否要将客户信息导入客户其他资料？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      }).then(() => {
        this.$set(
          this.ownerInfoForm,
          "contactPerson",
          this.ownerInfoForm.customerName
        );
        this.$set(
          this.ownerInfoForm,
          "contactMobile",
          this.ownerInfoForm.mobile
        );
        this.$set(this.ownerInfoForm, "contactPhone", this.ownerInfoForm.phone);
        this.$set(this.ownerInfoForm, "contactEmail", this.ownerInfoForm.email);

        this.$set(
          this.ownerInfoForm,
          "legalPersonCertify",
          this.ownerInfoForm.certificate
        );
        this.$set(this.ownerInfoForm, "addr", this.ownerInfoForm.certifyAddr);
      });
    },
    importOne() {
      this.$confirm("是否要将客户信息导入联系人？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      }).then(() => {
        this.$set(
          this.ownerInfoForm,
          "legalPerson",
          this.ownerInfoForm.customerName
        );

        this.$set(
          this.ownerInfoForm,
          "contactCertify",
          this.ownerInfoForm.certificate
        );
        this.$set(
          this.ownerInfoForm,
          "mailingAddr",
          this.ownerInfoForm.certifyAddr
        );
      });
    },
    // 输入名称获得简码
    getShortCode() {
      let value1 = this.ownerInfoForm.customerName;
      let value2 = value1.length;
      let shortCode = "";
      let reg = new RegExp("[a-zA-Z0-9]");
      for (var i = 0; i < value2; i++) {
        let val = value1.substr(i, 1);
        let name = this.arraySearch(val, pinyin);
        if (reg.test(val)) {
          shortCode += val;
        } else if (name !== false) {
          shortCode += name;
        }
      }
      shortCode = shortCode.replace(/ /g, "-");
      while (shortCode.indexOf("--") > 0) {
        shortCode = shortCode.replace("--", "-");
      }
      console.log(shortCode);
      this.$set(this.ownerInfoForm, "shortCode", this.sortFieldMatch(shortCode));
    },
    arraySearch(value1) {
      for (var name in pinyin) {
        if (pinyin[name].indexOf(value1) !== -1) {
          return this.ucfirst(name);
        }
      }
      return false;
    },
    ucfirst(value1) {
      if (value1.length > 0) {
        var first = value1.substr(0, 1).toUpperCase();
        var spare = value1.substr(1, value1.length);
        return first + spare;
      }
    },
    sortFieldMatch(field) {
      const stringArray = field.split(""); // 将字符串分割成相应的字符串数组
      let newStr = ""
      stringArray.forEach((t) => {
        if (/[A-Z]/.test(t)) {
          // 遍历分割之后的字符串组，将找到的大写字母替换成其他字符串，将替换后的字符串赋值给另外一个新的string 变量
          newStr = newStr + t
        }
      })
      return newStr
    },
  },
};
</script>

<style lang="scss" scoped>
.rentHouseList {
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
    padding: 10px 26px 95px;
    .main-head {
      position: relative;
      .edit {
        position: absolute;
        top: 0px;
        left: 0px;
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
