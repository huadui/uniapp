<template>
  <div class="history-container">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="nav-title">医案记录</div>
      <div class="clear-btn" @click="clearHistory"><i class="ri-delete-bin-line"></i> 清空</div>
    </div>

    <!-- 列表区域 -->
    <div class="list-container">
      <div class="timeline-block" v-for="(group, gIdx) in historyGroups" :key="gIdx">
        <div class="date-label">{{ group.dateLabel }}</div>
        
        <div class="record-card" v-for="(item, iIdx) in group.items" :key="iIdx" @click="viewDetail(item)">
          <div class="record-icon-box" :class="item.iconClass"><i :class="item.icon"></i></div>
          <div class="record-content">
            <div class="record-title">{{ item.title }}</div>
            <div class="record-desc">{{ item.desc }}</div>
            <div class="tags">
              <div class="tag" v-for="(tag, tIdx) in item.tags" :key="tIdx">{{ tag }}</div>
            </div>
            <div class="time">{{ item.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 Tab -->
    <div class="tabbar">
      <div class="tab-item" @click="switchTab('/pages/index/index')">
        <div class="tab-icon"><i class="ri-home-smile-2-line"></i></div>
        <div class="tab-text">医馆</div>
      </div>
      <div class="tab-item active">
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
      historyGroups: [
        {
          dateLabel: '今日 · 乙巳年十月廿三',
          items: [
            {
              title: '问诊脉络',
              desc: '主诉：失眠多梦，心烦易怒，伴有口苦咽干。',
              tags: ['气郁质', '肝火旺'],
              time: '14:30',
              icon: 'ri-question-answer-line',
              iconClass: 'bg-ink'
            },
            {
              title: '观舌知病',
              desc: '舌质红，苔黄腻，齿痕明显。',
              tags: ['湿热质'],
              time: '09:15',
              icon: 'ri-camera-lens-line',
              iconClass: 'bg-red'
            }
          ]
        },
        {
          dateLabel: '昨日 · 乙巳年十月廿二',
          items: [
            {
              title: '问诊脉络',
              desc: '咨询关于秋季养生的问题。',
              tags: ['健康科普'],
              time: '20:00',
              icon: 'ri-question-answer-line',
              iconClass: 'bg-ink'
            }
          ]
        }
      ]
    }
  },
  methods: {
    switchTab(url) {
      uni.reLaunch({ url });
    },
    clearHistory() {
      uni.showModal({
        title: '提示',
        content: '确定要清空所有医案记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.historyGroups = [];
            uni.showToast({ title: '已清空', icon: 'none' });
          }
        }
      });
    },
    viewDetail(item) {
      uni.showToast({ title: '查看详情: ' + item.title, icon: 'none' });
    }
  }
}
</script>

<style scoped>
.history-container {
  min-height: 100vh;
  padding-bottom: 90px;
  background-color: #F7F5F0;
  background-image: radial-gradient(#E8E6E1 1px, transparent 1px);
  background-size: 20px 20px;
  color: #4A4A4A;
  font-family: "PingFang SC", "Kaiti SC", serif;
}

/* 顶部导航 */
.navbar {
  background: rgba(247, 245, 240, 0.95);
  padding: 12px 20px;
  padding-top: calc(44px + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #E8E0D5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title { font-size: 18px; font-weight: 600; color: #333; font-family: "Kaiti SC", "STKaiti", serif; }
.clear-btn { position: absolute; right: 20px; color: #888; font-size: 14px; }

.list-container { padding: 20px; }

/* 时间轴样式 */
.timeline-block { position: relative; padding-left: 24px; margin-bottom: 24px; }
.timeline-block::before {
  content: '';
  position: absolute;
  left: 6px; top: 28px; bottom: -20px;
  width: 1px; background: #D8D0C5;
  border-left: 1px dashed #D8D0C5;
}
.timeline-block:last-child::before { display: none; }

.date-label {
  font-size: 14px;
  font-weight: bold;
  color: #8B5A2B;
  margin-bottom: 12px;
  position: relative;
}

.date-label::before {
  content: '';
  position: absolute;
  left: -28px; top: 4px;
  width: 12px; height: 12px;
  background: #8B5A2B;
  border: 3px solid #F7F5F0;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #8B5A2B;
}

.record-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(139, 90, 43, 0.08);
  border: 1px solid #E8E0D5;
  position: relative;
}

.record-card::after {
  content: '';
  position: absolute;
  top: 4px; bottom: 4px; left: 4px;
  width: 2px;
  background-image: linear-gradient(to bottom, #8B5A2B 33%, transparent 0%);
  background-size: 1px 6px;
  opacity: 0.3;
}

.record-icon-box {
  width: 40px; height: 40px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.bg-ink { background: #F0EBE5; color: #4A4A4A; }
.bg-red { background: #FBE8E6; color: #C84C42; }

.record-content { flex: 1; }
.record-title { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 4px; font-family: "Kaiti SC", "STKaiti", serif; }
.record-desc { font-size: 13px; color: #666; line-height: 1.5; margin-bottom: 10px; }

.tags { display: flex; gap: 6px; }
.tag { 
  font-size: 10px; 
  padding: 2px 6px; 
  border-radius: 4px; 
  background: #F7F5F0; 
  color: #8B5A2B; 
  border: 1px solid #E0D8CE;
}

.time { font-size: 12px; color: #bbb; margin-top: 8px; text-align: right; font-family: "Georgia", serif; font-style: italic; }

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
