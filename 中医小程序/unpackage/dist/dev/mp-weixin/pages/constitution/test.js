"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentIndex: 0,
      selectedValue: null,
      answers: {},
      // 存储答案
      options: [
        { label: "没有 (根本不)", value: 1 },
        { label: "很少 (有一点)", value: 2 },
        { label: "有时 (有些)", value: 3 },
        { label: "经常 (相当)", value: 4 },
        { label: "总是 (非常)", value: 5 }
      ],
      questions: [
        { id: 1, tag: "气虚相关", text: "您是否容易感到疲乏，精神不振，且稍微活动后就容易出汗？" },
        { id: 2, tag: "阳虚相关", text: "您手脚发凉吗？" },
        { id: 3, tag: "阴虚相关", text: "您感到口干咽燥、总想喝水吗？" },
        { id: 4, tag: "痰湿相关", text: "您感到胸闷或腹部胀满吗？" },
        { id: 5, tag: "湿热相关", text: "您面部或鼻部有油腻感或者油亮发光吗？" },
        { id: 6, tag: "血瘀相关", text: "您的皮肤在不知不觉中会出现青紫瘀斑（皮下出血）吗？" },
        { id: 7, tag: "气郁相关", text: "您感到闷闷不乐、情绪低沉吗？" },
        { id: 8, tag: "特禀相关", text: "您容易过敏（对药物、食物、气味、花粉或在季节交替、气候变化时）吗？" },
        { id: 9, tag: "平和相关", text: "您精力充沛吗？" },
        { id: 10, tag: "综合评估", text: "您容易忘事（健忘）吗？" }
      ]
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex];
    },
    progressPercentage() {
      return (this.currentIndex + 1) / this.questions.length * 100;
    }
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    selectOption(val) {
      this.selectedValue = val;
      this.$set(this.answers, this.currentIndex, val);
    },
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.selectedValue = this.answers[this.currentIndex] || null;
      }
    },
    nextQuestion() {
      if (!this.selectedValue) {
        common_vendor.index.showToast({ title: "请选择一个选项", icon: "none" });
        return;
      }
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.selectedValue = this.answers[this.currentIndex] || null;
      } else {
        this.submitTest();
      }
    },
    submitTest() {
      common_vendor.index.showLoading({ title: "分析中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "辨识结果",
          content: "初步判定您为「气虚质」兼「湿热质」。建议调理脾胃，清热祛湿。",
          showCancel: false,
          success: () => {
            common_vendor.index.navigateBack();
          }
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.currentIndex + 1),
    c: common_vendor.t($data.questions.length),
    d: $options.progressPercentage + "%",
    e: $options.currentQuestion
  }, $options.currentQuestion ? {
    f: common_vendor.t($options.currentQuestion.tag),
    g: common_vendor.t($options.currentQuestion.text),
    h: common_vendor.f($data.options, (opt, idx, i0) => {
      return {
        a: common_vendor.t(opt.label),
        b: idx,
        c: $data.selectedValue === opt.value ? 1 : "",
        d: common_vendor.o(($event) => $options.selectOption(opt.value), idx)
      };
    })
  } : {}, {
    i: common_vendor.o((...args) => $options.prevQuestion && $options.prevQuestion(...args)),
    j: $data.currentIndex === 0,
    k: common_vendor.t($data.currentIndex === $data.questions.length - 1 ? "提交" : "下一题"),
    l: common_vendor.o((...args) => $options.nextQuestion && $options.nextQuestion(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-36d0b53b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/constitution/test.js.map
