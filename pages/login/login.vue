<template>
	<view class="container">
		<view class="topTitle">
			<image
				@tap="handleGoBack"
				style="width: 18rpx; height: 30rpx; margin-right: 20rpx; transform: rotate(180deg)"
				src="https://cdn.law.xiaomugua.cn/minip/back.png"
				mode="scaleToFill"
			></image>
			<view>登录</view>
		</view>
		<view class="login">
			<image src="https://cdn.law.xiaomugua.cn/minip/muguaAI.png" mode=""></image>
			<view class="title">欢迎使用木瓜合同宝，</view>
			<view class="tips">登陆后您将免费享受优惠活动！</view>
			<button :open-type="checked ? 'getPhoneNumber' : ''" @getphonenumber="handlePhoneNumber" @tap="prepareLogin" hover-class="none" class="login-btn">一键登录</button>
			<!-- <button class="rest" @tap="handleRest">手机号登录</button> -->
			<checkbox-group @change="handelChecked">
				<view class="checkbox">
					<checkbox class="checkedbox" :checked="checked" activeBorderColor="#3CB56C" iconColor="rgba(60, 181, 108, 1)"></checkbox>
					<view class="privacy">
						我已阅读并同意
						<text @tap="handleShow('privacy')">《隐私政策》</text>
						<text @tap="handleShow('agreement')">《服务协议》</text>
						和
						<text @tap="handleShow('disclaimer')">《免责条款》</text>
					</view>
				</view>
			</checkbox-group>

			<view class="other">
				<u-divider text="其他方式登录"></u-divider>
				<image @tap="handleRest" style="width: 80rpx; height: 80rpx" src="https://cdn.law.xiaomugua.cn/minip/phoneLogin.png" mode="scaleToFill"></image>
				<text style="color: #909090; font-size: 26rpx; margin-top: 5rpx">手机号</text>
			</view>
		</view>
		<u-overlay :show="show">
			<view class="rulesShow">
				<view class="rule" v-if="rules === 'privacy'">
					<text class="iconfont icon-guanbi" @tap="show = false"></text>
					<text class="title">隐私政策</text>
					<view class="content">
						尊敬的用户，感谢您使用我们的合同审查小程序。我们非常重视您的隐私和个人信息保护。请仔细阅读本隐私政策，了解我们如何收集、使用、存储和保护您的个人信息。
						<br />
						1、信息收集。当您注册本服务时，我们会收集您的用户名及其他必要的注册信息。当您使用本服务上传合同文本进行审查时，我们会收集您提供的合同文本内容。我们会收集关于您使用本服务的相关信息，如访问时间、使用时长、访问页面等。
						<br />
						2、信息使用我们会将收集的信息用于：提供、维护、改进和优化我们的服务；处理您的请求和指令；进行数据分析和研究，以提升用户体验。
						<br />
						3、我们采取各种合理的安全措施，以保护您的个人信息。
						<br />
						4. 隐私政策的变更。我们可能会不时更新本隐私政策。任何更新都会在本页面上公布，并注明最新的生效日期。请定期查阅本隐私政策，以了解最新的变化。
						<br />
						5.
						联系我们。如果您对本隐私政策有任何疑问或建议，或者您希望行使您的权利，请通过客服联系我们。感谢您信任并使用我们的审查合同小程序。我们将尽一切努力保护您的隐私和个人信息安全。（最新更新日期：2024年6月29日）
					</view>
				</view>
				<view class="rule" v-else-if="rules === 'agreement'">
					<text class="iconfont icon-guanbi" @tap="show = false"></text>
					<text class="title">服务协议</text>
					<view class="content">
						尊敬的用户，欢迎使用我们的木瓜合同审查小程序。在使用本服务前，请仔细阅读以下服务协议。您一旦使用本服务，即表示您同意并接受本协议的全部内容。如果您不同意本协议中的任何条款，请立即停止使用本服务。
						<br />
						1.服务内容。本服务旨在为用户提供合同审查功能，包括但不限于合同文本的上传、分析、修改建议等。
						<br />
						2.用户义务。用户应保证上传的合同文本及其他相关内容不违反国家法律法规，不侵犯任何第三方的合法权益；用户不得利用本服务从事任何非法活动或不正当行为。
						<br />
						3.隐私保护。我们承诺保护用户的隐私和个人信息。除法律规定或用户授权外，我们不会向第三方披露用户的个人信息；用户上传的合同文本仅用于提供审查服务，我们不会将合同文本用于其他用途。
						<br />
						4.免责声明。本服务所提供的合同审查结果仅供参考，用户应根据实际情况进行判断和处理； 因使用本服务导致的任何直接或间接损失，我们不承担任何责任。
						<br />
						5.服务变更与终止。我们保留在任何时候变更、暂停或终止本服务的权利，用户对此表示理解和同意。
					</view>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { baseUrl } from '@/utils/request.js';
import { useUserStore } from '../../store';

const checked = ref(false);
const show = ref(false);
const rules = ref('');
const userStore = useUserStore();
const form = reactive({
	mobile: '',
	code: ''
});
const userEncryptedData = ref('');
const userIv = ref('');
const wxCode = ref('');
const isSending = ref(false);
const sendButtonText = ref('发送验证码');

const handelChecked = (e) => {
	checked.value = !checked.value;
};

const handleGoBack = () => {
	uni.navigateBack({
		delta: 1
	});
};

const getUserinfoApi = () => {
	uni.getUserInfo({
		provider: 'weixin',
		success: (res) => {
			const { encryptedData, iv } = res;
			userEncryptedData.value = encryptedData;
			userIv.value = iv;
		},
		fail: (err) => {
			console.log(err);
		}
	});
};

const prepareLogin = () => {
	if (!checked.value) {
		return uni.showModal({
			content: '是否同意用户协议',
			success: (res) => {
				if (res.confirm) {
					checked.value = true;
				} else {
					uni.showToast({
						title: '请同意用户协议后进行登录',
						icon: 'none'
					});
				}
			}
		});
	}
	// 获取code
	uni.login({
		provider: 'weixin',
		success: async (res) => {
			wxCode.value = res.code;
			await getUserinfoApi();
			// 调用获取手机号的方法
			handlePhoneNumber();
		},
		fail: (err) => {
			console.log(err);
			uni.showToast({
				title: '一键登录失败，请重试',
				icon: 'none'
			});
		}
	});
};

const handlePhoneNumber = (e) => {
	const { iv, encryptedData } = e.detail;
	if (e.detail.errMsg === 'getPhoneNumber:ok') {
		if (wxCode.value) {
			uni.showLoading({
				title: '正在登录..',
				icon: 'none',
				mask: true
			});
			uni.removeStorageSync('userId');
			uni.removeStorageSync('userInfo');
			uni.removeStorageSync('wxInfo');
			uni.removeStorageSync('wxuserId');
			uni.removeStorageSync('wxcookies');
			uni.removeStorageSync('cookies');
			uni.request({
				url: baseUrl + '/api2/wx/wxLogin',
				method: 'post',
				header: {
					'Content-Type': 'application/json'
				},
				data: {
					code: wxCode.value,
					phoneIv: iv,
					phoneEncryptedData: encryptedData,
					userIv: userIv.value,
					userEncryptedData: userEncryptedData.value,
					invitedCode: uni.getLaunchOptionsSync().query.scene || '' //邀请码
				},
				success: (login) => {
					uni.setStorageSync('wxcookies', login.cookies[0]);
					console.log(uni.getLaunchOptionsSync(), 'uni.getLaunchOptionsSync().query.scene');
					if (login.data.code === 200) {
						console.log(162, login.data.data);
						uni.setStorageSync('wxInfo', login.data.data);
						uni.setStorageSync('wxuserId', login.data.data.userId);
						userStore.setDisplayHomePagePopupWindow(login.data.data.displayHomePagePopupWindow);
						userStore.setNewUserHomePageEventTips(login.data.data.newUserHomePageEventTips);
						uni.hideLoading();
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						setTimeout(() => {
							uni.switchTab({
								url: `/pages/index/index`
							});
						}, 100);
					} else {
						uni.showToast({
							icon: 'error',
							title: login.data.message
						});
					}
				},
				fail: (err) => {
					console.log(err);
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					});
				}
			});
		}
	} else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
		return;
	}
};

const handleRest = () => {
	uni.navigateTo({
		url: '/pages/mobile/mobile'
	});
};

const handleShow = (type) => {
	// rules.value = type;
	// show.value = true;
	if (type === 'privacy') {
		uni.navigateTo({
			url: '/subpackage/muguaFile/privacyPolicy'
		});
	} else if (type === 'agreement') {
		uni.navigateTo({
			url: '/subpackage/muguaFile/serviceAgreement'
		});
	} else if (type === 'disclaimer') {
		uni.navigateTo({
			url: '/subpackage/muguaFile/disclaimer'
		});
	}
};
</script>

<style lang="scss">
.rest {
	background-color: #fff;
	width: 276px;
	height: 52px;
	border: 2rpx solid #eee;
	border-radius: 26px;
	margin-top: 40rpx;
}

.login-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 100rpx;
	width: 276px;
	height: 52px;
	color: #fff;
	opacity: 1;
	border-radius: 26px;
	background: #4d6ef1;

	.img {
		width: 20rpx;
		height: 16rpx;
		margin-right: 10rpx;
	}
}

.iconfont {
	float: right;
	margin-bottom: 4rpx;
}

.rulesShow {
	background-color: #fff;
	margin: 204rpx 60rpx;
	border-radius: 10px;
	background: rgba(255, 255, 255, 1);

	.rule {
		padding: 40rpx 34rpx;
		text-align: center;

		.title {
			font-size: 36rpx;
			font-weight: 600;
		}

		.content {
			padding-top: 44rpx;
			font-size: 24rpx;
			text-align: justify;
			vertical-align: top;
		}
	}
}

.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	.topTitle {
		display: flex;
		align-items: center;
		font-size: 18px;
		padding: 110rpx 0 20rpx 30rpx;
	}

	.login {
		text-align: center;
		flex: 1;

		image {
			width: 300rpx;
			height: 320rpx;
			border-radius: 50%;
			margin-top: 60rpx;
		}

		.title {
			padding-top: 20rpx;
			font-size: 34rpx;
			font-weight: 400;
			color: #4d6ef1;
		}

		.tips {
			font-size: 24rpx;
			color: rgba(0, 0, 0, 0.45);
			text-align: center;
			padding-top: 44rpx;
			white-space: nowrap; /* 防止文本换行 */
			word-break: keep-all; /* 保持单词完整性 */
		}

		.btn {
			display: flex;
			justify-content: center;
			align-items: center;

			margin-top: 180rpx;
			color: #fff;
			border-radius: 26px;
			background: rgba(29, 111, 233, 1);

			image {
				width: 40rpx;
				height: 34rpx;
				// padding-right: 10rpx;
			}
		}

		.checkbox {
			padding-top: 34rpx;
			display: flex;
			justify-content: center;
			align-items: flex-end;
			font-size: 24rpx;
			color: rgba(0, 0, 0, 0.65);
			.privacy {
				font-size: 12px;
				color: #909090;
				white-space: nowrap; /* 防止文本换行 */
				word-break: keep-all; /* 保持单词完整性 */
				text {
					font-size: 24rpx;
					color: rgba(29, 111, 233, 1);
				}
			}
		}

		checkbox .wx-checkbox-input {
			border-radius: 50%; /* 圆角 */
			width: 28rpx; /* 背景的宽 */
			height: 28rpx; /* 背景的高 */
		}
		/* 选中后的 背景样式*/
		checkbox .wx-checkbox-input.wx-checkbox-input-checked {
			border: 1rpx solid #4463ef;
			background: #4463ef;
		}

		checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
			border-radius: 50%; /* 圆角 */
			width: 20rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
			height: 20rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
			line-height: 20rpx;
			text-align: center;
			font-size: 22rpx; /* 对勾大小 30rpx */
			color: #fff; /* 对勾颜色 白色 */
			background: transparent;
			transform: translate(-50%, -50%) scale(1);
			-webkit-transform: translate(-50%, -50%) scale(1);
		}

		.other {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 40rpx;
			image {
				margin-top: 10rpx;
			}
		}
	}
}
</style>
