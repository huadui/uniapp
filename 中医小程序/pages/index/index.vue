<template>
  <div class="home-container">
    <!-- 顶部 Header -->
    <div class="header">
      <div class="user-row">
        <div class="greeting-box">
          <div class="greeting-time">{{ headerInfo.lunarText }}</div>
          <div class="greeting-text">{{ headerInfo.greetingText }}</div>
        </div>
        <div class="avatar" @click="switchTab('/pages/profile/profile')">
          <image v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar-img" mode="aspectFill"></image>
          <i v-else class="ri-user-line"></i>
        </div>
      </div>

      <!-- 节气卡片 -->
      <div class="solar-card">
        <div class="solar-icon">
          <text class="solar-name">{{ headerInfo.solarName }}</text>
          <text class="solar-date">{{ headerInfo.solarDate }}</text>
        </div>
        <div class="solar-info">
          <div class="solar-tip">{{ headerInfo.solarTip }}</div>
          <div class="solar-desc">{{ headerInfo.solarDesc }}</div>
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
const SOLAR_TERMS = [
  { key: 106, name: '小寒', date: '01.06', tip: '寒气正盛，温养脾肾', desc: '宜：早睡晚起，温补御寒，多食羊肉、山药' },
  { key: 120, name: '大寒', date: '01.20', tip: '岁寒极盛，固本培元', desc: '宜：护阳防寒，适度进补，多食桂圆、红枣' },
  { key: 204, name: '立春', date: '02.04', tip: '阳气始生，重在疏肝', desc: '宜：早睡早起，舒展筋骨，多食韭菜、豆芽' },
  { key: 219, name: '雨水', date: '02.19', tip: '湿气渐盛，健脾祛湿', desc: '宜：少食生冷，护脾胃，多食薏米、山药' },
  { key: 305, name: '惊蛰', date: '03.05', tip: '阳气升发，调肝和气', desc: '宜：规律作息，缓解春困，多食梨、蜂蜜' },
  { key: 320, name: '春分', date: '03.20', tip: '阴阳平衡，调和为要', desc: '宜：饮食清淡，平衡寒温，多食菠菜、胡萝卜' },
  { key: 404, name: '清明', date: '04.04', tip: '清气上升，养肝润肺', desc: '宜：踏青舒志，防风保暖，多食荠菜、枸杞' },
  { key: 419, name: '谷雨', date: '04.19', tip: '雨生百谷，养脾祛湿', desc: '宜：健脾利湿，少食油腻，多食赤小豆、冬瓜' },
  { key: 505, name: '立夏', date: '05.05', tip: '暑气初起，养心安神', desc: '宜：晚睡早起，静养心神，多食莲子、苦瓜' },
  { key: 521, name: '小满', date: '05.21', tip: '阳热渐增，防湿热困', desc: '宜：清淡饮食，适度运动，多食绿豆、丝瓜' },
  { key: 605, name: '芒种', date: '06.05', tip: '暑湿交加，护脾清热', desc: '宜：避免贪凉，健脾祛湿，多食薏米、扁豆' },
  { key: 621, name: '夏至', date: '06.21', tip: '阳极阴生，养心护阴', desc: '宜：午间小憩，少辛增酸，多食百合、莲藕' },
  { key: 707, name: '小暑', date: '07.07', tip: '暑热渐盛，清热生津', desc: '宜：补水防暑，少食辛辣，多食西瓜、绿豆汤' },
  { key: 722, name: '大暑', date: '07.22', tip: '炎热鼎盛，避暑养气', desc: '宜：静心降火，避免暴晒，多食冬瓜、荷叶茶' },
  { key: 807, name: '立秋', date: '08.07', tip: '暑去凉来，润肺防燥', desc: '宜：少辛多酸，润肺生津，多食银耳、梨' },
  { key: 823, name: '处暑', date: '08.23', tip: '暑热渐退，清润并重', desc: '宜：早晚添衣，防秋燥，多食百合、莲子' },
  { key: 907, name: '白露', date: '09.07', tip: '昼夜温差大，润燥护肺', desc: '宜：注意保暖，养阴润肺，多食芝麻、蜂蜜' },
  { key: 923, name: '秋分', date: '09.23', tip: '寒暑均平，调和阴阳', desc: '宜：起居有常，平补为主，多食山药、莲藕' },
  { key: 1008, name: '寒露', date: '10.08', tip: '寒意渐浓，润肺养胃', desc: '宜：防寒保暖，少凉多温，多食南瓜、红薯' },
  { key: 1023, name: '霜降', date: '10.23', tip: '霜降天冷，温养脾肾', desc: '宜：早睡早起，温补防寒，多食牛肉、栗子' },
  { key: 1107, name: '立冬', date: '11.07', tip: '万物收藏，养精蓄锐', desc: '宜：避寒就温，适度进补，多食黑豆、羊肉' },
  { key: 1122, name: '小雪', date: '11.22', tip: '气寒将雪，地气闭藏', desc: '宜：温补益肾，多食黑芝麻、羊肉' },
  { key: 1207, name: '大雪', date: '12.07', tip: '寒气更甚，护阳防寒', desc: '宜：头颈保暖，少食生冷，多食核桃、红枣' },
  { key: 1221, name: '冬至', date: '12.21', tip: '一阳来复，温阳养藏', desc: '宜：早睡晚起，温补阳气，多食饺子、羊汤' }
];

export default {
  data() {
    return {
      headerInfo: {
        lunarText: '',
        greetingText: '',
        solarName: '',
        solarDate: '',
        solarTip: '',
        solarDesc: ''
      },
      userInfo: {
        avatar: ''
      }
    }
  },
  onShow() {
    this.refreshHeaderInfo();
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      const info = uni.getStorageSync('userInfo') || {};
      this.userInfo = {
        avatar: info.avatarUrl || info.avatar || ''
      };
    },
    refreshHeaderInfo() {
      const now = new Date();
      const solarInfo = this.getCurrentSolarTerm(now);
      this.headerInfo = {
        lunarText: this.getLunarDateText(now),
        greetingText: this.getGreetingText(now),
        solarName: solarInfo.name,
        solarDate: solarInfo.date,
        solarTip: solarInfo.tip,
        solarDesc: solarInfo.desc
      };
    },
    getLunarDateText(date) {
      try {
        const formatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const raw = formatter.format(date).replace(/^\d+/, '');
        const match = raw.match(/(.+?年)(.+)/);
        if (match) {
          return `${match[1]} · ${match[2]}`;
        }
        return raw;
      } catch (e) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年 · ${month}月${day}日`;
      }
    },
    getGreetingText(date) {
      const hour = date.getHours();
      if (hour >= 5 && hour < 11) return '早安，顺时而养';
      if (hour >= 11 && hour < 14) return '午安，顺时而养';
      if (hour >= 14 && hour < 19) return '下午好，顺时而养';
      return '晚安，顺时而养';
    },
    getCurrentSolarTerm(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const todayKey = month * 100 + day;
      let current = SOLAR_TERMS[SOLAR_TERMS.length - 1];

      for (let i = 0; i < SOLAR_TERMS.length; i += 1) {
        if (todayKey >= SOLAR_TERMS[i].key) {
          current = SOLAR_TERMS[i];
        } else {
          break;
        }
      }

      return current;
    },
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
  padding-bottom: 110px;
  color: #4A4A4A;
}

/* 顶部区域 - 新中式风格 */
.header {
  background: linear-gradient(180deg, #8B5A2B 0%, #A67B51 100%);
  padding: 18px 20px 24px;
  padding-top: calc(88px + env(safe-area-inset-top));
  border-radius: 0 0 34px 34px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 26px rgba(139, 90, 43, 0.2);
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
  margin-bottom: 18px;
  position: relative;
  z-index: 2;
}

.greeting-box { color: #fff; }
.greeting-time { font-size: 14px; opacity: 0.9; font-family: "Kaiti SC", "STKaiti", serif; }
.greeting-text { font-size: 48rpx; font-weight: 600; margin-top: 6px; }

.avatar { 
  width: 48px; height: 48px; 
  background: rgba(255,255,255,0.2); 
  border: 2px solid rgba(255,255,255,0.4); 
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 24px;
}

.avatar-img {
  width: 100%; height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* 节气卡片 */
.solar-card {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 2;
  box-shadow: 0 3px 10px rgba(84, 58, 34, 0.08);
}

.solar-icon {
  width: 52px; height: 52px;
  background: #8B5A2B;
  color: #fff;
  border-radius: 12px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  font-family: "Kaiti SC", "STKaiti", serif;
  line-height: 1.1;
  box-shadow: 0 2px 8px rgba(139, 90, 43, 0.3);
}
.solar-name { font-size: 18px; font-weight: bold; }
.solar-date { font-size: 11px; opacity: 0.85; }

.solar-info { flex: 1; }
.solar-tip { font-size: 18px; color: #555; font-weight: 600; margin-bottom: 6px; }
.solar-desc { font-size: 24rpx; color: #888; line-height: 1.45; }

/* 功能网格 - 卷轴式设计 */
.grid-section {
  margin-top: -8px;
  padding: 20px 20px 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.feature-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 22px 16px 18px;
  box-shadow: 0 4px 12px rgba(139, 90, 43, 0.08);
  position: relative;
  border: 1px solid rgba(139, 90, 43, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  min-height: 230rpx;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:nth-child(odd) {
  transform: translateY(-2px);
}

.feature-card:nth-child(even) {
  transform: translateY(2px);
}

.feature-card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(139, 90, 43, 0.12);
}

/* 边角装饰 */
.corner-deco {
  position: absolute;
  width: 14px; height: 14px;
  border: 2px solid #8B5A2B;
  opacity: 0.2;
}
.top-left { top: 10px; left: 10px; border-right: none; border-bottom: none; }
.top-right { top: 10px; right: 10px; border-left: none; border-bottom: none; }
.bottom-left { bottom: 10px; left: 10px; border-right: none; border-top: none; }
.bottom-right { bottom: 10px; right: 10px; border-left: none; border-top: none; }

.card-icon-box {
  width: 68px; height: 68px;
  border-radius: 50%;
  margin-bottom: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 34px;
}

.bg-ink { background: #F0EBE5; color: #4A4A4A; } /* 墨灰 */
.bg-red { background: #FBE8E6; color: #C84C42; } /* 丹红 */
.bg-green { background: #E9F0EA; color: #5D7A69; } /* 竹青 */
.bg-gold { background: #FBF5E6; color: #B8860B; } /* 藤黄 */

.card-title { 
  font-size: 38rpx; 
  font-weight: bold; 
  color: #333; 
  font-family: "Kaiti SC", "STKaiti", serif; 
  margin-bottom: 6px;
}
.card-desc { font-size: 24rpx; color: #999; }

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
  bottom: 16px;
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
