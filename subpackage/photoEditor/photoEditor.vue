<template>
	<view class="container">
		<view class="img">
			<image :src="AlbumStore.Album[photoIndex]" mode="aspectFit" style="height: 100%;"></image>
		</view>
		<button class="footer-btn" @tap="handleOk">确认</button>
	</view>
</template>

<script setup>
	import { useAlbumStore } from '@/store/index.js';
	import { onLoad } from '@dcloudio/uni-app';
	import { ref } from 'vue';
	const AlbumStore = useAlbumStore();
	const photoIndex = ref()
	
	onLoad((option) => {
		photoIndex.value = option.photoIndex
	})
	
	const handleOk = () =>{
		uni.navigateBack()
	}
</script>

<style lang="scss">
	// 水平垂直居中mixin
	@mixin center($type: flex, $direction: column) {
	  @if $type == flex {
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    flex-direction: $direction;
	  } @else if $type == grid {
	    display: grid;
	    place-items: center;
	  } @else {
	    position: absolute;
	    transform: translate(-50%, -50%);
	    top: 50%;
	    left: 50%;
	  }
	}
	
	.container{
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100vh;
	}
	.img{
		flex: 1;
		@include center(flex);
		padding: 0 10rpx;
		box-sizing: border-box;
	}
	.footer-btn{
		background: #2651F9;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin-bottom: env(safe-area-inset-bottom);
		height: 92rpx;
		width: 690rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 500;
		font-size: 32rpx;
		color: #FFFFFF;
	}
</style>
