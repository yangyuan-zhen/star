'use strict';
const { default: axios } = require('axios');

exports.main = async (event, context) => {
    try {
        const { imageUrl } = event;

        console.log('开始执行云函数，接收到的参数:', event);

        if (!imageUrl) {
            console.log('图片URL为空');
            return {
                code: -1,
                msg: '图片URL不能为空'
            }
        }

        console.log('准备下载图片:', imageUrl);

        const response = await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://byteimg.com',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Connection': 'keep-alive'
            },
            maxRedirects: 5
        });

        console.log('图片下载成功，内容长度:', response.data.length);

        const fileName = `${Date.now()}-${Math.random().toString(36).slice(-6)}.png`;
        const cloudPath = `book_images/${fileName}`;

        console.log('开始上传到云存储，路径:', cloudPath);

        const uploadResult = await uniCloud.uploadFile({
            fileContent: response.data,
            cloudPath: cloudPath
        });

        console.log('上传成功，结果:', uploadResult);

        const tempFileURLResult = await uniCloud.getTempFileURL({
            fileList: [uploadResult.fileID]
        });

        console.log('获取临时URL结果:', tempFileURLResult);

        return {
            code: 0,
            msg: 'success',
            data: {
                fileID: uploadResult.fileID,
                tempFileURL: tempFileURLResult.fileList[0].tempFileURL
            }
        }

    } catch (error) {
        console.error('处理图片失败:', error);
        return {
            code: -1,
            msg: `处理图片失败: ${error.message}`,
            error: error.message
        }
    }
}