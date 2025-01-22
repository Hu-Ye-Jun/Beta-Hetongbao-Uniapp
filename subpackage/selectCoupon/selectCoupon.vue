<template>
	<view class="container">
		
		<view class="titleText">可使用 <text>{{ availableCoupons.length }} 张</text></view>
		<scroll-view enable-flex scroll-y>
		  <view v-if="availableCoupons && availableCoupons.length > 0">
		    <!-- 循环遍历所有优惠券 -->
		    <view v-for="(item, index) in availableCoupons" :key="item.id">
		      <u-card
		        :head-style="{ padding: 0 }"
		        :border="false"
		        :head-border-bottom="false"
		        :class="{
		          expired: item.status === 'expired',
		          used: item.status === 'used',
		          unused: item.status === 'unused',
		        }"
		        class="coupon-card"
		      >
		        <template #body>
		          <view class="couponCardBody">
		            <view class="coupon-content">
		              <view class="content-left">
		                <view class="coupon-title">
		                  <text
		                    v-if="item.coupon.couponTypeId !== 2"
		                    style="font-size: 18px"
		                    >¥</text
		                  >
		                  <text>{{ item.coupon.promotionDetails }}</text>
		                </view>
		                <!-- 倒计时显示 -->
		                <view class="coupon-center">
		                  <view
		                    v-if="item.countdown"
		                    class="countdown coupon-time"
		                    style="color: red"
		                    >仅剩{{ item.countdown }}</view
		                  >
		                  <view v-else class="coupon-description coupon-time"
		                    >有效期至：{{ formatDate(item.expireDate) }}</view
		                  >
		                  <view class="coupon-use-rules">
		                    {{ item.useRules }}
		                  </view>
		                </view>
		              </view>
		
		              <view>
		                <u-checkbox usedAlone shape="circle" @change="selectCoupon(item.id)" :checked="isCouponSelected(item.id)" />
		              </view>
		              
		            </view>
		            <!-- <view v-if="item.status === 'unused'" class="coupon-tag">
										<u-tag shape="circle" text="超值福利" size="mini" type="error"></u-tag>
									</view> -->
		          </view>
		        </template>
		      </u-card>
		    </view>
		  </view>
		  <view v-else class="empty">
		    <u-image
		      width="260"
		      height="200"
		      src="https://cdn.law.xiaomugua.cn/minip/empty.png"
		      :fade="true"
		      duration="450"
		    ></u-image>
		    <text>暂无优惠券</text>
		  </view>
		</scroll-view>
		
		
		<view class="footer-box">
			<button class="btn" @tap="confirmSelection" :class="{disabled:!selectedCoupon}" :disabled="!selectedCoupon">{{ selectedCoupon ? '确认选择' : '未选择' }}</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/index.js';
import { getUserCouponList } from '@/api/operation.js';
import toast from '../../libs/function/toast';

const availableCoupons = ref([]);
const unAvailableCoupons = ref([]);
const selectedCoupon = ref(null);
const userStore = useUserStore();
const userId = ref('');
const rightsId = ref('');

const isCouponSelected = (id) => {
	return selectedCoupon.value === id;
};

const formatDate = (dateStr) => {
	const date = new Date(dateStr);
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// 格式化倒计时
const formatCountdown = (endTime) => {
	const now = new Date().getTime();
	const end = new Date(endTime).getTime();
	const diff = end - now;

	if (diff <= 0) return null; // 如果已经过期则返回null

	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);

	return `${hours}:${minutes}:${seconds}`;
};

// 检查是否距离过期时间小于24小时
const checkIsExpiringSoon = (endTime) => {
	const now = new Date().getTime();
	const end = new Date(endTime).getTime();
	const diff = end - now;

	return diff > 0 && diff <= 24 * 60 * 60 * 1000; // 小于24小时
};

const toggleUseRules = (couponList, index) => {
	couponList[index].showRules = !couponList[index].showRules;
};

// 选择优惠券
const selectCoupon = (id) => {
	if (selectedCoupon.value !== id) {
		selectedCoupon.value = id;
	} else {
		selectedCoupon.value = null;
	}
};

// 确认选择
const confirmSelection = () => {
	console.log(selectedCoupon.value);
	if (selectedCoupon.value) {
		const selectItem = availableCoupons.value.filter((item) => item.id === selectedCoupon.value);
		// console.log(selectItem);
		userStore.setSelectCoupon(selectItem[0]);
	} else {
		console.log('false');
		userStore.setSelectCoupon({});
	}
	uni.navigateBack();
};

onShow(() => {
	if (userStore.selectCoupon && Object.keys(userStore.selectCoupon).length > 0) {
		selectedCoupon.value = userStore.selectCoupon.id;
	}
});

onLoad((option) => {
	userId.value = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
	rightsId.value = option.rightsId;
	getUserCouponList(userId.value, rightsId.value)
		.then((res) => {
			console.log(res);
			const dataFromBackend = res.data;
			const processedUnusedCoupons = dataFromBackend.available.map((coupon) => {
				// 检查优惠券是否快过期
				const countdown = checkIsExpiringSoon(coupon.coupon.endTime) ? formatCountdown(coupon.coupon.endTime) : null;
				return {
					...coupon,
					status: 'available', // 添加未使用状态
					showRules: false, // 添加一个属性控制规则显示
					countdown
				};
			});

			const processedUsedCoupons = dataFromBackend.unAvailable.map((coupon) => ({
				...coupon,
				status: 'unAvailable', // 添加已使用状态
				showRules: false // 添加一个属性控制规则显示
			}));

			availableCoupons.value = processedUnusedCoupons;
			unAvailableCoupons.value = processedUsedCoupons;

			// 定时更新倒计时
			setInterval(() => {
				availableCoupons.value.forEach((coupon, index) => {
					if (checkIsExpiringSoon(coupon.coupon.endTime)) {
						availableCoupons.value[index].countdown = formatCountdown(coupon.coupon.endTime);
					}
				});
				unAvailableCoupons.value.forEach((coupon, index) => {
					if (checkIsExpiringSoon(coupon.coupon.endTime)) {
						unAvailableCoupons.value[index].countdown = formatCountdown(coupon.coupon.endTime);
					}
				});
			}, 1000); // 每秒更新一次
		})
		.catch((err) => {
			console.log(err);
			toast(err.message);
		});
});
</script>

<style lang="scss" scoped>
.container {
	padding-bottom: 180rpx;
}
.titleText {
	font-family: Microsoft YaHei;
	font-weight: bold;
	font-size: 31rpx;
	color: #0D1114;
	margin: 20rpx 0;
	padding-left: 30rpx;
}
.coupon-card {
  margin-bottom: 50rpx;
}
.coupon-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.content-left {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.coupon-center{
	min-width: 400rpx;
}
.coupon-title {
  font-family: Microsoft YaHei;
  font-size: 64rpx;
  font-weight: bold;
  color: #ec6555;
}
.coupon-description {
  font-size: 16px;
  color: #000;
}
.countdown {
  color: red;
  font-size: 14px;
}
.use-button {
  margin-left: 10px;
}
.expired .coupon-content,
.overdue .coupon-content {
  opacity: 0.5;
}
.expired-badge,
.overdue-badge {
  color: #ccc;
}

.couponCardBody {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.coupon-time {
  margin: 15rpx 0;
}

.coupon-tag {
  position: absolute;
  left: -40rpx;
  top: -50rpx;
  transform: translate(0.8);
}

.coupon-use-rules {
  font-size: 14px;
  color: #ccc;
  margin-top: 8rpx;
}

.imageTransform {
  transform: translateX(25rpx) translateY(-25rpx);
}

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100rpx;
  text {
    font-size: 36rpx;
    color: #666666;
    margin-top: 30rpx;
  }
}

:deep(.u-card.data-v-040f828b) {
  overflow: visible !important;
}
:deep(.u-card.data-v-f5002069) {
  overflow: visible !important;
}

.footer-box {
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fff;
	padding-top: 30rpx;
	box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1);
	padding-bottom: calc(env(safe-area-inset-bottom) + 10rpx) ;
	
	
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
		&.disabled{
			background: #43a8ff;
		}
	}
}

.footer-left {
	line-height: 44rpx;
	font-size: 16px;
}

:deep(.u-card.data-v-040f828b) {
	overflow: visible !important;
}
:deep(.u-border-top){
	border-top-style: none;
}
</style>
