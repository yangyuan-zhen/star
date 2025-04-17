'use strict';

// 导入云数据库
const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
    try {
        // 1. 获取所有需要发送订阅消息的用户
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // 从 subscriptions 集合获取昨天订阅的用户
        const usersToNotify = await db.collection('subscriptions')
            .where({
                subscribeDate: yesterdayStr // 查找昨天订阅的用户
            })
            .get();

        // 如果没有用户需要通知，直接返回
        if (!usersToNotify.data || usersToNotify.data.length === 0) {
            return {
                success: true,
                message: '没有需要发送订阅消息的用户'
            };
        }

        console.log(`找到${usersToNotify.data.length}位需要发送订阅消息的用户`);

        // 2. 为每个用户生成今日运势并发送订阅消息
        const sendResults = [];
        for (const user of usersToNotify.data) {
            try {
                // 获取用户星座的运势数据
                const fortuneResult = await uniCloud.callFunction({
                    name: 'getZodiacFortune',
                    data: {
                        zodiac: user.zodiacName,
                        zodiacSign: user.zodiacName
                    }
                });

                if (fortuneResult.result.code !== 0) {
                    console.error(`获取${user.zodiacName}运势失败:`, fortuneResult.result.message);
                    continue;
                }

                const fortuneData = fortuneResult.result.data.fortune;

                // 准备发送的数据
                const sendData = {
                    openid: user.openid,
                    zodiacName: user.zodiacName,
                    overallStar: `${Math.round((fortuneData.overall?.index || 50) / 20)}/5`, // 转换为1-5星评级
                    careerStar: `${Math.round((fortuneData.career?.index || 50) / 20)}/5`,
                    loveStar: `${Math.round((fortuneData.love?.index || 50) / 20)}/5`,
                    healthStar: `${Math.round((fortuneData.health?.index || 50) / 20)}/5`
                };

                // 调用发送订阅消息的云函数
                const result = await uniCloud.callFunction({
                    name: 'sendSubscribeMessage',
                    data: sendData
                });

                sendResults.push({
                    openid: user.openid,
                    result: result.result
                });

                // 发送成功后删除该订阅记录(一次性订阅)
                if (result.result.success) {
                    await db.collection('subscriptions').doc(user._id).remove();
                }
            } catch (userError) {
                console.error(`处理用户${user.openid}的订阅消息失败:`, userError);
                sendResults.push({
                    openid: user.openid,
                    error: userError.message
                });
            }
        }

        return {
            success: true,
            message: '订阅消息发送完成',
            results: sendResults
        };
    } catch (error) {
        console.error('每日运势定时任务错误：', error);
        return {
            success: false,
            message: error.message
        };
    }
}; 