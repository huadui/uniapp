"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      historyGroups: [
        {
          dateLabel: "今日 · 乙巳年十月廿三",
          items: [
            {
              title: "问诊脉络",
              desc: "主诉：失眠多梦，心烦易怒，伴有口苦咽干。",
              tags: ["气郁质", "肝火旺"],
              time: "14:30",
              icon: "ri-question-answer-line",
              iconClass: "bg-ink"
            },
            {
              title: "观舌知病",
              desc: "舌质红，苔黄腻，齿痕明显。",
              tags: ["湿热质"],
              time: "09:15",
              icon: "ri-camera-lens-line",
              iconClass: "bg-red"
            }
          ]
        },
        {
          dateLabel: "昨日 · 乙巳年十月廿二",
          items: [
            {
              title: "问诊脉络",
              desc: "咨询关于秋季养生的问题。",
              tags: ["健康科普"],
              time: "20:00",
              icon: "ri-question-answer-line",
              iconClass: "bg-ink"
            }
          ]
        }
      ]
    };
  },
  methods: {
    switchTab(url) {
      common_vendor.index.reLaunch({ url });
    },
    clearHistory() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清空所有医案记录吗？",
        success: (res) => {
          if (res.confirm) {
            this.historyGroups = [];
            common_vendor.index.showToast({ title: "已清空", icon: "none" });
          }
        }
      });
    },
    viewDetail(item) {
      common_vendor.index.showToast({ title: "查看详情: " + item.title, icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.clearHistory && $options.clearHistory(...args)),
    b: common_vendor.f($data.historyGroups, (group, gIdx, i0) => {
      return {
        a: common_vendor.t(group.dateLabel),
        b: common_vendor.f(group.items, (item, iIdx, i1) => {
          return {
            a: common_vendor.n(item.icon),
            b: common_vendor.n(item.iconClass),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.desc),
            e: common_vendor.f(item.tags, (tag, tIdx, i2) => {
              return {
                a: common_vendor.t(tag),
                b: tIdx
              };
            }),
            f: common_vendor.t(item.time),
            g: iIdx,
            h: common_vendor.o(($event) => $options.viewDetail(item), iIdx)
          };
        }),
        c: gIdx
      };
    }),
    c: common_vendor.o(($event) => $options.switchTab("/pages/index/index")),
    d: common_vendor.o(($event) => $options.switchTab("/pages/profile/profile"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b2d018fa"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/history.js.map
