<template>
  <my-popup
    v-model:show="visible"
    @update:show="onVisibleChange"
    :maskClosable="!isFirstTime"
  >
    <view class="custom-dialog" :class="{ 'first-time': isFirstTime }">
      <view class="dialog-header">
        <text class="dialog-title">{{
          isFirstTime ? "欢迎使用" : "设置"
        }}</text>
      </view>
      <view class="dialog-content">
        <view v-if="isFirstTime" class="welcome-message">
          <text>请选择您的星座，获取专属运势分析</text>
        </view>
        <view class="input-group">
          <text class="label">选择您的星座</text>
          <picker
            mode="selector"
            :range="zodiacSigns"
            :value="zodiacIndex"
            @change="onZodiacChange"
            class="input"
          >
            <view class="picker-value">{{ currentZodiacLocal }}</view>
          </picker>
        </view>
        <view class="input-group">
          <text class="label">生日</text>
          <picker
            mode="date"
            :value="birthDateLocal"
            @change="onBirthDateChange"
            class="input"
          >
            <view class="picker-value">{{ birthDateLocal }}</view>
          </picker>
        </view>
      </view>
      <view class="dialog-footer" :class="{ 'single-button': isFirstTime }">
        <button v-if="!isFirstTime" class="btn cancel" @tap="cancel">
          取消
        </button>
        <button class="btn confirm" @tap="confirm">
          {{ isFirstTime ? "开始探索" : "确定" }}
        </button>
      </view>
    </view>
  </my-popup>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import MyPopup from "@/components/my-popup/my-popup.vue";

// 定义组件属性
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  currentZodiac: {
    type: String,
    default: "白羊座",
  },
  birthDate: {
    type: String,
    default: "",
  },
  isFirstTime: {
    type: Boolean,
    default: false,
  },
});

// 定义组件事件
const emit = defineEmits(["update:show", "save"]);

// 星座相关数据
const zodiacSigns = [
  "白羊座",
  "金牛座",
  "双子座",
  "巨蟹座",
  "狮子座",
  "处女座",
  "天秤座",
  "天蝎座",
  "射手座",
  "摩羯座",
  "水瓶座",
  "双鱼座",
];

// 本地状态
const visible = ref(props.show);
const currentZodiacLocal = ref(props.currentZodiac);
const birthDateLocal = ref(
  props.birthDate || new Date().toISOString().split("T")[0]
);

// 计算当前星座在数组中的索引
const zodiacIndex = computed(() => {
  return zodiacSigns.findIndex((item) => item === currentZodiacLocal.value);
});

// 监听props变化
watch(
  () => props.show,
  (newVal) => {
    visible.value = newVal;
  }
);

watch(
  () => props.currentZodiac,
  (newVal) => {
    currentZodiacLocal.value = newVal;
  }
);

watch(
  () => props.birthDate,
  (newVal) => {
    if (newVal) {
      birthDateLocal.value = newVal;
    }
  }
);

// 根据日期计算星座
const getZodiacByDate = (month, day) => {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "水瓶座";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "双鱼座";
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "白羊座";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "金牛座";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return "双子座";
  } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return "巨蟹座";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "狮子座";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "处女座";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return "天秤座";
  } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return "天蝎座";
  } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return "射手座";
  } else {
    return "摩羯座";
  }
};

// 处理星座选择变更
const onZodiacChange = (e) => {
  const index = e.detail.value;
  currentZodiacLocal.value = zodiacSigns[index];
};

// 处理生日日期变更
const onBirthDateChange = (e) => {
  birthDateLocal.value = e.detail.value;
  // 根据生日自动推算星座
  const [year, month, day] = birthDateLocal.value.split("-").map(Number);
  currentZodiacLocal.value = getZodiacByDate(month, day);
};

// 处理弹窗显示状态变更
const onVisibleChange = (newVal) => {
  // 如果是首次使用，不允许通过点击蒙层关闭弹窗
  if (props.isFirstTime && !newVal) {
    return;
  }
  emit("update:show", newVal);
};

// 取消操作
const cancel = () => {
  // 如果是首次使用，不允许取消
  if (props.isFirstTime) {
    return;
  }

  // 重置为原始值
  currentZodiacLocal.value = props.currentZodiac;
  birthDateLocal.value =
    props.birthDate || new Date().toISOString().split("T")[0];
  emit("update:show", false);
};

// 确认保存
const confirm = () => {
  const userData = {
    sign: currentZodiacLocal.value,
    birthDate: birthDateLocal.value,
  };

  // 保存到本地存储
  uni.setStorageSync("userZodiac", userData);

  emit("save", userData);
  emit("update:show", false);
};
</script>

<style lang="scss">
// 弹窗样式
.custom-dialog {
  background: #fff;
  width: 600rpx;
  border-radius: 24rpx;
  overflow: hidden;

  &.first-time {
    width: 650rpx;
  }

  .dialog-header {
    padding: 30rpx;
    text-align: center;
    border-bottom: 1rpx solid #eee;

    .dialog-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .dialog-content {
    padding: 30rpx;

    .welcome-message {
      text-align: center;
      margin-bottom: 30rpx;
      color: #666;
      font-size: 28rpx;
      line-height: 1.5;
    }

    .input-group {
      margin-bottom: 20rpx;

      .label {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 10rpx;
        display: block;
      }
    }
  }

  .dialog-footer {
    display: flex;
    border-top: 1rpx solid #eee;

    &.single-button .btn.confirm {
      border-right: none;
      background-color: #6366f1;
      color: #fff;
    }

    .btn {
      flex: 1;
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      font-size: 32rpx;
      border: none;
      background: none;

      &.cancel {
        color: #666;
        border-right: 1rpx solid #eee;
      }

      &.confirm {
        color: #6366f1;
      }

      &:active {
        background-color: #f5f5f5;
      }
    }
  }
}

.picker-value {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  font-size: 28rpx;
}
</style>
