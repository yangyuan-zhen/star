<template>
  <view
    v-if="show"
    class="uni-popup"
    :class="['uni-popup--' + type, show ? 'active' : '']"
    @touchmove.stop.prevent
  >
    <view
      class="uni-popup__mask"
      @click="onMaskClick"
      :style="{ opacity: show ? 1 : 0 }"
    />
    <view
      class="uni-popup__wrapper"
      :class="['uni-popup--' + type, show ? 'active' : '']"
    >
      <slot />
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "center",
  },
  maskClick: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:show"]);

const onMaskClick = () => {
  if (props.maskClick) {
    emit("update:show", false);
  }
};
</script>

<style>
.uni-popup {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.uni-popup.active {
  opacity: 1;
  visibility: visible;
}

.uni-popup__mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s;
}

.uni-popup.active .uni-popup__mask {
  opacity: 1;
}

.uni-popup__wrapper {
  position: absolute;
  z-index: 999;
  transition: all 0.3s;
}

.uni-popup--center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.uni-popup--center .uni-popup__wrapper {
  transform: scale(1.2);
  opacity: 0;
}

.uni-popup--center.active .uni-popup__wrapper {
  transform: scale(1);
  opacity: 1;
}
</style>
