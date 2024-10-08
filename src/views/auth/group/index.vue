<template>
  <panelHead />
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">弹窗</el-button>
  </div>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="permissionName" label="菜单权限" width="500px" />
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
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="permissionData"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
        />
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
import { reactive, ref, onMounted, nextTick } from "vue";
import { userGetMenu, userSetMenu, menuList } from "../../../api";
import { Plus } from "@element-plus/icons-vue";

onMounted(() => {
  userGetMenu().then(({ data }) => {
    console.log(data);
    permissionData.value = data.data;
  });
  getListData();
});

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});

const form = reactive({
  id: "",
  name: "",
  permissions: "",
});
//树形菜单权限数据
const permissionData = ref([]);

const dialogFormVisable = ref(false);
const beforeClose = () => {
  dialogFormVisable.value = false;
  // 重置表单
  formRef.value.resetFields();
  // 重置树形菜单
  treeRef.value.setCheckedKeys(defaultKeys);
};

const defaultKeys = [4, 5];

const treeRef = ref();

const formRef = ref();

const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      userSetMenu({ name: form.name, permissions, id: form.id }).then(
        (data) => {
          console.log(data);
          beforeClose();
          getListData();
        }
      );
    } else {
      console.log("error submit!", fields);
    }
  });
};

const rules = reactive({
  name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
  //   passWord: [{ validator: validatePass, trigger: "blur" }],
});

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});



const open = (rowData = {}) => {
  dialogFormVisable.value = true;
  //弹窗打开form生成是异步的
  nextTick(() => {
    if (rowData) {
      Object.assign(form, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};

const getListData = () => {
  menuList(paginationData).then((data) => {
    console.log(data);
    //解构
    const { list, total } = data.data.data;
    //给el-form绑定的数据赋值
    tableData.list = list;
    tableData.total = total;
  });
};
</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
