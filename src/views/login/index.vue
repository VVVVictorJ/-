<template>
  <el-row class="login-container" justify="center" align="middle">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @Click="handleChange">{{
          formType ? "登录" : "注册"
        }}</el-link>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" style="max-width: 600px" :rules="rules">
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            :prefix-icon="UserFilled"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form-item v-if="formType" prop="vaildCode">
        <el-input
          v-model="loginForm.validCode"
          placeholder="验证码"
          :prefix-icon="Lock"
        >
          <template #append>
            <span @click="countDownChange">{{ countDown.vaildText }}</span>
          </template></el-input
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :style="{ width: '100%' }"
          @click="submitForm(loginFormRef)"
        >
          {{ formType ? "注册" : "登录" }}
        </el-button>
      </el-form-item>
    </el-card>
  </el-row>
</template>

<script setup>
import { ref, reactive, computed,toRaw } from "vue";
import { getCode, userAuthentication,login, menuPermissions} from "../../api";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// import { ElMessage } from "element-plus";
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;

const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});

//切换表单(0 登录 1 注册)
const formType = ref(0);
const handleChange = () => {
  formType.value = formType.value === 1 ? 0 : 1;
};

const validateUser = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    const phoneReg =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    phoneReg.test(value)
      ? callback()
      : callback(new Error("手机号格式不对，请重新输入"));
  }
};

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const passWordReg = /^[a-zA-Z0-9_-]{4,16}$/;
    passWordReg.test(value)
      ? callback()
      : callback(new Error("密码格式不对，需要4到16位字符"));
  }
};

const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});

const countDown = reactive({
  vaildText: "获取验证码",
  time: 60,
});

let flag = false;

const countDownChange = () => {
  // 60s倒计时
  //如果已发送不处理
  if (flag) {
    return;
  }
  //判断手机号是否正确
  const phoneReg =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: "请检查手机号是否正确",
      type: "warning",
    });
  }
  const time = setInterval(() => {
    if (countDown.time <= 0) {
      countDown.time = 60;
      countDown.vaildText = "获取验证码";
      flag = false;
      clearInterval(time);
    } else {
      countDown.time -= 1;
      countDown.vaildText = `剩余${countDown.time}s`;
    }
  }, 1000);
  flag = true;
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    console.log(data);
    if(data.code === 10000){
      ElMessage.success("验证码发送成功");
    }
  });
};
const loginFormRef = ref();
const router = useRouter();
const store = useStore();
const routerList = computed(() => store.state.menu.routerList);
const submitForm = async (formEl) => {
  if (!formEl) return;
  //手动触发校验
  formEl.validate((valid,fields) => {
    if (valid) {
      console.log(loginForm ,"submit!");
      if(formType.value){
        userAuthentication(loginForm).then(({data})=>{
          if(data.code === 10000){
            ElMessage.success("注册成功");
            formType.value = 0;
          }
        })
      }else{
        login(loginForm).then(({data})=>{
          if(data.code === 10000){
            ElMessage.success("登录成功");
            console.log(data);
            localStorage.setItem('pz_token', data.data.token)
            localStorage.setItem('pz_userinfo', JSON.stringify(data.data.userInfo))
            menuPermissions().then(({data}) => {
              store.commit('dynamicMenu', data.data)
              console.log(routerList)
              toRaw(routerList.value).forEach(item => {
                router.addRoute('main', item)
              });
            })
            router.push('/')
          }
        })
      }
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
