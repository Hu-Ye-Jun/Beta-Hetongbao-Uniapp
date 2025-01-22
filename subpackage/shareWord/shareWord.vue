<template>
	<watermarker font_color="rgba(201, 201, 201, 0.5)" :rotate="-20" :key="item" :watermark="200" :width="windowWidth" :height="windowHeight + 'px'" posi="fixed">
		<view class="resols-box">
			<view class="title">
				{{ fileName }}
			</view>
			<view class="result">审核结果（{{ num }}）</view>
			<view class="collapse" v-for="item in reviewDetail" :key="item">
				<view class="result-title">{{ item.businessRisk }}</view>
				<view class="collapse-title">
					<view class="subtitle">解释说明</view>
					<view class="text">
						{{ item.details.proposedChanges }}
					</view>
				</view>
				<view class="collapse-title">
					<view class="subtitle">
						<span class="suggestion">修改建议</span>
					</view>
					<view class="text">
						{{ item.details.modifiedContent }}
					</view>
				</view>
				<view class="collapse-title">
					<view class="subtitle">相关法规</view>
					<view class="text">
						{{ item.details.relatedRegulation }}
					</view>
				</view>
			</view>
		</view>
	</watermarker>
</template>

<script>
import { onLoad, onShow, onShareAppMessage } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
import { getConversationFile, getContractById } from '@/api/upload.js';

const reviewDetail = ref([]);
const num = ref(0);
const conversationId = ref('');
const fileName = ref('');
const windowWidth = ref(0);
const windowHeight = ref(0);
// const onShare = () => {
// 	const savePath = `${wx.env.USER_DATA_PATH}/${fileName.value}`;
// 	uni.downloadFile({
// 		url: linkUrl.value,
// 		filePath: savePath,
// 		success(res) {
// 			uni.shareFileMessage({
// 				filePath: res.filePath,
// 				fileName: updatafileName.value,
// 				success: (result) => {
// 				},
// 				fail: (err) => {
// 					console.log(err);
// 				},
// 			});
// 		},
// 	});
// };

const getSystemInfo = () => {
	uni.getSystemInfo({
		success: function (res) {
			windowWidth.value = res.windowWidth;
			windowHeight.value = res.windowHeight;

			// console.log('屏幕宽度:', screenWidth);
			// console.log('屏幕高度:', screenHeight);
			// console.log('窗口宽度:', windowWidth.value);
			// console.log('窗口高度:', windowHeight.value);
		}
	});
};
onLoad(async (e) => {
	console.log('shareWord');
	getSystemInfo();
	await getContractById(e.conversationId).then((res) => {
		reviewDetail.value = res.data.reviewDetail;
		num.value = res.data.reviewDetail.length;
	});
	await getConversationFile(e.conversationId)
		.then((res) => {
			if (res.code === 200) {
				updatafileName.value = res.data[0].fileName;
				fileName.value = res.data[0].fileName.split('.').shift();
			} else {
				uni.showToast({
					title: res.message,
					icon: 'error'
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
});
</script>

<style>
.suggestion {
	background-color: #bcdcff;
}
</style>
