// 创建一个简单的颜色选择器工具
const colorPicker = {
    show({ color = '#000000', success, fail, complete } = {}) {
        // 使用系统原生的选择器样式
        uni.showActionSheet({
            itemList: ['选择颜色'],
            success: () => {
                // 创建一个隐藏的 input 元素来触发原生颜色选择器
                const input = document.createElement('input');
                input.type = 'color';
                input.value = color;

                // 监听颜色变化
                input.addEventListener('change', (e) => {
                    const selectedColor = e.target.value;
                    if (typeof success === 'function') {
                        success({ color: selectedColor });
                    }
                });

                // 触发点击
                input.click();
            },
            fail: () => {
                if (typeof fail === 'function') {
                    fail({ errMsg: 'cancel' });
                }
            },
            complete: () => {
                if (typeof complete === 'function') {
                    complete();
                }
            }
        });
    }
};

export default colorPicker;