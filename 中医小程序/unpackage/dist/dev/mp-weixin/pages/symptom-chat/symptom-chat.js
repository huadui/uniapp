"use strict";
const common_vendor = require("../../common/vendor.js");
const api_chat = require("../../api/chat.js");
const _sfc_main = {
  data() {
    return {
      scrollTop: 0,
      scrollIntoView: "",
      inputText: "",
      isLoading: false,
      quickTags: ["失眠多梦", "心烦易怒", "手足冰凉", "食欲不振"],
      messages: [
        {
          type: "ai",
          text: "阁下安好。吾乃智能中医助手。请详述身体不适之处，或上传舌象、面相照片，吾将为您辨证施治。",
          card: {
            title: "问诊示例：",
            content: '"近来夜寐不安，心烦易怒，口苦咽干，不知何故？"'
          }
        }
      ]
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    sendText(text) {
      this.inputText = text;
      this.sendMsg();
    },
    sendMsg() {
      if (!this.inputText.trim() || this.isLoading)
        return;
      const userText = this.inputText;
      const history = this.messages.filter((m) => m.text && !m.card).map((m) => ({
        role: m.type === "ai" ? "assistant" : "user",
        content: m.text
      })).slice(-10);
      this.messages.push({
        type: "user",
        text: userText
      });
      this.inputText = "";
      this.scrollToBottom();
      this.isLoading = true;
      api_chat.sendChat({
        message: userText,
        history
      }).then((res) => {
        if (res.code === "200") {
          const aiText = res.data;
          this.messages.push({
            type: "ai",
            text: aiText,
            card: null
            // 目前后端返回纯文本，后续可优化为结构化数据
          });
        } else {
          this.messages.push({
            type: "ai",
            text: "抱歉，系统繁忙，请稍后再试。"
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/symptom-chat/symptom-chat.vue:132", "Chat error:", err);
        this.messages.push({
          type: "ai",
          text: "网络连接异常，请检查您的网络。"
        });
      }).finally(() => {
        this.isLoading = false;
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollIntoView = "msg-" + (this.messages.length - 1);
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.f($data.messages, (msg, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(msg.type === "ai" ? "医" : "患"),
        b: common_vendor.n(msg.type),
        c: common_vendor.t(msg.text),
        d: msg.card
      }, msg.card ? common_vendor.e({
        e: msg.card.tags
      }, msg.card.tags ? {
        f: common_vendor.f(msg.card.tags, (tag, tIdx, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tIdx,
            c: common_vendor.n(tIdx === 0 ? "t1" : "t2")
          };
        })
      } : {}, {
        g: msg.card.title
      }, msg.card.title ? {
        h: msg.card.title
      } : {}, {
        i: msg.card.content
      }, msg.card.content ? {
        j: common_vendor.t(msg.card.content)
      } : {}, {
        k: msg.card.sections
      }, msg.card.sections ? {
        l: common_vendor.f(msg.card.sections, (sec, sIdx, i1) => {
          return common_vendor.e({
            a: sIdx > 0 || msg.card.tags
          }, sIdx > 0 || msg.card.tags ? {} : {}, {
            b: common_vendor.n(sec.icon),
            c: common_vendor.t(sec.title),
            d: common_vendor.t(sec.content),
            e: sIdx
          });
        })
      } : {}) : {}, {
        m: index,
        n: "msg-" + index,
        o: common_vendor.n(msg.type)
      });
    }),
    c: $data.scrollTop,
    d: $data.scrollIntoView,
    e: common_vendor.f($data.quickTags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index,
        c: common_vendor.o(($event) => $options.sendText(tag), index)
      };
    }),
    f: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args)),
    g: $data.inputText,
    h: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    i: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1ef4f868"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/symptom-chat/symptom-chat.js.map
