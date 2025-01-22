<template>
	<view class="container">
		<web-view class="web-view" :src="pdfUrl">
			<view
				:style="{
					touchAction: 'none',
					catchtouchmove: 'false',
					pointerEvents: 'none'
				}"
			>
				<cover-view
					class="action-watermark"
					:style="{
						touchAction: 'none',
						catchtouchmove: 'false',
						pointerEvents: 'none'
					}"
				>
					<cover-view class="watermark-container" :style="{ touchAction: 'none', catchtouchmove: 'false' }">
						<cover-view
							class="watermark-list"
							:style="{
								transform: 'rotate(-45deg)',
								touchAction: 'none',
								catchtouchmove: 'false'
							}"
						>
							<cover-view
								class="watermark-item"
								v-for="i in 100"
								:key="i"
								:style="{
									padding: '30rpx',
									color: 'rgba(201, 201, 201, 0.5)',
									touchAction: 'none',
									catchtouchmove: 'false'
								}"
							>
								<cover-view :style="{ touchAction: 'none', catchtouchmove: 'false' }">
									木瓜合同宝&emsp;&emsp;木瓜合同宝&emsp;&emsp;木瓜合同宝&emsp;&emsp;木瓜合同宝
								</cover-view>
							</cover-view>
						</cover-view>
					</cover-view>
				</cover-view>
				<cover-view class="action-buttons">
					<cover-view class="button" @click="handleFavorite">
						<u-icon name="star"></u-icon>
						收藏
					</cover-view>
					<cover-view class="button download" @click="handleDownload">
						<u-icon name="download"></u-icon>
						预览下载
					</cover-view>
				</cover-view>
			</view>
		</web-view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { addCollectionTemplate, downloadTemplate } from '@/api/template.js';

const pdfUrl = ref('');
const templateId = ref('');
const userId = ref('');

onLoad((options) => {
	uni.setNavigationBarTitle({
		title: options.pdfName
	});
	pdfUrl.value = options.pdfUrl;
	templateId.value = options.templateId;
	userId.value = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
});

function handleFavorite() {
	addCollectionTemplate(userId.value, templateId.value)
		.then((res) => {
			if (res.code === 200) {
				uni.showToast({
					title: res.data ? '收藏成功' : '取消收藏',
					icon: 'success'
				});
			} else {
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
		})
		.catch((err) => {
			uni.showToast({
				title: err.message,
				icon: 'none'
			});
		});
}

function handleDownload() {
	uni.showModal({
		title: '提示',
		content: '请在预览界面点击右上角 ... 按钮保存文件',
		success: async (res) => {
			if (res.confirm) {
				await downloadTemplate(templateId.value)
					.then((res) => {
						if (res.code === 200 && res.data) {
							const downloadUrl = res.data.playUrl;
							const downloadName = res.data.name;
							uni.downloadFile({
								url: downloadUrl,
								success: function (downloadRes) {
									if (downloadRes.statusCode === 200) {
										const tempFilePath = downloadRes.tempFilePath;
										const fs = uni.getFileSystemManager();
										const newFileName = `${downloadName}-${Date.now()}.pdf`;
										const savePath = `${uni.env.USER_DATA_PATH}/${newFileName}`;

										fs.saveFile({
											tempFilePath: tempFilePath,
											filePath: savePath,
											success: function (saveRes) {
												// uni.showToast({
												// 	title: '预览成功,请在预览界面点击右上角...按钮进行下载',
												// 	icon: 'none'
												// });
												console.log('文件已保存到', saveRes.savedFilePath);
												setTimeout(() => {
													uni.openDocument({
														filePath: saveRes.savedFilePath,
														fileType: 'pdf',
														showMenu: true,
														success: function () {
															console.log('文档打开成功');
														},
														fail: function (err) {
															console.error('文档打开失败', err);
															uni.showToast({
																title: '文档打开失败',
																icon: 'none'
															});
														}
													});
												}, 800);
											},
											fail: function (err) {
												uni.showToast({
													title: '文件保存失败',
													icon: 'none'
												});
												console.error('文件保存失败', err);
											}
										});
									} else {
										uni.showToast({
											title: '文件下载失败',
											icon: 'none'
										});
										console.error('文件下载失败，状态码:', downloadRes.statusCode);
									}
								},
								fail: function (err) {
									uni.showToast({
										title: '文件下载失败',
										icon: 'none'
									});
									console.error('文件下载失败', err);
								}
							});
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
							console.error('获取下载地址失败', res);
						}
					})
					.catch((err) => {
						uni.showToast({
							title: err.message,
							icon: 'none'
						});
						console.error('请求失败', err);
					});
			}
		}
	});
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.web-view {
	width: 100%;
	height: 100%;
}

.action-watermark {
	z-index: 3;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	touch-action: none;
	catchtouchmove: false;
}

.watermark-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 3;
	touch-action: none;
	catchtouchmove: false;
}

.watermark-list {
	width: 500%;
	height: 500%;
	position: absolute;
	top: -100%;
	left: -100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	touch-action: none;
	catchtouchmove: false;
	z-index: 3;
}

.watermark-item {
	font-size: 15px;
	font-weight: bold;
	touch-action: none;
	catchtouchmove: false;
	z-index: 3;
}

.action-buttons {
	position: fixed;
	bottom: 20px;
	left: 0;
	width: 100%;
	display: flex;
	justify-content: space-around;
	padding: 20px 0;
	background-color: rgba(255, 255, 255, 0.5);
	box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
	z-index: 4;
}

.button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100px;
	height: 40px;
	background-color: #ccc;
	border-radius: 20px;
	text-align: center;
	line-height: 40px;
	
	&.download {
		background: #4D6EF1;
		color: #fff;
	}
	
	
}

:deep(.u-button--normal.data-v-5ce41ee6) {
	padding: 0 50rpx;
	margin: 0 30rpx;
}

.red {
	background-color: red;
}
</style>
