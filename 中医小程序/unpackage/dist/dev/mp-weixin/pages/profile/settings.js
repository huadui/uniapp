"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      cacheSize: "2.4MB"
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    clearCache() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清理本地缓存吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "清理中..." });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              this.cacheSize = "0KB";
              common_vendor.index.showToast({ title: "清理成功" });
            }, 800);
          }
        }
      });
    },
    showAbout() {
      common_vendor.index.showModal({
        title: "关于",
        content: "中医智能助手 v1.0.0\n提供问诊、面诊、舌诊与体质测评服务。",
        showCancel: false
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.cacheSize),
    c: common_vendor.o((...args) => $options.clearCache && $options.clearCache(...args)),
    d: common_vendor.o((...args) => $options.showAbout && $options.showAbout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-eeefe5cd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/settings.js.map
