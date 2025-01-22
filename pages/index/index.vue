<template>
	<view class="contianer">
		<view class="topBg">
			<view class="titleText">木瓜合同宝</view>
			<image class="bgImg" src="https://cdn.law.xiaomugua.cn/minip/homeBg.png"></image>
		</view>
		<view class="content">
			<template v-for="(item, index) in text" :key="index">
				<view class="type">
					<image :src="item.img" mode="scaleToFill"></image>
					<view style="flex: 1">
						<view class="text">
							{{ item.tText }}
						</view>
						<view class="title">
							{{ item.bText }}
						</view>
					</view>
				</view>
			</template>
			<view class="robot">
				<view class="robotImg">
					<image style="width: 100%; height: 100%" src="https://cdn.law.xiaomugua.cn/minip/robot.png" mode="scaleToFill"></image>
				</view>
				<view class="robotText">Hi~, 木瓜合同宝为您服务</view>
			</view>
		</view>
		<view class="tips">
			<image class="tipsImg" src="https://cdn.law.xiaomugua.cn/minip/kindTips.png" mode=""></image>
			<view class="text">温馨提示：本平台将对上传的合同文件进行加密传输，确保您的隐私安全，未经授 权任何人无法访问。</view>
		</view>
		<view class="footer">
			<view class="selectTemplate">
				<!-- 合同类型选择 -->
				<view class="cellBox" @click="handleChoseType" style="margin-bottom: 20rpx">
					<image class="cellImg" src="https://cdn.law.xiaomugua.cn/minip/cell.png" mode="scaleToFill"></image>
					<view class="cellText">
						<view>合同类型</view>
						<view style="display: flex; align-items: center">
							<view style="color: #73747a">
								{{ selectedContractName }}
							</view>
							<image style="width: 12rpx; height: 24rpx; margin-left: 20rpx" src="https://cdn.law.xiaomugua.cn/minip/back.png" mode="scaleToFill"></image>
						</view>
					</view>
				</view>

				<view class="cellBox" @click="() => (pickerShowPosition = true)">
					<image class="cellImg" src="https://cdn.law.xiaomugua.cn/minip/cell.png" mode="scaleToFill"></image>
					<view class="cellText">
						<view>审查立场</view>
						<view style="display: flex; align-items: center">
							<view style="color: #73747a">
								{{ selectedPositionName }}
							</view>
							<image style="width: 12rpx; height: 24rpx; margin-left: 20rpx" src="https://cdn.law.xiaomugua.cn/minip/back.png" mode="scaleToFill"></image>
						</view>
					</view>
				</view>

				<!-- 审查立场选择 -->
				<u-picker
					:closeOnClickOverlay="true"
					:show="pickerShowPosition"
					:columns="[selectedPositions.map((position) => position)]"
					@confirm="handlePositionPickerConfirm"
					@cancel="handlePickerCancel"
					@close="handlePickerCancel"
				></u-picker>
			</view>
			<view class="process">
				<view class="processBox" @tap="handleProcess">
					<image style="width: 100%; height: 100%" src="https://cdn.law.xiaomugua.cn/minip/process.png" mode="scaleToFill"></image>
				</view>
			</view>
			<view class="btnBox">
				<button @tap="handeleUpload" hover-class="none" v-if="!times" class="btn">
					<view style="display: flex; align-items: center">
						<view style="margin-right: 10rpx">上传合同</view>
						<u-tag v-if="tagFlag" bgColor="#fff" plain size="mini" shape="circle" :text="`剩余:${contractReviewCount}次`"></u-tag>
					</view>
				</button>
				<u-line-progress v-else :percentage="percentage" :show-text="true" class="progress" :activeColor="percentage < 100 ? '#4683FF' : '#00be89'"></u-line-progress>
			</view>
			<button style="margin-top: 15rpx" v-if="times" @tap="handleCancel" hover-class="none" class="btn" :disabled="cancel">取消</button>
			<view class="pageFooter">
				<view>小木瓜人工智能科技(武汉)有限公司</view>
				<view>备案号: 鄂ICP备2024065419号</view>
			</view>
		</view>
		<u-popup :show="show" @close="handleClosePop" round="16" mode="bottom" v-show="show" :safeAreaInsetBottom="false">
			<view class="popup-content">
				<view class="popBg">
					<image style="width: 100%; height: 100%" src="https://cdn.law.xiaomugua.cn/minip/popupBg.png" mode="scaleToFill"></image>
					<view class="bgTextBox">
						<view class="bgTitle">操作流程</view>
						<view class="bgText">熟练使用我们的产品</view>
					</view>
				</view>
				<view class="table-container">
					<view style="padding: 20rpx 0">
						<image style="width: 18rpx; height: 300rpx; margin-right: 20rpx" src="https://cdn.law.xiaomugua.cn/minip/setpLine.png" mode="scaleToFill"></image>
					</view>
					<view class="setpContent">
						<view v-for="(item, index) in tipsList" :key="index">
							<view class="setpContentTitle">{{ item.title }}</view>
							<view class="setpContentText">{{ item.text }}</view>
						</view>
					</view>
				</view>
				<view class="rule-container">
					<view style="display: flex; align-items: center">
						<image style="width: 25rpx; height: 32rpx; margin-right: 15rpx" src="https://cdn.law.xiaomugua.cn/minip/rule.png" mode="scaleToFill"></image>
						<view style="font-size: 34rpx; font-weight: 700">减扣规则</view>
					</view>
					<view class="setpContentText" style="padding-left: 30rpx; margin-top: 10rpx">
						每进行1次合同审查将扣减您的合同审查次数。文件上传途中取消审查，不会扣减您的次数。
					</view>
				</view>
				<button @tap="() => (show = false)" hover-class="none" class="btn">
					<view style="display: flex; align-items: center">
						<view style="margin-right: 10rpx">完成</view>
					</view>
				</button>
			</view>
		</u-popup>
		<view class="masking" :style="{ marginTop: `${top}` }" v-if="open" :class="open ? 'disblad' : 'close'">
			<view class="guanb" @tap="handleClose">
				<text class="iconfont icon-guanbi"></text>
				<view class="resols">关闭</view>
			</view>
			<view class="tips" v-for="(item, index) in tipsList" :key="index">
				<view class="title">{{ item.title }}</view>
				<template v-for="(sub, i) in item.children" :key="i">
					<view class="text">
						{{ sub.text }}
					</view>
				</template>
			</view>
		</view>

		<u-popup :show="showModal && overlayDisplayed" mode="center" bgColor="transparent" @confirm="handleModalConfirm" confirmText="我知道了">
			<image src="https://cdn.law.xiaomugua.cn/minip/winner_popup_bg.png" style="height: 100vh; width: 100vw; position: relative"></image>
			<view style="width: 100%; height: 100rpx; position: absolute; bottom: 500rpx; left: 0" @tap="handleModalConfirm"></view>
			<!-- <view>
        <view
          style="
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 40rpx;
            text-align: center;
          "
          >恭喜🎉</view
        >
        <view>免费获得30次合同审查机会和60积分</view>
        <view
          style="
            text-align: center;
            font-size: 14px;
            color: #ccc;
            margin-top: 30rpx;
          "
          >积分可用来查看合同模板</view
        >
      </view> -->
		</u-popup>
		<BuyPopup ref="buyPopup" @close="handlePopupClose"></BuyPopup>
		<shinn-xSlideButton left="20rpx" top="50%" margin="20rpx">
			<view style="color: #fff; background-color: #007aff" @tap="handlePhotoScan">
				<image style="width: 100rpx; height: 100rpx; position: absolute; top: 0; left: 0" src="https://cdn.law.xiaomugua.cn/minip/scan.png" mode="scaleToFill"></image>
			</view>
		</shinn-xSlideButton>
	</view>

	<view class="mask" v-if="maskStep !== 4">
		<text @click="maskStep = 4" class="cancel">X</text>

		<view class="mask1" style="z-index: 1000" v-if="maskStep == 1">
			<view class="highlight-box1">
				<!-- 合同类型选择 -->
				<view class="cellBox" @click="handleChoseType" style="margin-bottom: 20rpx; z-index: 1001">
					<image class="cellImg" src="https://cdn.law.xiaomugua.cn/minip/cell.png" mode="scaleToFill"></image>
					<view class="cellText">
						<view>合同类型</view>
						<view style="display: flex; align-items: center">
							<view style="color: #73747a">
								{{ selectedContractName }}
							</view>
							<image style="width: 12rpx; height: 24rpx; margin-left: 20rpx" src="https://cdn.law.xiaomugua.cn/minip/back.png" mode="scaleToFill"></image>
						</view>
					</view>
				</view>

				<view style="z-index: 1001" class="cellBox" @click="() => (pickerShowPosition = true)">
					<image class="cellImg" src="https://cdn.law.xiaomugua.cn/minip/cell.png" mode="scaleToFill"></image>
					<view class="cellText">
						<view>审查立场</view>
						<view style="display: flex; align-items: center">
							<view style="color: #73747a">
								{{ selectedPositionName }}
							</view>
							<image style="width: 12rpx; height: 24rpx; margin-left: 20rpx" src="https://cdn.law.xiaomugua.cn/minip/back.png" mode="scaleToFill"></image>
						</view>
					</view>
				</view>
			</view>
			<image class="mask-image1" src="https://cdn.law.xiaomugua.cn/minip/index_first.png" mode=""></image>

			<view @click="toNext" class="bottom-button-next">
				<image class="mask-btnImage1" src="https://cdn.law.xiaomugua.cn/minip/index_next.png" mode=""></image>
			</view>
		</view>

		<view class="mask2" v-if="maskStep == 2">
			<view class="highlight-box2">
				<button hover-class="none" class="btn">
					<view style="display: flex; align-items: center">
						<view style="margin-right: 10rpx">上传合同</view>
						<u-tag v-if="tagFlag" bgColor="#fff" plain size="mini" shape="circle" :text="`剩余:${contractReviewCount}次`"></u-tag>
					</view>
				</button>
			</view>
			<image class="mask-image2" src="https://cdn.law.xiaomugua.cn/minip/index_two.png" mode=""></image>

			<view @click="toNext" class="bottom-button-ok">
				<!-- <image class="mask-btnImage2" src="https://cdn.law.xiaomugua.cn/minip/index_isOk.png" mode=""></image> -->
				<image class="mask-btnImage2" src="https://cdn.law.xiaomugua.cn/minip/index_next.png" mode=""></image>
			</view>
		</view>

		<view class="mask3" v-if="maskStep == 3">
			<view class="highlight-box3">
				<view class="example" @click="toNext">
					<image style="width: 22rpx; height: 40rpx; margin-right: 15rpx" src="@/static/image/hand.gif" mode="scaleToFill"></image>
					<text style="color: #007aff">点击此处上传示例合同</text>
				</view>
			</view>

			<view class="example-text">
				<text>示例审查不消耗次数, 快来点击试一试吧~</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onShow, onHide, onLaunch, onShareAppMessage, onReady } from '@dcloudio/uni-app';
import { ref, computed, nextTick } from 'vue';
import { getId, getContractResult, interruptContract, getContractType } from '@/api/upload.js';
import { updateDisplayHomePagePopupApi, updateNewUserTipsApi, getUserById } from '@/api/user.js';
import { baseUrl, request } from '@/utils/request.js';
import { useUserStore } from '../../store';
import { getContractCount, getUserIsUsingRights } from '@/api/template.js';
import toast from '@/libs/function/toast.js';

const maskStep = ref(1);

const { safeAreaInsets } = uni.getSystemInfoSync();
const open = ref(false);
const isVip = ref(false);
const userStore = useUserStore();
const contractTypes = ref([
	{
		id: '1',
		name: '通用合同',
		reviewPositions: [
			{ id: '2', name: '甲方' },
			{ id: '3', name: '乙方' }
		]
	}
]);
const selectedContract = ref(contractTypes.value[0]);
const selectedPositions = ref(['甲方立场', '乙方立场', '第三方']);
const pickerShowContract = ref(false);
const pickerShowPosition = ref(false);
const selectedContractName = ref('通用合同');
const selectedPositionName = ref(selectedPositions.value[0]);
const showGuide = ref(false); // 控制遮罩显示
const show = ref(false); // 控制遮罩显示
const guideStep = ref(1); // 当前引导步骤
const cellGroupPosition = ref({ top: 0, left: 0, width: 0, height: 0 });
const buttonPosition = ref({ top: 0, left: 0, width: 0, height: 0 });
const contractReviewCount = ref(0);

const tipsList = ref([
	{
		title: '第一步',
		text: '将手机里的合同文件发送给任意好友，推荐使用“文件传输助手”'
	},
	{
		title: '第二步',
		text: '进入小程序，点击“开始审查”，选择刚才发送文件的对话'
	},
	{ title: '第三步', text: '选中要审核的合同文件，点击“确定”' }
]);
const Id = ref('');
const conversationId = ref('');
const userId = ref('');
// 进度条
const percentage = ref(0);

const times = ref(false);
const showModal = ref(false);
// 取消/禁用
const cancel = ref(false);
const aloneChecked = ref(true);
const cookie = ref('');
const papayaBeans = ref('');
const overlayDisplayed = ref(false);
const tagFlag = ref(false);
// 用户信息
const userInfo = ref({});
// 获取头部安全距离
const top = computed(() => {
	return safeAreaInsets.top + 24 + 'px';
});

let time = null;
let task;
const text = ref([
	{
		tText: '合同类型',
		bText: '支持劳动用工，买卖转让，常见租赁，婚姻家事，公司类，知识产权，服务类型，借款合同，特殊行业等合同类型',
		img: 'https://cdn.law.xiaomugua.cn/minip/content-one.png'
	},
	{
		tText: '文件格式',
		bText: '仅限DOCX、DOC、PDF格式',
		img: 'https://cdn.law.xiaomugua.cn/minip/content-two.png'
	},
	{
		tText: '文件大小',
		bText: '文件总字数不超过2.5万字',
		img: 'https://cdn.law.xiaomugua.cn/minip/content-three.png'
	}
]);

const handleProcess = () => {
	show.value = true;
};

const handleClosePop = () => {
	show.value = false;
};

const handleModalConfirm = () => {
	showModal.value = false;
	updateNewUserTipsApi(false)
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
};

const toNext = () => {
	maskStep.value += 1;
	if (maskStep.value === 4) {
		updateDisplayHomePagePopupApi(false);
		uni.showTabBar();
	}
};
const handleGuideNext = () => {
	if (guideStep.value === 1) {
		guideStep.value = 2;
	} else {
		if (aloneChecked.value) {
			updateDisplayHomePagePopupApi(false)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		showGuide.value = false; // 关闭引导遮罩
		guideStep.value = 1;
		aloneChecked.value = true;
		overlayDisplayed.value = true; // 标记遮罩层已经显示
		// 确保遮罩层关闭后再显示弹窗
		nextTick(() => {
			showModal.value = true;
		});
	}
};

const handleChoseType = () => {
	userStore.setContractType(true);
	uni.navigateTo({
		url: '/subpackage/contractType/contractType'
	});
};

const handlePhotoScan = () => {
	if (userId.value) {
		uni.navigateTo({
			url: '/subpackage/photoScan/photoScan'
		});
	} else {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	}
};

const handleContractPickerConfirm = (e) => {
	selectedContract.value = contractTypes.value[e.indexs[0]];
	selectedPositions.value = selectedContract.value.reviewPositions;
	selectedContractName.value = selectedContract.value.name;
	selectedPositionName.value = selectedPositions.value[0].name;
	pickerShowContract.value = false;
};

const handlePositionPickerConfirm = (e) => {
	selectedPositionName.value = selectedPositions.value[e.indexs[0]];
	pickerShowPosition.value = false;
};

const handlePickerCancel = () => {
	pickerShowContract.value = false;
	pickerShowPosition.value = false;
};

const handleCancel = () => {
	uni.showModal({
		title: '提示',
		content: '是否取消合同审核',
		success: async (res) => {
			if (res.confirm) {
				await interruptContract(conversationId.value)
					.then((res) => {
						uni.showToast({
							title: '已取消审查',
							icon: 'none'
						});
						percentage.value = 0;
						times.value = false;
						clearInterval(time);
						task.abort();
						task = null;
						cancel.value = false;
					})
					.catch((err) => {
						uni.showToast({
							title: '网络异常,请确认网络环境后,重新登录',
							icon: 'none'
						});
						percentage.value = 0;
						times.value = false;
						clearInterval(time);
						task.abort();
						task = null;
						cancel.value = false;
						console.log(err);
					});
			}
		}
	});
};
const handeleUpload = () => {
	if (userId.value) {
		wx.chooseMessageFile({
			count: 1,
			type: 'file',
			success: (res) => {
				times.value = true;
				const tempFiles = res.tempFiles[0];
				if (percentage.value < 100) {
					time = setInterval(() => {
						percentage.value++;
						if (percentage.value >= 90) {
							percentage.value = 90;
						}
					}, 1500);
				}
				conversationId.value = Id.value;
				wx.uploadFile({
					url: baseUrl + '/api2/intelligent/intelligentProSaveFile',
					filePath: tempFiles.path,
					name: 'file',
					header: {
						'Content-Type': 'application/json',
						cookie: cookie.value
					},
					formData: {
						userName: 'admin',
						userId: userId.value,
						conversationId: Id.value,
						permissionName: 'user-contract',
						file: tempFiles.name,
						nickName: tempFiles.name,
						fileBelongType: '3'
					},
					success: (data) => {
						const i = JSON.parse(data.data);
						console.log(i, 'intelligentProSaveFile');
						if (i.code === 200) {
							console.log(i.data[0], 'data');
							task = uni.request({
								url: baseUrl + '/api2/wxcontract/getContractResult',
								method: 'post',
								timeout: 600000,
								header: {
									'Content-Type': 'application/json',
									cookie: cookie.value
								},
								data: {
									userId: userId.value,
									conversationId: i.data[0].conversationId,
									type: selectedContractName.value,
									position: selectedPositionName.value
								},
								success: (result) => {
									console.log(result, 'result');
									if (result.data.code === 200) {
										const { conversationId, reviewDetail, companyNameList } = result.data.data;
										console.log(companyNameList, 265);
										percentage.value = 100;
										if (percentage.value === 100) {
											cancel.value = true;
											setTimeout(() => {
												clearInterval(time);
												times.value = false;
												// percentage.value = 0;
												uni.navigateTo({
													url: `/pages/uploadtext/uploadtext?companyName=${companyNameList}&conversationId=${conversationId}&reviewDetail=${encodeURIComponent(
														JSON.stringify(reviewDetail)
													)} `
												});
											}, 500);
										}
									} else if (result.data.code) {
										percentage.value = 0;
										times.value = false;
										clearInterval(time);
										if (result.data.code === 5003) {
											return uni.showToast({
												title: '文件解析异常',
												icon: 'none'
											});
										} else if (result.data.code === 5005) {
											return uni.showToast({
												title: '已取消合同审查',
												icon: 'none'
											});
										} else if (result.data.code === 220) {
											showBuy();
										} else {
											uni.showToast({
												title: result.data.message,
												icon: 'none'
											});
										}
									}
								},
								fail: (err) => {
									percentage.value = 0;
									times.value = false;
									clearInterval(time);
									uni.showToast({
										title: err.message,
										icon: 'none'
									});
									console.log(err, 'getContractResult');
								}
							});
						} else {
							percentage.value = 0;
							times.value = false;
							clearInterval(time);
							uni.showToast({
								title: i.message,
								icon: 'error'
							});
						}
					},
					fail: function (err) {
						console.log('上传失败', err);
						percentage.value = 0;
						times.value = false;
						clearInterval(time);
						uni.showToast({
							title: '上传失败',
							icon: 'error'
						});
					}
				});
			},
			fail: () => {
				console.log('调用微信聊天文件失败', err);
				percentage.value = 0;
				times.value = false;
				clearInterval(time);
				uni.showToast({
					title: '获取微信聊天文件失败, 请重新打开小程序'
				});
			}
		});
	} else {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	}
};
const handleClose = () => {
	open.value = !open.value;
};

onShareAppMessage((res) => {
	return {
		path: '/pages/index/index',
		title: '木瓜合同宝',
		imageUrl: 'https://cdn.law.xiaomugua.cn/minip/mugua-ai.png',
		success(res) {
			console.log(res);
		},
		fail(err) {
			console.log(err);
		}
	};
});

const handleOpen = () => {
	open.value = true;
};

onHide(() => {
	if (task) {
		percentage.value = 0;
		times.value = false;
		clearInterval(time);
		task.abort();
		task = null;
		cancel.value = false;
	}
});

const getUserInfo = async () => {
	await getContractCount(userId.value)
		.then((res) => {
			console.log(res.code);
			if (res.code === 202) {
				uni.removeStorageSync('userId');
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('wxInfo');
				uni.removeStorageSync('wxuserId');
				uni.removeStorageSync('wxcookies');
				uni.removeStorageSync('cookies');
				userId.value = '';
				tagFlag.value = false;
				return;
			}
			if (res.code === 200) {
				const count = res.data.combination.freeCount + res.data.combination.cardCount;
				contractReviewCount.value = count;
				tagFlag.value = true;
			}
		})
		.catch((err) => {
			console.log(err.code);
			if (err.code === 202) {
				uni.removeStorageSync('userId');
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('wxInfo');
				uni.removeStorageSync('wxuserId');
				uni.removeStorageSync('wxcookies');
				uni.removeStorageSync('cookies');
				userId.value = '';
				tagFlag.value = false;
				return;
			}
		});
	await getUserIsUsingRights(userId.value)
		.then((res) => {
			if (res.code === 200) {
				isVip.value = true;
			} else {
				isVip.value = false;
			}
		})
		.catch((err) => {
			isVip.value = false;
		});
	await getId(userId.value).then((res) => {
		Id.value = res.data;
	});
	await getUserById(userId.value).then((res) => {
		if (res.code === 200) {
			userInfo.value = res.data;
			uni.setStorageSync('wxInfo', res.data);
			uni.setStorageSync('userInfo', res.data);
		}
	});
};

const handlePopupClose = () => {
	getUserInfo();
};

onShow(async () => {
	console.log('index onShow');
	userId.value = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
	cookie.value = uni.getStorageSync('wxcookies') || uni.getStorageSync('cookies') || '';
	userInfo.value = uni.getStorageSync('userInfo') || uni.getStorageSync('wxInfo');
	if (userId.value) {
		getUserInfo();
	} else {
		tagFlag.value = false;
	}
	nextTick(() => {
		// 获取 u-cell-group 的位置和大小
		uni.createSelectorQuery()
			.select('.selectTemplate')
			.boundingClientRect((rect) => {
				if (rect) {
					cellGroupPosition.value = {
						top: rect.top,
						left: rect.left,
						width: rect.width,
						height: rect.height
					};
				}
			})
			.exec();

		// 获取按钮的位置和大小
		uni.createSelectorQuery()
			.select('.btn')
			.boundingClientRect((rect) => {
				if (rect) {
					buttonPosition.value = {
						top: rect.top,
						left: rect.left,
						width: rect.width,
						height: rect.height
					};
				}
			})
			.exec();
		if (userStore.selectTypeItem && userStore.selectTypeItem.type) {
			selectedContractName.value = userStore.selectTypeItem.type;
		}

		if (!userStore.displayHomePagePopupWindow) {
			maskStep.value = 4;
			uni.hideTabBar();
		}

		if (userStore.displayHomePagePopupWindow) {
			showGuide.value = true;
			userStore.setDisplayHomePagePopupWindow(false);
		} else if (userStore.newUserHomePageEventTips && !userStore.displayHomePagePopupWindow) {
			overlayDisplayed.value = true;
			showModal.value = true;
		}

		if (userStore.newUserHomePageEventTips) {
			userStore.setNewUserHomePageEventTips(false);
			nextTick(() => {
				// 在下一个 tick 中显示弹窗
				if (overlayDisplayed.value) {
					showModal.value = true;
				}
			});
		}
	});
	// showBuy();
});

const buyPopupShow = ref(false);

const buyPopup = ref();
const showBuy = function () {
	if (!userInfo.value.isTeenager) {
		buyPopup.value.show(1, true, isVip.value);
	} else {
		toast('青少年模式下无法购买');
	}
};

const secondaryCard = ref({});

const getSecondaryCard = async () => {
	try {
		const res = await request('/api2/rights/getSecondaryCard', 'POST');
		if (res.code === 200) {
			secondaryCard.value = res.data;
		}
	} catch (e) {
		uni.showToast({
			title: 'e.message',
			icon: 'error'
		});
	}
};
</script>

<style lang="scss" scoped>
.contianer {
	height: 100%;
	.topBg {
		height: 560rpx;
		padding-top: 110rpx;
		text-align: center;
		position: relative;
		.titleText {
			position: relative;
			z-index: 1;
		}
		.bgImg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	.content {
		position: absolute;
		top: 340rpx;
		margin: 0 56rpx;
		background-color: #fff;
		box-shadow: 0px 4px 8px #eee;
		padding: 28rpx 40rpx;
		padding-top: 60rpx;
		z-index: 3;
		border-radius: 30rpx;

		.robot {
			position: absolute;
			top: -190rpx;
			left: 0;
			display: flex;
			align-items: center;
			.robotImg {
				width: 180rpx;
				height: 230rpx;
				margin-right: 30rpx;
			}
			.robotText {
				width: 350rpx;
				background-color: #bdcef3;
				border-radius: 0 30rpx 30rpx 30rpx;
				padding: 20rpx 30rpx;
				font-size: 24rpx;
				color: #333333;
				display: inline-block;
				white-space: nowrap;
				overflow: hidden; /* 隐藏溢出内容 */
				width: 0; /* 初始宽度为0 */
				animation: typing 2s steps(30) 0.1s forwards, blink-caret 0.75s step-end infinite;
			}
		}

		.type {
			display: flex;
			align-items: flex-start;
			padding: 10rpx 0;

			image {
				width: 75rpx;
				height: 75rpx;
				margin-right: 26rpx;
			}

			.text {
				font-size: 32rpx;
				font-weight: 400;
			}
			.title {
				padding: 14rpx 0rpx;
				font-size: 24rpx;
				color: #888888;
			}
		}
	}

	.tips {
		display: flex;
		margin: 0 60rpx;
		margin-top: 220rpx;
		.tipsImg {
			width: 20rpx;
			height: 20rpx;
			margin-right: 10rpx;
		}

		.text {
			font-size: 18rpx;
			color: #ff1414;
			flex: 1;
		}
	}

	.footer {
		padding: 0 40rpx;
		margin-top: 20rpx;
		height: 35vh;
		.btnBox {
			position: relative;
			.example {
				position: absolute;
				top: -50rpx;
				font-size: 25rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
		.process {
			display: flex;
			justify-content: flex-end;
			margin: 20rpx 0;
			.processBox {
				width: 100rpx;
				height: 100rpx;
			}
		}
		.cellBox {
			position: relative;
			height: 90rpx;
			border-radius: 20rpx;
			.cellImg {
				width: 100%;
				height: 100%;
			}
			.cellText {
				position: absolute;
				top: 0;
				left: 0;
				width: 92%;
				height: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 30rpx;
			}
		}
		.upload {
			margin-top: 20rpx;
			font-size: 24rpx;
			text-align: center;
			color: rgba(0, 0, 0, 0.6);
		}
		.pageFooter {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			font-size: 20rpx;
			position: fixed;
			bottom: 10rpx;
			left: 50%;
			transform: translateX(-50%);
			color: #666666;
		}
		.btn {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #ffffff;
			background: linear-gradient(106.65deg, #4683ff 0%, #1864fe 100%);
			width: 100%;
			margin-bottom: 20rpx;

			image {
				width: 34rpx;
				height: 32rpx;
				margin-right: 20 rpx;
			}
		}
	}
	.popup-content {
		.popBg {
			width: 100%;
			height: 280rpx;
			transform: translateY(-60rpx);
			// background: linear-gradient(#cfdaff 0%, #f5f7ff 100%);
			position: relative;
			.bgTextBox {
				position: absolute;
				top: 90rpx;
				left: 50rpx;
				.bgTitle {
					font-family: PDDZHT-J;
					font-weight: 900;
					font-size: 40rpx;
					margin-bottom: 10rpx;
				}
				.bgText {
					font-weight: 400;
					font-size: 23rpx;
					color: #787878;
				}
			}
		}
		.table-container {
			display: flex;
			background-color: #fff;
			margin: 0 56rpx;
			box-shadow: 0px 4px 8px #eee;
			padding: 28rpx 20rpx;
			z-index: 1;
			border-radius: 30rpx;
			transform: translateY(-120rpx);
			.setpContent {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.setpContentTitle {
					font-size: 34rpx;
					margin-bottom: 10rpx;
				}
				.setpContentText {
					color: #999999;
					font-size: 24rpx;
				}
			}
		}
		.rule-container {
			background-color: #fff;
			margin: 0 56rpx;
			box-shadow: 0px 4px 8px #eee;
			padding: 28rpx 20rpx;
			z-index: 1;
			border-radius: 30rpx;
			transform: translateY(-100rpx);
			.setpContentText {
				color: #999999;
				font-size: 24rpx;
			}
		}

		.btn {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #ffffff;
			background: linear-gradient(106.65deg, #4683ff 0%, #1864fe 100%);
			width: 90%;
			margin-bottom: 20rpx;
			transform: translateY(-40rpx);
		}
	}
}

@keyframes typing {
	from {
		width: 0; /* 初始宽度为0 */
	}
	to {
		width: 350rpx; /* 最终宽度为文字的完整宽度 */
	}
}

@keyframes blink-caret {
	50% {
		border-color: transparent;
	}
	100% {
		border-color: #333;
	}
}

.mask {
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 999999;
	display: flex;
}

.mask-image1 {
	position: absolute;
	left: 170rpx;
	right: 160.33rpx;
	top: 420.67rpx;
	height: 524rpx;
	width: 418rpx;
}
.bottom-button-next {
	display: flex;
	justify-content: center;
}
.mask-btnImage1,
.mask-btnImage2 {
	height: 120rpx;
	width: 320rpx;
	position: absolute;
	bottom: 4%;
	left: 225rpx;
}
.mask-image2 {
	position: absolute;
	bottom: 24%;
	left: 120rpx;
	height: 643rpx;
}
.cancel {
	position: absolute;
	color: #fff;
	right: 70.67rpx;
	top: 160.67rpx;
	font-size: 40rpx;
}

.highlight-box1 {
	height: 220rpx;
	width: 700rpx;
	border: 1px solid gray;
	z-index: 1000;
	position: absolute;
	top: 59%;
	border-radius: 10px;
	left: 3%;
	background-color: white;

	.cellBox {
		position: relative;
		height: 90rpx;
		border-radius: 20rpx;
		.cellImg {
			width: 100%;
			height: 100%;
		}
		.cellText {
			position: absolute;
			top: 0;
			left: 0;
			width: 92%;
			height: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;
		}
	}
}
.highlight-box2 {
	height: 120rpx;
	width: 713rpx;
	border: 1px solid gray;
	z-index: 1000;
	position: absolute;
	bottom: 13%;
	left: 2%;
	border-radius: 10px;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		background: linear-gradient(106.65deg, #4683ff 0%, #1864fe 100%);
		width: 95%;
		height: 100rpx;

		image {
			width: 34rpx;
			height: 32rpx;
			margin-right: 20 rpx;
		}
	}
}
.highlight-box3 {
	height: 65rpx;
	width: 400rpx;
	border: 1px solid gray;
	z-index: 1000;
	position: absolute;
	bottom: 22%;
	left: 50%;
	transform: translateX(-50%);
	border-radius: 10px;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	.example {
		display: flex;
		align-items: center;
	}
}
.example-text {
	position: absolute;
	bottom: 28%;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 600;
	width: 100vw;
}
</style>