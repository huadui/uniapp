"use strict";
const common_vendor = require("../../common/vendor.js");
const api_history = require("../../api/history.js");
const _sfc_main = {
  data() {
    return {
      stats: {
        inquiry: 0,
        face: 0,
        tongue: 0,
        constitution: 0
      },
      userInfo: {
        avatar: "",
        nickname: ""
      }
    };
  },
  onShow() {
    this.loadUserInfo();
    this.fetchStats();
  },
  methods: {
    loadUserInfo() {
      const info = common_vendor.index.getStorageSync("userInfo") || {};
      this.userInfo = {
        ...info,
        avatar: info.avatar || "",
        nickname: info.nickname || ""
      };
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail;
      this.userInfo.avatar = avatarUrl;
      this.saveUserInfo();
    },
    onInputNickname(e) {
      const { value } = e.detail;
      if (value) {
        this.userInfo.nickname = value;
        this.saveUserInfo();
      }
    },
    saveUserInfo() {
      const info = common_vendor.index.getStorageSync("userInfo") || {};
      const newInfo = { ...info, avatar: this.userInfo.avatar, nickname: this.userInfo.nickname };
      common_vendor.index.setStorageSync("userInfo", newInfo);
    },
    fetchStats() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const userId = userInfo && userInfo.id;
      if (!userId) {
        this.stats = {
          inquiry: 0,
          face: 0,
          tongue: 0,
          constitution: 0
        };
        return;
      }
      api_history.getHistoryList(userId).then((res) => {
        const nextStats = {
          inquiry: 0,
          face: 0,
          tongue: 0,
          constitution: 0
        };
        const list = Array.isArray(res.data) ? res.data : [];
        list.forEach((item) => {
          if (item.type === "inquiry")
            nextStats.inquiry += 1;
          if (item.type === "face")
            nextStats.face += 1;
          if (item.type === "tongue")
            nextStats.tongue += 1;
          if (item.type === "constitution")
            nextStats.constitution += 1;
        });
        this.stats = nextStats;
      }).catch(() => {
        this.stats = {
          inquiry: 0,
          face: 0,
          tongue: 0,
          constitution: 0
        };
      });
    },
    switchTab(url) {
      common_vendor.index.reLaunch({ url });
    },
    navTo(url) {
      if (!url) {
        common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({ url });
    },
    showToast(msg) {
      common_vendor.index.showToast({ title: msg, icon: "none" });
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.reLaunch({
              url: "/pages/login/login"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar
  }, $data.userInfo.avatar ? {
    b: $data.userInfo.avatar
  } : {}, {
    c: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    d: $data.userInfo.nickname,
    e: common_vendor.o((...args) => $options.onInputNickname && $options.onInputNickname(...args)),
    f: common_vendor.o((...args) => $options.onInputNickname && $options.onInputNickname(...args)),
    g: common_vendor.t($data.stats.inquiry),
    h: common_vendor.t($data.stats.face),
    i: common_vendor.t($data.stats.tongue),
    j: common_vendor.t($data.stats.constitution),
    k: common_vendor.o(($event) => $options.navTo("/pages/profile/settings")),
    l: common_vendor.o(($event) => $options.navTo("/pages/profile/privacy")),
    m: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    n: common_vendor.o(($event) => $options.switchTab("/pages/index/index")),
    o: common_vendor.o(($event) => $options.switchTab("/pages/history/history"))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
