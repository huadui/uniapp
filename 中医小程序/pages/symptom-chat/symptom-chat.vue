<template>
  <div class="chat-container">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="back-icon" @click="goBack"><i class="ri-arrow-left-s-line"></i></div>
      <div class="nav-title">问诊脉络</div>
      <div class="nav-right"></div>
    </div>

    <!-- 聊天区域 -->
    <scroll-view class="chat-area" scroll-y="true" :scroll-top="scrollTop" :scroll-into-view="scrollIntoView">
      <div class="chat-inner">
        <div v-for="(msg, index) in messages" :key="index" :id="'msg-' + index" 
             class="message" :class="msg.type">
          <div class="avatar" :class="msg.type">{{ msg.type === 'ai' ? '医' : '患' }}</div>
          <div class="bubble">
            <text>{{ msg.text }}</text>
            
            <!-- 结构化分析卡片 (仅 AI 且有 card 数据时显示) -->
            <div v-if="msg.card" class="analysis-card">
              <div v-if="msg.card.tags" class="tag-group">
                <div v-for="(tag, tIdx) in msg.card.tags" :key="tIdx" 
                     class="tag" :class="tIdx === 0 ? 't1' : 't2'">{{ tag }}</div>
              </div>
              <div v-if="msg.card.title" class="advice-title" v-html="msg.card.title"></div>
              <div v-if="msg.card.content" class="advice-content">{{ msg.card.content }}</div>
              
              <!-- 复合内容支持 -->
              <template v-if="msg.card.sections">
                <div v-for="(sec, sIdx) in msg.card.sections" :key="sIdx">
                  <div class="divider" v-if="sIdx > 0 || msg.card.tags"></div>
                  <div class="advice-title"><i :class="sec.icon"></i> {{ sec.title }}</div>
                  <div class="advice-content">{{ sec.content }}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>

    <!-- 底部输入区 -->
    <div class="input-area">
      <scroll-view class="quick-tags" scroll-x="true" show-scrollbar="false">
        <div class="quick-tag-list">
          <div class="quick-tag" v-for="(tag, index) in quickTags" :key="index" @click="sendText(tag)">{{ tag }}</div>
        </div>
      </scroll-view>
      
      <div class="input-box">
        <input type="text" class="text-input" v-model="inputText" placeholder="请描述您的症状..." @confirm="sendMsg" />
        <div class="send-btn" @click="sendMsg"><i class="ri-send-plane-fill"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendChat } from '@/api/chat.js';

export default {
  data() {
    return {
      scrollTop: 0,
      scrollIntoView: '',
      inputText: '',
      isLoading: false,
      quickTags: ['失眠多梦', '心烦易怒', '手足冰凉', '食欲不振'],
      messages: [
        {
          type: 'ai',
          text: '阁下安好。吾乃智能中医助手。请详述身体不适之处，或上传舌象、面相照片，吾将为您辨证施治。',
          card: {
            title: '问诊示例：',
            content: '"近来夜寐不安，心烦易怒，口苦咽干，不知何故？"'
          }
        }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    sendText(text) {
      this.inputText = text;
      this.sendMsg();
    },
    sendMsg() {
      if (!this.inputText.trim() || this.isLoading) return;
      
      const userText = this.inputText;
      
      // 准备历史消息 (只取最近的几条以节省Token，且排除当前的)
      const history = this.messages
        .filter(m => m.text && !m.card) // 排除卡片示例消息
        .map(m => ({
          role: m.type === 'ai' ? 'assistant' : 'user',
          content: m.text
        }))
        .slice(-10); // 取最近10条

      // 发送用户消息
      this.messages.push({
        type: 'user',
        text: userText
      });
      
      this.inputText = '';
      this.scrollToBottom();
      this.isLoading = true;

      // Call Backend API
      sendChat({ 
        message: userText,
        history: history
      }).then(res => {
        if (res.code === '200') {
          const aiText = res.data;
          this.messages.push({
            type: 'ai',
            text: aiText,
            card: null // 目前后端返回纯文本，后续可优化为结构化数据
          });
        } else {
          this.messages.push({
            type: 'ai',
            text: '抱歉，系统繁忙，请稍后再试。'
          });
        }
      }).catch(err => {
        console.error('Chat error:', err);
        this.messages.push({
          type: 'ai',
          text: '网络连接异常，请检查您的网络。'
        });
      }).finally(() => {
        this.isLoading = false;
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollIntoView = 'msg-' + (this.messages.length - 1);
      });
    }
  }
}
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F7F5F0;
  background-image: radial-gradient(#E8E6E1 1px, transparent 1px);
  background-size: 20px 20px;
  color: #4A4A4A;
  font-family: "PingFang SC", sans-serif;
}

/* 顶部导航 */
.navbar {
  background: rgba(247, 245, 240, 0.95);
  padding: 12px 16px;
  padding-top: calc(44px + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(139, 90, 43, 0.1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
}

.nav-title { 
  font-size: 18px; 
  font-weight: 600; 
  flex: 1; 
  text-align: center; 
  font-family: "Kaiti SC", "STKaiti", serif;
  color: #333;
}
.back-icon { font-size: 24px; color: #555; width: 40px; }
.nav-right { width: 40px; }

/* 聊天区域 */
.chat-area {
  flex: 1;
  /* 留出顶部导航和底部输入区的高度 */
  margin-top: calc(44px + 44px + env(safe-area-inset-top));
  margin-bottom: calc(60px + 40px + env(safe-area-inset-bottom)); 
  height: 0; /* flex item 需要设置 height 0 才能滚动 */
}

.chat-inner {
  padding: 20px;
}

.message {
  display: flex;
  margin-bottom: 24px;
  align-items: flex-start;
}

.message.user { flex-direction: row-reverse; }

.avatar {
  width: 40px; height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: "Kaiti SC", "STKaiti", serif;
  font-size: 18px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.avatar.ai { 
  background: #8B5A2B; 
  color: #fff; 
  border: 2px solid #A67B51;
}

.avatar.user {
  background: #5D7A69;
  color: #fff;
  border: 2px solid #7A9A85;
}

.bubble {
  max-width: 75%;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 12px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.message.ai .bubble { 
  background: #FFFFFF; 
  color: #333; 
  border: 1px solid rgba(139, 90, 43, 0.1);
}

.message.user .bubble { 
  background: #E9F0EA; 
  color: #333; 
  border: 1px solid rgba(93, 122, 105, 0.1);
}

/* 结构化分析卡片 */
.analysis-card {
  background: #FDFBF7;
  border: 1px solid #E8E0D5;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
  font-size: 14px;
  position: relative;
}

.analysis-card::before {
  content: '';
  position: absolute;
  top: 4px; left: 4px; right: 4px; bottom: 4px;
  border: 1px dashed #E8E0D5;
  pointer-events: none;
}

.tag-group { display: flex; gap: 8px; margin-bottom: 12px; position: relative; z-index: 1; }
.tag { 
  padding: 4px 10px; 
  border-radius: 4px; 
  font-size: 12px; 
  font-family: "Kaiti SC", "STKaiti", serif;
}
.tag.t1 { background: #FBE8E6; color: #C84C42; border: 1px solid #E6C0BD; }
.tag.t2 { background: #FBF5E6; color: #B8860B; border: 1px solid #E6D0A0; }

.divider { 
  height: 1px; 
  background: #E8E0D5; 
  margin: 12px 0; 
  position: relative;
  z-index: 1;
}

.advice-title { 
  font-weight: bold; 
  margin-bottom: 6px; 
  font-size: 14px; 
  color: #8B5A2B; 
  display: flex; align-items: center; gap: 6px;
  position: relative; z-index: 1;
}

.advice-content { position: relative; z-index: 1; color: #555; }

/* 底部输入区 */
.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #FDFBF7;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid #E8E0D5;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.02);
  z-index: 100;
}

.quick-tags {
  white-space: nowrap;
  width: 100%;
  margin-bottom: 8px;
}

.quick-tag-list {
  display: flex;
  padding-right: 20px;
}

.quick-tag {
  display: inline-block;
  padding: 6px 14px;
  background: #fff;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  margin-right: 10px;
  border: 1px solid #E0D8CE;
  font-family: "Kaiti SC", "STKaiti", serif;
}

.input-box {
  display: flex;
  gap: 10px;
  align-items: center;
}

.text-input {
  flex: 1;
  height: 44px;
  background: #fff;
  border: 1px solid #E0D8CE;
  border-radius: 22px;
  padding: 0 16px;
  font-size: 15px;
  color: #333;
}

.send-btn {
  width: 44px;
  height: 44px;
  background: #8B5A2B;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(139, 90, 43, 0.3);
}
</style>
