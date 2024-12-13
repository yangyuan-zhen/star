import { ref } from 'vue'

// 创建用户信息的响应式引用
export const userInfo = ref(null)

// 检查登录状态
export const checkLoginStatus = () => {
    const storedUserInfo = uni.getStorageSync('userInfo')
    if (storedUserInfo) {
        userInfo.value = JSON.parse(storedUserInfo)
        return true
    }
    return false
}

// 处理微信登录
export const handleWxLogin = async () => {
    try {
        // 获取用户登录凭证
        const { code } = await uni.login({
            provider: 'weixin'
        })

        // 获取用户信息
        const { userInfo: wxUserInfo } = await uni.getUserProfile({
            desc: '用于完善用户资料'
        })

        // 保存用户信息
        userInfo.value = wxUserInfo
        uni.setStorageSync('userInfo', JSON.stringify(wxUserInfo))

        uni.showToast({
            title: '登录成功',
            icon: 'success'
        })

        return wxUserInfo
    } catch (error) {
        console.error('登录失败:', error)
        // 只有在非用户取消的情况下才显示错误提示
        if (error.errMsg && !error.errMsg.includes('cancel')) {
            uni.showToast({
                title: '登录失败',
                icon: 'none'
            })
        }
        throw error
    }
}

// 退出登录
export const logout = () => {
    userInfo.value = null
    uni.removeStorageSync('userInfo')
    uni.showToast({
        title: '已退出登录',
        icon: 'success'
    })
} 