<template>
  <div class="page-container">
    <div class="navbar">
      <div class="back-icon" @click="goBack"><i class="ri-arrow-left-s-line"></i></div>
      <div class="nav-title">隐私政策</div>
      <div class="nav-right"></div>
    </div>
    <scroll-view class="content-area" scroll-y="true">
      <div class="article-content">
        <div class="title">中医智能助手隐私保护指引</div>
        <div class="date">更新日期：2026年04月11日</div>
        <div class="paragraph">
          欢迎您使用中医智能助手！我们非常重视您的隐私保护和个人信息安全。本指引将帮助您了解我们会如何收集、使用和存储您的个人信息及您享有何种权利。
        </div>
        <div class="subtitle">1. 信息收集</div>
        <div class="paragraph">
          在您使用面诊、舌诊等功能时，我们将需要获取您的摄像头权限或相册读取权限，并在服务器分析您的面部或舌象特征以生成健康报告。这些图像数据仅用于当次特征分析，我们不会长期保存您的生物识别原图。
        </div>
        <div class="subtitle">2. 信息使用</div>
        <div class="paragraph">
          我们收集的您的健康数据（如体质测试结果、智能问诊记录、面诊舌诊结论等）将用于为您提供个性化的中医养生建议和历史健康档案查看，帮助您更好地管理自身健康。
        </div>
        <div class="subtitle">3. 信息共享与披露</div>
        <div class="paragraph">
          除法律法规规定外，未经您的同意，我们不会向任何第三方共享或披露您的个人健康信息。
        </div>
        <div class="subtitle">4. 您的权利</div>
        <div class="paragraph">
          您可以在“设置”中选择清除本地缓存或退出登录。如有其他隐私相关疑问或需要注销账号，您可以通过“帮助与反馈”联系我们，收到请求后，我们将及时删除或匿名化处理您的个人信息。
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped>
.page-container {
  height: 100vh;
  background-color: #F7F5F0;
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", "Kaiti SC", serif;
  color: #333;
}

.navbar {
  background: rgba(247, 245, 240, 0.95);
  padding: 12px 20px;
  padding-top: calc(44px + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(139, 90, 43, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title { font-size: 18px; font-weight: 600; flex: 1; text-align: center; }
.back-icon { font-size: 24px; color: #555; width: 40px; }
.nav-right { width: 40px; }

.content-area {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  height: 0;
}

.article-content {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(139, 90, 43, 0.05);
  margin-bottom: 30px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  color: #8B5A2B;
}

.date {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-bottom: 24px;
}

.subtitle {
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 8px;
  color: #4A4A4A;
}

.paragraph {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 12px;
  text-align: justify;
}
</style>
