<template>
  <view class="container">
    <view class="bgBox">
      <image
        src="https://cdn.law.xiaomugua.cn/minip/buyVipBg.png"
        style="width: 100%; height: 100%; position: absolute"
      ></image>
      <view style="padding: 6vh 30rpx 0 30rpx">
        <view class="navBar">
          <view class="navIcon" @tap="handleGoBack">
            <u-icon size="24" name="arrow-left" color="#000"></u-icon>
          </view>
          <view class="navText">会员充值</view>
        </view>
        <view class="header">
          <view class="infoBox">
            <!-- <u-avatar src="https://cdn.law.xiaomugua.cn/minip/user.png" size="45"></u-avatar> -->
            <view class="avatarImg">
              <image
                style="width: 100%; height: 100%"
                src="https://cdn.law.xiaomugua.cn/minip/avatarImg.png"
              ></image>
            </view>
            <view class="info">
              <view :class="['nickname', { 'nickname-not-vip': !isVip }]">
                {{ nickName || "用户名" }}
              </view>
              <view class="vipInfo" v-if="!isVip">开通会员，畅享好内容</view>
              <view class="vipInfo" v-else>
                VIP权益生效中
                <br />
                {{ dateToYear(expirationTime) }}到期
              </view>
            </view>
          </view>
          <!-- 				<view class="headerBg">
						<u-image v-if="isVip" width="170" height="170" src="https://cdn.law.xiaomugua.cn/minip/vipBg.png" :fade="true" duration="450"></u-image>
						<u-image v-else width="170" height="170" src="https://cdn.law.xiaomugua.cn/minip/notVipBg.png" :fade="true" duration="450"></u-image>
					</view> -->
        </view>
      </view>
    </view>

    <view class="vipCard">
      <!-- 外层圆角卡片 -->
      <view class="outer-card">
        <!-- 内层圆角样式卡片 -->
        <view class="privilege-title">享优质审查、24小时专属客服等特权</view>
        <view class="inner-card">
          <view class="privileges">
            <view class="privilege-item">
              <view class="icon">
                <u-image
                  width="30"
                  height="30"
                  src="https://cdn.law.xiaomugua.cn/minip/contract.png"
                  :fade="true"
                  duration="450"
                ></u-image>
              </view>
              <view class="text">合同审查</view>
            </view>
            <view class="privilege-item">
              <view class="icon">
                <u-image
                  width="30"
                  height="30"
                  src="https://cdn.law.xiaomugua.cn/minip/mainBody.png"
                  :fade="true"
                  duration="450"
                ></u-image>
              </view>
              <view class="text">主体审查</view>
            </view>
            <view class="privilege-item">
              <view class="icon">
                <u-image
                  width="30"
                  height="30"
                  src="https://cdn.law.xiaomugua.cn/minip/template.png"
                  :fade="true"
                  duration="450"
                ></u-image>
              </view>
              <view class="text">海量合同模板</view>
            </view>
            <view class="privilege-item">
              <view class="icon">
                <u-image
                  width="30"
                  height="30"
                  src="https://cdn.law.xiaomugua.cn/minip/service.png"
                  :fade="true"
                  duration="450"
                ></u-image>
              </view>
              <view class="text">专属客服</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="commodityBox">
      <view class="select" v-if="!isIos">
        <view
          class="selectItem"
          :class="{ active: activeIndex == index }"
          v-for="(item, index) in rightsList"
          :key="item.rightsId"
          @click="toggleActive(index, item)"
        >
          <view class="title">
            {{ item.rightsName }}
          </view>
          <view class="originalPrice">￥{{ item.rightsOriginalPrice }}</view>
          <view class="price">￥{{ item.rightsDiscountPrice }}</view>
          <view
            v-if="index === 0"
            :class="activeIndex == index ? 'info' : 'unInfo'"
            >企业适用，¥0.2/天</view
          >
          <view
            v-if="index === 1"
            :class="activeIndex == index ? 'info' : 'unInfo'"
            >推荐开通, 最大优惠</view
          >
          <view class="triangle" v-if="activeIndex == index"></view>
        </view>
      </view>

      <view class="terms" v-if="!isIos">
        <view class="termsText">购买前请仔细阅读</view>
        <view class="termsLink" @tap="handleShow('agreement')"
          >《会员服务协议》</view
        >
      </view>
    </view>

    <view class="paymethod">
      <view class="title">支付方式</view>
      <u-radio-group v-model="radiovalue" placement="row" @change="groupChange">
        <view style="width: 100%">
          <view
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              margin: 36rpx 0;
            "
          >
            <view style="display: flex; align-items: center">
              <!-- <u-icon name="zhifubao" color="#2979ff" size="28"></u-icon> -->
              <image
                style="width: 56rpx; height: 56rpx"
                src="https://cdn.law.xiaomugua.cn/minip/zfb.png"
              ></image>
              <view style="margin-left: 10rpx">支付宝</view>
            </view>
            <u-radio activeColor="#2577e0" name="支付宝支付"></u-radio>
          </view>
          <view
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            "
          >
            <view style="display: flex; align-items: center">
              <!-- <u-icon name="weixin-fill" color="#03c60e" size="28"></u-icon> -->
              <image
                style="width: 56rpx; height: 56rpx"
                src="https://cdn.law.xiaomugua.cn/minip/wx.png"
              ></image>
              <view style="margin-left: 10rpx">微信</view>
            </view>
            <u-radio activeColor="#2577e0" name="weChat-pay"></u-radio>
          </view>
        </view>
      </u-radio-group>
    </view>

    <view class="footer">
      <view class="infoTitle">会员权益</view>
      <view class="rightsInfo">
        <u-image
          width="660rpx"
          height="750rpx"
          src="https://cdn.law.xiaomugua.cn/minip/vip-rights.png"
          :fade="true"
          duration="450"
		  mode="aspectFit"
        ></u-image>
      </view>
      <view
        v-if="isIos"
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #ccc;
          margin-top: 20rpx;
        "
      >
        <!-- <u-icon color="#ccc" size="28" name="info-circle"></u-icon> -->
        <image
          style="width: 280rpx; height: 200rpx"
          src="https://cdn.law.xiaomugua.cn/minip/locking.png"
        ></image>
        <view style="margin-top: 20rpx; color: #ccc"
          >IOS手机不支持购买, 如有疑问请联系客服</view
        >
      </view>
    </view>

    <view class="couponBox">
      <!-- 优惠券部分 -->
      <!-- <view class="coupon-section" v-if="!isIos">
				<view class="left-section">
					<text class="coupon-label">优惠券</text>
					<text class="no-coupon">
						{{ selectCouponItem && selectCouponItem.coupon && selectCouponItem.coupon.couponName ? selectCouponItem.coupon.couponName : '暂未选择优惠券' }}
					</text>
				</view>
				<view class="right-section" @tap="selectCoupon">
					<text class="select-other">选择其他优惠券</text>
					<u-icon name="arrow-right" size="20" color="#d3d3d3"></u-icon>
				</view>
			</view> -->

      <!-- 价格和按钮部分 -->
      <view class="price-section">
        <view class="price-info">
          <view v-if="!isIos">
            <view>
              <text style="font-size: 32rpx; color: #ff5722">¥</text>
              <text class="price">{{ feFinalAmount }}</text>
              <!-- <text class="discount">已优惠{{ feDiscountAmount }}元</text> -->
            </view>
            <view class="coupon-section">
              <view class="left-section">
                <text class="coupon-label">券</text>
                <view class="select-coupon" @tap="selectCoupon">
                  <text class="no-coupon">
                    {{
                      selectCouponItem &&
                      selectCouponItem.coupon &&
                      selectCouponItem.coupon.couponName
                        ? selectCouponItem.coupon.couponName
                        : "无优惠券"
                    }}
                  </text>
                  <u-icon name="arrow-right" size="16" color="#000"></u-icon>
                </view>
              </view>
            </view>
          </view>
          <view v-else>解锁更多优质服务</view>
        </view>
        <view class="buy-btn">
          <u-button
            v-if="!isIos"
            @tap="handlePay"
            :hairline="false"
            color="#fbc78e"
            type="primary"
            :loading="confirmLoading"
            custom-style="background: linear-gradient(to right, #EE8A3E, #EC6955); border-radius: 24rpx; padding: 40rpx 24rpx; color:#fff; font-weight: 700;"
          >
            同意协议并立即支付
          </u-button>
          <u-button
            v-else
            @tap="handleContact"
            :hairline="false"
            color="#fbc78e"
            type="primary"
            custom-style="background: linear-gradient(to right, #EE8A3E, #EC6955); border-radius: 24rpx; padding: 40rpx 24rpx; color:#fff; font-weight: 700;"
          >
            联系客服
          </u-button>
        </view>
      </view>
      <view>
        <text v-if="!isIos" style="font-size: 24rpx; color: #989898"
          >点击支付表明您已阅读并同意《会员服务协议、隐私政策》</text
        >
      </view>

      <!-- 			<view class="price-section">
				<view class="price-info">
					<view v-if="!isIos">
						<text>合计：</text>
						<text class="price">{{ feFinalAmount }}</text>
						<text class="discount">已优惠{{ feDiscountAmount }}元</text>
					</view>
					<view v-else>解锁更多优质服务</view>
				</view>
				<view class="buy-btn">
					<u-button
						v-if="!isIos"
						@tap="handlePay"
						:hairline="false"
						color="#fbc78e"
						type="primary"
						:loading="confirmLoading"
						custom-style="background: linear-gradient(to right, #fbc78e, #f08b48); border-radius: 50rpx; padding: 0 40rpx; color:#b36211; font-weight: 700;"
					>
						确认协议并购买
					</u-button>
					<u-button
						v-else
						@tap="handleContact"
						:hairline="false"
						color="#fbc78e"
						type="primary"
						custom-style="background: linear-gradient(to right, #fbc78e, #f08b48); border-radius: 50rpx; padding: 0 40rpx; color:#b36211; font-weight: 700;"
					>
						联系客服
					</u-button>
				</view>
			</view> -->
    </view>

    <u-overlay :show="show">
      <view class="rulesShow">
        <view class="rule" v-if="rules === 'agreement'">
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
            4.免责声明。本服务所提供的合同审查结果仅供参考，用户应根据实际情况进行判断和处理；
            因使用本服务导致的任何直接或间接损失，我们不承担任何责任。
            <br />
            5.服务变更与终止。我们保留在任何时候变更、暂停或终止本服务的权利，用户对此表示理解和同意。
          </view>
        </view>
      </view>
    </u-overlay>

    <u-modal
      :show="showPayModal"
      :title="title"
      confirmText="查看订单"
      cancelText="我知道了"
      showCancelButton
      buttonReverse
      @cancel="handlePayCancel"
      @confirm="handlePayConfirm"
    >
      <view class="slot-content" style="text-align: center">
        <view v-if="paySuccess">
          <image
            style="width: 100rpx; height: 100rpx"
            src="https://cdn.law.xiaomugua.cn/minip/payOk.png"
          ></image>
          <view style="margin-top: 30rpx; font-weight: 700; font-size: 18px"
            >恭喜您！支付成功</view
          >
        </view>
        <view v-else>
          <image
            style="width: 100rpx; height: 100rpx"
            src="https://cdn.law.xiaomugua.cn/minip/payErr.png"
          ></image>
          <view style="margin-top: 30rpx; font-weight: 700; font-size: 18px"
            >支付失败</view
          >
          <view style="margin-top: 30rpx; font-size: 14px; color: #ccc"
            >支付好像遇到问题</view
          >
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { request } from "../../utils/request";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { toast } from "../../uni_modules/uview-plus";
import { useUserStore } from "../../store";
import {
  createPhoneWebOrder,
  getCalculateFinalPrice,
  createWxOrder,
} from "@/api/operation.js";
import { dateToYear } from "@/utils/formDate.js";
import { getUserCouponList } from "@/api/operation.js";

const isVip = ref(false);
const userId = ref("");
const nickName = ref("");
const rightsList = ref([]);
const activeIndex = ref(0);
const expirationTime = ref("");
const rules = ref("");
const show = ref(false);
const userStore = useUserStore();
const isIos = ref(userStore.system === "ios");
// const isIos = ref(true);
const selectCouponItem = ref();
const rights = ref();
const feTotalAmount = ref();
const feDiscountAmount = ref();
const feFinalAmount = ref();
const couponList = ref([]);
const radiovalue = ref("weChat-pay");
const showPayModal = ref(false);
const paySuccess = ref(false);
const confirmLoading = ref(false);
const payOrderId = ref("");

onLoad(() => {
  userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  if (!userId.value) {
    uni.redirectTo({
      url: "/pages/login/login",
    });
    return;
  }
  getRightsList();
});

onShow(() => {
  getUserInfo();
  getIsUsingRights();
  if (
    userStore.selectCoupon &&
    Object.keys(userStore.selectCoupon).length > 0
  ) {
    selectCouponItem.value = userStore.selectCoupon;
    countProce();
  } else {
    selectCouponItem.value = {};
    feTotalAmount.value = rights.value.rightsOriginalPrice;
    feDiscountAmount.value = 0;
    feFinalAmount.value = rights.value.rightsDiscountPrice;
  }
});

const handleContact = () => {
  console.log("handleContact");
  // 跳转客服
  try {
    wx.openCustomerServiceChat({
      extInfo: {
        url: "https://work.weixin.qq.com/kfid/kfc6b083a0e732c2639",
      },
      corpId: "wwbf12658b7f639707", //企业微信ID
      success: (res) => {
        console.log(260, res);
      },
      fail: (err) => {
        console.log(263, err);
      },
    });
  } catch (error) {
    console.log("请更新至微信最新版本");
  }
};

const handlePayConfirm = () => {
  uni.navigateTo({
    url: `/subpackage/orderDetails/orderDetails?orderId=${payOrderId.value}`,
  });
};

const handlePayCancel = () => {
  // showPayModal.value = false;
  uni.switchTab({
    url: `/pages/my/my`,
  });
};

const groupChange = (n) => {
  console.log("groupChange", n);
  console.log(radiovalue.value);
};

// const getCouponList = () => {
// 	getUserCouponList(userId.value, rights.value.rightsId)
// 		.then((res) => {
// 			couponList.value = res.data.available;
// 			const law = res.data.available.filter(item => item.bestCoupon)
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// };

const countProce = async () => {
  await getCalculateFinalPrice(
    userId.value,
    selectCouponItem.value.id,
    rights.value.rightsId
  )
    .then((res) => {
      console.log(res, "getCalculateFinalPrice");
      feTotalAmount.value = res.data.totalAmount;
      feDiscountAmount.value = res.data.discountAmount;
      feFinalAmount.value = res.data.finalAmount;
    })
    .catch((err) => {
      console.log(err);
    });
};

const selectCoupon = () => {
  uni.navigateTo({
    url: `/subpackage/selectCoupon/selectCoupon?rightsId=${rights.value.rightsId}`,
  });
};

const handleShow = (type) => {
  // rules.value = type;
  // show.value = true;
  uni.navigateTo({
    url: "/subpackage/muguaFile/memberServiceAgreement",
  });
};

const handlePay = async () => {
  console.log(rights.value);
  const userCouponId = selectCouponItem.value.id
    ? selectCouponItem.value.id
    : "";
  confirmLoading.value = true;
  if (radiovalue.value === "支付宝支付") {
    createPhoneWebOrder(rights.value.rightsId, userCouponId)
      .then((res) => {
        if (res.code === 200) {
          userStore.setSelectCoupon({});
          uni.navigateTo({
            url: `/subpackage/pay/pay?url=${encodeURIComponent(
              JSON.stringify(res.data)
            )}`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast("网络波动异常, 请稍后重试");
      })
      .finally(() => {
        confirmLoading.value = false;
      });
  } else {
    try {
      const res = await createWxOrder(
        rights.value.rightsId,
        userCouponId,
        "weChat-pay"
      );
      if (res.data) {
        // 调用jsapi进行支付
        console.log(res.data);
        payOrderId.value = res.data.order.orderId;
        userStore.setSelectCoupon({});
        selectCouponItem.value = {};
        if (res.data.payResult === null) {
          toast("订单参数异常");
          return;
        }
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
            confirmLoading.value = false;
          },
          fail: function (err) {
            // 支付失败处理逻辑...
            console.log(err);
            paySuccess.value = false;
            showPayModal.value = true;
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
  }
};

// 切换激活状态
const toggleActive = (index, rightsItem) => {
  activeIndex.value = index;
  rights.value = rightsItem;
  feTotalAmount.value = rights.value.rightsOriginalPrice;
  feDiscountAmount.value = 0;
  feFinalAmount.value = rights.value.rightsDiscountPrice;
  selectCouponItem.value = {};
  userStore.setSelectCoupon({});
};

// 返回上一页
const handleGoBack = () => {
  uni.navigateBack();
};

// 获取用户信息
const getUserInfo = async () => {
  const res = await request("/api2/users/getUserById", "POST", {
    userId: userId.value,
  });
  if (res.code === 200) {
    nickName.value = res.data.nickName;
  }
};

// 获取是否是会员
const getIsUsingRights = async () => {
  const res = await request("/api2/userRights/getIsUsingRights", "POST", {
    userId: userId.value,
    // "userId":"99b60654-4851-4890-9c04-019fec0a3c38"
  });
  if (res.code === 200) {
    isVip.value = res.data.isUsing;
    if (res.data.isUsing) {
      expirationTime.value = res.data.expirationTime;
    }
    console.log(isVip.value);
  }
};

// 获取权益列表
const getRightsList = async () => {
  const res = await request("/api2/rights/getRightsList", "POST", {
    isDelete: null,
  });
  if (res.code === 200) {
    rightsList.value = res.data;
    if (
      userStore.selectCoupon &&
      Object.keys(userStore.selectCoupon).length > 0
    ) {
      if (
        userStore.selectCoupon.coupon.couponAvailableCardTypeId === 3 ||
        userStore.selectCoupon.coupon.couponAvailableCardTypeId === 5
      ) {
        activeIndex.value = 0;
        rights.value = res.data[0];
        feTotalAmount.value = rights.value.rightsOriginalPrice;
        feDiscountAmount.value = 0;
        feFinalAmount.value = rights.value.rightsDiscountPrice;
        countProce();
      } else {
        activeIndex.value = 1;
        rights.value = res.data[1];
        feTotalAmount.value = rights.value.rightsOriginalPrice;
        feDiscountAmount.value = 0;
        feFinalAmount.value = rights.value.rightsDiscountPrice;
        countProce();
      }
    } else {
      activeIndex.value = 0;
      rights.value = res.data[0];
      feTotalAmount.value = rights.value.rightsOriginalPrice;
      feDiscountAmount.value = 0;
      feFinalAmount.value = rights.value.rightsDiscountPrice;
    }
  }
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #f6f6f6;
  position: relative;
  .header {
    width: 100%;
    height: 280rpx;
    display: flex;
    padding-left: 20rpx;
    box-sizing: border-box;
    position: relative;
    .headerBg {
      position: absolute;
      bottom: 90rpx;
      right: -20rpx;
    }
    .infoBox {
      padding-top: 50rpx;
      display: flex;
      .avatarImg {
        width: 90rpx;
        height: 90rpx;
        margin-right: 24rpx;
      }
      .info {
        display: flex;
        flex-direction: column;
        .vipInfo {
          font-size: 24rpx;
          color: #1e1e32;
        }
        .nickname {
          font-size: 18px;
          font-weight: 500;
          color: #000;
          &.nickname-not-vip {
            color: #000; /* 未开通会员时的nickname字体色 */
          }
        }
      }
    }

    .vipIcon {
      width: 70rpx;
      height: 47.35rpx;
    }
  }

  .vipCard {
    width: 100vw;
    position: absolute;
    top: 280rpx;
    /* 外层卡片样式 */
    .outer-card {
      background-color: #dcebff; /* 橙色背景 */
      border-radius: 20rpx; /* 圆角 */
      padding-top: 20rpx;
      margin: 60rpx 30rpx;
    }

    /* 内层卡片样式 */
    .inner-card {
      background-color: #ffffff; /* 白色背景 */
      border-radius: 20rpx; /* 圆角 */
      padding: 20rpx 40rpx;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 卡片阴影 */
    }

    .privilege-title {
      font-size: 24rpx;
      color: #565f66; /* 标题颜色 */
      margin-bottom: 20rpx;
      padding-left: 20rpx;
    }

    .privileges {
      display: flex;
      justify-content: space-between;
    }

    .privilege-item {
      text-align: center;
    }

    .icon {
      display: flex;
      justify-content: center;
      margin-bottom: 20rpx;
    }

    .text {
      margin-top: 10rpx;
      font-size: 24rpx;
      color: #999999;
    }
  }

  .commodityBox {
    background-color: #fff;
    padding-bottom: 30rpx;
    margin-bottom: 14rpx;
  }

  .select {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 160rpx;
    .selectItem {
      width: 220rpx;
      height: 240rpx;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-between;
      background: rgba(255, 255, 255, 1);
      border: 6rpx solid #f1f1f1;
      border-radius: 30rpx;
      color: #000;
      position: relative; /* 添加相对定位 */
      // box-sizing: border-box;
      &.active {
        border: 6rpx solid #ef8b3e;
        color: #ec6955;
        .originalPrice {
          color: #ef8b3e !important;
        }
      }
      &:not(.active) {
        &::before {
          background-color: rgba(229, 229, 229, 1) !important;
        }
      }
      &:not(:last-child) {
        margin-right: 30rpx;
      }
      @mixin title {
        font-size: 28rpx;
        font-weight: 700;
        width: 100%;
        display: flex;
        justify-content: start;
        margin-top: 35rpx;
        padding-left: 30rpx;
        color: #000;
      }
      &:nth-child(odd) {
        .title {
          // background: rgba(232, 139, 139, 1);
          @include title();
        }
      }
      &:nth-child(even) {
        .title {
          // background: rgba(172, 51, 193, 1);
          @include title();
        }
      }

      .price {
        font-size: 42rpx;
        font-weight: 500;
        display: flex;
        align-items: center;
        margin-top: 15rpx;
        padding-left: 30rpx;
        margin-bottom: 10rpx;
      }
      .originalPrice {
        font-size: 22rpx;
        font-weight: 400;
        color: rgba(166, 166, 166, 1);
        text-decoration: line-through;
        padding-left: 30rpx;
      }

      /* 添加伪元素 */
      &:first-child::before {
        content: "限时活动";
        position: absolute;
        top: -15rpx;
        left: -5rpx;
        background-color: #ec6955;
        color: #fff;
        padding: 8rpx 12rpx;
        border-top-left-radius: 15rpx;
        border-bottom-right-radius: 30rpx;
        font-size: 20rpx;
      }
    }
    .info {
      font-size: 20rpx;
      text-align: center;
      width: 92%;
      background-color: #ef8b3e;
      color: #fff;
      padding: 10rpx;
      border-bottom-right-radius: 24rpx;
      border-bottom-left-radius: 24rpx;
    }
    .unInfo {
      font-size: 20rpx;
      text-align: center;
      width: 92%;
      padding: 10rpx;
      border-bottom-right-radius: 24rpx;
      border-bottom-left-radius: 24rpx;
      background-color: #f1f1f1;
      color: #8d8d8d;
    }
    .triangle {
      position: absolute;
      bottom: -22rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 20rpx solid transparent;
      border-right: 20rpx solid transparent;
      border-top: 23rpx solid #ef8b3e;
    }
  }

  .terms {
    margin-top: 35rpx;
    margin-left: 60rpx;
    color: #9e9e9e;
    font-size: 12px;
    display: flex;
    align-items: center;
    .termsLink {
      color: #2577e0;
    }
  }

  .paymethod {
    padding: 30rpx;
    background-color: #fff;
    margin-bottom: 14rpx;
    .title {
      font-weight: 700;
      margin-bottom: 20rpx;
    }
  }

  .footer {
    background-color: #fff;
    padding: 30rpx;
    padding-bottom: 340rpx;
    .infoTitle {
      font-weight: 700;
      margin-bottom: 30rpx;
    }
    .rightsInfo {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
	  height: 600rpx;
      .title {
        font-size: 30rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        position: absolute;
        top: 10rpx;
        left: auto;
        right: auto;
      }
      .info {
        width: 564rpx;
        height: 306rpx;
        opacity: 1;
        border-radius: 60rpx;
        background: rgba(255, 255, 255, 1);
        font-size: 30rpx;
        font-weight: 400;
        padding: 40rpx 30rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-content: center;
        line-height: 2.5rem;
        .highLight {
          display: inline;
          white-space: nowrap;
          color: rgba(42, 130, 228, 1);
        }
      }
    }
    .btn {
      width: 322rpx;
      height: 116rpx;
      opacity: 1;
      border-radius: 100rpx;
      background: rgba(245, 210, 95, 1);
      margin-top: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .bgBox {
    background-color: #a7c1e9;
    position: relative;
    .navBar {
      display: flex;
      align-items: center;
      .navText {
        font-size: 38rpx;
        color: #000;
      }
      .navIcon {
        z-index: 10;
        margin-right: 16rpx;
      }
    }
  }
  .rulesShow {
    background-color: #fff;
    margin: 204rpx 60rpx;
    border-radius: 10px;
    background: rgba(255, 255, 255, 1);

    .rule {
      padding: 40rpx 34rpx;
      text-align: center;

      .iconfont {
        float: right;
        margin-bottom: 4rpx;
      }

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

  .couponBox {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 200rpx;
    background-color: #fff;
    box-shadow: 1px -2px 10px #ccc;
    padding: 20rpx;
    /* 优惠券部分 */
    .coupon-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      padding-right: 60rpx;
    }

    .left-section {
      display: flex;
      align-items: center;
      height: 50rpx;
      .select-coupon {
        display: flex;
        align-items: center;
        text {
          margin-right: 8rpx;
        }
      }
    }

    .coupon-label {
      color: #fff;
      background-color: #ff5722;
      padding: 2rpx 4rpx;
      border-radius: 10rpx;
      font-size: 20rpx;
      margin-right: 10rpx;
    }

    .no-coupon {
      color: #989898;
      font-size: 24rpx;
    }

    .right-section {
      display: flex;
      align-items: center;
      color: #999999;
    }

    .select-other {
      margin-right: 5rpx;
      font-size: 24rpx;
    }

    /* 价格和按钮部分 */
    .price-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 120rpx;
      padding-right: 60rpx;
    }

    .price-info {
      display: flex;
      align-items: baseline;
    }

    .price-info text {
      font-size: 26rpx;
    }

    .price {
      color: #ff5722;
      font-size: 24px !important;
      margin: 0 5rpx;
      font-weight: 700;
    }

    .discount {
      color: #ff5722;
      font-size: 24rpx;
    }

    .buy-btn {
      display: flex;
      align-items: center;
    }
  }
}
</style>
