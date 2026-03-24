"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      result: {
        mainConstitution: "",
        tendencyConstitution: "",
        scores: {},
        advice: ""
      }
    };
  },
  onLoad(options) {
    if (options.data) {
      try {
        this.result = JSON.parse(decodeURIComponent(options.data));
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/constitution/result.vue:64", "解析结果失败", e);
      }
    }
  },
  methods: {
    getBarColor(score) {
      if (score >= 60)
        return "#4CAF50";
      if (score >= 40)
        return "#D32F2F";
      if (score >= 30)
        return "#FFA000";
      return "#8B5A2B";
    },
    goHome() {
      common_vendor.index.reLaunch({ url: "/pages/index/index" });
    },
    reTest() {
      common_vendor.index.redirectTo({ url: "/pages/constitution/test" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goHome && $options.goHome(...args)),
    b: common_vendor.t($data.result.mainConstitution || "未判定"),
    c: $data.result.tendencyConstitution
  }, $data.result.tendencyConstitution ? {
    d: common_vendor.t($data.result.tendencyConstitution)
  } : {}, {
    e: common_vendor.f($data.result.scores, (score, type, i0) => {
      return {
        a: common_vendor.t(type),
        b: Math.min(score, 100) + "%",
        c: $options.getBarColor(score),
        d: common_vendor.t(score.toFixed(1)),
        e: type
      };
    }),
    f: common_vendor.t($data.result.advice),
    g: common_vendor.o((...args) => $options.goHome && $options.goHome(...args)),
    h: common_vendor.o((...args) => $options.reTest && $options.reTest(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9d964624"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/constitution/result.js.map
