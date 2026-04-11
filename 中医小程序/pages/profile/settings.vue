<template>
  <div class="page-container">
    <div class="navbar">
      <div class="back-icon" @click="goBack"><i class="ri-arrow-left-s-line"></i></div>
      <div class="nav-title">设置</div>
      <div class="nav-right"></div>
    </div>
    
    <div class="settings-list">
      <div class="setting-item" @click="clearCache">
        <div class="setting-text">清理本地缓存</div>
        <div class="setting-value">{{ cacheSize }} <i class="ri-arrow-right-s-line"></i></div>
      </div>
      <div class="setting-item" @click="showAbout">
        <div class="setting-text">关于中医智能助手</div>
        <div class="setting-value">v1.0.0 <i class="ri-arrow-right-s-line"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cacheSize: '2.4MB'
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    clearCache() {
      uni.showModal({
        title: '提示',
        content: '确定要清理本地缓存吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '清理中...' });
            setTimeout(() => {
              uni.hideLoading();
              this.cacheSize = '0KB';
              uni.showToast({ title: '清理成功' });
            }, 800);
          }
        }
      });
    },
    showAbout() {
      uni.showModal({
        title: '关于',
        content: '中医智能助手 v1.0.0\n提供问诊、面诊、舌诊与体质测评服务。',
        showCancel: false
      });
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #F7F5F0;
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", "Kaiti SC", serif;
  color: #333;
}

.navbar {
  background: rgba(247, 245, 240, 0.95);
  padding: 12px 20px;
  padding-top: calc(44px + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(139, 90, 43, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title { font-size: 18px; font-weight: 600; flex: 1; text-align: center; }
.back-icon { font-size: 24px; color: #555; width: 40px; }
.nav-right { width: 40px; }

.settings-list {
  margin-top: 20px;
  background: #fff;
  border-top: 1px solid #E8E0D5;
  border-bottom: 1px solid #E8E0D5;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #F5F0EB;
  cursor: pointer;
  background: #fff;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:active {
  background: #F9F7F2;
}

.setting-text {
  font-size: 16px;
  color: #333;
}

.setting-value {
  font-size: 14px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.setting-value i {
  font-size: 18px;
  color: #CCC;
}
</style>
