"use strict";
const common_vendor = require("../../common/vendor.js");
const SOLAR_TERMS = [
  { key: 106, name: "小寒", date: "01.06", tip: "寒气正盛，温养脾肾", desc: "宜：早睡晚起，温补御寒，多食羊肉、山药" },
  { key: 120, name: "大寒", date: "01.20", tip: "岁寒极盛，固本培元", desc: "宜：护阳防寒，适度进补，多食桂圆、红枣" },
  { key: 204, name: "立春", date: "02.04", tip: "阳气始生，重在疏肝", desc: "宜：早睡早起，舒展筋骨，多食韭菜、豆芽" },
  { key: 219, name: "雨水", date: "02.19", tip: "湿气渐盛，健脾祛湿", desc: "宜：少食生冷，护脾胃，多食薏米、山药" },
  { key: 305, name: "惊蛰", date: "03.05", tip: "阳气升发，调肝和气", desc: "宜：规律作息，缓解春困，多食梨、蜂蜜" },
  { key: 320, name: "春分", date: "03.20", tip: "阴阳平衡，调和为要", desc: "宜：饮食清淡，平衡寒温，多食菠菜、胡萝卜" },
  { key: 404, name: "清明", date: "04.04", tip: "清气上升，养肝润肺", desc: "宜：踏青舒志，防风保暖，多食荠菜、枸杞" },
  { key: 419, name: "谷雨", date: "04.19", tip: "雨生百谷，养脾祛湿", desc: "宜：健脾利湿，少食油腻，多食赤小豆、冬瓜" },
  { key: 505, name: "立夏", date: "05.05", tip: "暑气初起，养心安神", desc: "宜：晚睡早起，静养心神，多食莲子、苦瓜" },
  { key: 521, name: "小满", date: "05.21", tip: "阳热渐增，防湿热困", desc: "宜：清淡饮食，适度运动，多食绿豆、丝瓜" },
  { key: 605, name: "芒种", date: "06.05", tip: "暑湿交加，护脾清热", desc: "宜：避免贪凉，健脾祛湿，多食薏米、扁豆" },
  { key: 621, name: "夏至", date: "06.21", tip: "阳极阴生，养心护阴", desc: "宜：午间小憩，少辛增酸，多食百合、莲藕" },
  { key: 707, name: "小暑", date: "07.07", tip: "暑热渐盛，清热生津", desc: "宜：补水防暑，少食辛辣，多食西瓜、绿豆汤" },
  { key: 722, name: "大暑", date: "07.22", tip: "炎热鼎盛，避暑养气", desc: "宜：静心降火，避免暴晒，多食冬瓜、荷叶茶" },
  { key: 807, name: "立秋", date: "08.07", tip: "暑去凉来，润肺防燥", desc: "宜：少辛多酸，润肺生津，多食银耳、梨" },
  { key: 823, name: "处暑", date: "08.23", tip: "暑热渐退，清润并重", desc: "宜：早晚添衣，防秋燥，多食百合、莲子" },
  { key: 907, name: "白露", date: "09.07", tip: "昼夜温差大，润燥护肺", desc: "宜：注意保暖，养阴润肺，多食芝麻、蜂蜜" },
  { key: 923, name: "秋分", date: "09.23", tip: "寒暑均平，调和阴阳", desc: "宜：起居有常，平补为主，多食山药、莲藕" },
  { key: 1008, name: "寒露", date: "10.08", tip: "寒意渐浓，润肺养胃", desc: "宜：防寒保暖，少凉多温，多食南瓜、红薯" },
  { key: 1023, name: "霜降", date: "10.23", tip: "霜降天冷，温养脾肾", desc: "宜：早睡早起，温补防寒，多食牛肉、栗子" },
  { key: 1107, name: "立冬", date: "11.07", tip: "万物收藏，养精蓄锐", desc: "宜：避寒就温，适度进补，多食黑豆、羊肉" },
  { key: 1122, name: "小雪", date: "11.22", tip: "气寒将雪，地气闭藏", desc: "宜：温补益肾，多食黑芝麻、羊肉" },
  { key: 1207, name: "大雪", date: "12.07", tip: "寒气更甚，护阳防寒", desc: "宜：头颈保暖，少食生冷，多食核桃、红枣" },
  { key: 1221, name: "冬至", date: "12.21", tip: "一阳来复，温阳养藏", desc: "宜：早睡晚起，温补阳气，多食饺子、羊汤" }
];
const _sfc_main = {
  data() {
    return {
      headerInfo: {
        lunarText: "",
        greetingText: "",
        solarName: "",
        solarDate: "",
        solarTip: "",
        solarDesc: ""
      }
    };
  },
  onShow() {
    this.refreshHeaderInfo();
  },
  methods: {
    refreshHeaderInfo() {
      const now = /* @__PURE__ */ new Date();
      const solarInfo = this.getCurrentSolarTerm(now);
      this.headerInfo = {
        lunarText: this.getLunarDateText(now),
        greetingText: this.getGreetingText(now),
        solarName: solarInfo.name,
        solarDate: solarInfo.date,
        solarTip: solarInfo.tip,
        solarDesc: solarInfo.desc
      };
    },
    getLunarDateText(date) {
      try {
        const formatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const raw = formatter.format(date).replace(/^\d+/, "");
        const match = raw.match(/(.+?年)(.+)/);
        if (match) {
          return `${match[1]} · ${match[2]}`;
        }
        return raw;
      } catch (e) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年 · ${month}月${day}日`;
      }
    },
    getGreetingText(date) {
      const hour = date.getHours();
      if (hour >= 5 && hour < 11)
        return "早安，顺时而养";
      if (hour >= 11 && hour < 14)
        return "午安，顺时而养";
      if (hour >= 14 && hour < 19)
        return "下午好，顺时而养";
      return "晚安，顺时而养";
    },
    getCurrentSolarTerm(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const todayKey = month * 100 + day;
      let current = SOLAR_TERMS[SOLAR_TERMS.length - 1];
      for (let i = 0; i < SOLAR_TERMS.length; i += 1) {
        if (todayKey >= SOLAR_TERMS[i].key) {
          current = SOLAR_TERMS[i];
        } else {
          break;
        }
      }
      return current;
    },
    navTo(url) {
      common_vendor.index.navigateTo({ url });
    },
    switchTab(url) {
      common_vendor.index.reLaunch({ url });
    },
    showToast(msg) {
      common_vendor.index.showToast({
        title: msg,
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.headerInfo.lunarText),
    b: common_vendor.t($data.headerInfo.greetingText),
    c: common_vendor.t($data.headerInfo.solarName),
    d: common_vendor.t($data.headerInfo.solarDate),
    e: common_vendor.t($data.headerInfo.solarTip),
    f: common_vendor.t($data.headerInfo.solarDesc),
    g: common_vendor.o(($event) => $options.navTo("/pages/symptom-chat/symptom-chat")),
    h: common_vendor.o(($event) => $options.navTo("/pages/diagnosis/tongue")),
    i: common_vendor.o(($event) => $options.navTo("/pages/diagnosis/face")),
    j: common_vendor.o(($event) => $options.navTo("/pages/constitution/test")),
    k: common_vendor.o(($event) => $options.switchTab("/pages/history/history")),
    l: common_vendor.o(($event) => $options.switchTab("/pages/profile/profile"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
