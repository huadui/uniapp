<template>
  <div class="diag-container">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="back-icon" @click="goBack"><i class="ri-arrow-left-s-line"></i></div>
      <div class="nav-title">望面察色</div>
      <div class="nav-right"></div>
    </div>

    <!-- 拍摄引导区 -->
    <div class="camera-section" v-if="!result">
      <div class="camera-placeholder" @click="chooseImage">
        <div class="camera-mask">
          <!-- 模拟人脸轮廓 -->
          <div class="face-outline"></div>
        </div>
        <div class="camera-tips">
          <i class="ri-emotion-line"></i>
          <text>点击拍摄/上传面相</text>
          <text class="sub-tip">请保持素颜，光线均匀，正对镜头</text>
        </div>
        <image v-if="tempImage" :src="tempImage" class="preview-img" mode="aspectFill"></image>
      </div>
      
      <button class="action-btn" @click="startAnalyze" :disabled="!tempImage">
        {{ tempImage ? '开始分析' : '请先上传' }}
      </button>
    </div>

    <!-- 分析结果区 -->
    <div class="result-section" v-else>
      <div class="result-header">
        <div class="result-title">面诊报告</div>
        <div class="re-btn" @click="reset">重新检测</div>
      </div>
      
      <div class="result-card">
        <div class="face-feature">
          <div class="feature-item">
            <div class="f-label">面色</div>
            <div class="f-val">萎黄</div>
          </div>
          <div class="feature-item">
            <div class="f-label">光泽</div>
            <div class="f-val">少华</div>
          </div>
          <div class="feature-item">
            <div class="f-label">神态</div>
            <div class="f-val">疲惫</div>
          </div>
        </div>
        
        <div class="diagnosis-main">
          <div class="d-title">综合诊断：脾胃气虚</div>
          <div class="d-desc">面色萎黄无华，神疲乏力，多为脾胃虚弱，气血生化不足所致。</div>
        </div>
        
        <div class="organ-status">
          <div class="organ-title">脏腑状况</div>
          <div class="organ-grid">
            <div class="organ-item status-ok">
              <div class="o-name">心</div>
              <div class="o-dot"></div>
            </div>
            <div class="organ-item status-ok">
              <div class="o-name">肝</div>
              <div class="o-dot"></div>
            </div>
            <div class="organ-item status-warn">
              <div class="o-name">脾</div>
              <div class="o-dot"></div>
            </div>
            <div class="organ-item status-ok">
              <div class="o-name">肺</div>
              <div class="o-dot"></div>
            </div>
            <div class="organ-item status-ok">
              <div class="o-name">肾</div>
              <div class="o-dot"></div>
            </div>
          </div>
        </div>
        
        <div class="suggestion-box">
          <div class="s-title"><i class="ri-cup-line"></i> 养生建议</div>
          <div class="s-item">1. 规律饮食，细嚼慢咽，七分饱。</div>
          <div class="s-item">2. 推荐药膳：黄芪炖鸡，补中益气。</div>
          <div class="s-item">3. 避免过度思虑，保持心情舒畅。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tempImage: '',
      result: null
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.tempImage = res.tempFilePaths[0];
        }
      });
    },
    startAnalyze() {
      if (!this.tempImage) return;
      
      uni.showLoading({ title: '面诊分析中...' });
      
      // 模拟 API 延迟
      setTimeout(() => {
        uni.hideLoading();
        this.result = true; // 显示结果
      }, 2000);
    },
    reset() {
      this.tempImage = '';
      this.result = null;
    }
  }
}
</script>

<style scoped>
.diag-container {
  min-height: 100vh;
  background-color: #F7F5F0;
  font-family: "PingFang SC", "Kaiti SC", serif;
  display: flex;
  flex-direction: column;
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
}
.nav-title { flex: 1; text-align: center; font-size: 18px; font-weight: 600; color: #333; }
.back-icon { width: 40px; font-size: 24px; }
.nav-right { width: 40px; }

/* 拍摄区 */
.camera-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
  justify-content: center;
}

.camera-placeholder {
  width: 280px;
  height: 380px;
  background: #E8E0D5;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  border: 2px dashed #C8B8A8;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
}

.camera-mask {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.1);
  pointer-events: none;
  z-index: 1;
}

.face-outline {
  width: 180px;
  height: 240px;
  border: 2px solid rgba(255,255,255,0.6);
  border-radius: 50%;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.camera-tips {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8B5A2B;
  z-index: 2;
}

.camera-tips i { font-size: 48px; margin-bottom: 12px; }
.sub-tip { font-size: 12px; opacity: 0.7; margin-top: 8px; max-width: 80%; text-align: center; }

.preview-img {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
}

.action-btn {
  width: 80%;
  height: 50px;
  background: #8B5A2B;
  color: #fff;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(139, 90, 43, 0.3);
}
.action-btn[disabled] { background: #D8D0C5; box-shadow: none; }

/* 结果区 */
.result-section {
  padding: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-title { font-size: 20px; font-weight: 600; color: #333; }
.re-btn { font-size: 14px; color: #8B5A2B; border: 1px solid #8B5A2B; padding: 4px 12px; border-radius: 15px; }

.result-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(139, 90, 43, 0.08);
}

.face-feature {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 16px;
  background: #FBF5E6;
  border-radius: 8px;
}

.feature-item { text-align: center; }
.f-label { font-size: 12px; color: #888; margin-bottom: 4px; }
.f-val { font-size: 16px; font-weight: 600; color: #333; }

.diagnosis-main { margin-bottom: 24px; }
.d-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 8px; }
.d-desc { font-size: 14px; color: #555; line-height: 1.6; }

.organ-status { margin-bottom: 24px; }
.organ-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
.organ-grid { display: flex; justify-content: space-between; }
.organ-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.o-name { font-size: 12px; color: #666; }
.o-dot { width: 8px; height: 8px; border-radius: 50%; }

.status-ok .o-dot { background: #5D7A69; }
.status-warn .o-dot { background: #B8860B; box-shadow: 0 0 4px #B8860B; }

.suggestion-box {
  background: #F9F7F2;
  padding: 16px;
  border-radius: 8px;
}

.s-title { font-weight: bold; color: #5D7A69; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.s-item { font-size: 13px; color: #666; line-height: 1.8; }
</style>
