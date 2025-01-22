<template>
  <view class="item">
    <image
      src="https://cdn.law.xiaomugua.cn/minip/collectItemIcon.png"
      class="icon"
      mode="aspectFit"
    ></image>
    <text class="title">{{ name }}</text>
    <text class="tiem">{{ time }}</text>
  </view>
</template>

<script setup>
defineProps(["name", "time"]);
</script>

<style lang="scss">
.item {
  width: 686rpx;
  height: 180rpx;
  opacity: 1;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 8rpx 16rpx rgba(0, 0, 0, 0.06);
  position: relative;
  .icon {
    width: 32rpx;
    height: 36rpx;
    position: absolute;
    left: 38rpx;
    top: 42rpx;
  }
  .title {
    font-size: 28rpx;
    font-weight: 500;
    top: 38rpx;
    left: 98rpx;
    position: absolute;
  }
  .tiem {
    font-size: 24rpx;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    left: 98rpx;
    top: 90rpx;
    position: absolute;
  }
}
</style>
