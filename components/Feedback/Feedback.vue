<template>
	<view class="feedback" @tap="handlePath(path.path)">
		<view class="feedback-left">
			<image :src="path.pictrue" mode=""></image>
			<view class="text">{{ path.title }}</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps(['path']);
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
const userId = ref('');

const handlePath = (path) => {
	console.log(path);
	if (userId.value) {
		uni.navigateTo({
			url: `/subpackage/${path}/${path}`
		});
	} else {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	}
};
onShow(async () => {
	userId.value = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
});
</script>

<style lang="scss" scoped>
.feedback {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;

	.feedback-left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	image {
		width: 40rpx;
		height: 40rpx;
		vertical-align: middle;
	}

	.text {
		font-size: 24rpx;
		color: rgba(0, 0, 0, 1);
		margin-top: 15rpx;
	}

	.iconfont {
		display: inline-block;
		font-size: 26rpx;
	}
}
</style>
