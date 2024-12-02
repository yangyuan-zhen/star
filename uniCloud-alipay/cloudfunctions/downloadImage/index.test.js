const main = require('./index.js').main;

async function test() {
    const event = {
        imageUrl: "https://p3-bot-workflow-sign.byteimg.com/tos-cn-i-mdko3gqilj/8ae37a0e22e14760b38eec8d8a1975da.png~tplv-mdko3gqilj-image.png?rk3s=c8fe7ad5&x-expires=1764234959&x-signature=WWOyP6ZOb7v9hhpYmXsxfJjAQT4%3D"
    };

    try {
        const result = await main(event);
        console.log('测试结果:', result);
    } catch (error) {
        console.error('测试失败:', error);
    }
}

test(); 