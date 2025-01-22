<template>
  <view class="container">
    <scroll-view
      class="main"
      scroll-y="true"
      v-if="orderList && orderList.length > 0"
    >
      <view v-for="(item, index) in orderList" :key="item.orderId">
        <view class="item">
          <view class="row">
            <view class="item-title">
              <text>{{ item.content ? item.content : item.sourceDesc }}</text>
            </view>
            <text class="price">{{
              item.integralChange > 0
                ? "+" + item.integralChange
                : item.integralChange
            }}</text>
          </view>
          <view class="row">
            <text class="time">{{
              timeFormat(new Date(item.createTime), "yyyy-mm-dd hh:MM:ss")
            }}</text>
          </view>
        </view>
      </view>
      <view class="bottom-space"></view>
    </scroll-view>
    <view class="historys" v-else>
      <image
        src="https://cdn.law.xiaomugua.cn/minip/noContent.png"
        mode=""
      ></image>
      <view class="title">暂无记录</view>
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

const userId = ref("");
//订单数据
const orderList = reactive([]);

// 获取本地存储中的userId
userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
// 如果没有userId，则跳转到登录页面
if (!userId.value) {
  uni.redirectTo({
    url: "/pages/login/login",
  });
}

// 获取我的订单
const getMyOrderList = async () => {
  try {
    const res = await request("/api2/users/getIntegralDesc", "POST");
    if (res.data) {
      orderList.push(...res.data);
    }
  } catch (e) {
    console.log(e);
    toast(e.message);
  }
};
onShow(() => {
  getMyOrderList();
});
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(249, 250, 254, 1);
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
    padding: 0 38rpx;
    padding-top: 50rpx;
    .item {
      border-bottom: 2rpx solid rgba(245, 245, 245, 1);
      background: #fff;
      height: 152rpx;
      display: flex;
      flex-direction: column;
      padding: 0 50rpx;
      justify-content: center;
      border-radius: 8rpx;
      margin-bottom: 22rpx;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:first-child {
          margin-bottom: 25rpx;
        }
        .item-title {
          font-size: 28rpx;
          font-weight: 500;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          .refund {
            font-size: 24rpx;
            font-weight: 400;
            // width: 72rpx;
            height: 28rpx;
            font-size: 20rpx;
            font-weight: 400;
            margin-left: 16rpx;
            opacity: 1;
            border-radius: 4rpx;
            padding: 0 8rpx;
            display: flex;
            flex-direction: row;
            .u-count-down {
              height: 28rpx;
              box-sizing: border-box;
              padding: 0;
              .u-count-down__text {
                color: rgba(255, 195, 0, 1);
                font-size: 20rpx;
                font-weight: 400;
                height: 28rpx;
                margin: 0;
                line-height: 20rpx;
              }
            }
            &.statu-0 {
              color: rgba(255, 195, 0, 1);
              background: rgba(255, 250, 232, 1);
            }
            &.statu-1 {
              color: rgba(209, 209, 209, 1);
              background: rgba(245, 245, 245, 1);
            }
            &.statu-2 {
              color: rgba(209, 209, 209, 1);
              background: rgba(245, 245, 245, 1);
            }
            &.statu-3 {
              background: rgba(255, 245, 245, 1);
              color: rgba(255, 140, 140, 1);
            }
            &.statu-4 {
              color: rgba(209, 209, 209, 1);
              background: rgba(245, 245, 245, 1);
            }
            &.statu-5 {
              color: rgba(209, 209, 209, 1);
              background: rgba(245, 245, 245, 1);
            }
            &.statu-6 {
              color: rgba(209, 209, 209, 1);
              background: rgba(245, 245, 245, 1);
            }
          }
        }
        .price {
          font-size: 28rpx;
          font-weight: 600;
        }
        .time {
          font-size: 24rpx;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
    .bottom-space {
      height: env(safe-area-inset-bottom);
    }
  }
}
</style>
