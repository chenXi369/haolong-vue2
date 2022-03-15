<template>
  <div>
    <el-dialog
      center
      width="570px"
      min-width="100%"
      title="注册"
      :modal="false"
      @close="handleClose"
      :visible="registerDialog"
    >
      <el-steps :active="actived" align-center>
        <el-step title="步骤 1" icon="el-icon-edit"></el-step>
        <el-step title="步骤 2" icon="el-icon-upload"></el-step>
      </el-steps>

      <el-form
        :model="form"
        :rules="formRule"
        ref="form"
        label-width="80px"
        class="findPsd_form"
      >
        <template v-if="actived === 1">
          <el-form-item prop="account" label="手机号">
            <el-input
              v-model.trim="form.account"
              placeholder="请输入手机号"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item class="code" prop="code" label="验证码">
            <el-input
              v-model="form.code"
              placeholder="请输入短信验证码"
              maxlength="8"
            ></el-input>
            <el-button class="checkedCode" v-show="showTime"
              >{{ totalTime }}S
            </el-button>
            <el-button
              class="checkedCode codeButton"
              v-show="!showTime"
              @click="getCode"
              :loading="form.getCodeBtnStatus"
              >获取验证码
            </el-button>
          </el-form-item>
          <el-form-item prop="userPwd" label="密码">
            <el-tooltip
              class="tool_tip"
              effect="light"
              placement="right"
              :manual="true"
              v-model="tip_flag"
            >
              <div slot="content">
                <p style="color: '#9CACCA'">
                  <i v-if="pwdflag" class="el-icon-circle-check success"></i>
                  <i v-else class="el-icon-circle-close fail"></i>
                  6-20位，且只能包含字母、数字、标点符号
                </p>
              </div>
              <div>
                <el-input
                  @click="disabeld = !disabeld"
                  @blur="hideTooltip"
                  @focus="showTooltip"
                  type="password"
                  v-model="form.userPwd"
                  placeholder="设置您的登录密码"
                  maxlength="20"
                  @copy.native.capture.prevent="handlePwdInput"
                  @paste.native.capture.prevent="handlePwdInput"
                >
                </el-input>
              </div>
            </el-tooltip>
          </el-form-item>
        </template>

        <template v-if="actived === 2">
          <el-form-item prop="account" label="身份证号">
            <el-input
              v-model.trim="form.idNum"
              placeholder="请输入身份证号"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item prop="notarizeUserPwd" label="营业执照">
            <el-button style="width: 100%"><i class="el-icon-upload"></i> 上传工商营业执照</el-button>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="actived === 1">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="nextStep" class="login_btn" :loading="loading">下一步</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button @click="fromStep">上一步</el-button>
        <el-button type="primary" @click="confirm" class="login_btn" :loading="loading">完 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validatePwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入6~20位的字母与数字组合！"));
      } else {
        callback();
      }
    };
    return {
      // 激活状态
      actived: 1,
      loading: false,
      form: {
        account: "",
        code: "",
        userPwd: "",
        idNum: "",
        submitStatus: false,
        getCodeBtnStatus: false,
      },
      tip_flag: false,
      pwdflag: false,
      showTime: false,
      totalTime: 60, // 倒计时冷却时间
      formRule: {
        account: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
        ],
        userPwd: [{ required: true, trigger: "blur", validator: validatePwd }],
        notarizeUserPwd: [
          { required: true, message: "请再次输入你的密码", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    registerDialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 下一步
    nextStep() {
      this.actived = 2
      this.$refs.form.resetFields()
    },
    fromStep() {
      this.actived = 1
    },
    // 确认
    confirm() {
      // this.$emit("closeDialog", false);
    },
    // 取消
    cancel() {
      this.$emit("hiddenDialog", false);
      this.$refs.form.resetFields()
    },
    handleClose() {
      this.$emit("hiddenDialog", false);
    },
    // 获取验证码
    getCode() {
      if (this.form.account === "") {
        this.$message.warning("请输入手机号！");
        return;
      }
      this.form.getCodeBtnStatus = true;
    },
    handlePwdInput() {
      return false;
    },
    hideTooltip() {

    },
    showTooltip() {

    }
  },
};
</script>

<style lang="scss" scoped>
.findPsd_form {
  width: 440px;
  margin: auto;
  text-align: center;
  .tooltip {
    position: absolute;
    top: 2px;
    left: 100%;
    width: 265px;
    height: 14px;
    font-size: 14px;
    color: rgba(156, 172, 201, 0.8);
    line-height: 36px;
  }
  .el-input__inner {
    height: 50px;
    opacity: 0.7;
    border-radius: 2px;
  }
  .code .el-button {
    background: transparent;
    width: 33%;
    font-size: 8px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #5475a9;
    border: 1px solid #9cacc9;
    border-radius: 2px;
    // margin-left: 10px;
  }
  .code .el-input {
    color: #242424;
    width: 64%;
  }
  .el-form-item__error {
    color: #ff4949;
    // font-size: 18px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 90px;
    font-family: "SourceHanSansSC";
  }
  .codeInput {
    width: 64%;
  }
  .codeButton {
    width: 33%;
    margin-left: 10px;
  }
}
.login-container .el-form-item {
  background: none;
}
</style>
<style lang="scss">
.dialog-footer .login_btn {
  width: 200px;
  background: linear-gradient(90deg, #7ac2ff, #00dbff);
  border-radius: 4px;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.5;
  }
}
</style>
