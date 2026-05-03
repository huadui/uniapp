"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://127.0.0.1:8080";
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "content-type": "application/json",
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === "200") {
            resolve(res.data);
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "请求失败",
              icon: "none"
            });
            reject(res.data);
          }
        } else {
          common_vendor.index.showToast({
            title: "系统错误",
            icon: "none"
          });
          reject(res);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
        reject(err);
      }
    });
  });
};
exports.BASE_URL = BASE_URL;
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
