"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  MyPopup();
}
const MyPopup = () => "../my-popup/my-popup.js";
const _sfc_main = {
  __name: "zodiac-settings",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    currentZodiac: {
      type: String,
      default: "白羊座"
    },
    birthDate: {
      type: String,
      default: ""
    },
    isFirstTime: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:show", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
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
      "双鱼座"
    ];
    const visible = common_vendor.ref(props.show);
    const currentZodiacLocal = common_vendor.ref(props.currentZodiac);
    const birthDateLocal = common_vendor.ref(
      props.birthDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    );
    const zodiacIndex = common_vendor.computed(() => {
      return zodiacSigns.findIndex((item) => item === currentZodiacLocal.value);
    });
    common_vendor.watch(
      () => props.show,
      (newVal) => {
        visible.value = newVal;
      }
    );
    common_vendor.watch(
      () => props.currentZodiac,
      (newVal) => {
        currentZodiacLocal.value = newVal;
      }
    );
    common_vendor.watch(
      () => props.birthDate,
      (newVal) => {
        if (newVal) {
          birthDateLocal.value = newVal;
        }
      }
    );
    const getZodiacByDate = (month, day) => {
      if (month === 1 && day >= 20 || month === 2 && day <= 18) {
        return "水瓶座";
      } else if (month === 2 && day >= 19 || month === 3 && day <= 20) {
        return "双鱼座";
      } else if (month === 3 && day >= 21 || month === 4 && day <= 19) {
        return "白羊座";
      } else if (month === 4 && day >= 20 || month === 5 && day <= 20) {
        return "金牛座";
      } else if (month === 5 && day >= 21 || month === 6 && day <= 21) {
        return "双子座";
      } else if (month === 6 && day >= 22 || month === 7 && day <= 22) {
        return "巨蟹座";
      } else if (month === 7 && day >= 23 || month === 8 && day <= 22) {
        return "狮子座";
      } else if (month === 8 && day >= 23 || month === 9 && day <= 22) {
        return "处女座";
      } else if (month === 9 && day >= 23 || month === 10 && day <= 23) {
        return "天秤座";
      } else if (month === 10 && day >= 24 || month === 11 && day <= 22) {
        return "天蝎座";
      } else if (month === 11 && day >= 23 || month === 12 && day <= 21) {
        return "射手座";
      } else {
        return "摩羯座";
      }
    };
    const onZodiacChange = (e) => {
      const index = e.detail.value;
      currentZodiacLocal.value = zodiacSigns[index];
    };
    const onBirthDateChange = (e) => {
      birthDateLocal.value = e.detail.value;
      const [year, month, day] = birthDateLocal.value.split("-").map(Number);
      currentZodiacLocal.value = getZodiacByDate(month, day);
    };
    const onVisibleChange = (newVal) => {
      if (props.isFirstTime && !newVal) {
        return;
      }
      emit("update:show", newVal);
    };
    const cancel = () => {
      if (props.isFirstTime) {
        return;
      }
      currentZodiacLocal.value = props.currentZodiac;
      birthDateLocal.value = props.birthDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      emit("update:show", false);
    };
    const confirm = () => {
      const userData = {
        sign: currentZodiacLocal.value,
        birthDate: birthDateLocal.value
      };
      common_vendor.index.setStorageSync("userZodiac", userData);
      emit("save", userData);
      emit("update:show", false);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.isFirstTime ? "欢迎使用" : "设置"),
        b: __props.isFirstTime
      }, __props.isFirstTime ? {} : {}, {
        c: common_vendor.t(currentZodiacLocal.value),
        d: zodiacSigns,
        e: zodiacIndex.value,
        f: common_vendor.o(onZodiacChange),
        g: common_vendor.t(birthDateLocal.value),
        h: birthDateLocal.value,
        i: common_vendor.o(onBirthDateChange),
        j: !__props.isFirstTime
      }, !__props.isFirstTime ? {
        k: common_vendor.o(cancel)
      } : {}, {
        l: common_vendor.t(__props.isFirstTime ? "开始探索" : "确定"),
        m: common_vendor.o(confirm),
        n: __props.isFirstTime ? 1 : "",
        o: __props.isFirstTime ? 1 : "",
        p: common_vendor.o(onVisibleChange),
        q: common_vendor.o(($event) => visible.value = $event),
        r: common_vendor.p({
          maskClosable: !__props.isFirstTime,
          show: visible.value
        })
      });
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/zodiac-settings/zodiac-settings.js.map
