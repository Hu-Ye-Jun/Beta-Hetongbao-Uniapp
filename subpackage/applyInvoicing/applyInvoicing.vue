<template>
	<view class="invoice-page">
		<view style="background-color: white;">
			<TopTitle title="申请开票"></TopTitle>
		</view>
		<!-- 顶部标题 -->
		<view style="margin-top: 15rpx"></view>
		<!-- 内容区域 -->
		<view class="content">
			<u-form :model="form" ref="formRef" labelWidth="90" style="padding: 30rpx">
				<!-- 抬头类型 -->
				<u-form-item label="抬头类型">
					<!-- <u-radio-group v-model="form.invoiceType" label-size="28rpx" size="25rpx">
						<u-radio :name="1" label="企业单位">
						</u-radio>
						<u-radio :name="2" label="个人/非企业单位">
						</u-radio>
					</u-radio-group> -->
					<uni-data-checkbox
						v-model="form.invoiceType"
						:localdata="checkboxList"
						
					  ></uni-data-checkbox>
				</u-form-item>
				

				<!-- 购方名称 -->
				<u-form-item label="购方名称" prop="buyerName">
					<u-input v-model="form.buyerName" placeholder="请填写（必填）" border="none" placeholder-class="placeholder-style" input-align="right"/>
				</u-form-item>

				<!-- 购方税号 -->
				<u-form-item label="购方税号" prop="buyerTaxNumber" v-if="form.invoiceType === 1">
					<u-input v-model="form.buyerTaxNumber" placeholder="请填写（必填）" border="none" placeholder-class="placeholder-style" input-align="right"/>
				</u-form-item>

				<!-- 更多内容 -->
				<u-form-item label="更多内容">
					<u-input v-model="form.moreInfo" placeholder="请填写备注、地址等（非必填）" border="none" placeholder-class="placeholder-style" input-align="right"/>
				</u-form-item>
			</u-form>
		</view>

		<!-- 总金额 -->
		<view class="total-amount">
			总金额
			<text class="amount">{{ feFinalAmount }}元</text>
		</view>

		<!-- 底部提交按钮 -->
		<view class="bottom-bar">
			<u-button type="primary" @click="submitForm" :disabled="isSubmitting" color="#4D6EF1">提交</u-button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import toast from '@/libs/function/toast.js';
import { request } from '../../utils/request';

const form = ref({
	invoiceType: 1,
	buyerName: '',
	buyerTaxNumber: '',
	moreInfo: ''
});
const feFinalAmount = ref(99);
const isSubmitting = ref(false);
const orderId = ref('');

const formRef = ref(null);
const goBack = () => {
	uni.navigateBack();
};

const checkboxList = ref([
	{
		text:"企业单位",
		value:1
	},
	{
		text:"个人/非企业单位",
		value:2
	}
])

onLoad((options) => {
	if (options) {
		console.log(67, options);
		orderId.value = options.orderId;
		feFinalAmount.value = options.finalAmount;
	}
});

const submitForm = () => {
	if (form.value.invoiceType === 1 && form.value.buyerName === '') return toast('请输入购方名称');
	if (form.value.invoiceType === 1 && form.value.buyerTaxNumber === '') return toast('请输入购方税号');
	if (form.value.invoiceType === 2 && form.value.buyerName === '') return toast('请输入购方名称');
	isSubmitting.value = true;
	// 提交请求
	console.log(orderId.value, feFinalAmount.value);
	request('/api2/invoice/addInvoice', 'PUT', {
		headerType: form.value.invoiceType,
		buyerName: form.value.buyerName,
		buyerTaxNumber: form.value.buyerTaxNumber,
		moreContent: form.value.moreInfo,
		orderId: orderId.value
	})
		.then((res) => {
			console.log(res);
			if (res.code === 200) {
				toast('开票申请成功');
			} else {
				toast(res.message);
			}
		})
		.catch((err) => {
			console.log(err);
			toast(err.message);
		});
};
</script>

<style scoped>
.invoice-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.content {
	background-color: #fff;
}

:deep(.placeholder-style){
	font-family: Microsoft YaHei;
	font-weight: 400;
	font-size: 28rpx;
	color: #AAAAAA;
	float: right;
}

.total-amount {
	padding: 15px;
	font-size: 16px;
	color: #333;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fff;
	margin-top: 15rpx;
}

.amount {
	font-size: 28rpx;
	color: #4D6EF1;
}

.bottom-bar {
	position: fixed;
	bottom: 10px;
	left: 0;
	width: 93%;
	padding: 10px 15px;
}





u-button {
	width: 100%;
	background: #4D6EF1;
	border-radius: 13rpx;
}

:deep(.u-radio) {
	margin: 0 10rpx;
}
:deep(.u-form-item__body.data-v-42bac3de) {
	border-bottom: 1px solid #f0f0f0;
	padding: 15px;
}
:deep(.uni-data-checklist .checklist-group .checklist-box){
	margin-right: 0;
	margin-left: 45rpx;
	justify-self: flex-end;
}
</style>
