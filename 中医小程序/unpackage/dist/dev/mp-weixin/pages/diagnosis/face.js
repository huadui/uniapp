"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      tempImage: "",
      result: null
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.tempImage = res.tempFilePaths[0];
        }
      });
    },
    startAnalyze() {
      if (!this.tempImage)
        return;
      common_vendor.index.showLoading({ title: "面诊分析中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        this.result = true;
      }, 2e3);
    },
    reset() {
      this.tempImage = "";
      this.result = null;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: !$data.result
  }, !$data.result ? common_vendor.e({
    c: $data.tempImage
  }, $data.tempImage ? {
    d: $data.tempImage
  } : {}, {
    e: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    f: common_vendor.t($data.tempImage ? "开始分析" : "请先上传"),
    g: common_vendor.o((...args) => $options.startAnalyze && $options.startAnalyze(...args)),
    h: !$data.tempImage
  }) : {
    i: common_vendor.o((...args) => $options.reset && $options.reset(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9f8aba69"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/diagnosis/face.js.map
