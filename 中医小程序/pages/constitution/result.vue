<template>
  <div class="result-container">
    <div class="navbar">
      <div class="nav-left" @click="goHome"><i class="ri-home-4-line"></i></div>
      <div class="nav-title">辨识结果</div>
      <div class="nav-right"></div>
    </div>

    <div class="result-card">
      <div class="result-header">
        <text class="label">您的主体质</text>
        <text class="main-type">{{ result.mainConstitution || '未判定' }}</text>
      </div>
      
      <div class="tendency-section" v-if="result.tendencyConstitution">
        <text class="label">倾向体质：</text>
        <text class="tendency-type">{{ result.tendencyConstitution }}</text>
      </div>

      <div class="chart-box">
        <!-- 这里可以使用图表库，或者简单的条形图 -->
        <div class="chart-item" v-for="(score, type) in result.scores" :key="type">
          <div class="chart-label">{{ type }}</div>
          <div class="chart-bar-bg">
            <div class="chart-bar-fill" :style="{ width: Math.min(score, 100) + '%', backgroundColor: getBarColor(score) }"></div>
          </div>
          <div class="chart-value">{{ score.toFixed(1) }}</div>
        </div>
      </div>
    </div>

    <div class="advice-card">
      <div class="card-title">
        <i class="ri-lightbulb-flash-line"></i>
        <text>调理建议</text>
      </div>
      <text class="advice-content">{{ result.advice }}</text>
    </div>
    
    <div class="actions">
      <button class="btn btn-primary" @click="goHome">返回首页</button>
      <button class="btn btn-outline" @click="reTest">重新测试</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: {
        mainConstitution: '',
        tendencyConstitution: '',
        scores: {},
        advice: ''
      }
    };
  },
  onLoad(options) {
    if (options.data) {
      try {
        this.result = JSON.parse(decodeURIComponent(options.data));
      } catch (e) {
        console.error('解析结果失败', e);
      }
    }
  },
  methods: {
    getBarColor(score) {
      if (score >= 60) return '#4CAF50'; // 高分绿色 (对于偏颇体质其实是不好的，这里暂且用绿色表示程度)
      // 修正逻辑：偏颇体质分数越高越不好。
      // 平和质：分数越高越好。
      // 暂时统一用棕色系
      if (score >= 40) return '#D32F2F'; // 明显偏颇
      if (score >= 30) return '#FFA000'; // 倾向
      return '#8B5A2B';
    },
    goHome() {
      uni.reLaunch({ url: '/pages/index/index' });
    },
    reTest() {
      uni.redirectTo({ url: '/pages/constitution/test' });
    }
  }
}
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  background-color: #F7F5F0;
  padding-bottom: 40px;
  font-family: "PingFang SC", "Kaiti SC", serif;
}

.navbar {
  background: rgba(247, 245, 240, 0.95);
  padding: 12px 20px;
  padding-top: calc(44px + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-left { font-size: 24px; color: #555; width: 40px; }
.nav-title { font-size: 18px; font-weight: 600; color: #333; }
.nav-right { width: 40px; }

.result-card {
  margin: 20px;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(139, 90, 43, 0.08);
}

.result-header {
  text-align: center;
  margin-bottom: 16px;
}

.label {
  font-size: 14px;
  color: #888;
  display: block;
  margin-bottom: 8px;
}

.main-type {
  font-size: 28px;
  font-weight: bold;
  color: #8B5A2B;
}

.tendency-section {
  text-align: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: #666;
}

.chart-box {
  margin-top: 24px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.chart-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.chart-label {
  width: 60px;
  font-size: 13px;
  color: #555;
}

.chart-bar-bg {
  flex: 1;
  height: 10px;
  background: #F0F0F0;
  border-radius: 5px;
  margin: 0 12px;
  overflow: hidden;
}

.chart-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.chart-value {
  width: 40px;
  font-size: 12px;
  color: #888;
  text-align: right;
}

.advice-card {
  margin: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
}

.card-title i {
  color: #FBC02D;
  font-size: 20px;
}

.advice-content {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
}

.actions {
  display: flex;
  gap: 16px;
  padding: 0 20px;
  margin-top: 30px;
}

.btn {
  flex: 1;
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.btn-primary {
  background: #8B5A2B;
  color: #fff;
  box-shadow: 0 4px 12px rgba(139, 90, 43, 0.3);
}

.btn-outline {
  background: transparent;
  border: 1px solid #8B5A2B;
  color: #8B5A2B;
}
</style>
