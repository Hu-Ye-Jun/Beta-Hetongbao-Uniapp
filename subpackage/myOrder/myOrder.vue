<template>
  <view
    style="
      background-color: #f6f6f6;
      padding: 0 30rpx;
      display: flex;
      flex-direction: column;
      height: 100vh;
    "
  >
    <view class="container">
      <view>
        <!-- <uni-data-select class="title" v-model="showValue" :localdata="statusList" :clear="false"></uni-data-select> -->
        <u-sticky>
          <view class="topTitle">
            <image
              @tap="handleGoBack"
              style="
                width: 18rpx;
                height: 30rpx;
                margin-right: 20rpx;
                transform: rotate(180deg);
              "
              src="https://cdn.law.xiaomugua.cn/minip/back.png"
              mode="scaleToFill"
            ></image>
            <view>{{ title }}</view>
          </view>
          <u-tabs
            :list="statusList"
            lineColor="#F9FAFE"
            @change="changeActive"
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

      <scroll-view
        v-if="showList.length > 0"
        class="main"
        scroll-y="true"
        @scrolltolower="scrolltolower"
        @scroll="handleScroll"
      >
        <view
          v-for="(item, index) in showList"
          :key="item.orderId"
          @click="toOrderDetails(item)"
        >
          <view class="item">
            <view class="left"
              ><text style="font-size: 35rpx">¥</text
              >{{ item.finalAmount }}</view
            >
            <view class="middle">
              <text class="order-name">{{
                item.rightsName || item.couponName
              }}</text>
              <text
                class="time"
                v-if="item.status == 1 || item.status == 3 || item.status == 4"
                >{{
                  timeFormat(new Date(item.updateTime), "yyyy-mm-dd hh:MM:ss")
                }}</text
              >
              <text class="time" v-else>{{
                timeFormat(new Date(item.createTime), "yyyy-mm-dd hh:MM:ss")
              }}</text>
            </view>
            <view class="right">
              <view class="refund" :class="'statu-' + item.status">
                {{ item.statusName }}

                <CountDown
                  :time="item.createTime"
                  v-if="item.status == 0"
                ></CountDown>
              </view>
              <button
                :loading="confirmLoading"
                v-if="item.status == 0"
                @tap.stop="continueCreatePhoneWebOrder(item)"
              >
                去支付
              </button>
            </view>
          </view>
        </view>

        <!-- <u-loadmore :status="status" /> -->
        <view class="tips" :class="{ 'sticky-bottom': showList.length < 8 }"
          >已开发票订单不允许退款</view
        >
        <view class="bottom-space"></view>
      </scroll-view>
      <view class="no-data" v-else>
        <u-image src="https://cdn.law.xiaomugua.cn/minip/no-data.png"></u-image>
        <view>暂无订单</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from "vue";
import { request } from "../../utils/request";
import toast from "@/libs/function/toast.js";
import { onLoad, onShow, onHide } from "@dcloudio/uni-app";
import { dateToChinese } from "@/utils/formDate.js";
import { timeFormat } from "@/uni_modules/uview-plus";
import { useUserStore } from "../../store";
import { continueOrder } from "@/api/operation.js";

const userId = ref("");
//订单数据
const showValue = ref(5);
const orderList = reactive([]);
const title = ref("我的订单");
const userStore = useUserStore();
// const showList = ref([])
//加载状态
const status = ref("loadmore");
//显示第几页
const currentPage = ref(0);
const totalItem = ref(0);
const confirmLoading = ref(false);
const statusList = ref([
  {
    name: "全部订单",
    index: 5,
  },
  {
    name: "未支付",
    index: 0,
  },
  {
    name: "已完成",
    index: 1,
  },
  {
    name: "已取消",
    index: 2,
  },
  {
    name: "退款中",
    index: 3,
  },
  {
    name: "已退款",
    index: 4,
  },
]);
const handleGoBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const changeActive = (e) => {
  showValue.value = statusList.value[e.index].index;
};

const showList = computed(() => {
  if (showValue.value === 5) {
    return orderList; // 显示所有项
  } else {
    let arr = ref([]);

    return orderList.filter((item) => item.status == showValue.value);
  }
});

// 获取本地存储中的userId
userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
// 如果没有userId，则跳转到登录页面
if (!userId.value) {
  uni.redirectTo({
    url: "/pages/login/login",
  });
}

// 跳转到订单详情
const toOrderDetails = (item) => {
  // const plainObject = JSON.parse(JSON.stringify(item));
  // console.log("Emitting data:", plainObject);
  // uni.$emit("orderDetails", item);
  uni.navigateTo({
    // url: '/subpackage/orderDetails/orderDetails?item=' + encodeURIComponent(JSON.stringify(item)),
    url: "/subpackage/orderDetails/orderDetails?orderId=" + item.orderId,
  });
};

// 获取我的订单
const getMyOrder = async () => {
  status.value = "loading";
  try {
    const res = await request("/api2/order/getOrderByUserId", "POST", {
      userId: userId.value,
      currentPage: currentPage.value,
    });
    if (res.data) {
      orderList.push(...res.data.orderList);
      totalItem.value = res.data.totalItem;
    }
    if (orderList.length == totalItem.value) {
      status.value = "nomore";
    } else if (orderList.length < totalItem.value) {
      status.value = "loadmore";
    }
  } catch (e) {
    console.log(e);
    toast(e.message);
  }
};

const scrolltolower = () => {
  if (status.value == "loadmore") {
    currentPage.value++;
    // console.log(currentPage.value);
    getMyOrder();
  } else if (status.value == "nomore") {
    toast("没有更多了");
  }
};
const reloadFlag = ref(true);
const reload = () => {
  if (reloadFlag.value) {
    reloadFlag.value = false;
    orderList.length = 0;
    currentPage.value = 0;
    getMyOrder();
  }
};
onShow(() => {
  getMyOrder();
});
onHide(() => {
  orderList.length = 0;
  currentPage.value = 0;
});

const continueCreatePhoneWebOrder = async (orderDetails) => {
  console.log(orderDetails);
  try {
    const res = await continueOrder(orderDetails.orderId);
    if (res.data) {
      // 调用jsapi进行支付
      console.log(res.data);
      userStore.setSelectCoupon({});
      wx.requestPayment({
        timeStamp: res.data.payResult.timestamp,
        nonceStr: res.data.payResult.nonceStr,
        package: res.data.payResult.packageVal,
        signType: res.data.payResult.signType,
        paySign: res.data.payResult.paySign,
        success: function (res) {
          // 支付成功处理逻辑...
          console.log(res);
          paySuccess.value = true;
          showPayModal.value = true;
        },
        fail: function (err) {
          // 支付失败处理逻辑...
          console.log(err);
          paySuccess.value = false;
          showPayModal.value = true;
        },
        finally: function () {
          confirmLoading.value = false;
        },
      });
    } else {
      // 请求订单失败处理逻辑...
      console.log(res);
      confirmLoading.value = false;
    }
  } catch (err) {
    console.log(err);
    toast("网络波动异常, 请稍后重试");
    confirmLoading.value = false;
  }
};
</script>

<style lang="scss">
.topTitle {
  display: flex;
  align-items: center;
  font-size: 18px;
  padding: 110rpx 0 20rpx 30rpx;
  position: sticky;
  top: 0; /* 距离顶部的偏移量 */
}
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f6f6f6;
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
  .tips {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 21rpx;
    color: #a2a2a2;
    margin-bottom: env(safe-area-inset-bottom);
    text-align: center;
    align-self: center;

    &.sticky-bottom {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: env(safe-area-inset-bottom); // 吸附到底部
	  margin-bottom: 0;
    }
    // position: sticky;
    // bottom: env(safe-area-inset-bottom); // 吸附到底部
  }
  .no-data {
    width: inherit;
    height: 100vh;
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
