<template>
  <div class="equityChange">
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
        <span class="title">产权过户</span>
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
          <h2 style="text-align: center; color: #666">产权过户</h2>
        </section>
        <el-row>
          <el-form
            :label-position="labelPosition"
            label-width="85px"
            :model="equityBaseInfo"
          >
            <el-col :span="24">
              <el-card shadow="hover">
                <div slot="header" class="clearfix">
                  <span>客户资料</span>
                </div>
                <el-col :span="12">
                  <el-form-item
                    label="客户名称"
                    size="mini"
                    prop="customerName"
                  >
                    <el-input
                      v-model="equityBaseInfo.customerName"
                      clearable
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="手 机" size="mini" prop="phone">
                    <el-input
                      v-model="equityBaseInfo.phone"
                      clearable
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="简 码" size="mini" prop="shortCode">
                    <el-input
                      v-model="equityBaseInfo.shortCode"
                      clearable
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
              </el-card>
              <br />
              <el-card shadow="hover">
                <div slot="header" class="clearfix">
                  <span>基本资料</span>
                </div>
                <el-col :span="12">
                  <el-form-item
                    label="内部房号"
                    size="mini"
                    prop="internalRoomNumber"
                  >
                    <el-input
                      v-model="equityBaseInfo.internalRoomNumber"
                      clearable
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合同编号" size="mini" prop="contractNo">
                    <el-input
                      v-model="equityBaseInfo.contractNo"
                      clearable
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="建筑面积" size="mini" prop="floorage">
                    <el-input
                      v-model="equityBaseInfo.floorage"
                      clearable
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>
          </el-form>
          <el-form
            ref="finishFrom"
            :label-position="labelPosition"
            label-width="85px"
            :model="finishFrom"
            :rules="rules"
          >
            <el-col :span="24">
              <br />
              <el-card shadow="hover">
                <div slot="header" class="clearfix">
                  <span>止约情况</span>
                </div>
                <el-col :span="8">
                  <el-form-item
                    label="终止所有权"
                    size="mini"
                    prop="terminationStatus"
                  >
                    <el-checkbox
                      :disabled="true"
                      v-model="finishFrom.terminationStatus"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item
                    label="终止日期"
                    size="mini"
                    prop="terminationDate"
                  >
                    <el-date-picker
                      v-model="finishFrom.terminationDate"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="终止类型"
                    size="mini"
                    prop="terminationType"
                  >
                    <el-select
                      v-model="finishFrom.terminationType"
                      style="width: 99%"
                    >
                      <el-option
                        v-for="item in finishPermOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="终止原因"
                    size="mini"
                    prop="reasonsForTermination"
                  >
                    <el-input
                      v-model="finishFrom.reasonsForTermination"
                      type="textarea"
                      :rows="2"
                      style="height: 50px; overflow-y: scroll"
                    />
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>
          </el-form>
        </el-row>
      </main>
      <footer class="footer">
        <el-button plain type="primary" size="small" @click="nextStep">
          下一步
        </el-button>
        <el-button plain size="small" @click="goBack"> 取消 </el-button>
      </footer>
    </article>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getContract } from "@/api/system/userRegister";
export default {
  data() {
    return {
      labelPosition: "right",
      equityBaseInfo: {},
      finishFrom: {
        terminationStatus: true,
      },
      finishPermOptions: [
        {
          label: "正常终止",
          value: 1,
        },
        {
          label: "租户主动终止",
          value: 2,
        },
        {
          label: "租户被动终止",
          value: 3,
        },
        {
          label: "其他原因",
          value: 4,
        },
      ],
      rules: {
        terminationDate: [
          { required: true, trigger: "blur", message: "请选择终止日期" },
        ],
      },
    };
  },
  activated() {
    this.getContractInfo(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
      this.$store.dispatch("tagsView/delView", this.$route);
    },
    getContractInfo(id) {
      getContract({ contractId: id }).then((res) => {
        console.log(res)
        this.$set(
          this.equityBaseInfo,
          "customerName",
          { ...res.customer }.customerName
        );
        this.$set(this.equityBaseInfo, "phone", { ...res.customer }.mobile);
        this.$set(
          this.equityBaseInfo,
          "shortCode",
          { ...res.customer }.shortCode
        );
        this.$set(
          this.equityBaseInfo,
          "internalRoomNumber",
          { ...res.contract }.internalRoomNumber
        );
        this.$set(
          this.equityBaseInfo,
          "contractNo",
          { ...res.contract }.contractNo
        );
        this.$set(
          this.equityBaseInfo,
          "floorage",
          { ...res.contract }.floorage
        );
        this.$set(this.equityBaseInfo, "houseId", { ...res.houseList }.houseId);
        this.$set(
          this.equityBaseInfo,
          "buildingId",
          { ...res.houseList }.buildingId
        );
        this.finishFrom.contractId = this.$route.query.id
      });
    },
    // 下一步
    nextStep() {
      this.$refs["finishFrom"].validate((valid) => {
        Cookies.set('termination', this.finishFrom)
        if (valid) {
          this.$router.push({
            path: "ownerRegister",
            query: {
              houseId: this.equityBaseInfo.houseId,
              buildingId: this.equityBaseInfo.buildingId,
              equityState: "newEquity",
            },
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.equityChange {
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
    position: absolute;
    bottom: 50px;
    right: 30px;
  }
}
</style>
