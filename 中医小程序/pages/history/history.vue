<template>
  <div class="history-container">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="nav-left" @click="goHome"><i class="ri-arrow-left-s-line"></i></div>
      <div class="nav-title">健康档案</div>
      <div class="nav-right"></div>
    </div>

    <!-- 过滤器 -->
    <div class="filter-tabs">
      <div class="tab-item" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">全部</div>
      <div class="tab-item" :class="{ active: currentFilter === 'constitution' }" @click="setFilter('constitution')">体质</div>
      <div class="tab-item" :class="{ active: currentFilter === 'tongue' }" @click="setFilter('tongue')">舌诊</div>
      <div class="tab-item" :class="{ active: currentFilter === 'face' }" @click="setFilter('face')">面诊</div>
      <div class="tab-item" :class="{ active: currentFilter === 'inquiry' }" @click="setFilter('inquiry')">问诊</div>
    </div>

    <!-- 列表内容 -->
    <scroll-view class="history-list" scroll-y="true" v-if="filteredList.length > 0">
      <div class="timeline">
        <div class="timeline-item" v-for="(item, index) in filteredList" :key="index" @click="goDetail(item)">
          
          <!-- 时间轴左侧 -->
          <div class="time-col">
            <div class="date">{{ formatDate(item.createTime, 'MM-dd') }}</div>
            <div class="year">{{ formatDate(item.createTime, 'yyyy') }}</div>
          </div>
          
          <!-- 轴线 -->
          <div class="line-col">
            <div class="dot" :class="item.type"></div>
            <div class="line" v-if="index < filteredList.length - 1"></div>
          </div>
          
          <!-- 内容卡片 -->
          <div class="card-col">
            <div class="history-card">
              <div class="card-header">
                <div class="tag" :class="item.type">{{ getTypeName(item.type) }}</div>
                <div class="time">{{ formatDate(item.createTime, 'HH:mm') }}</div>
              </div>
              
              <div class="card-body">
                <div class="main-info">
                  <div class="info-title">{{ item.summary || '未见异常' }}</div>
                  <div class="info-desc" v-if="item.tags">{{ item.tags }}</div>
                </div>
                <image v-if="item.imageUrl" :src="item.imageUrl" class="thumb-img" mode="aspectFill"></image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <div class="empty-icon"><i class="ri-file-list-3-line"></i></div>
      <div class="empty-text">暂无历史记录</div>
    </div>
  </div>
</template>

<script>
import { getHistoryList } from '@/api/history.js';

export default {
  data() {
    return {
      currentFilter: 'all',
      historyList: [],
      userInfo: null
    }
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo');
    if (this.userInfo) {
      this.fetchData();
    } else {
      // 提示登录
    }
  },
  computed: {
    filteredList() {
      if (this.currentFilter === 'all') {
        return this.historyList;
      }
      return this.historyList.filter(item => item.type === this.currentFilter);
    }
  },
  methods: {
    goHome() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }
    },
    setFilter(filter) {
      this.currentFilter = filter;
    },
    fetchData() {
      if (!this.userInfo || !this.userInfo.id) return;
      
      uni.showLoading({ title: '加载中...' });
      getHistoryList(this.userInfo.id)
        .then(res => {
          if (res.code === '200') {
            this.historyList = res.data;
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    getTypeName(type) {
      const map = {
        constitution: '体质辨识',
        tongue: '智能舌诊',
        face: '智能面诊',
        inquiry: '智能问诊'
      };
      return map[type] || '未知';
    },
    formatDate(dateStr, fmt) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (fmt === 'MM-dd') {
        return (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
      }
      if (fmt === 'yyyy') {
        return date.getFullYear();
      }
      if (fmt === 'HH:mm') {
        return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
      }
      return dateStr;
    },
    goDetail(item) {
      uni.setStorageSync('temp_history_data', item.fullData);
      
      let url = '';
      switch (item.type) {
        case 'constitution':
          try {
             const scores = item.fullData.scoresJson ? JSON.parse(item.fullData.scoresJson) : {};
             const resultData = {
               mainConstitution: item.fullData.mainConstitution,
               tendencyConstitution: item.fullData.tendencyConstitution,
               scores: scores,
               advice: item.fullData.advice
             };
             url = `/pages/constitution/result?data=${encodeURIComponent(JSON.stringify(resultData))}`;
          } catch(e) {
             console.error(e);
          }
          break;
          
        case 'tongue':
          url = `/pages/diagnosis/tongue?mode=history`;
          break;
          
        case 'face':
          url = `/pages/diagnosis/face?mode=history`;
          break;
          
        case 'inquiry':
          url = `/pages/symptom-chat/symptom-chat?mode=history`;
          break;
      }
      
      if (url) {
        uni.navigateTo({ url });
      }
    }
  }
}
</script>

<style scoped>
.history-container {
  min-height: 100vh;
  background-color: #F7F5F0;
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", "Kaiti SC", serif;
}

.navbar {
  background: rgba(247, 245, 240, 0.95);
  padding: 12px 16px;
  padding-top: calc(44px + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(139, 90, 43, 0.1);
}
.nav-title { flex: 1; text-align: center; font-size: 18px; font-weight: 600; color: #333; }
.nav-left { width: 40px; font-size: 24px; }
.nav-right { width: 40px; }

.filter-tabs {
  display: flex;
  background: #fff;
  padding: 10px 16px;
  position: sticky;
  top: calc(44px + 44px + env(safe-area-inset-top));
  z-index: 90;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.tab-item {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 6px 0;
  position: relative;
}

.tab-item.active {
  color: #8B5A2B;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #8B5A2B;
  border-radius: 1px;
}

.history-list {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  margin-bottom: 20px;
}

.time-col {
  width: 50px;
  text-align: right;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.date { font-size: 16px; font-weight: 600; color: #333; }
.year { font-size: 12px; color: #999; margin-top: 2px; }

.line-col {
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid #F7F5F0;
  z-index: 2;
  flex-shrink: 0;
}

.dot.constitution { background: #8B5A2B; }
.dot.tongue { background: #E57373; }
.dot.face { background: #FFB74D; }
.dot.inquiry { background: #64B5F6; }

.line {
  flex: 1;
  width: 1px;
  background: #E0E0E0;
  position: absolute;
  top: 10px;
  bottom: -20px;
  z-index: 1;
}

.card-col {
  flex: 1;
  padding-left: 10px;
}

.history-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(139, 90, 43, 0.05);
  border: 1px solid #E8E0D5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;
}

.tag.constitution { background: #8B5A2B; }
.tag.tongue { background: #E57373; }
.tag.face { background: #FFB74D; }
.tag.inquiry { background: #64B5F6; }

.time { font-size: 12px; color: #999; }

.card-body {
  display: flex;
  justify-content: space-between;
}

.main-info {
  flex: 1;
}

.info-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.info-desc {
  font-size: 13px;
  color: #666;
}

.thumb-img {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  margin-left: 10px;
  background: #eee;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  padding-top: 100px;
}

.empty-icon { font-size: 48px; margin-bottom: 10px; }
.empty-text { font-size: 14px; }
</style>
