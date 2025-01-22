<template>
	<view class="modal-content">
		<view class="modal-title">
			<text>提示</text>
		</view>

		<view class="modal-message">
			<text>是否继续拍照</text>
		</view>

		<view class="modal-buttons">
			<view @click="onConfirm" class="continue-button">
				<text>继续拍照</text>
			</view>
			<view @click="onCancel" class="finished">
				<text>全部完成</text>
			</view>
		</view>

		<view class="checkbox-container">
			<checkbox-group>
				<label>
					<checkbox :checked="isChecked" @click="isChecked = !isChecked" />
				</label>
			</checkbox-group>
			<text class="checkbox-text">不再询问直接添加已拍</text>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isChecked = ref(false);

const emit = defineEmits(['confirm', 'cancel']);

function onConfirm() {
	emit('confirm', isChecked.value);
	console.log(isChecked.value);
}

function onCancel() {
	emit('cancel');
}
</script>

<style lang="scss" scoped>
.modal-content {
	position: fixed; /* 保持弹窗固定在屏幕上 */
	top: 50%; /* 将弹窗的顶部设置在屏幕的 50% */
	left: 50%; /* 将弹窗的左侧设置在屏幕的 50% */
	transform: translate(-50%, -50%); /* 使用 transform 将弹窗水平和垂直居中 */
	background: #fff;
	border-radius: 10px;
	width: 500rpx;
	height: 383rpx;
	text-align: center;
	z-index: 9999;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* 添加阴影 */
}

.modal-title {
	position: absolute;
	left: 50%; /* 将元素的左边界设置为 50% */
	transform: translateX(-50%); /* 将元素的水平位置移回自身宽度的 50%，实现居中 */
	top: 50rpx;
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
	color: #333;
}

.modal-message {
	position: absolute;
	left: 50%; /* 将元素的左边界设置为 50% */
	transform: translateX(-50%); /* 将元素的水平位置移回自身宽度的 50%，实现居中 */
	top: 135rpx;
	font-size: 16px;
	margin-bottom: 20px;
	color: #666;
}

.modal-buttons {
	display: flex;
	justify-content: space-around;
	position: absolute;
	left: 50%; /* 将元素的左边界设置为 50% */
	transform: translateX(-50%); /* 将元素的水平位置移回自身宽度的 50%，实现居中 */
	bottom: 100rpx;
	.continue-button {
		width: 190rpx;
		height: 66rpx;
		border-radius: 66rpx;
		border: 2rpx solid rgb(183, 183, 183); /* 添加黑色实线边框 */
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 53rpx;
	}

	.finished {
		width: 190rpx;
		height: 66rpx;
		border-radius: 66rpx;
		border: 1rpx solid rgb(183, 183, 183); /* 添加黑色实线边框 */
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	text {
		color: rgb(75, 75, 75);
	}
}

.checkbox-container {
	display: flex;
	align-items: center;
	width: auto; /* 可以设置为 auto，确保容器自适应内容 */
	position: absolute;
	justify-content: center;
	left: 50%; /* 将元素的左边界设置为 50% */
	transform: translateX(-50%); /* 将元素的水平位置移回自身宽度的 50%，实现居中 */
	bottom: 33rpx;
}

.checkbox-text {
	margin-left: 10px;
	font-size: 14px;
	color: black;
	white-space: nowrap; /* 强制文本不换行 */
}
</style>
