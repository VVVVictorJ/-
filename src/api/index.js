import request from "../utils/request";

// 获取验证码
export const getCode = (data) => {
  return request.post("/get/code", data);
};

export const userAuthentication = (data) => {
  return request.post("/user/authentication", data);
};

export const login = (data) => {
  return request.post("/login", data);
}

export const authAdmin = (params) => {
  return request.get("/auth/admin", {params});
}

export const userGetMenu = () => {
  return request.get("/user/getmenu");
}

export const userSetMenu = (data) => {
    return request.post("/user/setmenu", data);
    
}

export const menuList = (params) => {
    return request.get("/menu/list", {params});
    
}

export const menuSelectList = () => {
  return request.get("/menu/selectList");
}

export const updateUser = (data) => {
  return request.post("/update/user", data);
}

export const menuPermissions= () => {
  return request.get("/menu/permissions");
}