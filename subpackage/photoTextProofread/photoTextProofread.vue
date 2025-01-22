<template>
	<view class="container">
		<swiper class="swiper" @change="onPopSwiperChange" :current="currentIndex">
			<swiper-item v-for="(item, index) in AlbumStore.Album" :key="index" class="item">
				<view class="pic">
					<image :src="item" mode="aspectFill" style="width: 100%;height: 100%;"/>
				</view>
				<view class="content">
					<scroll-view class="scroll-area" scroll-y>
						{{ AlbumStore.photoContent[index].pictureContent }}
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
		<view class="footer">
			<view class="pagination-buttons">
				<view class="prev-button" @tap="goToPre">{{ '<' }}</view>
					{{ currentIndex + 1 }}/{{ AlbumStore.Album.length }}
				<view class="next-button" @tap="goToNext">{{ '>' }}</view>
			</view>
			<button class="btn" @tap="comfirmContractReview">提交审查</button>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { useAlbumStore } from '@/store/index.js';
	import { getContractResult, updatePictureContent } from '@/api/photo.js';
	import { onLoad } from '@dcloudio/uni-app';
	import toast from '@/libs/function/toast.js';
	
	const AlbumStore = useAlbumStore();
	const currentIndex = ref(0);
	const conversationId = ref('');
	const backData = ref([]);
	
	onLoad((option) => {
		conversationId.value = decodeURIComponent(option.conversationId)
	})
	
	const onSwiperChange = (e) => {
		currentIndex.value = e.detail.current;
	};
	
	//轮播图上一页
	const goToPre = () => {
		if (currentIndex.value > 0) {
			currentIndex.value--;
		}
	};
	
	//轮播图下一页
	const goToNext = () => {
		if (currentIndex.value < AlbumStore.Album.length - 1) {
			currentIndex.value++;
		}
	};
	
	const comfirmContractReview = async () => {
		uni.showLoading({
			title: '内容分析中',
			mask: true // 设置是否显示透明蒙层，防止触摸穿透
		});
		const updateData = AlbumStore.photoContent.map((item, index) => {
			return {
				conversationId: conversationId.value,
				pictureIndex: index,
				fileContent: item.pictureContent
			};
		});
		await updatePictureContent(updateData)
			.then(async (res) => {
				console.log(res);
				if (res.code === 200) {
					await getContractResult({ conversationId: conversationId.value })
						.then((res) => {
							console.log(res);
							if (res.code === 200) {
								const { conversationId, reviewDetail, companyNameList } = res.data;
								backData.value = reviewDetail;
								uni.setStorageSync('backData', backData.value);
								let time = setTimeout(() => {
									clearInterval(time);
									uni.navigateTo({
										url: `/pages/uploadtext/uploadtext?companyName=${companyNameList}&conversationId=${conversationId}&reviewDetail=${encodeURIComponent(
											JSON.stringify(reviewDetail)
										)} `
									});
								}, 500);
							} else {
								toast(res.message);
							}
						})
						.catch((err) => {
							console.log(err);
							toast(err.message);
						})
						.finally(() => {
							uni.hideLoading();
						});
				} else {
					toast(res.message);
				}
			})
			.catch((err) => {
				console.log(err);
				toast(err.message);
			})
			.finally(() => {
				uni.hideLoading();
			});
	};
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
		height: 100vh;
		width: 100vw;
	}
	.swiper {
		width: 100%;
		height: 1150rpx;
		.pic{
			height: 560rpx;
		}
		.item{
			display: flex;
			flex-direction: column;
		}
		.content{
			padding: 30rpx;
			height: 580rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 26rpx;
			color: #222222;
			display: flex;
			flex-direction: column;
			.scroll-area{
				height: 540rpx;
				flex: 1;
			}
		}
	}
	
	.footer{
		width: 100%;
		height: 220rpx;
		@include center(flex);
		padding-top: 15rpx;
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #F5F6F9 ;
		
		.pagination-buttons{
			display: flex;
			flex-direction: row;
			margin-bottom: 55rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 800;
			font-size: 26rpx;
			color: #1A1C27;
			line-height: 44rpx;
			.prev-button,.next-button {
				@include center(flex);
				width: 44rpx;
				height: 44rpx;
				background: #FFFFFF;
				border-radius: 50%;
				margin: 0 44rpx;
			}
		}
		.btn{
			background: #2651F9;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			width: 690rpx;
			height: 92rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 92rpx;
		}
	}
</style>
