"use strict";
const utils_request = require("../utils/request.js");
const uploadTongueImage = (userId, imageBase64) => {
  return utils_request.request({
    url: "/diagnosis/tongue",
    method: "POST",
    data: {
      userId,
      imageBase64
    }
  });
};
exports.uploadTongueImage = uploadTongueImage;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/diagnosis.js.map
