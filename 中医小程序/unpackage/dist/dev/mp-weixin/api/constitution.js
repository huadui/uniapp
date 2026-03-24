"use strict";
const utils_request = require("../utils/request.js");
const submitConstitutionTest = (userId, answers) => {
  return utils_request.request({
    url: "/constitution/test",
    method: "POST",
    data: {
      userId,
      answers
    }
  });
};
exports.submitConstitutionTest = submitConstitutionTest;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/constitution.js.map
