<template>
	<view class="container">
		<view class="tips">长按图片调整顺序，点击预览可裁剪图片</view>
		
		
		<view class="photo-grid-table">
		      <view
		        class="photo-item"
		        v-for="(item, index) in AlbumStore.Album"
		        :key="index"
		        :style="{
		          transform: `translate(${draggingIndex === index ? dragOffset.x + 'px' : '0'}, ${draggingIndex === index ? dragOffset.y + 'px' : '0'})`,
		          zIndex: draggingIndex === index ? 100 : 1,
		        }"
		        @touchstart="onTouchStart(index, $event)"
		        @touchmove="onTouchMove($event)"
		        @touchend="onTouchEnd"
		      >
		        <image :src="item" style="height: 100%; width: 100%;" mode="aspectFill"></image>
		        <!-- <view style="width: 100%;height: 100%;background-color: aqua;"></view> -->
				<view class="delete-btn" @tap.stop="deletePhoto(index)">
		          <u-icon name="close" color="#fff" size="25rpx"></u-icon>
		        </view>
		        <view class="preview-center-text" @tap="handleToEditor(index)">预览</view>
		      </view>
			  <view class="photo-add-btn" @tap="keepUpload">
				  <image src="https://cdn.law.xiaomugua.cn/minip/camera_icon.svg" style="width: 54rpx;height: 50rpx;" mode="aspectFill"></image>
				  <view>添加图片</view>
			  </view>
		</view>
		
		<view class="upload-button" @tap="nextStep">
			<button class="btn">确认上传</button>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { useAlbumStore } from '@/store/index.js';
	import { getContractResult, createConversationIdResult, getPictureContent, updatePictureContent } from '@/api/photo.js';
	import toast from '@/libs/function/toast.js';
	import { baseUrl } from '@/utils/request.js';
	import { onShow } from '@dcloudio/uni-app';
	
	const AlbumStore = useAlbumStore();
	
	//向后端发送图片请求回来的数据
	const backData = ref([]);
	const cookie = ref('');
	const conversationId = ref('');
	
	onShow(() => {
		cookie.value = uni.getStorageSync('wxcookies') || uni.getStorageSync('cookies') || '';
	});
	
	//删除当前图片
	const deletePhoto = (index) => {
		if (AlbumStore.Album.length == 1) {
			uni.showModal({
				title: '提示',
				content: '删除后将返回拍照页',
				showCancel: true,
				cancelText: '取消', // 取消按钮的文字
				confirmText: '确定',
				success: (res) => {
					if (res.cancel) {
						// 用户点击了“取消”按钮
						console.log('用户点击了取消按钮');
					} else {
						// 用户点击了“确定”按钮
						AlbumStore.clearAlbum();
						back();
					}
				}
			});
			return;
		}
		uni.showModal({
			title: '提示',
			content: '确定删除该文件？',
			showCancel: true,
			cancelText: '取消', // 取消按钮的文字
			confirmText: '确定',
			success: (res) => {
				if (res.confirm) {
					AlbumStore.deletePhoto(index);
				}
			}
		});
	};
	
	const handleToEditor = (index) =>{
		uni.navigateTo({
			url: '/subpackage/photoEditor/photoEditor?photoIndex=' + index
		});
	}
	
	//继续上传
	const keepUpload = () => {
		uni.setStorageSync('add', true);
		uni.navigateTo({
			url: '/subpackage/photoScan/photoScan'
		});
	};
	
	//下一步展示识别结果
	const nextStep = () => {
		uni.showModal({
			title: '提示',
			content: '确定后将开始对内容进行文字提取',
			showCancel: true,
			cancelText: '取消', // 取消按钮的文字
			confirmText: '确定',
			success: (success) => {
				//点击确定
				if (success.confirm) {
					if (AlbumStore.Album.length > 10) {
						uni.showModal({
							title: '提示',
							content: '最多可以上传10张，我们将为你自动选择前10张进行识别',
							showCancel: true,
							cancelText: '取消', // 取消按钮的文字
							confirmText: '确定',
							success: async (res) => {
								if (res.confirm) {
									uploadPhoto();
								}
							}
						});
					} else {
						uploadPhoto();
					}
				}
			}
		});
	};
	
	const uploadPhoto = async () => {
		uni.showLoading({
			title: '内容识别中',
			mask: true // 设置是否显示透明蒙层，防止触摸穿透
		});
		let data = {
			conversationId: '',
			nickName: '',
			fileBelongType: '3',
			permissionName: 'user-contract'
		};
		await createConversationIdResult()
			.then((res) => {
				console.log(res);
				if (res.code === 200) {
					data = {
						...data,
						conversationId: res.data
					};
					conversationId.value = res.data;
				} else {
					uni.hideLoading();
					return toast(res.message);
				}
			})
			.catch((err) => {
				uni.hideLoading();
				console.log(err);
				return toast(err.message);
			});
	
		console.log('上传图片中');
		// 将 uni.uploadFile 转换为返回 Promise 的形式
		const uploadFilePromise = (filePath, formData, header) => {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: baseUrl + '/api2/intelligent/intelligentProSaveFile',
					filePath: filePath,
					name: 'file', // 对应后端接收文件的字段名称
					formData: formData,
					header: header,
					success: (res) => {
						resolve(res);
					},
					fail: (err) => {
						reject(err);
					}
				});
			});
		};
	
		// 收集所有上传文件的 Promise
		console.log(431, AlbumStore.Album);
		const uploadPromises = AlbumStore.Album.map((filePath, index) => {
			return uploadFilePromise(
				filePath,
				{
					...data,
					pictureIndex: index + 1
				},
				{
					'Content-Type': 'application/json',
					cookie: cookie.value
				}
			);
		});
	
		try {
			// 等待所有上传完成
			await Promise.all(uploadPromises);
			console.log('所有图片上传完成',uploadPromises);
	
			// 发送 getPictureContent 请求
			await getPictureContent(conversationId.value)
				.then((res) => {
					console.log(res);
					
					if (res.code === 200) {
						console.log(111);
						AlbumStore.setPhotoContent(res.data)
						uni.navigateTo({
							url: `/subpackage/photoTextProofread/photoTextProofread?conversationId=${conversationId.value}`
						});
					} else {
						toast(res.message);
					}
				})
				.catch((err) => {
					console.log(err);
					toast(err.message);
				});
		} catch (error) {
			console.error('上传图片失败', error);
			toast('上传图片失败，请重试');
		} finally {
			uni.hideLoading();
		}
	};
	
	
	// 当前拖动相关数据
	const draggingIndex = ref(null);
	const dragOffset = ref({ x: 0, y: 0 });
	const startTouch = ref({ x: 0, y: 0 });
	const startPos = ref([]);
	const targetIndex = ref(null); // 用于记录拖动目标的索引
	
	// 获取元素位置信息
	const getElementsPositions = () => {
	  return new Promise((resolve) => {
	    const query = uni.createSelectorQuery().selectAll('.photo-item');
	    query.boundingClientRect((rects) => {
	      resolve(rects.map((rect) => ({ x: rect.left, y: rect.top, width: rect.width, height: rect.height })));
	    }).exec();
	  });
	};
	
	// 拖动开始
	const onTouchStart = async (index, event) => {
	  draggingIndex.value = index;
	
	  // 获取触摸开始位置
	  startTouch.value = {
	    x: event.touches[0].clientX,
	    y: event.touches[0].clientY,
	  };
	
	  // 获取所有元素位置信息
	  startPos.value = await getElementsPositions();
	};
	
	// 拖动中
	const onTouchMove = (event) => {
	  if (draggingIndex.value === null) return;
	
	  const currentTouch = {
	    x: event.touches[0].clientX,
	    y: event.touches[0].clientY,
	  };
	
	  // 更新拖动偏移量
	  dragOffset.value = {
	    x: currentTouch.x - startTouch.value.x,
	    y: currentTouch.y - startTouch.value.y,
	  };
	
	  // 检测是否需要记录目标索引
	  startPos.value.forEach((pos, idx) => {
	    if (idx !== draggingIndex.value) {
	      const isOverlapping =
	        currentTouch.x > pos.x &&
	        currentTouch.x < pos.x + pos.width &&
	        currentTouch.y > pos.y &&
	        currentTouch.y < pos.y + pos.height;
	
	      if (isOverlapping) {
	        targetIndex.value = idx; // 记录目标索引
	      }
	    }
	  });
	};
	
	// 拖动结束
	const onTouchEnd = () => {
	  if (draggingIndex.value !== null && targetIndex.value !== null) {
	    // 交换顺序
	    const temp = AlbumStore.Album[draggingIndex.value];
	    AlbumStore.Album.splice(draggingIndex.value, 1);
	    AlbumStore.Album.splice(targetIndex.value, 0, temp);
	  }
	
	  // 重置拖动状态
	  draggingIndex.value = null;
	  targetIndex.value = null;
	  dragOffset.value = { x: 0, y: 0 };
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
		padding: 30rpx;
	}
	.tips{
		font-family: PingFang SC, PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #FCA206;
		justify-content: stretch;
	}
	.photo-grid-table {
	  display: grid;
	  grid-template-columns: repeat(3, 1fr);
	  gap: 20rpx;
	  margin-top: 40rpx;
	  box-sizing: border-box;
	}
	.photo-item{
		height: 210rpx;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		overflow: hidden;
		position: relative;
	}
	.photo-add-btn{
		@extend .photo-item;
		@include center(flex);
		background: #F5F7FA;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		border: 2rpx dashed #D1D1D1;
		font-family: PingFang SC, PingFang SC;
		font-weight: bold;
		font-size: 26rpx;
		color: #2F303C;
	}
	.delete-btn{
		width: 40rpx;
		height: 40rpx;
		background: rgba(34,34,34,0.48);
		border-radius: 0rpx 16rpx 0rpx 34rpx;
		position: absolute;
		right: 0;
		top: 0;
		padding-left: 5rpx;
		padding-bottom: 5rpx;
		@include center(flex);
	}
	.preview-center-text{
		width: 84rpx;
		height: 40rpx;
		background: rgba(34,34,34,0.48);
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		@include center(absolute);
		@include center(flex);
		font-family: PingFang SC, PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #FFFFFF;
	}
	
	.upload-button{
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		background-color: white;
		position: fixed;
		left: 0;
		bottom: 0;
		padding-top: 15rpx;
		padding-bottom: env(safe-area-inset-bottom);
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
