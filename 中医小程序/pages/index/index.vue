<template>
  <div class="home-container">
    <!-- 顶部 Header -->
    <div class="header">
      <div class="user-row">
        <div class="greeting-box">
          <div class="greeting-time">乙巳年 · 十月廿三</div>
          <div class="greeting-text">早安，顺时而养</div>
        </div>
        <div class="avatar">
          <i class="ri-user-line"></i>
        </div>
      </div>

      <!-- 节气卡片 -->
      <div class="solar-card">
        <div class="solar-icon">
          <text class="solar-name">小雪</text>
          <text class="solar-date">11.22</text>
        </div>
        <div class="solar-info">
          <div class="solar-tip">气寒将雪，地气闭藏</div>
          <div class="solar-desc">宜：温补益肾，多食黑芝麻、羊肉</div>
        </div>
      </div>
    </div>

    <!-- 功能网格 -->
    <div class="grid-section">
      <div class="grid-container">
        <!-- 症状问答 -->
        <div class="feature-card" @click="navTo('/pages/symptom-chat/symptom-chat')">
          <div class="corner-deco top-left"></div>
          <div class="corner-deco top-right"></div>
          <div class="corner-deco bottom-left"></div>
          <div class="corner-deco bottom-right"></div>
          <div class="card-icon-box bg-ink"><i class="ri-question-answer-line"></i></div>
          <div class="card-title">问诊脉络</div>
          <div class="card-desc">智能辨证施治</div>
        </div>

        <!-- 舌象识别 -->
        <div class="feature-card" @click="navTo('/pages/diagnosis/tongue')">
          <div class="corner-deco top-left"></div><div class="corner-deco top-right"></div><div class="corner-deco bottom-left"></div><div class="corner-deco bottom-right"></div>
          <div class="card-icon-box bg-red"><i class="ri-camera-lens-line"></i></div>
          <div class="card-title">观舌知病</div>
          <div class="card-desc">舌苔色泽分析</div>
        </div>

        <!-- 面相识别 -->
        <div class="feature-card" @click="navTo('/pages/diagnosis/face')">
          <div class="corner-deco top-left"></div><div class="corner-deco top-right"></div><div class="corner-deco bottom-left"></div><div class="corner-deco bottom-right"></div>
          <div class="card-icon-box bg-gold"><i class="ri-emotion-line"></i></div>
          <div class="card-title">望面察色</div>
          <div class="card-desc">气色神态诊断</div>
        </div>

        <!-- 体质评估 -->
        <div class="feature-card" @click="navTo('/pages/constitution/test')">
          <div class="corner-deco top-left"></div><div class="corner-deco top-right"></div><div class="corner-deco bottom-left"></div><div class="corner-deco bottom-right"></div>
          <div class="card-icon-box bg-green"><i class="ri-file-list-3-line"></i></div>
          <div class="card-title">辨体养生</div>
          <div class="card-desc">九种体质测评</div>
        </div>
      </div>
    </div>

    <!-- 每日精选 -->
    <div class="section-header">
      <div class="section-mark"></div>
      <div class="section-title">医道传承</div>
    </div>

    <div class="article-list">
      <div class="article-item">
        <div class="article-thumb">
          <i class="ri-cup-line"></i>
        </div>
        <div class="article-info">
          <div class="article-title">秋冬进补，这三道药膳最养人</div>
          <div class="article-tags">
            <div class="tag">食疗</div>
            <div class="tag">节气</div>
          </div>
        </div>
      </div>
      <div class="article-item">
        <div class="article-thumb">
          <i class="ri-book-open-line"></i>
        </div>
        <div class="article-info">
          <div class="article-title">《黄帝内经》中的睡眠智慧</div>
          <div class="article-tags">
            <div class="tag">经典</div>
            <div class="tag">养生</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 Tab (自定义) -->
    <div class="tabbar">
      <div class="tab-item active">
        <div class="tab-icon"><i class="ri-home-smile-2-line"></i></div>
        <div class="tab-text">医馆</div>
      </div>
      <div class="tab-item" @click="switchTab('/pages/history/history')">
        <div class="tab-icon"><i class="ri-history-line"></i></div>
        <div class="tab-text">医案</div>
      </div>
      <div class="tab-item" @click="switchTab('/pages/profile/profile')">
        <div class="tab-icon"><i class="ri-user-3-line"></i></div>
        <div class="tab-text">我的</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    navTo(url) {
      uni.navigateTo({ url });
    },
    switchTab(url) {
      uni.reLaunch({ url });
    },
    showToast(msg) {
      uni.showToast({
        title: msg,
        icon: 'none'
      });
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  background-color: #F7F5F0;
  background-image: radial-gradient(#E8E6E1 1px, transparent 1px); /* 模拟纸张纹理 */
  background-size: 20px 20px;
  padding-bottom: 90px;
  color: #4A4A4A;
}

/* 顶部区域 - 新中式风格 */
.header {
  background: linear-gradient(180deg, #8B5A2B 0%, #A67B51 100%);
  padding: 20px;
  padding-top: calc(60px + env(safe-area-inset-top));
  border-radius: 0 0 30px 30px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(139, 90, 43, 0.2);
}

/* 云纹装饰背景 */
.header::after {
  content: '';
  position: absolute;
  right: -20px;
  bottom: -40px;
  width: 200px;
  height: 200px;
  background: url('data:image/svg+xml;utf8,<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="%23ffffff" fill-opacity="0.1" d="M45.7,123.5c-10.2,0-18.5-8.3-18.5-18.5s8.3-18.5,18.5-18.5c3.2,0,6.2,0.8,8.9,2.3c2.5-9.7,11.3-16.8,21.7-16.8 c12.4,0,22.5,10.1,22.5,22.5c0,1.2-0.1,2.4-0.3,3.5c8.5,2.3,14.8,10,14.8,19.2c0,11-8.9,19.9-19.9,19.9H45.7z"/></svg>') no-repeat;
  background-size: contain;
  opacity: 0.6;
  pointer-events: none;
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 2;
}

.greeting-box { color: #fff; }
.greeting-time { font-size: 14px; opacity: 0.9; font-family: "Kaiti SC", "STKaiti", serif; }
.greeting-text { font-size: 22px; font-weight: 600; margin-top: 4px; }

.avatar { 
  width: 48px; height: 48px; 
  background: rgba(255,255,255,0.2); 
  border: 2px solid rgba(255,255,255,0.4); 
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 24px;
}

/* 节气卡片 */
.solar-card {
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 2;
}

.solar-icon {
  width: 44px; height: 44px;
  background: #8B5A2B;
  color: #fff;
  border-radius: 8px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  font-family: "Kaiti SC", "STKaiti", serif;
  line-height: 1.1;
  box-shadow: 0 2px 8px rgba(139, 90, 43, 0.3);
}
.solar-name { font-size: 16px; font-weight: bold; }
.solar-date { font-size: 10px; opacity: 0.8; }

.solar-info { flex: 1; }
.solar-tip { font-size: 14px; color: #555; font-weight: 500; margin-bottom: 4px; }
.solar-desc { font-size: 12px; color: #888; }

/* 功能网格 - 卷轴式设计 */
.grid-section {
  padding: 24px 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(139, 90, 43, 0.08);
  position: relative;
  border: 1px solid rgba(139, 90, 43, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s;
}

.feature-card:active { transform: scale(0.98); }

/* 边角装饰 */
.corner-deco {
  position: absolute;
  width: 12px; height: 12px;
  border: 2px solid #8B5A2B;
  opacity: 0.3;
}
.top-left { top: 8px; left: 8px; border-right: none; border-bottom: none; }
.top-right { top: 8px; right: 8px; border-left: none; border-bottom: none; }
.bottom-left { bottom: 8px; left: 8px; border-right: none; border-top: none; }
.bottom-right { bottom: 8px; right: 8px; border-left: none; border-top: none; }

.card-icon-box {
  width: 56px; height: 56px;
  border-radius: 50%;
  margin-bottom: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px;
}

.bg-ink { background: #F0EBE5; color: #4A4A4A; } /* 墨灰 */
.bg-red { background: #FBE8E6; color: #C84C42; } /* 丹红 */
.bg-green { background: #E9F0EA; color: #5D7A69; } /* 竹青 */
.bg-gold { background: #FBF5E6; color: #B8860B; } /* 藤黄 */

.card-title { 
  font-size: 16px; 
  font-weight: bold; 
  color: #333; 
  font-family: "Kaiti SC", "STKaiti", serif; 
  margin-bottom: 4px;
}
.card-desc { font-size: 12px; color: #999; }

/* 每日精选 */
.section-header {
  padding: 0 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-mark {
  width: 4px; height: 18px;
  background: #8B5A2B;
  border-radius: 2px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  font-family: "Kaiti SC", "STKaiti", serif;
  color: #333;
}

.article-list { padding: 0 20px; }

.article-item {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(139, 90, 43, 0.08);
  border-left: 3px solid transparent;
}

.article-item:active { border-left-color: #8B5A2B; background: #f9f9f9; }

.article-thumb {
  width: 80px; height: 80px;
  background: #eee;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: #D8D0C5; 
  color: #8B5A2B;
}

.article-thumb img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }

.article-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.article-title { font-size: 15px; font-weight: 600; line-height: 1.5; color: #333; }
.article-tags { display: flex; gap: 8px; }
.tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #F5F5F5; color: #888; }

/* 底部导航 - 悬浮式 */
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
