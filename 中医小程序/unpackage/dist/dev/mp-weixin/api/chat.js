"use strict";
const utils_request = require("../utils/request.js");
const sendChat = (data) => {
  return utils_request.request({
    url: "/chat/send",
    method: "POST",
    data
  });
};
exports.sendChat = sendChat;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/chat.js.map
