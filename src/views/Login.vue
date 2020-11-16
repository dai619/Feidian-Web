<template>
  <div class="login_page">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer">
        <div class="titleArea rflex">
          <img class="logo" :src="logo" alt="小爱admin" />
          <span class="title"><i>沸点官网</i>管理</span>
        </div>
        <!-- 下面的el-form之前有:rules="rules"，但是有点问题，详情可以看一下data被注释了的地方 -->
        <el-form
          :model="loginForm"
          
          ref="loginForm"
          class="loginForm"
        >
          <el-form-item prop="username" class="-img">
            <span class="fa-tips"><i class="fa fa-user"></i></span>
            <el-input
              @keyup.enter.native="submitForm('loginForm')"
              class="area"
              type="text"
              placeholder="用户名"
              v-model="loginForm.userEmail"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" class="-img">
            <span class="fa-tips"><i class="fa fa-lock"></i></span>
            <el-input
              @keyup.enter.native="submitForm('loginForm')"
              class="area"
              type="password"
              placeholder="密码"
              v-model="loginForm.userPassword"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password" class="login-item-img">
            <div class="img_wrapper">
              <img
                width="100%"
                height="100%"
                ref="captcha_img"
                id="captcha_img"
                title="点击更换"
                @click="refresh()"
                :src= "baseUrl + '/api/kaptcha'"
              />
            </div>
            <div class="verifyCodeActual_wrapper">
              <el-input
                @keyup.enter.native="submitForm('loginForm')"
                class="area"
                type="text"
                placeholder="验证码"
                v-model="loginForm.verifyCodeActual"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm(loginForm)"
              class="submit_btn"
              >SIGN IN</el-button
            >
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import logoImg from "@/assets/img/logo.png";
import * as types from "../store/types";
// import { login } from "@/api/user";

// import this.axios from 'this.axios'
import { mapGetters, mapMutations } from "vuex";
import { BASEURL } from '@/config/index';
// import Verify from "vue2-verify";
export default {
  data() {
    return {
      logo: logoImg,
      loginForm: {
        userEmail: "",
        userPassword: "",
        verifyCodeActual: "",
      },
      // 不知道这里的rules为什么会有问题：明明已经输了2-20个自字符了他还是冒红框
      // rules: {
      //   username: [
      //     { required: true, message: "请输入用户名", trigger: "blur" },
      //     {
      //       min: 2,
      //       max: 20,
      //       message: "长度在 2 到 20 个字符",
      //       trigger: "blur",
      //     },
      //   ],
      //   password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      // },
      baseUrl:BASEURL
    };
  },
  // components: {
  //   Verify,
  // },
  methods: {
    submitForm(loginForm) {
      var _that = this;
      // let form = Object.assign({}, this.loginForm);
      let param = new FormData(); //创建form对象
      Object.keys(loginForm).forEach(function (key) {
        param.append(key.toString(), loginForm[key].toString());
      });
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      this.axios
        .post(
          "/api/login",
          param,
          config
        )
        .then((res) => {
          if (res.data.errno === 0) {
            this.setAddress(this.loginForm.userEmail);
            this.setUserLimit(res.data.data.userLimit);;
            // _that.changeLogin('100')
            // this.changeLogin('100')
            // _that.$router.push('/user')
            // this.$router.push('/user')

            if (res.data.token) {
              // 后端不一定怎么返回，看情况

              this.$store.commit(types.LOGIN, res.data.token);
              // let redirect = decodeURIComponent(this.$route.query.redirect || '/user'); 这个和在this.axios里设置的呼应
              // this.$router.push({
              //   path: redirect
              // })
              _that.$router.push("/user");
            }
          } else {
            this.$alert("密码或验证码错误");
          }
        })
        .catch(() => {});
    },
    refresh() {
      this.$refs.captcha_img.src =
        BASEURL + "/api/kaptcha?" + Math.random();
    },
    ...mapMutations(["setAddress", "setUserLimit", "changeLogin"]),
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      "address",
      "userLimit",
      "isLogin",
      // 'anotherGetter',
      // ...
    ]),
  },
  mounted() {
    this.$store.commit(types.TITLE, "Login");
  },
};
</script>

<style lang="less" scoped>
.login_page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../assets/img/bg9.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_contianer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 370px;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  .titleArea {
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-size: 22px;
    width: 100%;
    padding-bottom: 20px;
    .logo {
      width: 40px;
      margin-right: 10px;
    }
    .title {
      i {
        color: #ff6c60;
      }
    }
  }

  .loginForm {
    .submit_btn {
      width: 100%;
      padding: 13px 0;
      font-size: 16px;
    }
    .fa-tips {
      position: absolute;
      left: 10px;
      z-index: 20;
      color: #ff7c1a;
      font-size: 18px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.manage_tip {
  margin-bottom: 20px;
  .title {
    font-family: cursive;
    font-weight: bold;
    font-size: 26px;
    color: #fff;
  }
  .logo {
    width: 60px;
    height: 60px;
  }
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
.loginForm {
  .el-button--primary {
    background-color: #ff7c1a;
    border: 1px solid #ff7c1a;
  }
}
.verify_wrapper {
  overflow: hidden;
  background-color: antiquewhite;
  padding: 0 20px;
  border-radius: 10px;
  box-shadow: #ff6c60 5px;
}
.img_wrapper {
  display: inline-block;
  vertical-align: middle;
  // position: relative;
  // bottom: 20px;
  // top: 13px;
  padding: 5px;
  height: 36px;
}
.verifyCodeActual_wrapper {
  // width: 50%;
  display: inline-block;
  vertical-align: middle;
}
.login-item-img {
  // position: relative;
  // bottom: 10px;
  vertical-align: bottom;
}
</style>
