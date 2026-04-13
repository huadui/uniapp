<template>
  <div class="user-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
        </div>
      </template>
      
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索微信昵称"
          class="input-with-select"
          style="width: 300px; margin-right: 10px; margin-bottom: 20px;"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
        <el-button type="primary" :icon="Plus" @click="handleAdd" style="margin-bottom: 20px;">新增用户</el-button>
      </div>

      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-avatar :size="40" :src="scope.row.avatarUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            {{ scope.row.gender === 1 ? '男' : (scope.row.gender === 2 ? '女' : '未知') }}
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" />
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="scope">
            {{ scope.row.createdAt ? scope.row.createdAt.replace('T', ' ') : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              :type="scope.row.status === 1 ? 'warning' : 'success'"
              @click="handleStatusChange(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
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
      width="40%"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="头像URL">
          <el-input v-model="form.avatarUrl" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
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
import request from '@/utils/request'

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const tableData = ref([])

const form = reactive({
  nickname: '',
  avatarUrl: '',
  gender: 0,
  phoneNumber: '',
  status: 1
})

const loadUsers = async () => {
  try {
    const res = await request.get('/admin/user/page', {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        nickname: searchQuery.value
      }
    })
    if (res.code === '200') {
      tableData.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    // 错误在 request.js 已处理
  }
}

onMounted(() => {
  loadUsers()
})

const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

const handleAdd = () => {
  dialogTitle.value = '新增用户'
  Object.assign(form, {
    id: null,
    nickname: '',
    avatarUrl: '',
    gender: 0,
    phoneNumber: '',
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleStatusChange = (row) => {
  const targetStatus = row.status === 1 ? 0 : 1
  const actionText = targetStatus === 1 ? '启用' : '禁用'
  
  ElMessageBox.confirm(
    `确认${actionText}用户 ${row.nickname} 吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    request.put(`/admin/user/status/${row.id}`, { status: targetStatus }).then(() => {
      ElMessage.success(`${actionText}成功`)
      loadUsers()
    })
  }).catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除用户 ${row.nickname} 吗?`,
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        const res = await request.delete(`/admin/user/${row.id}`)
        if (res.code === '200') {
          ElMessage.success('删除成功')
          loadUsers()
        }
      } catch (e) {
      }
    })
    .catch(() => {})
}

const handleSave = async () => {
  try {
    if (form.id) {
      // update
      const res = await request.put('/admin/user/update', form)
      if (res.code === '200') {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        loadUsers()
      }
    } else {
      // add
      const res = await request.post('/admin/user', form)
      if (res.code === '200') {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        loadUsers()
      }
    }
  } catch (error) {
    // 错误在 request.js 已处理
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}
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

.search-box {
  display: flex;
  align-items: center;
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
