<template>
  <view class="container">
    <image
      class="mainHeader"
      src="https://cdn.law.xiaomugua.cn/minip/mainHeader.png"
    ></image>
    <view class="main" v-if="combination">
      <!-- <view class="title"><text>剩余次数</text><u-icon name="close" @tap="emit('close')"></u-icon></view> -->
      <view class="title">
        <view class="titleHeader">剩余次数</view>
        <view class="titleText">快来使用看看吧~</view>
      </view>
      <view class="itemBox">
        <view class="item">
          <image
            class="itemImg"
            src="https://cdn.law.xiaomugua.cn/minip/templateImg.png"
          ></image>
          <text style="color: ##555555; font-weight: 300">合同审查</text>
          <text style="color: #799cee">{{
            combination.freeCount + combination.cardCount
          }}</text>
        </view>
        <view class="item">
          <image
            class="itemImg"
            src="https://cdn.law.xiaomugua.cn/minip/bodyreviewImg.png"
          ></image>
          <text style="color: ##555555; font-weight: 300">主体审查</text>
          <text style="color: #799cee">{{ combination.bodyReviewCount }}</text>
        </view>
        <view class="item">
          <image
            class="itemImg"
            src="https://cdn.law.xiaomugua.cn/minip/reviewTemplate.png"
          ></image>
          <text style="color: ##555555; font-weight: 300">查看合同模板</text>
          <text style="color: #799cee">{{
            combination.templateViewCount
          }}</text>
        </view>
      </view>
      <!-- <view class="item">
				<text>下载合同模板</text>
				<text>{{ combination.contractTemplateDownloadCount }}</text>
			</view> -->
    </view>
    <view v-if="!combination" class="title">您还没有购买任何权益哦~</view>
    <view class="close" @tap="emit('close')">
      <!-- <u-icon name="close" @tap="emit('close')"></u-icon> -->
      <image
        class="closeImg"
        src="https://cdn.law.xiaomugua.cn/minip/closeImg.png"
      ></image>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { request } from "../../utils/request.js";

const userId = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
const combination = ref({});

const emit = defineEmits(["close"]);

// 获取所有权益
const getAllRights = async () => {
  const res = await request("/api2/contractReview/getContractCount", "POST", {
    // "userId": "99b60654-4851-4890-9c04-019fec0a3c38",
    userId: userId,
  });
  if (res.data) {
    console.log(res);
    combination.value = res.data.combination;
    console.log(combination.value);
  }
};
getAllRights();
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  padding: 20rpx;
  flex-direction: column;
  position: relative;
  .mainHeader {
    width: 80%;
    height: 280rpx;
    position: absolute;
    top: -120rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .close {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -100rpx;
    width: 70rpx;
    height: 70rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .main {
    width: 95vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 20rpx;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    padding-top: 120rpx;
    .title {
      text-align: center;
      font-size: 28rpx;
      letter-spacing: 0rpx;
      margin-top: 38rpx;
      margin-bottom: 32rpx;
      width: 90%;
      .titleHeader {
        font-size: 38rpx;
        margin-bottom: 5rpx;
      }
      .titleText {
        color: #939393;
      }
    }
    .itemBox {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 30rpx;
      background-color: #f9fafe;
      padding: 30rpx 10rpx;
      border-radius: 20rpx;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        height: 200rpx;
        opacity: 1;
        padding-left: 32rpx;
        padding-right: 32rpx;
        .itemImg {
          height: 80rpx;
          width: 80rpx;
        }
      }
    }
  }
}
</style>
