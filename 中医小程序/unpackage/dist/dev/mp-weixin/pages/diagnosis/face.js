"use strict";
const common_vendor = require("../../common/vendor.js");
const api_diagnosis = require("../../api/diagnosis.js");
const _sfc_main = {
  data() {
    return {
      tempImage: "",
      resultData: null,
      isAnalyzing: false,
      isHistoryMode: false
    };
  },
  onLoad(options) {
    if (options.mode === "history") {
      this.isHistoryMode = true;
      const historyData = common_vendor.index.getStorageSync("temp_history_data");
      if (historyData) {
        if (historyData.fullResultJson) {
          try {
            this.resultData = JSON.parse(historyData.fullResultJson);
            this.tempImage = historyData.imageUrl;
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/diagnosis/face.vue:89", "Failed to parse history data", e);
          }
        }
      }
    }
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
      if (!this.tempImage || this.isAnalyzing)
        return;
      this.isAnalyzing = true;
      common_vendor.index.showLoading({ title: "AI 面诊中..." });
      common_vendor.index.getFileSystemManager().readFile({
        filePath: this.tempImage,
        encoding: "base64",
        success: (res) => {
          const base64 = "data:image/jpeg;base64," + res.data;
          const userInfo = common_vendor.index.getStorageSync("userInfo");
          const userId = userInfo ? userInfo.id : null;
          api_diagnosis.uploadFaceImage(userId, base64).then((res2) => {
            const data = res2.data;
            if (data.valid === false) {
              common_vendor.index.showModal({
                title: "提示",
                content: data.message || "未能识别到清晰面相，请重新拍摄",
                showCancel: false,
                confirmText: "我知道了",
                confirmColor: "#8B5A2B"
              });
              this.resultData = null;
            } else {
              this.resultData = data;
            }
          }).catch((err) => {
            common_vendor.index.__f__("error", "at pages/diagnosis/face.vue:143", err);
            common_vendor.index.showToast({
              title: typeof err === "string" ? err : "辨证失败，请重试",
              icon: "none"
            });
          }).finally(() => {
            common_vendor.index.hideLoading();
            this.isAnalyzing = false;
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/diagnosis/face.vue:155", "Read file failed:", err);
          common_vendor.index.showToast({ title: "图片读取失败", icon: "none" });
          common_vendor.index.hideLoading();
          this.isAnalyzing = false;
        }
      });
    },
    reset() {
      this.tempImage = "";
      this.resultData = null;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: !$data.resultData
  }, !$data.resultData ? common_vendor.e({
    c: $data.tempImage
  }, $data.tempImage ? {
    d: $data.tempImage
  } : {}, {
    e: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    f: common_vendor.t($data.isAnalyzing ? "正在分析..." : $data.tempImage ? "开始分析" : "请先上传"),
    g: common_vendor.o((...args) => $options.startAnalyze && $options.startAnalyze(...args)),
    h: !$data.tempImage || $data.isAnalyzing
  }) : common_vendor.e({
    i: !$data.isHistoryMode
  }, !$data.isHistoryMode ? {
    j: common_vendor.o((...args) => $options.reset && $options.reset(...args))
  } : {}, {
    k: common_vendor.t($data.resultData.faceColor),
    l: common_vendor.t($data.resultData.gloss),
    m: common_vendor.t($data.resultData.spirit),
    n: common_vendor.t($data.resultData.diagnosis),
    o: common_vendor.t($data.resultData.diagnosisDesc),
    p: common_vendor.t($data.resultData.advice)
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9f8aba69"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/diagnosis/face.js.map
