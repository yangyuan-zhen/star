<template>
  <div id="app"></div>
</template>

<script>
export default {
  name: "App",
  components: {},
  onLaunch() {
    const updateManager = uni.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        console.log("发现新版本");
      }
    });

    updateManager.onUpdateReady(() => {
      uni.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: (res) => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed(() => {
      uni.showModal({
        title: "更新提示",
        content: "新版本下载失败，请检查网络后重试",
        showCancel: false,
      });
    });
  },
};
</script>
