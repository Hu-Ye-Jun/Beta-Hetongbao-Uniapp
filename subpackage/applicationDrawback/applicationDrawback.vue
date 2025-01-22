<template>
  <view class="container">
    <view style="background-color: white">
      <TopTitle title="申请退款"></TopTitle>
    </view>

    <view class="main">
      <view class="item">
        <view class="row" @click="showPopup">
          <text class="item-title">退款原因</text>
          <text
            class="selected"
            :style="{
              color: popupValue !== '点击选择退款原因' ? 'black' : '#cccccc',
            }"
            >{{ popupValue }}</text
          >
          <image
            style="
              width: 13rpx;
              height: 25rpx;
              opacity: 0.5;
              margin-right: 10rpx;
            "
            src="https://cdn.law.xiaomugua.cn/minip/back.png"
            mode="scaleToFill"
          ></image>
        </view>
      </view>
      <view class="item">
        <text class="item-title">退款金额</text>
        <text class="price">¥{{ feFinalAmount }}</text>
        <text class="content"
          >退实际支付的金额数，如使用优惠券退款后将会返回</text
        >
      </view>
      <view class="item" style="margin-top: 20rpx">
        <view class="row">
          <text class="item-title">退款说明</text>
          <text style="font-size: 24rpx; color: #aaaaaa"
            >您还可以输入{{ 170 - refundReason.length }}字</text
          >
        </view>
        <view class="textarea">
          <textarea
            maxlength="170"
            auto-height
            v-model="refundReason"
            placeholder="可详细填写退款说明（选填）"
            placeholder-class="placeholder-style"
          ></textarea>
        </view>
      </view>
    </view>
    <button class="buttom-button" @click="submit">确认提交</button>
    <view class="bottom-space"></view>
  </view>

  <view v-if="popupVisible" class="popup-mask" @click="closePopup">
    <view class="popup-content" @click.stop>
      <view class="popup-title">
        <view class="popup-title-text">请选择退款原因</view>
        <view @click="closePopup">
          <image
            src="https://cdn.law.xiaomugua.cn/minip/popup-close.png"
            mode="scaleToFill"
            class="popup-close"
          ></image>
        </view>
      </view>
      <view
        style="background-color: #f6f6f6; width: 100%; height: 20rpx"
      ></view>
      <view
        class="popup-item"
        v-for="(item, index) in popupItems"
        :class="{ active: index == activeItemIndex }"
        @click="handleSelect(item, index)"
      >
        {{ item }}
        <view class="tick">
          <image
            src="https://cdn.law.xiaomugua.cn/minip/tick.svg"
            style="width: 32rpx; height: 32rpx"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { request } from "../../utils/request";
import { onLoad } from "@dcloudio/uni-app";
import toast from "@/libs/function/toast.js";

const orderId = ref("");
const feFinalAmount = ref("");
const refundReason = ref("");
const userId = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
const popupText = ref("");

onLoad((option) => {
  orderId.value = option.orderId;
  feFinalAmount.value = option.feFinalAmount;
  console.log(option);
});

const activeItemIndex = ref(-1);
const popupItems = reactive([
  "重复购买",
  "套餐选择错了",
  "价格不合理",
  "不想要了",
  "其它",
]);

// 提交
const submit = async () => {
  if (popupValue.value == "点击选择退款原因") {
    toast("请选择退款原因");
    return;
  }
  uni.showLoading({
    title: "提交中",
  });
  try {
    const res = await request("/api2/alipay/refundedOrder", "POST", {
      userId: userId,
      orderId: orderId.value,
      feFinalAmount: feFinalAmount.value,
      refundReason:
        popupValue.value == "其它" ? refundReason.value : popupValue.value,
    });
    if (res.code == 23007) {
      uni.hideLoading();
      uni.showToast({
        title: "提交成功，请耐心等待～",
        icon: "success",
        mask: true,
        duration: 2000,
      });
      setTimeout(() => {
        uni.navigateBack({
          delta: 2,
        });
      }, 2000);
    }
    if (e.code == 19007 || e.code == 19006) {
      uni.hideLoading();
    }
  } catch (e) {
    if (e.code == 19007 || e.code == 19006) {
      uni.hideLoading();
    } else if (e.code == 23007) {
      uni.hideLoading();
      uni.showToast({
        title: "提交成功，请耐心等待～",
        icon: "success",
        mask: true,
        duration: 2000,
      });
      setTimeout(() => {
        uni.navigateBack({
          delta: 2,
        });
      }, 2000);
    } else {
      uni.hideLoading();
      toast(e.message);
    }
  }
};

// 弹出框
const popupValue = ref("点击选择退款原因");

const popupVisible = ref(false);

const showPopup = () => {
  popupVisible.value = true;
};

const closePopup = () => {
  popupVisible.value = false;
};

const handleSelect = (option, index) => {
  console.log("选择了:", option);
  popupValue.value = option;
  activeItemIndex.value = index;
  closePopup();
};
</script>

<style lang="scss" scoped>
.container {
  flex-direction: column;
  background: #f6f6f6;
  position: relative;
  min-height: calc(100vh - env(safe-area-inset-bottom));

  .main {
    margin-top: 20rpx;

    .item {
      border-bottom: 2rpx solid rgba(245, 245, 245, 1);
      background: #fff;
      min-height: 136rpx;
      display: flex;
      flex-direction: column;
      padding: 20rpx 50rpx;
      justify-content: center;
      box-sizing: border-box;
      font-family: Microsoft YaHei;

      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .item-title {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 31rpx;
        color: #555555;
      }

      .price {
        font-weight: bold;
        font-size: 49rpx;
        color: #111111;
        margin-top: 30rpx;
      }

      .selected {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 28rpx;
        color: #cccccc;
        flex: 1;
        margin-left: 44rpx;
      }

      .content {
        font-weight: 400;
        font-size: 24rpx;
        color: #dddddd;
        margin-top: 24rpx;
        margin-bottom: 26rpx;
      }

      .textarea {
        max-width: 668rpx;
        min-height: 228rpx;
        opacity: 1;
        border-radius: 8rpx;
        background: rgba(255, 255, 255, 1);
        // border: 2rpx solid rgba(219, 219, 219, 1);
        margin: 20rpx 0;

        textarea {
          width: 100%;
          min-height: 228rpx;
          padding: 20rpx;
          box-sizing: border-box;
        }
      }
    }
  }

  .buttom-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 98rpx;
    background: rgba(31, 107, 255, 1);
    border-radius: 8rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: 2rpx solid rgba(249, 250, 254, 1);
  }

  .bottom-space {
    height: env(safe-area-inset-bottom);
  }
}

.popup-mask {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.popup-content {
  background-color: #fff;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-item {
  padding: 15px;
  // border-bottom: 0.5px solid #ddd;
  position: relative;
  text-align: left;
  .tick {
    display: none;
    float: right;
  }
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 15px;
    width: 100%;
    height: 0.5px;
    background-color: #ddd;
  }
  &.active {
    color: #4d6ef1;
    .tick {
      display: block;
    }
  }
}

.popup-close {
  // padding: 15px;
  position: absolute;
  right: 40rpx;
  top: 40rpx;
  color: #007aff;
  width: 30rpx;
  height: 30rpx;
}

.popup-title {
  position: relative;
  padding: 15px;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  font-weight: 500;

  .popup-title-text {
    flex: 1;
  }
}

:deep(.placeholder-style) {
  font-family: "Microsoft YaHei";
  font-weight: 400;
  font-size: 28rpx;
  color: #cccccc;
}
</style>
