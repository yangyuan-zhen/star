// 添加性能监控工具
const performanceMonitor = {
    // 页面加载时间
    pageLoadTime: {},

    // API请求时间
    apiRequestTime: {},

    // 开始计时
    startTimer(key) {
        this.pageLoadTime[key] = Date.now();
    },

    // 结束计时并记录
    endTimer(key) {
        if (this.pageLoadTime[key]) {
            const duration = Date.now() - this.pageLoadTime[key];
            console.log(`${key} 加载耗时: ${duration}ms`);
            // 可以上报到监控平台
            if (duration > 3000) {
                reportPerformanceIssue(key, duration);
            }
        }
    }
};

export default performanceMonitor; 