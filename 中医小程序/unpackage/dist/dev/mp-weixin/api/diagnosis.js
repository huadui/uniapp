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
const uploadFaceImage = (userId, imageBase64) => {
  return utils_request.request({
    url: "/diagnosis/face",
    method: "POST",
    data: {
      userId,
      imageBase64
    }
  });
};
exports.uploadFaceImage = uploadFaceImage;
exports.uploadTongueImage = uploadTongueImage;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/diagnosis.js.map
