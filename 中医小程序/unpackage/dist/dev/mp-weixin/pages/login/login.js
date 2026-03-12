"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const _sfc_main = {
  data() {
    return {
      isAgreed: false
    };
  },
  methods: {
    toggleAgree() {
      this.isAgreed = !this.isAgreed;
    },
    handleLogin() {
      if (!this.isAgreed) {
        common_vendor.index.showToast({
          title: "请先同意用户协议",
          icon: "none"
        });
        return;
      }
      common_vendor.index.getUserProfile({
        desc: "用于完善会员资料",
        success: (res) => {
          const userInfo = res.userInfo;
          common_vendor.index.showLoading({
            title: "登录中..."
          });
          common_vendor.index.login({
            provider: "weixin",
            success: (loginRes) => {
              if (loginRes.code) {
                const loginDTO = {
                  code: loginRes.code,
                  nickname: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl,
                  gender: userInfo.gender
                };
                api_user.login(loginDTO).then((response) => {
                  common_vendor.index.hideLoading();
                  common_vendor.index.setStorageSync("userInfo", response.data);
                  common_vendor.index.showToast({
                    title: "登录成功",
                    icon: "success"
                  });
                  setTimeout(() => {
                    common_vendor.index.reLaunch({
                      url: "/pages/index/index"
                    });
                  }, 1500);
                }).catch((error) => {
                  common_vendor.index.hideLoading();
                  common_vendor.index.__f__("error", "at pages/login/login.vue:101", "Login failed:", error);
                });
              } else {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "获取登录凭证失败",
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              common_vendor.index.hideLoading();
              common_vendor.index.__f__("error", "at pages/login/login.vue:113", "uni.login failed:", err);
              common_vendor.index.showToast({
                title: "登录失败",
                icon: "none"
              });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:122", "getUserProfile failed or cancelled:", err);
          common_vendor.index.showToast({
            title: "需要授权才能登录",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    b: $data.isAgreed ? 1 : "",
    c: common_vendor.o((...args) => $options.toggleAgree && $options.toggleAgree(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
