'use strict';

// 星座运势关键词
const luckKeywords = {
    // 运势等级
    levels: ['极好', '不错', '一般', '较差'],

    // 运势描述
    descriptions: [
        '今天的你充满活力，各方面都很顺利。',
        '今天适合处理重要事务，会有不错的结果。',
        '今天的你思维敏捷，创造力爆棋。',
        '今天的你容易受到表扬，成就感满满。',
        '今天的你有点小情绪，需要调整心态。',
        '今天需要多加小心，避免冲动决策。',
        '今天的你有点疲惫，注意休息。',
        '今天可能遇到一些小挫折，保持耐心。',
        '今天心情有些起伏，可以做些放松的事。',
        '今天的你内心平静，容易有深度思考。',
        '今天是适合新开始的日子，勇敢尝试吧。',
        '今天你的直觉特别准，多听从内心的声音。',
        '今天适合整理和规划，会有不错的收获。'
    ],

    // 幸运颜色
    colors: ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色', '粉色', '白色', '黑色', '金色', '银色'],

    // 幸运数字范围
    luckyNumber: [1, 10],

    // 建议做的事
    goodFor: [
        '与朋友聚会',
        '独处思考',
        '学习新知识',
        '运动健身',
        '购物',
        '旅行',
        '告白',
        '谈判',
        '签约',
        '投资理财',
        '清理空间',
        '冥想放松',
        '创作'
    ],

    // 不宜做的事
    badFor: [
        '熬夜',
        '争吵',
        '冲动消费',
        '做重大决定',
        '激烈运动',
        '喝酒',
        '吃太辣的食物',
        '长途驾驶',
        '借钱给他人',
        '参与高风险活动',
        '搬家',
        '手术'
    ]
};

// 随机获取数组中的一个元素
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 获取指定范围内的随机整数
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 添加这个新函数，用于随机获取数组中的多个元素
function getRandomMultipleElements(array, count) {
    // 复制原数组，避免修改原数组
    const shuffled = [...array];

    // 随机打乱数组
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 返回前count个元素
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 生成一条星座运势
function generateLuck(starSign) {
    const level = getRandomElement(luckKeywords.levels);
    const description = getRandomElement(luckKeywords.descriptions);
    const luckyColor = getRandomElement(luckKeywords.colors);
    const luckyNumber = getRandomNumber(luckKeywords.luckyNumber[0], luckKeywords.luckyNumber[1]);

    // 修改这里：随机获取2-3个"宜做"的事项
    const goodForItems = getRandomMultipleElements(luckKeywords.goodFor, getRandomNumber(2, 3));
    // 随机获取2-3个"忌做"的事项
    const badForItems = getRandomMultipleElements(luckKeywords.badFor, getRandomNumber(2, 3));

    // 根据运势等级计算综合指数
    let overallIndex;
    switch (level) {
        case '极好':
            overallIndex = getRandomNumber(85, 99);
            break;
        case '不错':
            overallIndex = getRandomNumber(70, 84);
            break;
        case '一般':
            overallIndex = getRandomNumber(50, 69);
            break;
        case '较差':
            overallIndex = getRandomNumber(30, 49);
            break;
        default:
            overallIndex = getRandomNumber(50, 80);
    }

    // 根据星座元素调整运势倾向
    let elementBonus = {};
    switch (starSign.element) {
        case '火象':
            elementBonus = { career: 10, health: 5 };
            break;
        case '土象':
            elementBonus = { wealth: 10, health: 5 };
            break;
        case '风象':
            elementBonus = { love: 10, career: 5 };
            break;
        case '水象':
            elementBonus = { love: 10, wealth: 5 };
            break;
        default:
            elementBonus = {};
    }

    // 各分项指数，考虑星座元素特性
    const loveIndex = Math.min(99, getRandomNumber(30, 99) + (elementBonus.love || 0));
    const careerIndex = Math.min(99, getRandomNumber(30, 99) + (elementBonus.career || 0));
    const wealthIndex = Math.min(99, getRandomNumber(30, 99) + (elementBonus.wealth || 0));
    const healthIndex = Math.min(99, getRandomNumber(30, 99) + (elementBonus.health || 0));

    return {
        date: new Date().toISOString().split('T')[0], // 当前日期，格式：YYYY-MM-DD
        overall: {
            level: level,
            index: overallIndex,
            description: description
        },
        love: {
            index: loveIndex,
            description: `爱情指数 ${loveIndex}，${loveIndex > 70 ? '桃花运旺盛' : loveIndex > 50 ? '感情稳定' : '需要多关注'}`
        },
        career: {
            index: careerIndex,
            description: `事业指数 ${careerIndex}，${careerIndex > 70 ? '工作顺利' : careerIndex > 50 ? '平稳发展' : '需要努力'}`
        },
        wealth: {
            index: wealthIndex,
            description: `财富指数 ${wealthIndex}，${wealthIndex > 70 ? '财运亨通' : wealthIndex > 50 ? '收支平衡' : '避免大额支出'}`
        },
        health: {
            index: healthIndex,
            description: `健康指数 ${healthIndex}，${healthIndex > 70 ? '精力充沛' : healthIndex > 50 ? '状态一般' : '注意休息'}`
        },
        luckyColor: luckyColor,
        luckyNumber: luckyNumber,
        goodFor: goodForItems.join(', '),
        badFor: badForItems.join(', ')
    };
}

// 在updateDailyLuck函数中添加英文名称映射
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

// 修改更新部分的代码
exports.main = async (event, context) => {
    const db = uniCloud.database();
    const starSignsCollection = db.collection('star_signs');

    try {
        // 获取记录
        const starSignsResult = await starSignsCollection.get();
        if (!starSignsResult.data || starSignsResult.data.length === 0) {
            return {
                code: 1,
                message: '未找到星座数据',
                data: null
            };
        }

        // 生成运势并更新
        const dailyLuck = generateLuck(starSignsResult.data[0]);

        // 更新daily_luck字段
        await starSignsCollection.doc(starSignsResult.data[0]._id).update({
            daily_luck: dailyLuck,
            updated_at: new Date()
        });

        return {
            code: 0,
            message: '星座运势更新成功',
            data: {
                date: new Date().toISOString().split('T')[0]
            }
        };
    } catch (error) {
        console.error('更新星座运势失败:', error);
        return {
            code: -1,
            message: '更新星座运势失败: ' + error.message,
            data: null
        };
    }
}; 