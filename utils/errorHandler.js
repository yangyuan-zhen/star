const errorHandler = {
    // 全局错误处理
    handleGlobalError(error, vm, info) {
        console.error('全局错误:', error);

        // 错误分类处理
        if (error.name === 'NetworkError') {
            uni.showToast({
                title: '网络连接失败，请检查网络设置',
                icon: 'none'
            });
        } else if (error.name === 'TimeoutError') {
            uni.showToast({
                title: '请求超时，请稍后重试',
                icon: 'none'
            });
        } else {
            uni.showToast({
                title: '操作失败，请稍后重试',
                icon: 'none'
            });
        }

        // 错误上报
        reportError({
            type: error.name,
            message: error.message,
            stack: error.stack,
            info: info,
            page: vm?.$route?.path
        });
    }
};

export default errorHandler; 