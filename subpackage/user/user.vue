<template>
	<view class="container">
		<u-form labelPosition="left" ref="formRef" :labelWidth="60" :model="userInfo" :rules="rules">
			<u-form-item label="昵称" prop="nickName" borderBottom>
				<u-input v-model="userInfo.nickName" border="none" style="font-weight: 600" maxlength="14" placeholder="昵称最多不能超过14个字"></u-input>
			</u-form-item>
			<u-form-item label="手机号" prop="mobile" borderBottom>
				<u-input v-model="userInfo.userPhoneNumber" border="none" disabled placeholderStyle="text-align:right;"></u-input>
			</u-form-item>

			<u-form-item>
				<button class="btn" @tap="onSubmit">保存</button>
			</u-form-item>
		</u-form>
	</view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { wxUpdateUse, userUpdateUse, getUserById } from '@/api/user.js';
import { getVerificationCode } from '@/api/login.js';
const userInfo = ref({
	nickName: '',
	userPhoneNumber: '',
	code: ''
});

const sendButtonText = ref('发送验证码');
const userId = ref('');
const wxuserId = ref('');
const formRef = ref(null);
const rules = reactive({
	nickName: [
		{
			required: true,
			message: '昵称不能为空',
			trigger: ['blur', 'change']
		}
		// {
		// 	message: '',
		// 	trigger: ['blur', 'change'],
		// }
	]
	// mobile: {
	// 	required: true,
	// 	message: '请输入手机号',
	// 	trigger: ['blur', 'change'],
	// }
});

const onSubmit = () => {
	formRef.value.validate().then(async (valid) => {
		if (valid) {
			if (wxuserId.value) {
				await wxUpdateUse(wxuserId.value, userInfo.value.nickName)
					.then((res) => {
						console.log(res, 78);
						if (res.code === 200) {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							});
							setTimeout(() => {
								uni.navigateBack();
							}, 500);
						} else {
							uni.showToast({
								title: res.message
							});
						}
					})
					.catch((err) => {
						uni.showToast({
							title: err.message,
							icon: 'error'
						});
					});
			} else if (userId.value) {
				await userUpdateUse(userId.value, userInfo.value.nickName)
					.then((res) => {
						console.log(res);
						if (res.code === 200) {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							});
							setTimeout(() => {
								uni.navigateBack();
							}, 500);
						} else {
							uni.showToast({
								title: res.message
							});
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}
	});
};
onShow(async () => {
	userId.value = uni.getStorageSync('userId');
	wxuserId.value = uni.getStorageSync('wxuserId');
	console.log(userId.value);
	console.log(wxuserId.value);
	await getUserById(userId.value || wxuserId.value)
		.then((res) => {
			if (res.code === 200) {
				userInfo.value.nickName = res.data.nickName;
				userInfo.value.userPhoneNumber = res.data.userPhoneNumber;
				// console.log(userInfo.value.userPhoneNumber);
			} else {
				uni.showToast({
					title: res.message,
					icon: 'error'
				});
			}
		})
		.catch((error) => {
			uni.showToast({
				title: '网络异常，请检查网络后重试',
				icon: 'error'
			});
		});
});
</script>

<style lang="scss">
:deep(.u-input__content__field-wrapper__field) {
	padding-right: 10rpx;
	text-align: right !important;
}

// :deep(.u-input__content__field-wrapper__field .userName) {
// 	font-weight: 600;
// 	padding-right: 10rpx;
// 	text-align: right !important;
// }

.container {
	padding: 28rpx 28rpx 0;
	.btn {
		color: #ffffff;
		background: linear-gradient(106.65deg, #4683ff 0%, #1864fe 100%);
		font-size: 32rpx;
	}
}
</style>
