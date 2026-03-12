"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    navTo(url) {
      common_vendor.index.navigateTo({ url });
    },
    switchTab(url) {
      common_vendor.index.reLaunch({ url });
    },
    showToast(msg) {
      common_vendor.index.showToast({
        title: msg,
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.navTo("/pages/symptom-chat/symptom-chat")),
    b: common_vendor.o(($event) => $options.navTo("/pages/diagnosis/tongue")),
    c: common_vendor.o(($event) => $options.navTo("/pages/diagnosis/face")),
    d: common_vendor.o(($event) => $options.navTo("/pages/constitution/test")),
    e: common_vendor.o(($event) => $options.switchTab("/pages/history/history")),
    f: common_vendor.o(($event) => $options.switchTab("/pages/profile/profile"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
