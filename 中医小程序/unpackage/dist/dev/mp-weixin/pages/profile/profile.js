"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    switchTab(url) {
      common_vendor.index.reLaunch({ url });
    },
    navTo(url) {
      common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
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
  return {
    a: common_vendor.o(($event) => $options.navTo("/pages/constitution/report")),
    b: common_vendor.o(($event) => $options.showToast("开发中")),
    c: common_vendor.o(($event) => $options.showToast("开发中")),
    d: common_vendor.o(($event) => $options.showToast("开发中")),
    e: common_vendor.o(($event) => $options.showToast("开发中")),
    f: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    g: common_vendor.o(($event) => $options.switchTab("/pages/index/index")),
    h: common_vendor.o(($event) => $options.switchTab("/pages/history/history"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
