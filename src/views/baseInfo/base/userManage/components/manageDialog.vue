<template>
  <div class="manageDialog">
    <el-dialog
      :title="title"
      :visible.sync="showDialog"
      width="1200px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        ref="ownerForm"
        :model="ownerInfoForm"
        label-width="85px"
        :rules="rules"
      >
        <el-row :gutter="24" style="padding-bottom: 10px">
          <el-col :span="12">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <i class="el-icon-tickets" /> <span>客户基本资料</span>
              </div>

              <el-col :span="12">
                <el-form-item label="客户代码" size="mini" prop="customerCode">
                  <el-input v-model="ownerInfoForm.customerCode" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="类别" size="mini" prop="industryCategory">
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

              <el-col :span="12">
                <el-form-item label="客户名称" size="mini" prop="customerName">
                  <el-input v-model="ownerInfoForm.customerName" clearable />
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
              <el-col :span="6">
                <el-form-item label="单位" size="mini" prop="isCompany">
                  <el-checkbox v-model="ownerInfoForm.isCompany" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="境外" size="mini" prop="isAbroad">
                  <el-checkbox v-model="ownerInfoForm.isAbroad" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="证件号码" size="mini" prop="certificate">
                  <el-input v-model="ownerInfoForm.certificate" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="证件地址" size="mini" prop="certifyAddr">
                  <el-input v-model="ownerInfoForm.certifyAddr" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="电子邮件" size="mini" prop="email">
                  <el-input v-model="ownerInfoForm.email" clearable />
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
              </div>
              <el-col :span="12">
                <el-form-item label="姓 名" size="mini" prop="contactPerson">
                  <el-input v-model="ownerInfoForm.contactPerson" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" size="mini" prop="contactPhone">
                  <el-input v-model="ownerInfoForm.contactPhone" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="证件号码"
                  size="mini"
                  prop="contactCertify"
                >
                  <el-input v-model="ownerInfoForm.contactCertify" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="通讯地址" size="mini" prop="addr">
                  <el-input v-model="ownerInfoForm.addr" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="18">
                <el-form-item label="电子邮件" size="mini" prop="contactEmail">
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
                <el-form-item label="主营产品" size="mini" prop="mainProducts">
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
            <br />
            <el-col :span="24">
              <section class="btn-fixed">
                <el-button plain type="primary" size="mini" @click="confirm()"
                  >确 定</el-button
                >
                <el-button plain type="warning" size="mini" @click="cancel()"
                  >取 消</el-button
                >
              </section>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDictionary } from "@/api/system/systemData";
import { getCustomerType } from "@/api/system/userManage";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    ownerInfoForm: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
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
  created() {
    getDictionary({ nodeName: "币种" }).then((res) => {
      this.moneyOptions = [...res.data];
    });
    getDictionary({ nodeName: "国籍" }).then((res) => {
      this.cityOptions = [...res.data];
    });
    getCustomerType().then((res) => {
      this.businessOptions = [...res.data];
    });
  },
  methods: {
    handleClose() {
      this.$emit("closeOwnerDialog", false);
    },
    importTwo() {},
    confirm() {
      this.$refs['ownerForm'].validate((valid) => {
        if(valid) {
          this.$emit('submitForm')
        }
      })
    },
    cancel() {
      this.$emit('closeForm')
    }
  },
};
</script>

<style lang="scss" scoped>
.manageDialog {
  .btn-fixed {
    float: right;
    padding-top: 5px;
  }
}
</style>
