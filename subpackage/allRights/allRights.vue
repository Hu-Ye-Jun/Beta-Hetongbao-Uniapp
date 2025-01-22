<template>
	<view class="container">
		<!-- <view class="title"><text>展示剩余次数及总次数</text></view> -->
		<view class="main" v-if="combination">
			<view class="item">
				<text>合同审查</text>
				<text>{{ combination.freeCount + combination.cardCount }}</text>
			</view>
			<view class="item">
				<text>主体审查</text>
				<text>{{ combination.bodyReviewCount }}</text>
			</view>
			<view class="item">
				<text>查看合同模板</text>
				<text>{{ combination.templateViewCount }}</text>
			</view>
			<!-- <view class="item">
				<text>下载合同模板</text>
				<text>{{ combination.contractTemplateDownloadCount }}</text>
			</view> -->
		</view>
		<view v-if="!combination" class="title">您还没有购买任何权益哦~</view>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { request } from '../../utils/request.js';

const userId = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
const combination = ref({});

// 获取所有权益
const getAllRights = async () => {
	const res = await request('/api2/contractReview/getContractCount', 'POST', {
		// "userId": "99b60654-4851-4890-9c04-019fec0a3c38",
		userId: userId
	});
	if (res.data) {
		console.log(res);
		combination.value = res.data.combination;
		console.log(combination.value);
	}
};
getAllRights();
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	flex-direction: column;
	background: rgba(249, 250, 254, 1);
	.title {
		font-size: 28rpx;
		font-weight: 400;
		letter-spacing: 0rpx;
		line-height: 38.42rpx;
		color: rgba(89, 89, 89, 0.45);
		margin-left: 42rpx;
		margin-top: 38rpx;
		margin-bottom: 32rpx;
	}
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 650rpx;
			height: 106rpx;
			opacity: 1;
			background: rgba(255, 255, 255, 1);
			border-bottom: 2rpx solid rgba(224, 224, 224, 1);
			padding-left: 32rpx;
			padding-right: 32rpx;
		}
	}
}
</style>
