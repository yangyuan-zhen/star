<template>
  <view
    v-if="showPopup"
    class="uni-popup"
    :class="['uni-popup--' + type, showPopup ? 'active' : '']"
    @touchmove.stop.prevent
  >
    <view
      class="uni-popup__mask"
      @click="onMaskClick"
      :style="{ opacity: showPopup ? 1 : 0 }"
    />
    <view
      class="uni-popup__wrapper"
      :class="['uni-popup--' + type, showPopup ? 'active' : '']"
    >
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  name: "MyPopup",
  props: {
    type: {
      type: String,
      default: "center",
    },
    maskClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showPopup: false,
    };
  },
  methods: {
    open() {
      console.log("Opening popup");
      this.showPopup = true;
    },
    close() {
      console.log("Closing popup");
      this.showPopup = false;
    },
    onMaskClick() {
      if (this.maskClick) {
        this.close();
      }
    },
  },
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
