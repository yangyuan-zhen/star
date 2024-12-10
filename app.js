App({
    onLaunch: function () {
        // 初始化逻辑
    }
})

// 添加全局错误处理
Vue.config.errorHandler = (err, vm, info) => {
    console.error('全局错误:', err);
    // 上报错误到监控平台
    reportError(err, info);
};

// 添加网络状态监听
uni.onNetworkStatusChange(function (res) {
    if (!res.isConnected) {
        uni.showToast({
            title: '网络连接已断开',
            icon: 'none'
        });
    }
}); 