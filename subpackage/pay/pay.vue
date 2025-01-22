<template>
	<view class="content" :key="viewKey">
		<view style="font-size: 18px; font-weight: 700; text-align: center">请复制以下链接在浏览器中打开进行支付</view>
		<view style="margin: 60rpx 0">
			<u-read-more>
				<view v-if="flag">订单已经在处理中了, 请稍后重试</view>
				<rich-text v-else showHeight="200" :nodes="src"></rich-text>
			</u-read-more>
		</view>
		<u-button style="margin-top: 30rpx" type="primary" text="复制链接" @click="handleCopy"></u-button>
	</view>
</template>

<script setup>
import { onLoad, onBackPress, onShow, onUnload } from '@dcloudio/uni-app';
import { ref, nextTick } from 'vue';
import { request } from '../../utils/request';
import toast from '@/libs/function/toast.js';

const src = ref('');
const flag = ref(false);
const viewKey = ref(0);
const orderInfo = ref({});
const userId = ref('');
const payState = ref(0);
const showCount = ref(0);
let timer = null; // 定时器
// const maxPollTime = 900; // 最大轮询时间，单位为秒
// let pollTime = 0; // 当前轮询时间
const timerStopFlag = ref(false);

const handleCopy = () => {
	uni.setClipboardData({
		data: src.value,
		success: () => {
			toast('复制成功');
		},
		fail: () => {
			toast('复制失败');
		}
	});
};

onShow(() => {
	timer = null;
	timerStopFlag.value = false;
	startPolling();
});

onUnload(() => {
	console.log('onUnload');
	timerStopFlag.value = true;
});

onLoad((option) => {
	userId.value = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
	if (option.isContinue) {
		request(`/api2/alipay/continueCreatePhoneWebOrder?orderId=${option.orderId}`, 'POST')
			.then((res) => {
				if (res.code === 200) {
					nextTick(() => {
						src.value = res.data;
						flag.value = false;
						viewKey.value += 1; // 修改 key 值强制重新渲染
						console.log('数据已更新并且 DOM 已重新渲染');
					});
				}
			})
			.catch((err) => {
				if (err.code === 19010) {
					nextTick(() => {
						console.log(err);
						toast(err.message);
						flag.value = true;
						viewKey.value += 1; // 错误状态下也重新渲染
					});
				}
			});
	} else {
		src.value = JSON.parse(decodeURIComponent(option.url));
		console.log(src.value);
		viewKey.value += 1;
	}
});

onBackPress((e) => {
	console.log('返回');
	if (e.from === 'backbutton') {
		console.log('返回1');
		clearInterval(timer);
		timer = null;
		uni.navigateBack();
	}
});

const startPolling = () => {
	if (timer) return; // 如果定时器已经存在，则不再启动新的定时器
	timer = setInterval(() => {
		if (timerStopFlag.value) {
			clearInterval(timer);
			return;
		}
		getNewOrder();
		// pollTime += 2; // 每次轮询增加2秒
		// if (payState.value === 1) {
		// 	clearInterval(timer);
		// 	timer = null;
		// 	toast('支付成功');
		// 	uni.navigateTo({
		// 		url: '/pages/index/index'
		// 	});
		// } else if (pollTime >= maxPollTime) {
		// 	clearInterval(timer);
		// 	timer = null;
		// 	toast('支付超时，请在订单页继续支付');
		// 	uni.navigateTo({
		// 		url: `/subpackage/orderDetails/orderDetails?orderId=${orderInfo.value.orderId}`
		// 	});
		// }
	}, 2000);
};

const redirectByPaymentResults = (status) => {
	switch (status) {
		case 1:
			timerStopFlag.value = true;
			toast('支付成功, 正在跳转...');
			setTimeout(() => {
				wx.navigateBack({
					delta: 1
				});
			}, 800);
			break;
	}
};

//获取最新的订单
const getNewOrder = async () => {
	try {
		const res = await request('/api2/order/getNewOrder', 'POST', {
			userId: userId.value
		});
		console.log(138, res.data);
		if (res.code == 200 && res?.data?.status) {
			redirectByPaymentResults(res.data.status);
		}
	} catch (e) {
		console.log(e);
		clearInterval(timer);
	}
};
</script>

<style lang="scss">
.content {
	padding: 80rpx;
}
</style>
