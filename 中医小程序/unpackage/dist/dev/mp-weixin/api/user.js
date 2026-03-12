"use strict";
const utils_request = require("../utils/request.js");
const login = (data) => {
  return utils_request.request({
    url: "/user/login",
    method: "POST",
    data
  });
};
exports.login = login;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
