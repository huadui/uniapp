<template>
  <div class="admin-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>管理员列表</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增管理员</el-button>
        </div>
      </template>
      
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索管理员账号"
          class="input-with-select"
          style="width: 300px; margin-bottom: 20px;"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>

      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="管理员账号" />
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="180" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column prop="statusStr" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.statusStr === '启用' ? 'success' : 'danger'">
              {{ scope.row.statusStr }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-block">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Dialog for Add/Edit -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="30%"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.username" :disabled="!!form.id" placeholder="请输入管理员账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="不填则不修改" show-password />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="超级管理员" />
            <el-option label="普通管理员" value="普通管理员" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../utils/request'

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('新增管理员')
const tableData = ref([])

const form = reactive({
  id: null,
  username: '',
  password: '',
  realName: '',
  role: '普通管理员',
  status: '启用'
})

const loadAdmins = async () => {
  try {
    const res = await request.get('/admin/sysAdmin/page', {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        username: searchQuery.value
      }
    })
    if (res.code === '200') {
      tableData.value = res.data.records.map(item => {
        return {
          ...item,
          statusStr: item.status === 1 ? '启用' : '禁用',
          createdAt: item.createdAt ? item.createdAt.replace('T', ' ') : '',
          lastLoginTime: item.lastLoginTime ? item.lastLoginTime.replace('T', ' ') : ''
        }
      })
      total.value = res.data.total
    }
  } catch (error) {
    // 错误在 request.js 已处理
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadAdmins()
}

const handleAdd = () => {
  dialogTitle.value = '新增管理员'
  Object.assign(form, {
    id: null,
    username: '',
    password: '',
    realName: '',
    role: '普通管理员',
    status: '启用'
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑管理员'
  Object.assign(form, {
    ...row,
    password: '', // do not show password
    status: row.status === 1 ? '启用' : '禁用'
  })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除管理员 ${row.username} 吗?`,
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        const res = await request.delete(`/admin/sysAdmin/${row.id}`)
        if (res.code === '200') {
          ElMessage.success('删除成功')
          loadAdmins()
        }
      } catch (error) {
      }
    })
    .catch(() => {})
}

const handleSave = async () => {
  const isEdit = !!form.id
  const url = isEdit ? '/admin/sysAdmin/update' : '/admin/sysAdmin'
  const method = isEdit ? 'put' : 'post'
  
  const payload = { ...form }
  payload.status = payload.status === '启用' ? 1 : 0
  
  if (!isEdit && !payload.password) {
    ElMessage.warning('新增管理员需填写密码')
    return
  }
  
  try {
    const res = await request[method](url, payload)
    if (res.code === '200') {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      loadAdmins()
    }
  } catch (error) {
    // 错误在 request.js 已处理
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadAdmins()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadAdmins()
}

onMounted(() => {
  loadAdmins()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-family: "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "SimSun", serif;
  font-size: 20px;
  font-weight: bold;
  color: #3E2723; /* Dark Wood */
}

.pagination-block {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-card__header) {
  border-bottom: 1px solid #E0D6C8;
  background-color: #FAFAFA;
}
</style>
