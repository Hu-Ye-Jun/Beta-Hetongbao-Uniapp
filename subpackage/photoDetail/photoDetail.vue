<template>
	<view class="container">
		<!-- 中间拍摄的主要内容 -->
		<view class="content">
			<view class="logo">
				<view class="rephoto" @click="rePhoto">
					<image src="https://cdn.law.xiaomugua.cn/minip/rephoto.svg" class="icon1" />
				</view>
				<view class="cancel" @click="deletePhoto">
					<image src="https://cdn.law.xiaomugua.cn/minip/close.svg" class="icon2" />
				</view>
			</view>

			<view class="banner">
				<swiper :current="currentIndex" @change="onSwiperChange">
					<swiper-item v-for="(item, index) in AlbumStore.Album" :key="index">
						<image :src="item" mode="aspectFill" />
					</swiper-item>
				</swiper>
			</view>

			<view class="left" @click="goToPre">
				<uni-icons type="left" size="26"></uni-icons>
			</view>

			<view class="right" @click="goToNext">
				<uni-icons type="right" size="26"></uni-icons>
			</view>

			<view class="pagination">
				<view
					@click="clickPagenum(index)"
					v-for="(page, index) in displayedPages"
					:key="index"
					:class="[
						'page',
						{
							active: page === currentIndex + 1, // 当前页样式
							'gray-background': page > 10 // 页码大于 11 时添加灰色背景
						}
					]"
				>
					{{ page }}
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer">
			<view class="continue" @click="keepUpload">
				<text>继续上传</text>
			</view>

			<view class="next" @click="nextStep">
				<text>下一步</text>
			</view>

			<view class="pageNum">
				<text :class="{ red: AlbumStore.Album.length >= 10 }">已选{{ AlbumStore.Album.length }}张</text>
			</view>
		</view>
	</view>

	<!-- 底部弹出层 -->
	<u-popup :closeOnClickOverlay="false" customStyle="height: 90vh;" :show="popShow" mode="bottom" @close="popClose" @open="popOpen">
		<view class="popup-content">
			<!-- 顶部页码显示 -->
			<view class="page-indicator">
				<text>{{ `${currentPopIndex + 1} / ${items.length}` }}</text>
			</view>

			<!-- 内容显示区域 -->
			<scroll-view class="swiper-container" scroll-y scroll-with-animation>
				<swiper class="swiper" @change="onPopSwiperChange" :current="currentPopIndex">
					<swiper-item v-for="(item, index) in items" :key="index">
						<view class="item">
							<u-textarea
								:maxlength="-1"
								style="height: 100%"
								:fixed="true"
								:class="{ active: index === currentIndex }"
								v-model="item.pictureContent"
								placeholder="请输入内容"
								border="none"
								@focus="handleFocus"
								@blur="handleBlur"
							></u-textarea>
						</view>
					</swiper-item>
				</swiper>
			</scroll-view>

			<!-- 底部按钮区域 -->
			<view class="buttons">
				<button @click="popClose">返回</button>
				<button @click="popComfirm">确定</button>
			</view>
		</view>
	</u-popup>

	<!-- 蒙版 -->
	<view class="mask" v-if="showMask"></view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
//引入Pinia中的相册数据
import { useAlbumStore } from '@/store/index.js';
import { baseUrl } from '@/utils/request.js';
import { getContractResult, createConversationIdResult, getPictureContent, updatePictureContent } from '@/api/photo.js';
import toast from '@/libs/function/toast.js';
const AlbumStore = useAlbumStore();

// 当前 swiper 的索引
const currentIndex = ref(0);
//定义当前应该展示的页码
const displayedPages = ref<number[]>([]);
//判断是否展示蒙版
const showMask = ref(false);
const popShow = ref(false);
//向后端发送图片请求回来的数据
const backData = ref([]);
const cookie = ref('');
const conversationId = ref('');

// 字符串数组列表
const items = ref<any>([]);
let time = null;

// 当前显示的索引
const currentPopIndex = ref(0);

// 聚焦事件处理
const handleFocus = () => {
	// 使用uni.scrollTo滚动到指定位置
	setTimeout(() => {
		wx.pageScrollTo({
			scrollTop: 3000, // 根据需要调整滚动到的高度
			duration: 300 // 滚动动画持续时间
		});
	}, 100); // 延时是为了确保键盘弹出后再进行滚动
};

// 失去焦点事件处理
const handleBlur = () => {
	setTimeout(() => {
		wx.pageScrollTo({
			scrollTop: 0, // 滚动回顶部
			duration: 300 // 滚动动画时长
		});
	}, 100); // 延时滚动，确保键盘已收起
};

// 滑动切换事件
const onPopSwiperChange = (e) => {
	currentPopIndex.value = e.detail.current;
};

onShow(() => {
	cookie.value = uni.getStorageSync('wxcookies') || uni.getStorageSync('cookies') || '';
});

//轮播图上一页
const goToPre = () => {
	if (currentIndex.value > 0) {
		currentIndex.value--;
		changeNum();
	}
};

//轮播图下一页
const goToNext = () => {
	if (currentIndex.value < AlbumStore.Album.length - 1) {
		currentIndex.value++;
		changeNum();
	}
};

const popClose = () => {
	popShow.value = false;
	currentPopIndex.value = 0;
};

const popComfirm = async () => {
	uni.showLoading({
		title: '内容分析中',
		mask: true // 设置是否显示透明蒙层，防止触摸穿透
	});
	const updateData = items.value.map((item: any, index: number) => {
		return {
			conversationId: conversationId.value,
			pictureIndex: index,
			fileContent: item.pictureContent
		};
	});
	await updatePictureContent(updateData)
		.then(async (res: any) => {
			console.log(res);
			if (res.code === 200) {
				await getContractResult({ conversationId: conversationId.value })
					.then((res) => {
						// 使用类型断言，假设 res.data 是对象且包含 data 属性
						if (res.code === 200) {
							const { conversationId, reviewDetail, companyNameList } = res.data;
							backData.value = reviewDetail;
							uni.setStorageSync('backData', backData.value);
							time = setTimeout(() => {
								clearInterval(time);
								popClose();
								currentPopIndex.value = 0;
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
		.catch((err: any) => {
			console.log(err);
			toast(err.message);
		})
		.finally(() => {
			uni.hideLoading();
		});
};

const popOpen = () => {
	popShow.value = true;
};

const clickPagenum = (index: number) => {
	currentIndex.value = displayedPages.value[index] - 1;
	changeNum();
};

//轮播图切换的逻辑
const onSwiperChange = (e: any) => {
	currentIndex.value = e.detail.current;
	changeNum();
};

//页码的改变逻辑
const changeNum = () => {
	// 获取 Album 的总长度
	const totalPages = AlbumStore.Album.length;
	// 清空并更新 displayedPages，设置为包含所有页码的数组
	displayedPages.value = Array.from({ length: totalPages }, (_, index) => index + 1);
};

onMounted(() => {
	changeNum();
});

//重新拍照
const rePhoto = () => {
	uni.showModal({
		title: '提示',
		content: '重拍后确定的文件会替换当前文件',
		showCancel: true,
		cancelText: '取消', // 取消按钮的文字
		confirmText: '确定', // 确定按钮的文字
		success: (res) => {
			if (res.confirm) {
				uni.setStorageSync('replace', currentIndex.value);
				uni.navigateTo({
					url: '/subpackage/photoScan/photoScan'
				});
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		},
		fail: (err) => {
			console.error('调用失败', err);
		}
	});
};

//删除当前图片
const deletePhoto = () => {
	showMask.value = true;
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
					showMask.value = false;
				} else {
					// 用户点击了“确定”按钮
					showMask.value = false;
					AlbumStore.clearAlbum();
					changeNum();
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
			showMask.value = false;
			if (res.confirm) {
				AlbumStore.deletePhoto(currentIndex.value);
				// 如果当前是最后一张照片，currentIndex 需要减1
				if (currentIndex.value >= AlbumStore.Album.length) {
					currentIndex.value = AlbumStore.Album.length - 1;
				}
				changeNum();
			}
		}
	});
};

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
		console.log('所有图片上传完成');

		// 发送 getPictureContent 请求
		await getPictureContent(conversationId.value)
			.then((res) => {
				console.log(res);
				if (res.code === 200) {
					items.value = res.data;
					popShow.value = true;
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

//返回上一页
const back = () => {
	uni.navigateTo({
		url: '/subpackage/photoScan/photoScan'
	});
};
</script>

<style lang="scss" scoped>
.title {
	font-size: 16px;
}

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

	.content {
		position: relative;
		text-align: center;
		flex: 1;
		background-color: rgb(249, 250, 254);

		.logo {
			position: absolute;
			top: 30rpx;
			right: 85rpx;
			display: flex;
			align-items: center;
			gap: 10rpx;

			.icon1 {
				width: 48rpx;
				height: 48rpx;
			}

			.icon2 {
				width: 37rpx;
				height: 37rpx;
			}
		}

		.banner {
			position: absolute;
			top: 90rpx;
			left: 110rpx;
			width: 540rpx;
			height: 720rpx;

			swiper {
				width: 100%;
				height: 100%;

				swiper-item {
					width: 100%;
					height: 100%;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.clipBox {
			position: absolute;
			box-shadow: 0 0 0 2rpx rgba(117, 182, 255, 1);
			/* 创建向外延伸的边框 */
			background-color: rgba(255, 255, 255, 0.1);
			top: 90rpx;
			left: 110rpx;
			width: 540rpx;
			height: 880rpx;
			pointer-events: none;

			/* 禁用指针事件 */
			.control-point {
				position: absolute;
				width: 10rpx;
				height: 10rpx;
				background-color: #007aff;
				/* 控制点颜色 */
				border-radius: 50%;
				/* 圆形控制点 */
				cursor: pointer;
			}
		}

		uni-icons {
			opacity: 0.5;
		}

		.left {
			position: absolute;
			background-color: rgb(204, 204, 204);
			border-radius: 10rpx;
			top: 490rpx;
			left: 22rpx;
			width: 56rpx;
			height: 75rpx;
			display: flex;
			justify-content: center;
			/* 水平居中 */
			align-items: center;
		}

		.right {
			position: absolute;
			background-color: rgb(204, 204, 204);
			border-radius: 10rpx;
			top: 490rpx;
			right: 22rpx;
			width: 56rpx;
			height: 75rpx;
			display: flex;
			justify-content: center;
			/* 水平居中 */
			align-items: center;
		}

		.pagination {
			position: absolute;
			bottom: 210rpx;
			max-height: 300rpx;
			overflow: hidden;
			overflow-y: auto;
			scrollbar-width: none;
		}
	}

	.footer {
		display: flex;
		position: relative;
		justify-content: space-between;
		height: 100rpx;

		.continue,
		.next {
			position: absolute;
			top: 50%;
			/* 定位到父元素的中间 */
			transform: translateY(-50%);
			/* 通过偏移使其垂直居中 */
		}

		.continue {
			position: absolute;
			width: 195rpx;
			height: 65rpx;
			border: 1rpx solid rgb(183, 183, 183);
			border-radius: 65rpx;
			left: 178rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.next {
			position: absolute;
			width: 195rpx;
			height: 65rpx;
			border: 1rpx solid rgb(183, 183, 183);
			background-color: rgb(42, 129, 228);
			border-radius: 65rpx;
			right: 140rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.pageNum {
			position: absolute;
			top: 3rpx;
			right: 53rpx;
			background-color: rgb(204, 204, 204);
			width: 120rpx;
			height: 43rpx;
			border-radius: 20rpx;
			/* 使用 Flexbox 实现居中 */
			display: flex;
			/* 使父元素成为 Flexbox 容器 */
			justify-content: center;
			/* 水平居中 */
			align-items: center;

			/* 垂直居中 */
			text {
				font-size: 23rpx;
				font-weight: bold;
				/* 加粗 */
			}
		}
	}
}

.red {
	color: red;
}

.pagination {
	position: absolute;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	/* 每行 5 个 */
	grid-gap: 20rpx;
	/* 页码之间的间距 */
	left: 50%;
	/* 将元素左侧对齐到父元素的 50% */
	transform: translateX(-50%);
	/* 将元素向左移动自身宽度的一半，从而达到居中效果 */

	.page {
		width: 110rpx;
		height: 58rpx;
		border-radius: 58rpx;
		/* 圆形 */
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: white;
		/* 默认白色 */
		cursor: pointer;
		border: 1rpx solid #ccc;
		/* 边框 */

		&.active {
			background-color: rgb(42, 129, 228) !important;
			/* 确保优先级 */
			/* 当前页蓝色 */
			color: white;
			/* 字体颜色 */
		}

		&.gray-background {
			background-color: rgba(217, 217, 217, 1);
			color: rgba(166, 166, 166, 1);
		}
	}
}

/*蒙版*/
.mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	/* 半透明黑色 */
	z-index: 1000;
	/* 保证蒙版在最顶层 */
}

.popup-content {
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
}

.page-indicator {
	margin-bottom: 20px;
	font-size: 16px;
	color: #333;
	display: flex;
	align-items: center;
}

.swiper {
	width: 100%;
	height: 68vh;
}

.item {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	font-size: 18px;
}

.buttons {
	margin-top: 20px;
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.buttons button {
	flex: 1;
	margin: 0 10px;
}

:deep(.u-textarea.data-v-f6dd7ec7) {
	height: 100%;
}
:deep(.u-textarea__field.data-v-f6dd7ec7) {
	height: 100% !important;
}
</style>
