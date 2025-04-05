'use strict';

exports.main = async (event, context) => {
    console.log('云函数开始执行, 环境信息:', context);
    console.log('传入参数:', event);

    const db = uniCloud.database();
    // 同时支持两种参数名，兼容测试和生产环境
    const zodiacSign = event.zodiacSign || event.zodiac || '白羊座'; // 默认白羊座

    // 星座名称映射表（中文到英文字段名）
    const zodiacFieldMap = {
        '白羊座': 'aries',
        '金牛座': 'taurus',
        '双子座': 'gemini',
        '巨蟹座': 'cancer',
        '狮子座': 'leo',
        '处女座': 'virgo',
        '天秤座': 'libra',
        '天蝎座': 'scorpio',
        '射手座': 'sagittarius',
        '摩羯座': 'capricorn',
        '水瓶座': 'aquarius',
        '双鱼座': 'pisces'
    };

    // 获取对应的英文字段名
    const fieldName = zodiacFieldMap[zodiacSign];

    if (!fieldName) {
        return {
            code: 1,
            message: '无效的星座名称',
            data: null
        };
    }

    try {
        // 查询星座数据
        console.log('正在查询星座:', zodiacSign, '字段名:', fieldName);
        const result = await db.collection('star_signs').field({
            [fieldName]: 1,
            daily_luck: 1
        }).get();

        console.log('查询结果:', JSON.stringify(result));

        if (result.data && result.data.length > 0) {
            // 获取星座数据
            const starSign = result.data[0][fieldName];
            const dailyLuck = result.data[0].daily_luck;

            if (!starSign) {
                return {
                    code: 1,
                    message: '未找到该星座数据',
                    data: null
                };
            }

            // 返回星座信息和运势
            return {
                code: 0,
                message: '获取星座运势成功',
                data: {
                    zodiacInfo: {
                        name: starSign.name,
                        element: starSign.element,
                        dateRange: starSign.date_range,
                        traits: starSign.traits || []
                    },
                    fortune: dailyLuck
                }
            };
        } else {
            return {
                code: 1,
                message: '未找到星座数据',
                data: null
            };
        }
    } catch (error) {
        console.error('获取星座运势失败:', error);
        return {
            code: -1,
            message: '获取星座运势失败: ' + error.message,
            data: null
        };
    }
};

// 获取随机的幸运星座（除了自己）
function getRandomZodiac(currentZodiac) {
    const allZodiacs = [
        "白羊座", "金牛座", "双子座", "巨蟹座",
        "狮子座", "处女座", "天秤座", "天蝎座",
        "射手座", "摩羯座", "水瓶座", "双鱼座"
    ];

    // 移除当前星座
    const otherZodiacs = allZodiacs.filter(z => z !== currentZodiac);

    // 随机选择一个作为幸运星座
    return otherZodiacs[Math.floor(Math.random() * otherZodiacs.length)];
} 