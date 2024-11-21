const fs = require('fs'); // 文件系统模块
const path = require('path'); // 路径模块

// 云存储的基础路径
const baseUrl = 'https://env-00jxhk9ji189.normal.cloudstatic.cn/photos/';
// 本地图片文件夹路径
const folderPath = './photos';

// 读取文件夹内容
try {
    const files = fs
        .readdirSync(folderPath) // 读取文件夹内容
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file)); // 只保留图片文件

    if (files.length === 0) {
        console.log('文件夹中没有找到图片文件！');
        return;
    }

    // 生成 JSON 数据
    const jsonData = files.map(file => ({
        fileName: file, // 文件名
        url: `${baseUrl}${file}` // 拼接的 URL
    }));

    // 输出 JSON 文件
    const outputFile = './image_data.json'; // 输出文件路径
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log(`JSON 文件已生成：${outputFile}`);
} catch (error) {
    console.error('发生错误：', error.message);
}
