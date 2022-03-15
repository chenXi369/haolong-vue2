<template>
  <div>
    <el-dialog
      center
      width="570px"
      min-width="100%"
      :modal="false"
      title="忘记密码"
      :visible="forgetDialog"
      @close="handleClose"
    >
      <el-form
        :model="form"
        :rules="formRule"
        ref="form"
        label-width="80px"
        class="findPsd_form"
      >
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
        <el-form-item prop="notarizeUserPwd" label="确认密码">
          <el-input
            type="password"
            v-model="form.notarizeUserPwd"
            placeholder="请再次输入您的密码"
            maxlength="20"
            @copy.native.capture.prevent="handlePwdInput"
            @paste.native.capture.prevent="handlePwdInput"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm" class="login_btn">确 定</el-button>
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
      form: {
        account: "",
        code: "",
        userPwd: "",
        notarizeUserPwd: "",
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
    forgetDialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 确认
    confirm() {
      // this.$emit("closeDialog", false);
    },
    // 取消
    cancel() {
      this.$refs.form.resetFields()
      this.$emit("closeDialog", false);
    },
    handleClose() {
      this.$emit("closeDialog", false);
    },
    // 获取验证码
    getCode() {
      if (this.form.account === "") {
        this.$message.warning("请输入手机号！");
        return;
      }
      this.form.getCodeBtnStatus = true;
    },
    showTooltip() {
      this.pwdflag = true;
    },
    hideTooltip() {
      this.pwdflag = false;
    },
    handlePwdInput() {
      return false;
    },
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
  .login_btn {
    margin-top: 86px;
    width: 200px;
    background: linear-gradient(90deg, #7ac2ff, #00dbff);
    border-radius: 4px;
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

<style>
.el-dialog__title {
  font-size: 30px;
  line-height: 50px;
}
.el-form-item__label {
  font-weight: 500;
}
</style>
