import axios from "axios";
import { ElMessage } from "element-plus";

const http = axios.create({
  baseURL: "https:/v3pz.itndedu.com/v3pz",
  timeout: 10000,
});

//添加拦截器
http.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("pz_token");
    //不需要token的api
    const whiteUrl = ["/get/code", "/user/authentication", "/login"];
    if (token && !whiteUrl.includes(config.url)) {
      config.headers["X-token"] = token;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    //对接口异常的数据，给用户提示
    if (response.data.code === -1) {
      ElMessage.warning(response.data.message);
    }
    if (response.data.code === -2) {
      localStorage.removeItem("pz_token");
      localStorage.removeItem("pz_userinfo");
      // window.location.href = window.location.origin;
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default http;
