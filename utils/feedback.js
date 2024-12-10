const feedback = {
    // 统一的加载提示
    showLoading(title = '加载中...') {
        uni.showLoading({
            title,
            mask: true
        });
    },

    // 统一的结果提示
    showResult(success, message) {
        uni.hideLoading();
        uni.showToast({
            title: message,
            icon: success ? 'success' : 'none',
            duration: success ? 1500 : 3000
        });
    }
};

export default feedback; 