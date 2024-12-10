const cacheManager = {
    // 缓存配置
    config: {
        maxAge: 5 * 60 * 1000,  // 5分钟
        maxSize: 5 * 1024 * 1024  // 5MB
    },

    // 设置缓存
    async set(key, data) {
        try {
            const cacheItem = {
                data,
                timestamp: Date.now(),
                size: JSON.stringify(data).length
            };

            // 检查缓存大小
            await this.checkCacheSize();

            uni.setStorageSync(key, cacheItem);
        } catch (error) {
            console.error('缓存写入失败:', error);
        }
    },

    // 获取缓存
    get(key) {
        try {
            const cacheItem = uni.getStorageSync(key);
            if (cacheItem && Date.now() - cacheItem.timestamp < this.config.maxAge) {
                return cacheItem.data;
            }
            return null;
        } catch (error) {
            console.error('缓存读取失败:', error);
            return null;
        }
    }
};

export default cacheManager; 