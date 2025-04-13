'use strict';

// 星座运势关键词
const luckKeywords = {
    // 运势等级
    levels: ['极好', '不错', '一般', '较差'],

    // 运势描述
    descriptions: [
        '今天的你充满活力，各方面都很顺利。你的自信心和积极性会感染周围的人，带来更多的机会和成功。',
        '今天适合处理重要事务，会有不错的结果。你的判断力和执行力会让你在工作和生活中取得成果。',
        '今天的你思维敏捷，创造力爆炸。你的想象力和创新能力会帮助你解决问题和实现目标。',
        '今天的你容易受到表扬，成就感满满。你的努力和贡献会被认可和赏识，带来更多的成就和自豪感。',
        '今天的你有点小情绪，需要调整心态。你的情感会影响你的判断和行为，保持平静和理智是非常重要的。',
        '今天需要多加小心，避免冲动决策。你的决定会影响你的未来，保持理智和冷静是非常必要的。',
        '今天的你有点疲惫，注意休息。你的身体和精神需要休息和恢复，确保你有足够的能量和精力来应对挑战。',
        '今天可能遇到一些小挫折，保持耐心。你的耐心和毅力会帮助你度过困难，实现你的目标。',
        '今天心情有些起伏，可以做些放松的事。你的情感需要平衡和调整，做些你喜欢的事情来放松和娱乐。',
        '今天的你内心平静，容易有深度思考。你的内心平静会帮助你更好地思考和反省，找到更好的解决方案和方向。',
        '今天是适合新开始的日子，勇敢尝试吧。你的新开始会带来更多的机会和挑战，保持勇敢和自信的精神。',
        '今天你的直觉特别准，多听从内心的声音。你的直觉会帮助你做出正确的决定，多听从你的内心声音。',
        '今天适合整理和规划，会有不错的收获。你的整理和规划会帮助你更好地管理时间和资源，实现你的目标。'
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
        // 获取所有星座基本信息
        const zodiacNames = [
            '白羊座', '金牛座', '双子座', '巨蟹座',
            '狮子座', '处女座', '天秤座', '天蝎座',
            '射手座', '摩羯座', '水瓶座', '双鱼座'
        ];

        const zodiacElements = {
            '白羊座': '火象', '狮子座': '火象', '射手座': '火象',
            '金牛座': '土象', '处女座': '土象', '摩羯座': '土象',
            '双子座': '风象', '天秤座': '风象', '水瓶座': '风象',
            '巨蟹座': '水象', '天蝎座': '水象', '双鱼座': '水象'
        };

        // 生成当天所有星座的运势
        const date = new Date().toISOString().split('T')[0]; // 当前日期，格式：YYYY-MM-DD

        // 准备批量更新的数据
        const batchData = [];

        // 为每个星座生成运势数据
        for (const zodiacName of zodiacNames) {
            const fortune = generateLuck({ name: zodiacName, element: zodiacElements[zodiacName] });

            // 查询是否已存在该星座的数据
            const existingDoc = await starSignsCollection.where({
                name: zodiacName
            }).get();

            if (existingDoc.data && existingDoc.data.length > 0) {
                // 更新已有记录
                await starSignsCollection.doc(existingDoc.data[0]._id).update({
                    daily_luck: fortune,
                    updated_at: new Date()
                });
            } else {
                // 添加到批量插入数据中
                batchData.push({
                    name: zodiacName,
                    element: zodiacElements[zodiacName],
                    date_range: getDateRange(zodiacName),
                    traits: getTraits(zodiacName),
                    daily_luck: fortune,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        }

        // 如果有新数据需要插入，执行批量插入
        if (batchData.length > 0) {
            await starSignsCollection.add(batchData);
        }

        return {
            code: 0,
            message: '星座运势更新成功',
            data: {
                date: date,
                updatedCount: batchData.length
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

// 获取星座日期范围
function getDateRange(zodiacName) {
    const dateRanges = {
        '白羊座': '3月21日 - 4月19日',
        '金牛座': '4月20日 - 5月20日',
        '双子座': '5月21日 - 6月20日',
        '巨蟹座': '6月21日 - 7月22日',
        '狮子座': '7月23日 - 8月22日',
        '处女座': '8月23日 - 9月22日',
        '天秤座': '9月23日 - 10月22日',
        '天蝎座': '10月23日 - 11月21日',
        '射手座': '11月22日 - 12月21日',
        '摩羯座': '12月22日 - 1月19日',
        '水瓶座': '1月20日 - 2月18日',
        '双鱼座': '2月19日 - 3月20日'
    };
    return dateRanges[zodiacName] || '';
}

// 获取星座特质
function getTraits(zodiacName) {
    const traits = {
        '白羊座': ['热情', '冲动', '有领导力'],
        '金牛座': ['稳重', '固执', '可靠'],
        '双子座': ['好奇', '多变', '聪明'],
        '巨蟹座': ['敏感', '情感丰富', '有同情心'],
        '狮子座': ['自信', '慷慨', '有创造力'],
        '处女座': ['细心', '完美主义', '实际'],
        '天秤座': ['公正', '优雅', '和谐'],
        '天蝎座': ['热情', '神秘', '有洞察力'],
        '射手座': ['乐观', '自由', '冒险'],
        '摩羯座': ['务实', '坚韧', '有责任感'],
        '水瓶座': ['独立', '创新', '人道主义'],
        '双鱼座': ['富有同情心', '直觉', '艺术气质']
    };
    return traits[zodiacName] || [];
} 