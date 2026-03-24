<template>
  <div class="test-container">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="nav-left" @click="goBack"><i class="ri-arrow-left-s-line"></i></div>
      <div class="nav-title">体质辨识 ({{ questions.length }}题)</div>
      <div class="nav-right"></div>
    </div>

    <!-- 进度区域 -->
    <div class="progress-container">
      <div class="progress-info">
        <text>当前进度</text>
        <text>{{ currentIndex + 1 }} / {{ questions.length }}</text>
      </div>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="content">
      <div class="question-card" v-if="currentQuestion">
        <div class="q-tag">{{ currentQuestion.type }}</div>
        <div class="q-text">{{ currentQuestion.text }}</div>
        
        <div class="options">
          <div class="option-item" 
               v-for="(opt, idx) in options" 
               :key="idx"
               :class="{ selected: selectedValue === opt.score }"
               @click="selectOption(opt.score)">
            <text>{{ opt.label }}</text>
            <div class="radio-icon"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="actions-bar">
      <button class="btn btn-prev" @click="prevQuestion" :disabled="currentIndex === 0">上一题</button>
      <button class="btn btn-next" @click="nextQuestion">
        {{ currentIndex === questions.length - 1 ? '提交' : '下一题' }}
      </button>
    </div>
  </div>
</template>

<script>
import { answerOptions, constitutionQuestions } from '@/data/questions.js';
import { submitConstitutionTest } from '@/api/constitution.js';

export default {
  data() {
    return {
      currentIndex: 0,
      selectedValue: null,
      answers: {}, // 存储答案 key: questionId, value: score
      options: answerOptions,
      questions: constitutionQuestions
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex];
    },
    progressPercentage() {
      return ((this.currentIndex + 1) / this.questions.length) * 100;
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    selectOption(val) {
      this.selectedValue = val;
      // 使用 Vue.set 确保响应式
      this.$set(this.answers, this.currentQuestion.id, val);
      
      // 自动跳转下一题
      setTimeout(() => {
        if (this.currentIndex < this.questions.length - 1) {
          this.nextQuestion();
        }
      }, 200);
    },
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        const prevQId = this.questions[this.currentIndex].id;
        this.selectedValue = this.answers[prevQId] || null;
      }
    },
    nextQuestion() {
      const currentQId = this.questions[this.currentIndex].id;
      if (!this.answers[currentQId]) {
        uni.showToast({ title: '请选择一个选项', icon: 'none' });
        return;
      }

      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        const nextQId = this.questions[this.currentIndex].id;
        this.selectedValue = this.answers[nextQId] || null;
      } else {
        this.submitTest();
      }
    },
    submitTest() {
      uni.showLoading({ title: '分析中...' });
      
      // 获取当前用户ID
      const userInfo = uni.getStorageSync('userInfo');
      const userId = userInfo ? userInfo.id : null;
      
      submitConstitutionTest(userId, this.answers)
        .then(res => {
          uni.hideLoading();
          if (res.code === '200') {
             uni.redirectTo({
               url: '/pages/constitution/result?data=' + encodeURIComponent(JSON.stringify(res.data))
             });
          } else {
            uni.showToast({ title: res.msg || '分析失败', icon: 'none' });
          }
        })
        .catch(err => {
          uni.hideLoading();
          console.error(err);
          uni.showToast({ title: '网络请求失败', icon: 'none' });
        });
    }
  }
}
</script>

<style scoped>
.test-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F7F5F0;
  background-image: radial-gradient(#E8E6E1 1px, transparent 1px);
  background-size: 20px 20px;
  color: #333;
  font-family: "PingFang SC", "Kaiti SC", serif;
}

/* 顶部导航 */
.navbar {
  background: rgba(247, 245, 240, 0.95);
  padding: 12px 20px;
  padding-top: calc(44px + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E8E0D5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left { font-size: 24px; color: #555; width: 40px;}
.nav-title { font-size: 18px; font-weight: 600; color: #333; }
.nav-right { width: 40px; }

/* 进度区域 */
.progress-container {
  padding: 20px 24px;
  padding-bottom: 10px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
  font-family: "PingFang SC", sans-serif;
}

.progress-track {
  height: 8px;
  background: #E8E0D5;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(139, 90, 43, 0.1);
}

.progress-bar {
  height: 100%;
  background: #8B5A2B;
  width: 30%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 主要内容区 */
.content {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
}

/* 问题卡片 */
.question-card {
  background: #FFFEFA;
  border-radius: 12px;
  padding: 30px 24px;
  box-shadow: 0 4px 16px rgba(139, 90, 43, 0.08);
  border: 1px solid #E8E0D5;
  margin-bottom: 20px;
  position: relative;
}

.question-card::before {
  content: '';
  position: absolute;
  top: 6px; left: 6px; right: 6px; bottom: 6px;
  border: 1px solid rgba(139, 90, 43, 0.1);
  border-radius: 8px;
  pointer-events: none;
}

.q-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #FBF5E6;
  color: #8B5A2B;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(139, 90, 43, 0.2);
}

.q-text {
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
  line-height: 1.6;
  margin-bottom: 32px;
}

/* 选项列表 */
.options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-item {
  position: relative;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #E0D8CE;
  border-radius: 8px;
  font-size: 16px;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
}

.option-item:active { background: #F9F7F2; }

.option-item.selected {
  border-color: #8B5A2B;
  background: #FBF5E6;
  color: #8B5A2B;
  font-weight: 600;
}

.radio-icon {
  width: 20px; height: 20px;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.option-item.selected .radio-icon {
  border-color: #8B5A2B;
  background: #8B5A2B;
  color: #fff;
}

.radio-icon::after { content: ''; }
.option-item.selected .radio-icon::after { content: '✓'; font-size: 12px; }

/* 底部按钮 */
.actions-bar {
  background: rgba(255, 255, 255, 0.9);
  padding: 16px 24px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid #E8E0D5;
  display: flex;
  gap: 16px;
}

.btn {
  flex: 1;
  height: 50px;
  border-radius: 25px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  font-family: "PingFang SC", sans-serif;
  display: flex; align-items: center; justify-content: center;
}

.btn-prev {
  background: #F0EBE5;
  color: #666;
  border: 1px solid #E0D8CE;
}

.btn-next {
  background: #8B5A2B;
  color: #fff;
  box-shadow: 0 4px 12px rgba(139, 90, 43, 0.3);
}
</style>
