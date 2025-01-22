<template>
	<view class="container">
		<view class="topTitle">
			<image
				@tap="handleGoBack"
				style="width: 18rpx; height: 30rpx; margin-right: 20rpx; transform: rotate(180deg)"
				src="https://cdn.law.xiaomugua.cn/minip/back.png"
				mode="scaleToFill"
			></image>
			<view>手机号登录</view>
		</view>
		<view class="login">
			<view class="titleBox">
				<view class="textBox">
					<view class="title">Hi, 你的</view>
					<view class="title">手机号码是?</view>
					<view class="tips">欢迎使用木瓜合同宝</view>
				</view>
				<image src="https://cdn.law.xiaomugua.cn/minip/muguaAI.png" mode=""></image>
			</view>
			<view class="from">
				<view>
					<u-form :model="form" ref="formRef">
						<u-form-item prop="mobile">
							<u-input border="none" v-model="form.mobile" maxlength="11" type="text" placeholder="请输入手机号" />
						</u-form-item>
						<u-form-item prop="code">
							<u-input border="none" v-model="form.code" type="text" maxlength="10" placeholder="请输入验证码">
								<template #suffix>
									<u-button type="link" :disabled="isSending" @click="sendCode">{{ sendButtonText }}</u-button>
								</template>
							</u-input>
						</u-form-item>
					</u-form>
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
					<u-button customStyle="color: #fff; height: 90rpx;background-color: #4463ef;border-radius:50rpx;margin-top:80rpx" type="primary" @click="login">
						立即登录
					</u-button>
				</view>
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
import { getVerificationCode } from '@/api/login.js';
import { baseUrl } from '@/utils/request.js';

const checked = ref(false);
const show = ref(false);
const rules = ref('');

const form = reactive({
	mobile: '',
	code: ''
});
const isSending = ref(false);
const sendButtonText = ref('获取验证码');
const handelChecked = (e) => {
	checked.value = !checked.value;
};
const sendCode = async () => {
	if (!/^1[3-9]\d{9}$/.test(form.mobile)) {
		uni.showToast({
			title: '手机号格式不正确',
			icon: 'none'
		});
		return;
	}
	isSending.value = true;
	sendButtonText.value = '发送中';

	try {
		await getVerificationCode(form.mobile).then((res) => {
			console.log(res);
		});

		let seconds = 60;
		const interval = setInterval(() => {
			seconds--;
			sendButtonText.value = `${seconds}秒后重发`;
			if (seconds === 0) {
				clearInterval(interval);
				isSending.value = false;
				sendButtonText.value = '发送验证码';
			}
		}, 1000);
	} catch (error) {
		console.log(error);
		uni.showToast({
			title: '发送失败',
			icon: 'error'
		});
		isSending.value = false;
		sendButtonText.value = '发送验证码';
	}
};

const login = async () => {
	if (!form.mobile || !form.code) {
		uni.showToast({
			title: '手机号或验证码不能为空',
			icon: 'none'
		});

		return;
	}
	console.log(checked.value);
	if (!checked.value) {
		console.log(checked.value);
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
	uni.removeStorageSync('userId');
	uni.removeStorageSync('userInfo');
	uni.removeStorageSync('wxInfo');
	uni.removeStorageSync('wxuserId');
	uni.removeStorageSync('wxcookies');
	uni.removeStorageSync('cookies');
	try {
		uni.request({
			url: baseUrl + '/api2/users/smsLogin',
			method: 'post',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: {
				userPhoneNumber: form.mobile,
				verificationCode: form.code,
				invitedCode: uni.getLaunchOptionsSync().query.scene || '' //邀请码
			},
			success: (res) => {
				console.log(wx.getLaunchOptionsSync(), 'uni.getLaunchOptionsSync().query.scene');
				console.log(res, 'cookies');
				uni.setStorageSync('cookies', res.cookies[0]);
				if (res.data.code === 200) {
					if (checked.value) {
						uni.navigateBack({
							delta: 2
						});
						uni.setStorageSync('userInfo', res.data.data);
						uni.setStorageSync('userId', res.data.data.userId);
					}
				} else {
					uni.showToast({
						title: res.data.message,
						icon: 'error'
					});
				}
			},
			fail: (err) => {
				uni.showToast({
					title: err,
					icon: 'error'
				});
			}
		});
	} catch (error) {
		console.log(222, error);
		uni.showToast({
			title: error.message,
			icon: 'error'
		});
	}
};
const handleShow = (type) => {
	// show.value = true;
	// console.log(name);
	// if (name === "privacy") {
	//   rules.value = "privacy";
	// } else if (name === "agreement") {
	//   rules.value = "agreement";
	// }
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

const handleGoBack = () => {
	uni.navigateBack({
		delta: 1
	});
};
</script>

<style lang="scss">
.container {
	// margin: 100rpx;
	height: 100vh;

	.topTitle {
		display: flex;
		align-items: center;
		font-size: 18px;
		padding: 110rpx 0 20rpx 30rpx;
	}

	.login {
		text-align: center;
		padding: 0 50rpx;

		.titleBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 100rpx 0;
			.textBox {
				text-align: left;
				.title {
					color: #090808;
					font-weight: 700;
					font-family: Microsoft YaHei;
					font-size: 62rpx;
					line-height: 80rpx;
				}
				.tips {
					font-size: 32rpx;
					color: rgba(0, 0, 0, 0.45);
					text-align: center;
					padding-top: 10rpx;
					white-space: nowrap; /* 防止文本换行 */
					word-break: keep-all; /* 保持单词完整性 */
					text-align: left;
				}
			}
		}

		image {
			width: 192rpx;
			height: 192rpx;
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

:deep(.u-input__content.data-v-04652187) {
	background-color: #f5f5f5;
	text-align: left;
	padding: 20rpx 50rpx;
	border-radius: 50rpx;
	font-size: 36rpx;
	font-weight: 700;
}
:deep(.u-button.u-reset-button.data-v-20cfe6a0) {
	height: 36rpx;
	color: #4463ef;
}
</style>
