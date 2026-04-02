"use strict";
const utils_request = require("../utils/request.js");
const getHistoryList = (userId) => {
  return utils_request.request({
    url: "/history/list",
    method: "GET",
    data: {
      userId
    }
  });
};
const saveInquiryRecord = (data) => {
  return utils_request.request({
    url: "/inquiry/save",
    method: "POST",
    data
  });
};
exports.getHistoryList = getHistoryList;
exports.saveInquiryRecord = saveInquiryRecord;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/history.js.map
