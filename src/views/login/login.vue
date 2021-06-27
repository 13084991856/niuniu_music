<template>
  <div class="login">
    <!-- 登录box -->
    <div class="login_box">
      <!-- 登录logo -->
      <img src="~assets/img/logo.png" alt="" />
      <!-- 登录表单 -->
      <el-form
        v-if="status == 1"
        class="login_form"
        ref="loginFormRef"
        :model="ruleForm"
        :rules="rules"
        key="1"
      >
        <!-- 用户名 -->
        <el-form-item prop="phone">
          <el-input
            class="inp"
            placeholder="请输入网易云音乐手机号"
            prefix-icon="el-icon-user-solid"
            v-model="ruleForm.phone"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            ref="pwd"
            class="inp"
            placeholder="请输入密码"
            prefix-icon="el-icon-unlock"
            v-model="ruleForm.password"
            @keyup.enter.native="login"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="login">登录</el-button>
        </el-form-item>
        <el-form-item>
          <span>还没注册？去<span class="sign" @click="sign">注册</span></span>
        </el-form-item>
      </el-form>
      <!-- 注册表单 -->
      <el-form
        v-else
        class="register_form"
        ref="registerFormRef"
        :model="registerRuleForm"
        :rules="registerRules"
        size="mini"
        key="2"
      >
        <!-- 用户名 -->
        <el-form-item prop="reg_phone">
          <el-input
            size="mini"
            class="inp"
            placeholder="请输入手机号"
            prefix-icon="el-icon-user-solid"
            v-model="registerRuleForm.reg_phone"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="captcha" class="captcha">
          <el-input
            ref="code"
            class="inp"
            placeholder="请输入验证码"
            v-model="registerRuleForm.captcha"
          ></el-input>
          <el-button type="primary" @click="sendCaptcha" id="send"
            >发送验证码</el-button
          >
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item prop="nickname">
          <el-input
            class="inp"
            placeholder="请输入昵称"
            v-model="registerRuleForm.nickname"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="reg_password">
          <el-input
            ref="reg_pwd"
            class="inp"
            placeholder="请输入密码"
            prefix-icon="el-icon-unlock"
            v-model="registerRuleForm.reg_password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="password2">
          <el-input
            class="inp"
            placeholder="请再次输入密码"
            prefix-icon="el-icon-unlock"
            v-model="registerRuleForm.password2"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="register_btn">
          <el-button type="primary" class="btn_register" @click="register"
            >注册/修改密码</el-button
          >
          <el-button class="reset" type="info" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <span
            >已有账号？去<span class="sign" @click="Gotologin">登录</span></span
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerRuleForm.reg_password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      status: 1,
      ruleForm: {
        phone: "",
        password: "",
      },
      registerRuleForm: {
        reg_phone: "",
        captcha: "",
        nickname: "",
        reg_password: "",
        password2: "",
      },
      id: "",
      flag: true,
      rules: {
        phone: [
          { required: true, message: "请输入登录手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "密码长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
      //注册验证规则
      registerRules: {
        reg_phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" },
        ],
        reg_password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "密码长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        password2: [{ validator: validatePass2, trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
      },
      //手机号是否已被注册
      exist: 0,
    };
  },
  methods: {
    //重置注册表单
    reset() {
      this.$refs.registerFormRef.resetFields();
    },
    Gotologin() {
      this.status = 1;
      this.reset();
    },
    sign() {
      this.status = 2;
      this.ruleForm.phone = "";
      this.ruleForm.password = "";
    },
    //登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        //    表单预验证，通过则valid返回true
        if (!valid) return;
        //密码md5加密
        this.ruleForm.password = this.$md5(this.ruleForm.password);
        const result = await this.$http.post("/login/cellphone", {
          phone: this.ruleForm.phone,
          md5_password: this.ruleForm.password,
        });
        console.log(result);
        if (result.data.code == 502) {
          this.ruleForm.password = "";
          this.$refs["pwd"].focus();
          return this.$message.error("密码错误，请重新输入！");
        }
        if (result.data.code == 200) {
          this.$message.success("登录成功！");
          // 保存用户id
          this.id = result.data.account.id;
          // 获取后端返回的token
          var token = result.data.token;

          //存放userTokenb
          this.$store.commit("setUserToken", token);

          //存放userid
          this.$store.commit("setUserId", this.id);

          // 保存 cookie (大部分需要登录的接口都要用到)
          var cookie = result.data.cookie;
          this.$store.commit("setCookie", cookie);
        } else return this.$message.error("登录失败");

        // 跳转到首页
        this.$router.push("/home");
        let userdata = {
          token,
          cookie,
          id: this.id,
        };
        this.$bus.$emit("getUserData", userdata);

        this.$bus.$emit("getUserid", this.id);
      });
    },
    //发送验证码
    async sendCaptcha() {
      var reg_phone = this.registerRuleForm.reg_phone;
      let send = document.getElementById("send").children[0];
      if (!reg_phone) {
        return this.$message.warning("手机号不能为空");
      } else if (reg_phone && reg_phone.length != 11) {
        return this.$message.warning("请输入有效手机号");
      }

      if (this.flag) {
        let time = 60;
        let timer = null;
        if (timer == null) {
          timer = setInterval(() => {
            time--;
            if (time > 0) {
              send.innerHTML = `${time}s后重新发送`;
            } else {
              send.innerHTML = `发送验证码`;
              clearInterval(timer);
              timer = null;
              this.flag = true;
            }
          }, 1000);
        }
        const res = await this.$http.get(
          "/cellphone/existence/check?phone=" + this.registerRuleForm.reg_phone
        );
        console.log(res.data);
        if (res.data.code == 200 && res.data.exist == 1) {
          this.exist = 1;
          this.$message.warning(
            "当前手机号已被注册，接下来为修改密码操作，昵称无需填写。。。请知悉!"
          );
          this.registerRuleForm.nickname = +new Date();
          this.$refs["code"].focus();
          const result = await this.$http.get(
            "/captcha/sent?phone=" + this.registerRuleForm.reg_phone
          );
          // console.log(result.data);
          if (result.data.code == 200) {
            this.$message.success("发送成功，每个手机号一天只能发5条验证码!");

            this.flag = false;
          } else {
            this.$message.error(
              "发送验证码超过限制!每个手机号一天只能发5条验证码!"
            );
            this.flag = false;
          }
        }
      }
    },
    //注册
    register() {
      //注册前表单预验证;
      this.$refs.registerFormRef.validate(async (valid) => {
        if (!valid) return;
        //验证验证码

        const result1 = await this.$http
          .get(
            `/captcha/verify?phone=${this.registerRuleForm.reg_phone}&captcha=${this.registerRuleForm.captcha}`
          )
          .catch((err) => {
            console.log(err);
            if (err) {
              return this.$message.error("验证码错误!");
            }
          });
        if (result1.data && result1.data.code == 200) {
          const result = await this.$http
            .get(
              `/register/cellphone?phone=${this.registerRuleForm.reg_phone}&password=${this.registerRuleForm.reg_password}&captcha=${this.registerRuleForm.captcha}&nickname=${this.registerRuleForm.nickname}`
            )
            .catch((err) => {
              console.log(err);
              if (err) {
                return this.$message.error("昵称已被占用!");
              }
            });
          console.log(result.data);
          if (result.data.code == 200) {
            const res = await this.$http.get(
              "/cellphone/existence/check?phone=" +
                this.registerRuleForm.reg_phone
            );
            if (res.data.code == 200 && res.data.exist == 1) {
              this.exist = 1;
            }
            if (this.exist == 1) {
              this.$message.success("修改密码成功!");
            } else {
              this.$message.success("注册成功!");
            }
            this.status = 1;
          }
        }
      });
    },
  },
};
</script>
<style lang="less">
.register_form .el-input__inner {
  height: 32px !important;
}
.register_btn .el-form-item__content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  button {
    width: 50%;
  }
}
.captcha .el-form-item__content {
  display: flex;
  justify-content: space-between;
  button {
    margin-left: 10px;
  }
}
</style>

<style lang="less" scoped>
.login {
  height: 600px;
  width: 100%;
  background: url("~assets/img/bg.jpg");
  background-size: 100% 100%;
  position: relative;

  .login_box {
    width: 400px;
    height: 500px;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #d3d3d3;
    box-shadow: 0px 36px 54px -12px rgb(0 0 0);

    img {
      // 居中
      width: 150px;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
    }
    .inp ::-webkit-input-placeholder {
      color: rgb(43, 40, 40);
    }
    .inp ::-moz-input-placeholder {
      color: rgb(43, 40, 40);
    }
    .inp ::-ms-input-placeholder {
      color: rgb(43, 40, 40);
    }

    .login_form {
      // 居中
      margin-top: 150px;
      padding: 10px 25px;
      .btn {
        width: 100%;
        height: 40px;
      }
      .sign {
        font-size: 25px;
        color: rgb(18, 217, 243);
        font-weight: 600;
        margin-right: 15px;
        cursor: pointer;
      }
    }

    .register_form {
      margin-top: 130px;
      padding: 3px 25px;
      .sign {
        font-size: 25px;
        color: rgb(18, 217, 243);
        font-weight: 600;
        margin-right: 15px;
        cursor: pointer;
      }
    }
  }
}
</style>
