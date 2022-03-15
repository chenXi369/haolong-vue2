<template>
  <div class="login-container">
    <div class="snow" v-for="item in 100" :key="item"></div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">好邻邦物业管理信息系统</h3>
      </div>

      <el-form-item prop="loginName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginName"
          v-model="loginForm.loginName"
          placeholder="请输入用户名"
          name="loginName"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- 验证码 -->
      <section class="flex flex-between">
        <el-form-item prop="code" style="width: 70%">
          <span class="svg-container">
            <svg-icon icon-class="code" />
          </span>
          <el-input
            ref="code"
            v-model="loginForm.code"
            placeholder="请输入验证码"
            name="code"
            type="text"
            tabindex="3"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <div class="code-input" @click="getCode" >
          <img :src="codeUrl" class="login-code-img"/>
        </div>
      </section>

      <div class="register-box">
        <el-checkbox
          class="remember-pwd"
          v-model="loginForm.rememberMe"
        ></el-checkbox>
        <span class="blue-text" @click="rememberPwd">记住密码</span>

        <span class="blue-text float-right" @click="forgetPwd">忘记密码</span>
      </div>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px; height: 36px"
        @click.native.prevent="handleLogin"
        >{{!loading ? '登 录' : '登 录 中'}}</el-button
      >
    </el-form>

    <Forget-Pwd
      :forgetDialog="forgetDialog"
      @closeDialog="closeDialog"
    ></Forget-Pwd>

    <!-- <Register
      :registerDialog="registerDialog"
      @hiddenDialog="hiddenDialog"
    ></Register> -->
  </div>
</template>

<script>
import { getCodeImg } from "@/api/user.js"
import Cookies from "js-cookie";
import SocialSign from "./components/SocialSignin";
import ForgetPwd from "./components/forgetPwd";
import Register from "./components/register";

export default {
  name: "Login",
  components: { SocialSign, ForgetPwd, Register },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == '') {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      codeUrl: "",
      loginForm: {
        loginName: "",
        password: "",
        code: "",
        uuid: "",
        source: "",
        rememberMe: true,
      },
      loginRules: {
        loginName: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        code: [
          { required: true, trigger: "blur", message: "验证码不能为空" }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},

      forgetDialog: false,
      registerDialog: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getCookie()
    // 获取验证码
    this.getCode()
  },
  mounted() {
    if (this.loginForm.loginName === "") {
      this.$refs.loginName.focus()
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus()
    } else if (this.loginForm.code === "") {
      this.$refs.code.focus()
    }
  },
  destroyed() {},
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = "data:image/gif;base64," + res.img
        this.loginForm.uuid = res.uuid
        this.loginForm.source = "haolong"
      })
    },
    // 获取loginForm的状态和数据  Cookie中有数据就替换没有就延续原来的
    getCookie() {
      const loginName = Cookies.get("loginName");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        loginName: loginName === undefined ? this.loginForm.loginName : loginName,
        password: password === undefined ? this.loginForm.password : password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    // 注册
    // showRegister() {
    //   this.registerDialog = true;
    // },
    // hiddenDialog() {
    //   this.registerDialog = false;
    // },

    // 记住密码
    rememberPwd() {
      this.loginForm.rememberMe = !this.loginForm.rememberMe;
    },
    // 忘记密码
    forgetPwd() {
      this.forgetDialog = true;
    },
    closeDialog() {
      this.forgetDialog = false;
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // cookie信息的处理  判断是否勾选记住密码
          if (this.loginForm.rememberMe) {
            Cookies.set("loginName", this.loginForm.loginName, { expires: 30 });
            Cookies.set("password", this.loginForm.password, { expires: 30 });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("loginName");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
              this.getCode()
            });
        } else {
          this.getCode();
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .login-form .el-input input {
    color: $cursor;
  }
}
// 去掉滚动条的默认样式
.el-scrollbar .el-scrollbar__wrap {
  cursor: pointer;
  overflow-x: hidden;
}
/* reset element-ui css */
.login-container {
  .login-form {
    .el-input {
      display: inline-block;
      height: 39px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 8px 5px 8px 15px;
        color: $light_gray;
        height: 39px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 0px;
    margin-top: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

@function random_range($min, $max) {
  $rand: random();
  $random_range: $min + floor($rand * (($max - $min) + 1));
  @return $random_range;
}

.snow {
  $total: 100;
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;

  @for $i from 1 through $total {
    $random-x: random(1000000) * 0.0001vw;
    $random-offset: random_range(-100000, 100000) * 0.0001vw;
    $random-x-end: $random-x + $random-offset;
    $random-x-end-yoyo: $random-x + ($random-offset / 2);
    $random-yoyo-time: random_range(30000, 80000) / 100000;
    $random-yoyo-y: $random-yoyo-time * 100vh;
    $random-scale: random(10000) * 0.0001;
    $fall-duration: random_range(10, 30) * 1s;
    $fall-delay: random(30) * -1s;

    &:nth-child(#{$i}) {
      opacity: random(10000) * 0.0001;
      transform: translate($random-x, -10px) scale($random-scale);
      animation: fall-#{$i} $fall-duration $fall-delay linear infinite;
    }

    @keyframes fall-#{$i} {
      #{percentage($random-yoyo-time)} {
        transform: translate($random-x-end, $random-yoyo-y) scale($random-scale);
      }

      to {
        transform: translate($random-x-end-yoyo, 100vh) scale($random-scale);
      }
    }
  }
}

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
  filter: drop-shadow(0 0 10px white);

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 200px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    .register-box {
      clear: both;
      margin: 22px 0 14px 0;
      .remember-pwd {
        float: left;
        top: 1px;
        margin-right: 6px;
      }
      .blue-text {
        color: #1890ff;
        cursor: pointer;
      }
      .float-right {
        float: right;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 2px 5px 2px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
.code-input {
  height: 42.5px;
  width: 27%;
  border-radius: 5px;
  margin-left: 3%;
  margin-top: 24px;
  .login-code-img {
    width: 100%;
    height: 100%;
  }
}
</style>
