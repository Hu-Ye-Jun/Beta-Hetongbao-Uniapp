<template>
	<view class="topTitle">
	  <image
		@tap="handleGoBack"
		style="
		  width: 18rpx;
		  height: 30rpx;
		  margin-right: 20rpx;
		  transform: rotate(180deg);
		"
		src="https://cdn.law.xiaomugua.cn/minip/back.png"
		mode="scaleToFill"
	  ></image>
	  <view>{{ title }}</view>
	</view>
</template>

<script setup>
	const porp = defineProps(['title'])
	const handleGoBack = () => {
	  uni.navigateBack({
	    delta: 1,
	  });
	};
</script>

<style lang="scss">
.topTitle {
  display: flex;
  align-items: center;
  font-size: 18px;
  padding: 110rpx 0 20rpx 30rpx;
}
</style>