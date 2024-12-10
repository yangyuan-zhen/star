'use strict';
exports.main = async (event, context) => {
    const { imageUrl } = event;

    try {
        // 下载远程图片
        const res = await uniCloud.downloadFile({
            fileID: imageUrl
        });

        // 上传到云存储
        const uploadRes = await uniCloud.uploadFile({
            cloudPath: `temp/${Date.now()}.jpg`,
            fileContent: res.fileContent
        });

        return {
            code: 0,
            msg: 'success',
            data: {
                tempFileURL: uploadRes.fileID
            }
        }
    } catch (error) {
        return {
            code: -1,
            msg: error.message || '处理图片失败'
        }
    }
}; 