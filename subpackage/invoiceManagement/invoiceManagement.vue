<template>
	<view class="container">
		<!-- <view>
			<uni-data-select @change="changeSelect" class="title" v-model="showValue" :localdata="statusList" :clear="false"></uni-data-select>
		</view> -->

		<view>
		  <u-sticky>
		    <TopTitle title="发票管理"></TopTitle>
		    <u-tabs
		      :list="statusList"
		      lineColor="#F9FAFE"
		      @change="changeSelect"
		      :activeStyle="{
		        fontFamily: 'Microsoft YaHei',
		        fontWeight: 'bold',
		        fontSize: '28rpx',
		        color: '#12172B',
		      }"
		      :inactiveStyle="{
		        fontFamily: 'Microsoft YaHei',
		        fontWeight: 400,
		        fontSize: '28rpx',
		        color: '#515F73',
		      }"
		    ></u-tabs>
		  </u-sticky>
		</view>

		<scroll-view class="main" scroll-y="true" @scrolltolower="scrolltolower">
			<view v-if="invoiceList.length > 0" v-for="(item, index) in invoiceList" :key="item.orderId" @click="toInvoiceDetails(item)">
				<view class="item">
				    <view class="left"
				      ><text style="font-size: 35rpx">¥</text
				      >{{ item.order.finalAmount }}</view
				    >
				    <view class="middle">
				      <text class="order-name">{{
				        item.order.rightsName || item.order.couponName
				      }}</text>
				      <text
				        class="time"
				        v-if="item.invoiceStatus == 1 || item.invoiceStatus == 3 || item.invoiceStatus == 4"
				        >{{
				          timeFormat(new Date(item.updateDate), "yyyy-mm-dd hh:MM:ss")
				        }}</text
				      >
				      <text class="time" v-else>{{
				        timeFormat(new Date(item.createDate), "yyyy-mm-dd hh:MM:ss")
				      }}</text>
				    </view>
				    <view class="right">
				      <view class="refund" :class="'statu-' + item.invoiceStatus">
				        {{ item.invoiceStatusName }}
				
				        <CountDown
				          :time="item.createDate"
				          v-if="item.status == 0"
				        ></CountDown>
				      </view>
				    </view>
				  
				</view>
				
				<!-- <view class="item">
					<view class="row">
						<view class="item-title">
							<text>{{ item.order.rightsName || item.order.couponName }}</text>
							<view class="refund" :class="'statu-' + item.invoiceStatus">
								{{ item.invoiceStatusName }}
								<CountDown :time="item.createTime" v-if="item.invoiceStatus == 0"></CountDown>
							</view>
						</view>
						<text class="price">{{ item.order.finalAmount }}</text>
					</view>
					<view class="row">
						<text class="time" v-if="item.invoiceStatus == 1 || item.invoiceStatus == 3 || item.invoiceStatus == 4">
							{{ timeFormat(new Date(item.createDate), 'yyyy-mm-dd hh:MM:ss') }}
						</text>
						<text class="time" v-else>{{ timeFormat(new Date(item.createDate), 'yyyy-mm-dd hh:MM:ss') }}</text>
					</view>
				</view> -->
			</view>
			<view class="no-data" v-else>
				<!-- <u-empty mode="list"></u-empty> -->
				<image src="https://cdn.law.xiaomugua.cn/minip/invoice_empty.png"></image>
				<view>暂无发票订单</view>
			</view>
			<!-- <u-loadmore :status="status" /> -->
			<view class="bottom-space"></view>
		</scroll-view>
	</view>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { request } from '../../utils/request';
import toast from '@/libs/function/toast.js';
import { onLoad, onShow, onHide } from '@dcloudio/uni-app';
import { dateToChinese } from '@/utils/formDate.js';
import { timeFormat } from '@/uni_modules/uview-plus';

const userId = ref('');
//订单数据
const showValue = ref(0);
const invoiceList = ref([]);
// const showList = ref([])
//加载状态
const status = ref('loadmore');
//显示第几页
const currentPage = ref(0);
const totalItem = ref(0);
const statusList = ref([]);

const showList = computed(() => {
	if (showValue.value === 0) {
		return invoiceList; // 显示所有项
	} else {
		let arr = ref([]);

		return invoiceList.filter((item) => item.status == showValue.value);
	}
});

const changeSelect = ({index}) => {
	showValue.value = statusList.value[index].value
	getInvoiceList();
};

// 获取本地存储中的userId
userId.value = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
// 如果没有userId，则跳转到登录页面
if (!userId.value) {
	uni.redirectTo({
		url: '/pages/login/login'
	});
}

// 跳转到开票详情
const toInvoiceDetails = (item) => {
	uni.navigateTo({
		url: `/subpackage/invoiceDetails/invoiceDetails?invoice=${encodeURIComponent(JSON.stringify(item))}`
	});
};

// 获取我的订单
const getMyOrder = async () => {
	status.value = 'loading';
	try {
		const res = await request('/api2/order/getOrderByUserId', 'POST', {
			userId: userId.value,
			// userId:"ojPgh7Y69kJmA981Rl27rGMtrD2g",
			currentPage: currentPage.value
		});
		if (res.data) {
			invoiceList.push(...res.data.invoiceList);
			totalItem.value = res.data.totalItem;
		}
		if (invoiceList.length == totalItem.value) {
			status.value = 'nomore';
		} else if (invoiceList.length < totalItem.value) {
			status.value = 'loadmore';
		}
	} catch (e) {
		console.log(e);
		toast(e.message);
	}
};

const getInvoiceStatus = async () => {
	try {
		const res = await request('/api2/invoice/getInvoiceStatus', 'GET');
		console.log(122, res);
		if (res.data) {
			statusList.value = res.data;
			statusList.value = statusList.value.map(obj => {
			    if (obj.hasOwnProperty('text')) {
			        obj.name = obj.text; // 添加新键
			        delete obj.text; // 删除旧键
			    }
			    return obj;
			});
		}
	} catch (err) {
		console.log(err);
	}
};

const getInvoiceList = async () => {
	status.value = 'loading';
	try {
		const res = await request('/api2/invoice/getInvoiceList', 'GET', {
			userId: userId.value,
			invoiceStatus: showValue.value,
			currentPage: currentPage.value
		});
		console.log(129, res);
		if (res.data) {
			invoiceList.value = res.data.invoiceList;
			totalItem.value = res.data.totalItem;
		} else {
			invoiceList.value = [];
		}
		if (invoiceList.value.length == totalItem.value) {
			status.value = 'nomore';
		} else if (invoiceList.value.length < totalItem.value) {
			status.value = 'loadmore';
		}
	} catch (e) {
		console.log(e);
		toast(e.message);
	}
};

const scrolltolower = () => {
	if (status.value == 'loadmore') {
		currentPage.value++;
		// console.log(currentPage.value);
		// getMyOrder();
		getInvoiceList();
	} else if (status.value == 'nomore') {
		toast('没有更多了');
	}
};
const reloadFlag = ref(true);
const reload = () => {
	if (reloadFlag.value) {
		reloadFlag.value = false;
		invoiceList.value.length = 0;
		currentPage.value = 0;
		// getMyOrder();
		getInvoiceList();
	}
};
onShow(() => {
	// getMyOrder();
	getInvoiceStatus();
	getInvoiceList();
});
onHide(() => {
	invoiceList.value.length = 0;
	currentPage.value = 0;
});
</script>

<style lang="scss">
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: rgba(249, 250, 254, 1);
	padding: 0 34rpx;
	.title {
		font-size: 28rpx;
		font-weight: 500;
		margin-left: 42rpx;
		margin-bottom: 30rpx;
		margin-top: 34rpx;
		width: 194rpx;
		height: 52rpx;
		opacity: 1;
		border-radius: 40rpx;
		background: rgba(240, 240, 240, 1);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.uni-select {
			border: 0;
		}
	}
	


	.main {
	  flex: 1;
	  overflow: hidden;
	  // background: #fff;
	  box-sizing: border-box;
	  // padding: 0 32rpx;
	  .item {
	    border-bottom: 2rpx solid rgba(245, 245, 245, 1);
	    background: #fff;
	    height: 152rpx;
	    display: flex;
	    flex-direction: row;
	    padding: 0 27rpx 0 28rpx;
	    justify-content: center;
	    margin-bottom: 22rpx;
	    border-radius: 13rpx;
	    align-items: center;
	    .left {
	      font-family: Microsoft YaHei;
	      font-weight: bold;
	      font-size: 57rpx;
	      color: #ec6555;
	      margin-right: 35rpx;
	    }
	    .middle {
	      font-family: Microsoft YaHei;
	      font-weight: 400;
	      font-size: 23rpx;
	      color: #434343;
	      display: flex;
	      flex-direction: column;
	      flex: 1;
	      .order-name {
	        font-family: Microsoft YaHei;
	        font-weight: bold;
	        font-size: 31rpx;
	        color: #464646;
	      }
	    }
	    .right {
	      font-family: Microsoft YaHei;
	      font-weight: 400;
	      font-size: 24rpx;
	      display: flex;
	      flex-direction: column;
	      height: 122rpx;
	      width: 160rpx;
	      align-items: center;
	      justify-content: space-between;
	      .statu-0 {
	        color: #4d6ef1;
	      }
	      .statu-1,
	      .statu-2,
	      .statu-4 {
	        color: #a2a2a2;
	      }
	      .statu-3 {
	        color: #edae55;
	      }
	      button {
	        width: 128rpx;
	        height: 60rpx;
	        background: #4d6ef1;
	        border-radius: 9rpx;
	        font-family: Microsoft YaHei;
	        font-weight: 400;
	        font-size: 25rpx;
	        color: #ffffff;
	        align-self: flex-end;
	      }
	    }
	  }
	  .bottom-space {
	    height: env(safe-area-inset-bottom);
	  }
	}
	.no-data {
	  width: inherit;
	  height: 100%;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  flex-direction: column;
	  u-image {
	    width: 555rpx;
	    height: 363rpx;
	    margin-bottom: 96rpx;
	  }
	  view {
	    font-family: Microsoft YaHei;
	    font-weight: 400;
	    font-size: 41rpx;
	    color: #666666;
	  }
	}
}
</style>
