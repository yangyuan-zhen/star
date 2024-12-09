const result = await uniCloud.uploadFile({
    fileContent: response.data,
    cloudPath: `images/${Date.now()}.png`
});

// 获取临时访问链接
const { fileList } = await uniCloud.getTempFileURL({
    fileList: [result.fileID]
});

return {
    code: 0,
    msg: 'success',
    data: {
        fileID: result.fileID,
        tempFileURL: fileList[0].tempFileURL  // 这个就是实际可访问的图片URL
    }
} 