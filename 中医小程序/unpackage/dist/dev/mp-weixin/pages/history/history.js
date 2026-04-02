"use strict";
const common_vendor = require("../../common/vendor.js");
const api_history = require("../../api/history.js");
const _sfc_main = {
  data() {
    return {
      currentFilter: "all",
      historyList: [],
      userInfo: null
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
    if (this.userInfo) {
      this.fetchData();
    }
  },
  computed: {
    filteredList() {
      if (this.currentFilter === "all") {
        return this.historyList;
      }
      return this.historyList.filter((item) => item.type === this.currentFilter);
    }
  },
  methods: {
    goHome() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      }
    },
    setFilter(filter) {
      this.currentFilter = filter;
    },
    fetchData() {
      if (!this.userInfo || !this.userInfo.id)
        return;
      common_vendor.index.showLoading({ title: "加载中..." });
      api_history.getHistoryList(this.userInfo.id).then((res) => {
        if (res.code === "200") {
          this.historyList = res.data;
        }
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    getTypeName(type) {
      const map = {
        constitution: "体质辨识",
        tongue: "智能舌诊",
        face: "智能面诊",
        inquiry: "智能问诊"
      };
      return map[type] || "未知";
    },
    formatDate(dateStr, fmt) {
      if (!dateStr)
        return "";
      const date = new Date(dateStr);
      if (fmt === "MM-dd") {
        return (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
      }
      if (fmt === "yyyy") {
        return date.getFullYear();
      }
      if (fmt === "HH:mm") {
        return date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
      }
      return dateStr;
    },
    goDetail(item) {
      common_vendor.index.setStorageSync("temp_history_data", item.fullData);
      let url = "";
      switch (item.type) {
        case "constitution":
          try {
            const scores = item.fullData.scoresJson ? JSON.parse(item.fullData.scoresJson) : {};
            const resultData = {
              mainConstitution: item.fullData.mainConstitution,
              tendencyConstitution: item.fullData.tendencyConstitution,
              scores,
              advice: item.fullData.advice
            };
            url = `/pages/constitution/result?data=${encodeURIComponent(JSON.stringify(resultData))}`;
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/history/history.vue:159", e);
          }
          break;
        case "tongue":
          url = `/pages/diagnosis/tongue?mode=history`;
          break;
        case "face":
          url = `/pages/diagnosis/face?mode=history`;
          break;
        case "inquiry":
          url = `/pages/symptom-chat/symptom-chat?mode=history`;
          break;
      }
      if (url) {
        common_vendor.index.navigateTo({ url });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goHome && $options.goHome(...args)),
    b: $data.currentFilter === "all" ? 1 : "",
    c: common_vendor.o(($event) => $options.setFilter("all")),
    d: $data.currentFilter === "constitution" ? 1 : "",
    e: common_vendor.o(($event) => $options.setFilter("constitution")),
    f: $data.currentFilter === "tongue" ? 1 : "",
    g: common_vendor.o(($event) => $options.setFilter("tongue")),
    h: $data.currentFilter === "face" ? 1 : "",
    i: common_vendor.o(($event) => $options.setFilter("face")),
    j: $data.currentFilter === "inquiry" ? 1 : "",
    k: common_vendor.o(($event) => $options.setFilter("inquiry")),
    l: $options.filteredList.length > 0
  }, $options.filteredList.length > 0 ? {
    m: common_vendor.f($options.filteredList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.formatDate(item.createTime, "MM-dd")),
        b: common_vendor.t($options.formatDate(item.createTime, "yyyy")),
        c: common_vendor.n(item.type),
        d: index < $options.filteredList.length - 1
      }, index < $options.filteredList.length - 1 ? {} : {}, {
        e: common_vendor.t($options.getTypeName(item.type)),
        f: common_vendor.n(item.type),
        g: common_vendor.t($options.formatDate(item.createTime, "HH:mm")),
        h: common_vendor.t(item.summary || "未见异常"),
        i: item.tags
      }, item.tags ? {
        j: common_vendor.t(item.tags)
      } : {}, {
        k: item.imageUrl
      }, item.imageUrl ? {
        l: item.imageUrl
      } : {}, {
        m: index,
        n: common_vendor.o(($event) => $options.goDetail(item), index)
      });
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b2d018fa"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/history.js.map
