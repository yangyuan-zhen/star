'use strict';
const { default: axios } = require('axios');

exports.main = async (event, context) => {
    try {
        const { imageUrl } = event;

        // 详细的日志记录
        console.log('开始执行云函数，环境信息:', {
            context: context,
            provider: context.PLATFORM,
            spaceInfo: context.SPACEINFO
        });

        if (!imageUrl) {
            throw new Error('图片URL不能为空');
        }

        // 验证URL格式
        try {
            new URL(imageUrl);
        } catch (e) {
            throw new Error('无效的图片URL');
        }

        // 添加超时和重试机制
        const response = await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': imageUrl,
                'Origin': '*'
            },
            maxRedirects: 5,
            validateStatus: status => status >= 200 && status < 300
        });

        if (!response.data || !response.data.length) {
            throw new Error('下载的图片内容为空');
        }

        // 生成唯一文件名
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(-6)}.png`;
        const cloudPath = `book_images/${fileName}`;

        // 上传到云存储
        const uploadResult = await uniCloud.uploadFile({
            fileContent: response.data,
            cloudPath: cloudPath
        });

        if (!uploadResult || !uploadResult.fileID) {
            throw new Error('上传到云存储失败');
        }

        // 获取临时访问链接
        const tempFileURLResult = await uniCloud.getTempFileURL({
            fileList: [uploadResult.fileID]
        });

        if (!tempFileURLResult || !tempFileURLResult.fileList || !tempFileURLResult.fileList[0]) {
            throw new Error('获取临时访问链接失败');
        }

        return {
            code: 0,
            msg: 'success',
            data: {
                fileID: uploadResult.fileID,
                tempFileURL: tempFileURLResult.fileList[0].tempFileURL
            }
        }

    } catch (error) {
        console.error('云函数执行失败:', {
            error: error,
            stack: error.stack,
            message: error.message
        });

        return {
            code: -1,
            msg: `处理图片失败: ${error.message}`,
            error: error.message
        }
    }
}

