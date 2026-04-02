"use strict";
const common_vendor = require("../../common/vendor.js");
const api_chat = require("../../api/chat.js");
const api_history = require("../../api/history.js");
const _sfc_main = {
  data() {
    return {
      scrollTop: 0,
      scrollIntoView: "",
      inputText: "",
      isLoading: false,
      isHistoryMode: false,
      recordId: null,
      // Used to keep track of current session for auto-saving
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
  onLoad(options) {
    if (options.mode === "history") {
      this.isHistoryMode = true;
      const historyData = common_vendor.index.getStorageSync("temp_history_data");
      if (historyData) {
        if (historyData.chatLogJson) {
          try {
            this.messages = JSON.parse(historyData.chatLogJson);
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/symptom-chat/symptom-chat.vue:97", "Failed to parse chat log", e);
            this.messages = [
              { type: "ai", text: "主诉：" + historyData.mainSymptom },
              { type: "ai", text: "诊断：" + historyData.diagnosis },
              { type: "ai", text: "建议：" + historyData.advice }
            ];
          }
        } else {
          this.messages = [
            { type: "ai", text: "主诉：" + historyData.mainSymptom },
            { type: "ai", text: "诊断：" + historyData.diagnosis },
            { type: "ai", text: "建议：" + historyData.advice }
          ];
        }
      }
    }
  },
  methods: {
    saveRecord(showToastFlag = true) {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo)
        return;
      if (showToastFlag)
        common_vendor.index.showLoading({ title: "保存中..." });
      const userMessages = this.messages.filter((m) => m.type === "user");
      const aiMessages = this.messages.filter((m) => m.type === "ai" && !m.card);
      const mainSymptom = userMessages.length > 0 ? userMessages[0].text : "无主诉";
      const diagnosis = aiMessages.length > 0 ? "见详细记录" : "未诊断";
      const advice = aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].text : "";
      const record = {
        userId: userInfo.id,
        mainSymptom: mainSymptom.substring(0, 100),
        diagnosis,
        advice: advice.substring(0, 500),
        chatLogJson: JSON.stringify(this.messages)
      };
      if (this.recordId) {
        record.id = this.recordId;
      }
      api_history.saveInquiryRecord(record).then((res) => {
        if (res.code === "200") {
          this.recordId = res.data;
          if (showToastFlag)
            common_vendor.index.showToast({ title: "保存成功" });
        } else {
          if (showToastFlag)
            common_vendor.index.showToast({ title: "保存失败", icon: "none" });
        }
      }).finally(() => {
        if (showToastFlag)
          common_vendor.index.hideLoading();
      });
    },
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
          if (!this.isHistoryMode) {
            this.saveRecord(false);
          }
        } else {
          this.messages.push({
            type: "ai",
            text: "抱歉，系统繁忙，请稍后再试。"
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/symptom-chat/symptom-chat.vue:207", "Chat error:", err);
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
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: !$data.isHistoryMode && $data.messages.length > 2
  }, !$data.isHistoryMode && $data.messages.length > 2 ? {
    c: common_vendor.o((...args) => $options.saveRecord && $options.saveRecord(...args))
  } : {}, {
    d: common_vendor.f($data.messages, (msg, index, i0) => {
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
    e: $data.scrollTop,
    f: $data.scrollIntoView,
    g: $data.isHistoryMode ? "0" : "",
    h: !$data.isHistoryMode
  }, !$data.isHistoryMode ? {
    i: common_vendor.f($data.quickTags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index,
        c: common_vendor.o(($event) => $options.sendText(tag), index)
      };
    }),
    j: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args)),
    k: $data.inputText,
    l: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    m: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1ef4f868"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/symptom-chat/symptom-chat.js.map
