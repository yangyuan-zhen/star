'use strict';

const appid = 'wx9652b8bd8ff5fdd2'; // 请替换为你的小程序 appid
const appSecret = '1229611739903e409c15a9893b067a66'; // 请替换为你的小程序 app secret

exports.main = async (event, context) => {
    const { code, zodiacName, subscribeDate } = event;

    try {
        // 1. 通过 code 获取用户的 openid
        const wxRes = await uniCloud.httpclient.request(
            `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`,
            { dataType: 'json' }
        );

        if (wxRes.status !== 200 || !wxRes.data.openid) {
            throw new Error('获取openid失败：' + JSON.stringify(wxRes.data));
        }

        const openid = wxRes.data.openid;

        // 2. 将订阅信息存入数据库
        const db = uniCloud.database();
        const subscriptionsCollection = db.collection('subscriptions');

        // 查询是否已存在相同的订阅记录
        const existingRecord = await subscriptionsCollection
            .where({
                openid,
                subscribeDate
            })
            .get();

        // 如果已存在记录，则更新
        if (existingRecord.data && existingRecord.data.length > 0) {
            await subscriptionsCollection.doc(existingRecord.data[0]._id).update({
                zodiacName,
                updateTime: new Date().getTime()
            });
        } else {
            // 不存在则创建新记录
            await subscriptionsCollection.add({
                openid,
                zodiacName,
                subscribeDate,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime()
            });
        }

        return {
            success: true,
            message: '订阅信息保存成功'
        };
    } catch (error) {
        console.error('保存订阅信息错误：', error);
        return {
            success: false,
            message: error.message
        };
    }
}; 