"use strict";
const common_vendor = require("../../common/vendor.js");
const api_history = require("../../api/history.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      stats: {
        inquiry: 0,
        face: 0,
        tongue: 0,
        constitution: 0
      },
      userInfo: {
        avatar: "",
        nickname: "",
        gender: 0,
        phone: ""
      }
    };
  },
  computed: {
    genderText() {
      if (this.userInfo.gender === 1)
        return "男";
      if (this.userInfo.gender === 2)
        return "女";
      return "未知性别";
    }
  },
  onShow() {
    this.loadUserInfo();
    this.fetchStats();
  },
  methods: {
    loadUserInfo() {
      const info = common_vendor.index.getStorageSync("userInfo") || {};
      this.userInfo = {
        ...info,
        avatar: info.avatarUrl || info.avatar || "",
        nickname: info.nickname || "",
        gender: info.gender || 0,
        phone: info.phoneNumber || info.phone || ""
      };
      if (info.id && !this.userInfo.phone) {
        this.fetchLatestUserInfo(info.id);
      }
    },
    fetchLatestUserInfo(userId) {
      common_vendor.index.request({
        url: `${utils_request.BASE_URL}/admin/user/${userId}`,
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === "200") {
            const user = res.data.data;
            if (user) {
              this.userInfo.phone = user.phoneNumber || user.phone || "";
              this.userInfo.nickname = user.nickname || this.userInfo.nickname;
              this.userInfo.avatar = user.avatarUrl || user.avatar || this.userInfo.avatar;
              this.userInfo.gender = user.gender || this.userInfo.gender;
              this.saveUserInfo();
            }
          }
        }
      });
    },
    chooseGender() {
      common_vendor.index.showActionSheet({
        itemList: ["男", "女", "未知"],
        success: (res) => {
          let selectedGender = 0;
          if (res.tapIndex === 0)
            selectedGender = 1;
          if (res.tapIndex === 1)
            selectedGender = 2;
          if (this.userInfo.gender !== selectedGender) {
            this.userInfo.gender = selectedGender;
            this.saveUserInfo();
            this.updateProfile({ gender: selectedGender });
          }
        }
      });
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail;
      this.userInfo.avatar = avatarUrl;
      this.saveUserInfo();
      this.uploadAvatar(avatarUrl);
    },
    onInputNickname(e) {
      const { value } = e.detail;
      if (value) {
        this.userInfo.nickname = value;
        this.saveUserInfo();
        this.updateProfile({ nickname: value });
      }
    },
    saveUserInfo() {
      const info = common_vendor.index.getStorageSync("userInfo") || {};
      const newInfo = {
        ...info,
        avatar: this.userInfo.avatar,
        avatarUrl: this.userInfo.avatar,
        nickname: this.userInfo.nickname,
        gender: this.userInfo.gender,
        phoneNumber: this.userInfo.phone,
        phone: this.userInfo.phone
      };
      common_vendor.index.setStorageSync("userInfo", newInfo);
    },
    updateProfile(data) {
      const storedInfo = common_vendor.index.getStorageSync("userInfo");
      if (!storedInfo || !storedInfo.id)
        return;
      common_vendor.index.request({
        url: `${utils_request.BASE_URL}/admin/user/update`,
        method: "PUT",
        data: {
          id: storedInfo.id,
          ...data
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === "200") {
            common_vendor.index.__f__("log", "at pages/profile/profile.vue:218", "Profile updated successfully");
          } else {
            common_vendor.index.__f__("error", "at pages/profile/profile.vue:220", "Failed to update profile", res.data);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/profile/profile.vue:224", "Update profile request failed", err);
        }
      });
    },
    uploadAvatar(tempFilePath) {
      if (!tempFilePath)
        return;
      const storedInfo = common_vendor.index.getStorageSync("userInfo");
      if (!storedInfo || !storedInfo.id)
        return;
      common_vendor.index.showLoading({ title: "上传头像..." });
      common_vendor.index.uploadFile({
        url: `${utils_request.BASE_URL}/admin/user/avatar`,
        filePath: tempFilePath,
        name: "file",
        formData: {
          userId: storedInfo.id
        },
        success: (res) => {
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data);
              if (data.code === "200") {
                this.userInfo.avatar = data.data;
                this.saveUserInfo();
              } else {
                common_vendor.index.showToast({ title: data.msg || "上传失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/profile/profile.vue:252", "Avatar upload parse fail", e);
            }
          } else {
            common_vendor.index.showToast({ title: "上传失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/profile/profile.vue:259", "Avatar upload failed", err);
          common_vendor.index.showToast({ title: "上传失败", icon: "none" });
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    },
    fetchStats() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const userId = userInfo && userInfo.id;
      if (!userId) {
        this.stats = {
          inquiry: 0,
          face: 0,
          tongue: 0,
          constitution: 0
        };
        return;
      }
      api_history.getHistoryList(userId).then((res) => {
        const nextStats = {
          inquiry: 0,
          face: 0,
          tongue: 0,
          constitution: 0
        };
        const list = Array.isArray(res.data) ? res.data : [];
        list.forEach((item) => {
          if (item.type === "inquiry")
            nextStats.inquiry += 1;
          if (item.type === "face")
            nextStats.face += 1;
          if (item.type === "tongue")
            nextStats.tongue += 1;
          if (item.type === "constitution")
            nextStats.constitution += 1;
        });
        this.stats = nextStats;
      }).catch(() => {
        this.stats = {
          inquiry: 0,
          face: 0,
          tongue: 0,
          constitution: 0
        };
      });
    },
    switchTab(url) {
      common_vendor.index.reLaunch({ url });
    },
    navTo(url) {
      if (!url) {
        common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({ url });
    },
    showToast(msg) {
      common_vendor.index.showToast({ title: msg, icon: "none" });
    },
    handlePhoneNumber(e) {
      if (!e || e.detail.errMsg !== "getPhoneNumber:ok") {
        common_vendor.index.showToast({ title: "获取失败", icon: "none" });
        return;
      }
      const storedInfo = common_vendor.index.getStorageSync("userInfo");
      if (!storedInfo || !storedInfo.id) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "绑定中..." });
      common_vendor.index.request({
        url: `${utils_request.BASE_URL}/admin/user/phone`,
        method: "POST",
        data: {
          userId: storedInfo.id,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === "200") {
            this.userInfo.phone = res.data.data;
            this.saveUserInfo();
            common_vendor.index.showToast({ title: "绑定成功", icon: "success" });
          } else {
            common_vendor.index.showToast({ title: res.data.msg || "绑定失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/profile/profile.vue:352", "Bind phone failed", err);
          common_vendor.index.showToast({ title: "绑定失败", icon: "none" });
        },
        complete: () => common_vendor.index.hideLoading()
      });
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.reLaunch({
              url: "/pages/login/login"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar
  }, $data.userInfo.avatar ? {
    b: $data.userInfo.avatar
  } : {}, {
    c: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    d: $data.userInfo.nickname,
    e: common_vendor.o((...args) => $options.onInputNickname && $options.onInputNickname(...args)),
    f: common_vendor.o((...args) => $options.onInputNickname && $options.onInputNickname(...args)),
    g: $data.userInfo.gender === 2
  }, $data.userInfo.gender === 2 ? {} : $data.userInfo.gender === 1 ? {} : {}, {
    h: $data.userInfo.gender === 1,
    i: common_vendor.t($options.genderText),
    j: common_vendor.o((...args) => $options.chooseGender && $options.chooseGender(...args)),
    k: common_vendor.t($data.userInfo.phone ? "已绑定：" + $data.userInfo.phone : "手机号未绑定"),
    l: common_vendor.t($data.userInfo.phone ? "重新绑定" : "绑定手机号"),
    m: common_vendor.o((...args) => $options.handlePhoneNumber && $options.handlePhoneNumber(...args)),
    n: common_vendor.t($data.stats.inquiry),
    o: common_vendor.t($data.stats.face),
    p: common_vendor.t($data.stats.tongue),
    q: common_vendor.t($data.stats.constitution),
    r: common_vendor.o(($event) => $options.navTo("/pages/profile/settings")),
    s: common_vendor.o(($event) => $options.navTo("/pages/profile/privacy")),
    t: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    v: common_vendor.o(($event) => $options.switchTab("/pages/index/index")),
    w: common_vendor.o(($event) => $options.switchTab("/pages/history/history"))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
