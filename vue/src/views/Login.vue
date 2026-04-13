<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="login-header">
          <h2>中医小程序后台管理</h2>
        </div>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0px">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入管理员账号"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import request from '../utils/request'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await request.post('/admin/sysAdmin/login', loginForm)
        if (res.code === '200') {
          ElMessage.success('登录成功')
          localStorage.setItem('adminInfo', JSON.stringify(res.data))
          router.push('/')
        }
      } catch (error) {
        // 错误提示已经在 request.js 拦截器中处理
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)),
    url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop'); /* Misty mountains */
  background-size: cover;
  background-position: center;
}

.login-card {
  width: 420px;
  background: rgba(253, 251, 247, 0.95); /* Rice paper color */
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-shadow: 0 8px 24px rgba(62, 39, 35, 0.15);
}

.login-header {
  text-align: center;
  padding: 10px 0;
  border-bottom: 2px solid #884A39; /* Chinese Red underline */
  margin-bottom: 20px;
}

.login-header h2 {
  margin: 0;
  color: #3E2723; /* Dark Wood */
  font-size: 28px;
  font-family: "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "SimSun", serif; /* Calligraphy style fonts */
  font-weight: bold;
  letter-spacing: 2px;
}

.login-button {
  width: 100%;
  background-color: #884A39; /* Chinese Red */
  border-color: #884A39;
  font-size: 16px;
  letter-spacing: 4px;
}

.login-button:hover {
  background-color: #A65D4B;
  border-color: #A65D4B;
}

/* Customizing Element Plus Input focus color to match theme */
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #884A39 inset !important;
}
</style>
