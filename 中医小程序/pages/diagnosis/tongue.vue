<template>
  <div class="diag-container">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="back-icon" @click="goBack"><i class="ri-arrow-left-s-line"></i></div>
      <div class="nav-title">智能舌诊</div>
      <div class="nav-right"></div>
    </div>

    <!-- 拍摄引导区 -->
    <div class="camera-section" v-if="!resultData">
      <div class="camera-placeholder" @click="chooseImage">
        <div class="camera-mask">
          <!-- 模拟舌头轮廓 -->
          <div class="tongue-outline"></div>
        </div>
        <div class="camera-tips">
          <i class="ri-camera-lens-line"></i>
          <text>点击拍摄/上传舌象</text>
          <text class="sub-tip">请在光线充足处，伸出舌头，放松平展</text>
        </div>
        <image v-if="tempImage" :src="tempImage" class="preview-img" mode="aspectFill"></image>
      </div>
      
      <button class="action-btn" @click="startAnalyze" :disabled="!tempImage || isAnalyzing">
        {{ isAnalyzing ? '正在辨证...' : (tempImage ? '开始辨证' : '请先上传') }}
      </button>
    </div>

    <!-- 分析结果区 -->
    <div class="result-section" v-else>
      <div class="result-header">
        <div class="result-title">辨证报告</div>
        <div class="re-btn" @click="reset" v-if="!isHistoryMode">重新拍摄</div>
      </div>
      
      <div class="result-card">
        <div class="diag-row">
          <div class="diag-label">舌质</div>
          <div class="diag-val red">{{ resultData.tongueBody }}</div>
        </div>
        <div class="diag-row">
          <div class="diag-label">舌苔</div>
          <div class="diag-val yellow">{{ resultData.tongueCoating }}</div>
        </div>
        <div class="divider"></div>
        <div class="diagnosis-main">
          <div class="d-title">综合诊断：{{ resultData.diagnosis }}</div>
          <!-- 诊断详情/建议从 advice 字段提取或直接展示 -->
          <!-- 后端返回的 advice 可能包含建议，diagnosis 是结论 -->
        </div>
        
        <div class="suggestion-box">
          <div class="s-title"><i class="ri-leaf-line"></i> 调理建议</div>
          <div class="s-item" style="white-space: pre-wrap;">{{ resultData.advice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadTongueImage } from '@/api/diagnosis.js';

export default {
  data() {
    return {
      tempImage: '',
      resultData: null,
      isAnalyzing: false,
      isHistoryMode: false
    }
  },
  onLoad(options) {
    if (options.mode === 'history') {
      this.isHistoryMode = true;
      const historyData = uni.getStorageSync('temp_history_data');
      if (historyData) {
        // historyData is the full TongueDiagnosisRecord
        // We need to map it to resultData format expected by the template
        // template uses: tongueBody, tongueCoating, diagnosis, advice
        // record has: fullResultJson (string) which contains these
        if (historyData.fullResultJson) {
           try {
             this.resultData = JSON.parse(historyData.fullResultJson);
             this.tempImage = historyData.imageUrl;
           } catch(e) {
             console.error('Failed to parse history data', e);
           }
        }
      }
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
      if (!this.tempImage || this.isAnalyzing) return;
      
      this.isAnalyzing = true;
      uni.showLoading({ title: 'AI 辨证中...' });
      
      // 读取文件并转换为Base64
      uni.getFileSystemManager().readFile({
        filePath: this.tempImage,
        encoding: 'base64',
        success: (res) => {
          const base64 = 'data:image/jpeg;base64,' + res.data;
          
          // 获取当前用户ID
          const userInfo = uni.getStorageSync('userInfo');
          const userId = userInfo ? userInfo.id : null;
          
          uploadTongueImage(userId, base64)
            .then(res => {
              const data = res.data;
              if (data.valid === false) {
                uni.showModal({
                  title: '提示',
                  content: data.message || '未能识别到舌象，请重新拍摄',
                  showCancel: false,
                  confirmText: '我知道了',
                  confirmColor: '#8B5A2B'
                });
                this.resultData = null;
              } else {
                this.resultData = data;
              }
            })
            .catch(err => {
              console.error(err);
              uni.showToast({
                title: typeof err === 'string' ? err : '辨证失败，请重试',
                icon: 'none'
              });
            })
            .finally(() => {
              uni.hideLoading();
              this.isAnalyzing = false;
            });
        },
        fail: (err) => {
          console.error('Read file failed:', err);
          uni.showToast({ title: '图片读取失败', icon: 'none' });
          uni.hideLoading();
          this.isAnalyzing = false;
        }
      });
    },
    reset() {
      this.tempImage = '';
      this.resultData = null;
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

.tongue-outline {
  width: 160px;
  height: 240px;
  border: 2px solid rgba(255,255,255,0.6);
  border-radius: 80px 80px 60px 60px;
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

.diag-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eee;
}

.diag-label { color: #666; }
.diag-val { font-weight: 600; font-size: 16px; }
.diag-val.red { color: #C84C42; }
.diag-val.yellow { color: #B8860B; }

.divider { height: 1px; background: #eee; margin: 0 -24px 20px; }

.diagnosis-main { margin-bottom: 24px; }
.d-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 8px; }
.d-desc { font-size: 14px; color: #555; line-height: 1.6; }

.suggestion-box {
  background: #F9F7F2;
  padding: 16px;
  border-radius: 8px;
}

.s-title { font-weight: bold; color: #5D7A69; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.s-item { font-size: 13px; color: #666; line-height: 1.8; }
</style>
