"use strict";
const common_vendor = require("../../common/vendor.js");
const data_questions = require("../../data/questions.js");
const api_constitution = require("../../api/constitution.js");
const _sfc_main = {
  data() {
    return {
      currentIndex: 0,
      selectedValue: null,
      answers: {},
      // 存储答案 key: questionId, value: score
      options: data_questions.answerOptions,
      questions: data_questions.constitutionQuestions
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
      this.$set(this.answers, this.currentQuestion.id, val);
      setTimeout(() => {
        if (this.currentIndex < this.questions.length - 1) {
          this.nextQuestion();
        }
      }, 200);
    },
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        const prevQId = this.questions[this.currentIndex].id;
        this.selectedValue = this.answers[prevQId] || null;
      }
    },
    nextQuestion() {
      const currentQId = this.questions[this.currentIndex].id;
      if (!this.answers[currentQId]) {
        common_vendor.index.showToast({ title: "请选择一个选项", icon: "none" });
        return;
      }
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        const nextQId = this.questions[this.currentIndex].id;
        this.selectedValue = this.answers[nextQId] || null;
      } else {
        this.submitTest();
      }
    },
    submitTest() {
      common_vendor.index.showLoading({ title: "分析中..." });
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const userId = userInfo ? userInfo.id : null;
      api_constitution.submitConstitutionTest(userId, this.answers).then((res) => {
        common_vendor.index.hideLoading();
        if (res.code === "200") {
          common_vendor.index.redirectTo({
            url: "/pages/constitution/result?data=" + encodeURIComponent(JSON.stringify(res.data))
          });
        } else {
          common_vendor.index.showToast({ title: res.msg || "分析失败", icon: "none" });
        }
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/constitution/test.vue:130", err);
        common_vendor.index.showToast({ title: "网络请求失败", icon: "none" });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.questions.length),
    c: common_vendor.t($data.currentIndex + 1),
    d: common_vendor.t($data.questions.length),
    e: $options.progressPercentage + "%",
    f: $options.currentQuestion
  }, $options.currentQuestion ? {
    g: common_vendor.t($options.currentQuestion.type),
    h: common_vendor.t($options.currentQuestion.text),
    i: common_vendor.f($data.options, (opt, idx, i0) => {
      return {
        a: common_vendor.t(opt.label),
        b: idx,
        c: $data.selectedValue === opt.score ? 1 : "",
        d: common_vendor.o(($event) => $options.selectOption(opt.score), idx)
      };
    })
  } : {}, {
    j: common_vendor.o((...args) => $options.prevQuestion && $options.prevQuestion(...args)),
    k: $data.currentIndex === 0,
    l: common_vendor.t($data.currentIndex === $data.questions.length - 1 ? "提交" : "下一题"),
    m: common_vendor.o((...args) => $options.nextQuestion && $options.nextQuestion(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-36d0b53b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/constitution/test.js.map
