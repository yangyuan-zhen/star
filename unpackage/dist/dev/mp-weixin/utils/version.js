"use strict";
const common_vendor = require("../common/vendor.js");
const getAppVersion = () => {
  try {
    const accountInfo = common_vendor.index.getAccountInfoSync();
    const { miniProgram } = accountInfo;
    const versionMap = {
      "develop": "开发版",
      "trial": "体验版",
      "release": "正式版"
    };
    const envVersion = miniProgram.envVersion;
    let version = miniProgram.version;
    if (!version) {
      version = `${versionMap[envVersion] || "开发版"} (${process.env.VUE_APP_VERSION || "1.0.0"})`;
    }
    return {
      version,
      envVersion,
      appId: miniProgram.appId,
      versionName: versionMap[envVersion] || "未知版本"
    };
  } catch (error) {
    console.error("获取版本信息失败:", error);
    return {
      version: "1.0.0",
      envVersion: "develop",
      appId: "",
      versionName: "开发版"
    };
  }
};
exports.getAppVersion = getAppVersion;
