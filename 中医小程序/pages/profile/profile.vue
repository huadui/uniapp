<template>
  <div class="profile-container">
    <!-- 头部区域 -->
    <div class="header">
      <div class="user-info">
        <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar-img" mode="aspectFill"></image>
          <div v-else class="avatar-placeholder"><i class="ri-user-line"></i></div>
        </button>
        <div class="info-text">
          <input type="nickname" class="nickname-input" :value="userInfo.nickname" @change="onInputNickname" @blur="onInputNickname" placeholder="点击获取微信昵称" />
        </div>
      </div>
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-num">{{ stats.inquiry }}</div>
          <div class="stat-label">问诊</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">{{ stats.face }}</div>
          <div class="stat-label">面诊</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">{{ stats.tongue }}</div>
          <div class="stat-label">舌诊</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">{{ stats.constitution }}</div>
          <div class="stat-label">体质报告</div>
        </div>
      </div>
    </div>

    <div class="menu-group">
      <div class="menu-item" @click="navTo('/pages/profile/settings')">
        <div class="menu-icon"><i class="ri-settings-4-line"></i></div>
        <div class="menu-text">设置</div>
        <div class="menu-arrow"><i class="ri-arrow-right-s-line"></i></div>
      </div>
      <button class="menu-item btn-menu" open-type="feedback">
        <div class="menu-icon"><i class="ri-question-line"></i></div>
        <div class="menu-text">帮助与反馈</div>
        <div class="menu-arrow"><i class="ri-arrow-right-s-line"></i></div>
      </button>
      <div class="menu-item" @click="navTo('/pages/profile/privacy')">
        <div class="menu-icon"><i class="ri-shield-check-line"></i></div>
        <div class="menu-text">隐私政策</div>
        <div class="menu-arrow"><i class="ri-arrow-right-s-line"></i></div>
      </div>
    </div>

    <div class="logout-btn" @click="handleLogout">退出登录</div>

    <!-- 底部 Tab -->
    <div class="tabbar">
      <div class="tab-item" @click="switchTab('/pages/index/index')">
        <div class="tab-icon"><i class="ri-home-smile-2-line"></i></div>
        <div class="tab-text">医馆</div>
      </div>
      <div class="tab-item" @click="switchTab('/pages/history/history')">
        <div class="tab-icon"><i class="ri-history-line"></i></div>
        <div class="tab-text">医案</div>
      </div>
      <div class="tab-item active">
        <div class="tab-icon"><i class="ri-user-3-line"></i></div>
        <div class="tab-text">我的</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistoryList } from '@/api/history.js';

export default {
  data() {
    return {
      stats: {
        inquiry: 0,
        face: 0,
        tongue: 0,
        constitution: 0
      },
      userInfo: {
        avatar: '',
        nickname: ''
      }
    }
  },
  onShow() {
    this.loadUserInfo();
    this.fetchStats();
  },
  methods: {
    loadUserInfo() {
      const info = uni.getStorageSync('userInfo') || {};
      this.userInfo = {
        ...info,
        avatar: info.avatar || '',
        nickname: info.nickname || ''
      };
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail;
      this.userInfo.avatar = avatarUrl;
      this.saveUserInfo();
    },
    onInputNickname(e) {
      const { value } = e.detail;
      if (value) {
        this.userInfo.nickname = value;
        this.saveUserInfo();
      }
    },
    saveUserInfo() {
      const info = uni.getStorageSync('userInfo') || {};
      const newInfo = { ...info, avatar: this.userInfo.avatar, nickname: this.userInfo.nickname };
      uni.setStorageSync('userInfo', newInfo);
    },
    fetchStats() {
      const userInfo = uni.getStorageSync('userInfo');
      const userId = userInfo && userInfo.id;

      if (!userId) {
        this.stats = {
          inquiry: 0,
          face: 0,
          tongue: 0,
          constitution: 0
        };
        return;
      }

      getHistoryList(userId)
        .then(res => {
          const nextStats = {
            inquiry: 0,
            face: 0,
            tongue: 0,
            constitution: 0
          };

          const list = Array.isArray(res.data) ? res.data : [];
          list.forEach(item => {
            if (item.type === 'inquiry') nextStats.inquiry += 1;
            if (item.type === 'face') nextStats.face += 1;
            if (item.type === 'tongue') nextStats.tongue += 1;
            if (item.type === 'constitution') nextStats.constitution += 1;
          });

          this.stats = nextStats;
        })
        .catch(() => {
          this.stats = {
            inquiry: 0,
            face: 0,
            tongue: 0,
            constitution: 0
          };
        });
    },
    switchTab(url) {
      uni.reLaunch({ url });
    },
    navTo(url) {
      if (!url) {
        uni.showToast({ title: '功能开发中', icon: 'none' });
        return;
      }
      uni.navigateTo({ url });
    },
    showToast(msg) {
      uni.showToast({ title: msg, icon: 'none' });
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.reLaunch({
              url: '/pages/login/login'
            });
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding-bottom: 90px;
  background-color: #F7F5F0;
  background-image: radial-gradient(#E8E6E1 1px, transparent 1px);
  background-size: 20px 20px;
  color: #4A4A4A;
  font-family: "PingFang SC", "Kaiti SC", serif;
}

/* 头部区域 */
.header {
  background: linear-gradient(180deg, #8B5A2B 0%, #A67B51 100%);
  padding: 30px 20px;
  padding-top: calc(60px + env(safe-area-inset-top));
  border-radius: 0 0 30px 30px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  color: #fff;
  box-shadow: 0 4px 20px rgba(139, 90, 43, 0.2);
}

/* 云纹装饰 */
.header::before {
  content: '';
  position: absolute;
  left: -20px; top: -20px;
  width: 150px; height: 150px;
  background: url('data:image/svg+xml;utf8,<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="none" stroke="white" stroke-opacity="0.1" stroke-width="20"/></svg>') no-repeat;
  background-size: contain;
  pointer-events: none;
}

.user-info { 
  display: flex; align-items: center; gap: 16px; margin-bottom: 24px; 
  position: relative; z-index: 2;
}

.avatar-btn {
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  flex-shrink: 0;
}
.avatar-btn::after {
  display: none;
}

.avatar-placeholder {
  width: 100%; height: 100%;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; color: #fff;
  box-sizing: border-box;
}

.avatar-img {
  width: 100%; height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4);
  box-sizing: border-box;
}

.info-text { flex: 1; }

.nickname-input {
  font-size: 20px; 
  font-weight: 600; 
  margin-bottom: 4px; 
  font-family: "Kaiti SC", "STKaiti", serif;
  background: transparent;
  color: #fff;
  border: none;
  outline: none;
  width: 100%;
  text-align: left;
}

.nickname-input::placeholder {
  color: rgba(255,255,255,0.7);
  font-size: 16px;
}

/* 数据统计卡片 */
.stats-card {
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(5px);
  display: flex;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255,255,255,0.2);
}

.stat-item { 
  flex: 1; 
  text-align: center; 
  position: relative; 
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0; top: 20%; bottom: 20%;
  width: 1px;
  background: rgba(255,255,255,0.2);
}

.stat-num { font-size: 20px; font-weight: 700; margin-bottom: 4px; font-family: "Times New Roman", serif; }
.stat-label { font-size: 12px; opacity: 0.9; font-family: "Kaiti SC", "STKaiti", serif; }

/* 菜单区域 */
.menu-group {
  background: #fff;
  border-radius: 16px;
  margin: 0 20px 24px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(139, 90, 43, 0.05);
  border: 1px solid #E8E0D5;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 20px 22px;
  border-bottom: 1px solid #F5F0EB;
  cursor: pointer;
  transition: background 0.2s;
}
.menu-item:last-child { border-bottom: none; }
.menu-item:active { background: #F9F7F2; }

/* 专门针对 button 的样式重置 */
.btn-menu {
  background-color: transparent;
  border: none;
  border-radius: 0;
  text-align: left;
  line-height: normal;
  margin: 0;
}
.btn-menu::after {
  display: none;
}

.menu-icon { 
  font-size: 22px; 
  color: #8B5A2B; 
  margin-right: 12px;
  display: flex; align-items: center;
}

.menu-text { 
  flex: 1; 
  font-size: 16px; 
  color: #333; 
  font-weight: 500;
}

.menu-arrow { 
  color: #CCC; 
  font-size: 20px;
}

/* 退出登录 */
.logout-btn {
  margin: 40px 20px;
  background: #fff;
  color: #C84C42;
  text-align: center;
  padding: 16px;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #E8E0D5;
  font-family: "Kaiti SC", "STKaiti", serif;
}

/* 底部 Tab */
.tabbar {
  position: fixed;
  bottom: 20px;
  left: 20px; right: 20px;
  height: 60px;
  background: #fff;
  border-radius: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.05);
  z-index: 100;
}

.tab-item {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #999;
  flex: 1; height: 100%;
}

.tab-item.active { color: #8B5A2B; }

.tab-icon { font-size: 24px; margin-bottom: 2px; }
.tab-text { font-size: 10px; font-weight: 500; }
</style>
