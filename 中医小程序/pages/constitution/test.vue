<template>
  <div class="test-container">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="nav-left" @click="goBack"><i class="ri-arrow-left-s-line"></i></div>
      <div class="nav-title">体质辨识</div>
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
        <div class="q-tag">{{ currentQuestion.tag }}</div>
        <div class="q-text">{{ currentQuestion.text }}</div>
        
        <div class="options">
          <div class="option-item" 
               v-for="(opt, idx) in options" 
               :key="idx"
               :class="{ selected: selectedValue === opt.value }"
               @click="selectOption(opt.value)">
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
export default {
  data() {
    return {
      currentIndex: 0,
      selectedValue: null,
      answers: {}, // 存储答案
      options: [
        { label: '没有 (根本不)', value: 1 },
        { label: '很少 (有一点)', value: 2 },
        { label: '有时 (有些)', value: 3 },
        { label: '经常 (相当)', value: 4 },
        { label: '总是 (非常)', value: 5 }
      ],
      questions: [
        { id: 1, tag: '气虚相关', text: '您是否容易感到疲乏，精神不振，且稍微活动后就容易出汗？' },
        { id: 2, tag: '阳虚相关', text: '您手脚发凉吗？' },
        { id: 3, tag: '阴虚相关', text: '您感到口干咽燥、总想喝水吗？' },
        { id: 4, tag: '痰湿相关', text: '您感到胸闷或腹部胀满吗？' },
        { id: 5, tag: '湿热相关', text: '您面部或鼻部有油腻感或者油亮发光吗？' },
        { id: 6, tag: '血瘀相关', text: '您的皮肤在不知不觉中会出现青紫瘀斑（皮下出血）吗？' },
        { id: 7, tag: '气郁相关', text: '您感到闷闷不乐、情绪低沉吗？' },
        { id: 8, tag: '特禀相关', text: '您容易过敏（对药物、食物、气味、花粉或在季节交替、气候变化时）吗？' },
        { id: 9, tag: '平和相关', text: '您精力充沛吗？' },
        { id: 10, tag: '综合评估', text: '您容易忘事（健忘）吗？' }
      ]
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
      this.$set(this.answers, this.currentIndex, val);
    },
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.selectedValue = this.answers[this.currentIndex] || null;
      }
    },
    nextQuestion() {
      if (!this.selectedValue) {
        uni.showToast({ title: '请选择一个选项', icon: 'none' });
        return;
      }

      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.selectedValue = this.answers[this.currentIndex] || null;
      } else {
        this.submitTest();
      }
    },
    submitTest() {
      uni.showLoading({ title: '分析中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showModal({
          title: '辨识结果',
          content: '初步判定您为「气虚质」兼「湿热质」。建议调理脾胃，清热祛湿。',
          showCancel: false,
          success: () => {
            uni.navigateBack();
          }
        });
      }, 1500);
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
