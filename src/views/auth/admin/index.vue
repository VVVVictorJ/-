<template>
  <panelHead />
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="permissions_id" label="所属组别">
      <template #default="scope">
        {{ permissionsName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag class="ml-2" :type="scope.row.active ? 'success' : 'danger'">
          {{ scope.row.active ? "正常" : "失效" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 20px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)"> 编辑 </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      size="small"
      :background="false"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog
    v-model="dialogFormVisable"
    :before-close="beforeClose"
    title="添加权限"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="100px"
      label-position="left"
      :rules="rules"
    >
      <el-form-item label="手机号" prop="moblie">
        <el-input v-model="form.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" disabled />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select
          v-model="form.permissions_id"
          placeholder="请选择权限"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { authAdmin, menuSelectList, updateUser } from "../../../api";
import { reactive, onMounted, ref } from "vue";
import dayjs from "dayjs";
import { Clock } from "@element-plus/icons-vue";

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});

// 获取点击数据，再根据点击数据请求列表
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};

const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};

onMounted(() => {
  getListData();
  menuSelectList().then(({ data }) => {
    options.value = data.data;
  });
});

const getListData = () => {
  authAdmin(paginationData).then((data) => {
    console.log(data);
    const { list, total } = data.data.data;
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
    tableData.list = list;
    tableData.total = total;
  });
};

const options = ref([]);

//根据权限id获取权限名称
const permissionsName = (id) => {
  const data = options.value.find((el) => el.id === id);
  return data ? data.name : "超级管理员";
};

const open = (rowData) => {
  dialogFormVisable.value = true;
  Object.assign(form, {
    mobile: rowData.mobile,
    name: rowData.name,
    permissions_id: rowData.permissions_id,
  });
};

//弹窗
const dialogFormVisable = ref(false);
const beforeClose = () => {
  dialogFormVisable.value = false;
};

const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入昵称" }],
  permissions_id: [{ required: true, trigger: "blur", message: "请选择权限" }],
});

const formRef = ref();
const form = reactive({
  name: "",
  permissions_id: "",
});

const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form;
      updateUser({ name, permissions_id }).then(({ data }) => {
        if (data.code === 10000) {
          dialogFormVisable.value = false;
          getListData();
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>
