import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Layout from "../views/Main.vue";
import Login from "../views/login/index.vue";
import Admin from "../views/auth/admin/index.vue";
import Group from "../views/auth/group/index.vue";
import Dashboard from "../views/dashboard/index.vue";
import Order from "../views/vppz/order/index.vue";
import Staff from "../views/vppz/staff/index.vue";


const routes = [
  {
    path: "/",
    component: Layout,
    name: "main",
    children: [
      {
        path: "dashboard",
        meta: {
          id: "1",
          name: "控制台",
          icon: "Platform",
          path: "/dashboard",
          describe: "控制台",
        },
        component: Dashboard,
      },
      {
        path: "auth",
        meta: {
          id: "2",
          name: "权限管理",
          icon: "Grid",
        },
        children: [
          {
            path: "",
            alias: ["admin"],
            meta: {
              id: "1",
              name: "控制台",
              icon: "Avatar",
              path: "/auth/admin",
              describe: "管理员可进行编辑",
            },
            component: Admin,
          },
          {
            path: "group",
            meta: {
              id: "2",
              name: "菜单管理",
              icon: "Menu",
              path: "/auth/group",
              describe: "菜单规则",
            },
            component: Group,
          },
        ],
      },
      {
        path: "vppz",
        meta: {
          id: "3",
          name: "陪诊",
          icon: "Grid",
        },
        children: [
          {
            path: "staff",
            meta: {
              id: "1",
              name: "陪护管理",
              icon: "Checked",
              path: "/vppz/staff",
              describe: "陪诊管理",
            },
            component: Staff,
          },
          {
            path: "order",
            meta: {
              id: "2",
              name: "订单管理",
              icon: "Menu",
              path: "/vppz/order",
              describe: "订单管理",
            },
            component: Order,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
];

const router = createRouter({
  //路由匹配模式
  // history: createWebHistory(),
  history: createWebHashHistory(),
  //
  routes,
});

export default router;