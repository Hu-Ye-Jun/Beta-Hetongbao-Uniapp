<template>
  <view v-if="isPopupVisible" class="popup-wrapper">
    <view class="popup-content">
      <image
        class="background-image"
        src="https://cdn.law.xiaomugua.cn/minip/popup_bg.png"
        alt="背景图片"
      />
      <view class="title">提示</view>
      <view class="content">如您已使用优惠券，取消后将退回至您的账户</view>
      <view class="popup-actions">
        <button @click="handleCancel">取消</button>
        <button @click="handleConfirm">确认</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const isPopupVisible = ref(false);
const emit = defineEmits(["confirm", "cancel"]);

const show = function () {
  isPopupVisible.value = true;
};

const hide = () => {
  isPopupVisible.value = false;
};

// 处理取消操作
const handleCancel = () => {
  isPopupVisible.value = false;
  emit("cancel");
};

// 处理确认操作
const handleConfirm = () => {
  isPopupVisible.value = false;
  emit("confirm");
};
defineExpose({
  show,
  hide,
});
</script>

<style lang="scss" scoped>
.popup-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  :not(.background-image) {
    z-index: 2;
  }

  .popup-content {
    width: 600rpx;
    height: 345rpx;
    padding: 35rpx 48rpx;
    border-radius: 10px;
    text-align: center;
    position: relative;

    .title {
      font-family: MicrosoftYaHei;
      font-weight: bold;
      font-size: 35rpx;
      color: #1f2020;
      margin-top: 30rpx;
    }

    .content {
      font-family: MicrosoftYaHei;
      font-weight: 400;
      font-size: 25rpx;
      color: #575757;
    }
  }

  .popup-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  button {
    border: none;
    width: 244rpx;
    height: 85rpx;
    background: #4d6ef1;
    border-radius: 12rpx;
    cursor: pointer;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    font-size: 29rpx;
    color: #ffffff;
  }

  button:first-child {
    background: #f3f3f3;
    color: #484848;
    margin-right: 20rpx;
  }
}
</style>
