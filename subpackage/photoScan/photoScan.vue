<template>
	<view class="camera-area">
		<camera class="camera" device-position="back" flash="off" />
		<!-- <view class="image">
			<view class="content" v-if="AlbumStore.Album.length === 0">
				<text>请拍照</text>
			</view>

			<view class="content" v-else @click="finishPhoto">
				<text class="Capture">已拍{{ AlbumStore.Album.length }}张</text>
				<uni-icons type="right" size="17"></uni-icons>
			</view>
		</view> -->

		<!-- 判断是否点击了拍照和是否在弹窗中进行了勾选 -->
		<view v-if="showModal === true && noAsk === false">
			<my-modal title="提示" content="是否继续拍照" @confirm="handleConfirm" @cancel="AllFinish" />
		</view>

		<!-- 底部控制栏 -->
		<view class="footer">
			<!-- 相册按钮 -->
			<view class="album" @click="toAlbum">
				<view class="Nonphoto">
					<u-image src="https://cdn.law.xiaomugua.cn/minip/photo_album_import_icon.svg" width="46rpx" height="40rpx"></u-image>
				</view>
				<text>相册导入</text>
			</view>

			<!-- 拍照按钮 -->
			<view class="takePhoto" @click="takePhoto">
				<view class="outer-circle">
					<view class="inner-circle"></view>
				</view>
			</view>
			
			<view class="photo" v-if="AlbumStore.Album.length > 0" @tap="finishPhoto">
				<view class="selected-image-count">{{ AlbumStore.Album.length }}</view>
				<image :src="AlbumStore.Album[AlbumStore.Album.length - 1]" mode="scaleToFill" />
				<view class="ok-btn">完成></view>
			</view>
			<!-- 取消拍照按钮 -->
			<view class="cancel" @click="cancelPhoto" v-else>
				<view class="cancelButton">
					<u-image src="https://cdn.law.xiaomugua.cn/minip/cancel_camera_icon.svg" width="46rpx" height="46rpx"></u-image>
				</view>
				<text class="cancelText">取消拍摄</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import MyModal from '@/components/MyModal.vue';
//引入Pinia中的相册数据
import { useAlbumStore } from '@/store/index.js';
const AlbumStore = useAlbumStore();

//判断是否出现弹窗
const showModal = ref(false);
//判断是否勾选了不再询问的变量
const noAsk = ref(false);
const cameraContext = uni.createCameraContext(); // 创建摄像头上下文

// 页面加载时读取存储的 Album 数据
onShow(() => {
	const storedAlbum = uni.getStorageSync('Album');
	console.log(66, AlbumStore.Album.length);
});

// 拍照逻辑
function takePhoto() {
	//弹窗的同时不允许拍照
	if (showModal.value === true && noAsk.value === false) {
		return;
	}
	cameraContext.takePhoto({
		quality: 'high',
		success: (res) => {
			// 如果是重新拍照，则替换对应的照片
			if (typeof uni.getStorageSync('replace') === 'number') {
				AlbumStore.replacePhoto(uni.getStorageSync('replace'), res.tempImagePath);
				uni.removeStorageSync('replace');
				uni.navigateBack({ delta: 1 });
			} else {
				//这对应首次拍照的情况
				AlbumStore.setAlbum(res.tempImagePath);
				// 如果是第一次拍照，或者用户没有选择继续拍照，则弹窗
				// if (AlbumStore.Album.length === 0 || noAsk.value === false) {
				// 	showModal.value = true; // 只有当noAsk为false时才显示弹窗
				// }
			}
		},
		fail: (err) => {
			console.error('拍照失败:', err);
		}
	});
}

const cancelPhoto = () => {
	//弹窗的同时不允许点击取消
	if (showModal.value === true && noAsk.value === false) {
		return;
	}
	//如果是重新拍照回来的，那点击取消就跳回照片页面
	if (uni.getStorageSync('add') === true || typeof uni.getStorageSync('replace') === 'number') {
		uni.removeStorageSync('replace');
		uni.removeStorageSync('add');
		uni.navigateBack({
			delta: 1 // 返回的页面数，默认为1，即返回上一页面
		});
	} else {
		//否则就是第一次拍照，点击取消就弹窗确认
		uni.showModal({
			title: '提示',
			content: '确定取消后您拍的文件将会丢失',
			showCancel: true,
			cancelText: '取消',
			confirmText: '确定',

			success: (res) => {
				if (res.confirm) {
					// 继续拍照的逻辑
					AlbumStore.clearAlbum();
					//这里应该是退出拍照功能，但是目前没有这个功能
					uni.switchTab({
						url: `/pages/index/index`
					});
				}
			}
		});
	}
};

// 处理用户点击相册
const toAlbum = () => {
	//弹窗的同时不允许点击相册
	if (showModal.value === true && noAsk.value === false) {
		return;
	}
	if (typeof uni.getStorageSync('replace') === 'number') {
		uni.chooseImage({
			count: 1, // 可选择的照片数量
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
			sourceType: ['album'], // 只从相册选择
			success: (res) => {
				// 将选中的照片文件路径存储到数组中

				AlbumStore.replacePhoto(uni.getStorageSync('replace'), res.tempFilePaths[0]);
				uni.removeStorageSync('replace');
				uni.navigateBack({
					delta: 1 // 返回的页面数，默认为1，即返回上一页面
				});
			},
			fail: (err) => {
				// console.error('选择照片失败:', err);
			}
		});
	} else {
		uni.chooseImage({
			count: 99, // 可选择的照片数量
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
			sourceType: ['album'], // 只从相册选择
			success: (res) => {
				// 将选中的照片文件路径存储到数组中
				AlbumStore.setAlbum(res.tempFilePaths);
			},
			fail: (err) => {
				// console.error('选择照片失败:', err);
			}
		});
	}
};

// 处理用户点击继续拍照
const handleConfirm = (isChecked: boolean) => {
	showModal.value = false; // 隐藏弹窗
	// console.log(isChecked);
	noAsk.value = isChecked; // 更新noAsk的值
};

//点击全部完成，进入图片识别页面
const finishPhoto = () => {
	uni.navigateTo({
		url: '/subpackage/photoPreview/photoPreview'
		// url: '/subpackage/photoDetail/photoDetail'
	});
};

// 处理用户弹窗点击全部完成
const AllFinish = () => {
	showModal.value = false; // 隐藏弹窗
	uni.navigateTo({
		url: '/subpackage/photoDetail/photoDetail'
	});
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;

	.navbar {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 20rpx;
		height: 195rpx;

		.back {
			position: absolute;
			left: 58rpx;
			bottom: 42rpx;
		}

		text {
			position: absolute;
			bottom: 42rpx;
			font-size: 34rpx;
			font-weight: bold;
		}
	}
}

.title {
	font-size: 16px;
}

.camera-area {
	position: relative;
	text-align: center;
	display: flex;
	flex-direction: column;
	height: 100vh;
	.camera {
		flex: 1;
		width: 100%;
		/* 确保摄像头组件占满父容器 */
		height: 100%;
		/* 确保摄像头组件占满父容器 */
	}

	.image {
		position: absolute;
		width: 234rpx;
		height: 63rpx;
		top: 40rpx;
		left: 50%;
		/* 将元素的左边放到屏幕的50%处 */
		transform: translateX(-50%);
		/* 向左移动元素自身宽度的50%，从而实现水平居中 */
		background: rgba(34, 34, 34, 0.5);
		border-radius: 32rpx 32rpx 32rpx 32rpx;
		display: flex;
		color: #fff;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */

		text {
			font-size: 26rpx;
			font-weight: bold;
			padding: 0 27rpx;
		}
	}
}

.footer {
	display: flex;
	justify-content: space-between;
	justify-content: center;
	align-items: center;
	position: relative;
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 195rpx;
	background-color: #000;
	padding-bottom: env(safe-area-inset-bottom);
	color: #fff;
	font-family: PingFang SC, PingFang SC;
	font-weight: 500;
	font-size: 26rpx;

	.album {
		left: 102rpx;
		position: absolute;
		text-align: center;
		width: 120rpx;
		height: 135rpx;
		
		display: flex;
		flex-direction: column;
		align-items: center;

		.Nonphoto {
			width: 96rpx;
			height: 96rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			// background-color: #c0c0c0;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}

	.photo {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		right: 120rpx;
		image{
			width: 100%;
			height: 100%;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
		}
		.selected-image-count{
			width: 36rpx;
			height: 26rpx;
			background: #2651F9;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			position: absolute;
			top: 6rpx;
			left: 6rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 20rpx;
			color: #FFFFFF;
		}
		
		.ok-btn{
			background: #2651F9;
			border-radius: 12rpx 12rpx 8rpx 8rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 38rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 24rpx;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.takePhoto {
		.outer-circle {
			width: 120rpx;
			/* 大圆的宽度 */
			height: 120rpx;
			/* 大圆的高度 */
			border-radius: 100rpx;
			/* 使其变为圆形 */
			background-color: #fff;
			/* 大圆的颜色 */
			display: flex;
			justify-content: center;
			align-items: center;

			.inner-circle {
				width: 105rpx;
				/* 小圆的宽度 */
				height: 105rpx;
				/* 小圆的高度 */
				border-radius: 50rpx;
				/* 使其变为圆形 */
				background-color: #404040;
				/* 小圆的颜色 */
			}
		}
	}

	.cancel {
		position: absolute;
		right: 120rpx;
		width: 120rpx;
		height: 135rpx;
		
		display: flex;
		flex-direction: column;
		align-items: center;

		.cancelButton{
			width: 96rpx;
			height: 96rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.cancel-icon {
			opacity: 0.6;
			/* 设置透明度 */
		}

		.cancelText {
			font-size: 27rpx;
		}
	}
}
</style>
