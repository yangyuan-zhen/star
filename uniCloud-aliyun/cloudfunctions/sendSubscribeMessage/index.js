'use strict';

const appid = 'wx9652b8bd8ff5fdd2'; // 替换为你的小程序 appid
const appSecret = '1229611739903e409c15a9893b067a66'; // 替换为你的小程序 app secret

exports.main = async (event, context) => {
    const { openid, zodiacName, overallStar, careerStar, loveStar, healthStar } = event;

    try {
        // 1. 获取小程序全局接口调用凭据 access_token
        const accessTokenRes = await uniCloud.httpclient.request(
            `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appSecret}`,
            { dataType: 'json' }
        );

        if (accessTokenRes.status !== 200 || !accessTokenRes.data.access_token) {
            throw new Error('获取access_token失败：' + JSON.stringify(accessTokenRes.data));
        }

        const accessToken = accessTokenRes.data.access_token;

        // 2. 发送订阅消息
        const sendRes = await uniCloud.httpclient.request(
            `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`,
            {
                method: 'POST',
                dataType: 'json',
                contentType: 'json',
                data: {
                    touser: openid, // 接收者（用户）的 openid
                    template_id: '4Z-MQULVPsg5IeFzS7X6MSrjAs8FihGfoV7FuxG5FcM', // 所需下发的订阅模板id
                    page: 'pages/index/index', // 点击模板卡片后跳转的页面
                    data: {
                        // 模板内容，格式形如 { "key1": { "value": any } }
                        phrase1: { value: zodiacName }, // 星座名称
                        number2: { value: overallStar }, // 运势星级
                        number3: { value: loveStar }, // 爱情运势
                        number4: { value: careerStar }, // 事业运势
                        number5: { value: healthStar } // 健康运势
                    }
                }
            }
        );

        if (sendRes.status !== 200 || sendRes.data.errcode !== 0) {
            throw new Error('发送订阅消息失败：' + JSON.stringify(sendRes.data));
        }

        return {
            success: true,
            message: '订阅消息发送成功'
        };
    } catch (error) {
        console.error('发送订阅消息错误：', error);
        return {
            success: false,
            message: error.message
        };
    }
}; 