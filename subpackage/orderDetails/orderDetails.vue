<template>
  <view class="container">
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
      <view>订单详情</view>
    </view>

    <view class="head">
      <view class="left" @tap="reload">
        <text class="amount">商品总价：{{ orderDetails.totalAmount }}</text>
        <text class="name">
          {{ orderDetails.rightsName || orderDetails.couponName }}
        </text>
        <text class="time">{{
          dateToChineseDate(orderDetails.createTime)
        }}</text>
        <!-- <text>该订单{{ orderDetails.statusName }}</text> -->
      </view>
      <view style="margin-top: 20rpx"></view>
      <view class="right">
        <text class="amount"
          ><text style="font-size: 35rpx">¥</text
          >{{ orderDetails.finalAmount }}</text
        >
        <view
          :loading="confirmLoading"
          @tap="continueCreatePhoneWebOrder"
          v-if="orderDetails.status == 0"
          class="btn"
        >
          待支付
          <u-count-down
            :time="countdown(orderDetails.createTime)"
            format="mm:ss"
            v-if="orderDetails.status == 0"
            @finish="reload()"
          ></u-count-down>
        </view>
        <view v-else-if="orderDetails.status == 1">
          <image
            src="https://cdn.law.xiaomugua.cn/minip/paid_status_icon.png"
            class="statu-icon"
          ></image>
        </view>
      </view>
    </view>

    <view class="main">
      <view class="title">订单详情</view>
      <!-- <view class="item">
        <text class="left">商品总价</text>
        <text class="right">{{ orderDetails.totalAmount }}</text>
      </view> -->
      <view class="item">
        <text class="left">优惠信息</text>
        <text class="right">{{
          orderDetails.couponName ? orderDetails.couponName : "无优惠"
        }}</text>
      </view>
      <view class="item">
        <text class="left">实付金额</text>
        <text class="right">{{ orderDetails.finalAmount }}</text>
      </view>
      <view class="item">
        <text class="left">支付方式</text>
        <text class="right">{{ orderDetails.paymentMethod }}</text>
      </view>
      <view class="item">
        <text class="left">订单编号</text>
        <text class="right">{{ orderDetails.orderId }}</text>
        <text class="copy" @tap="copy(orderDetails.orderId)"
          ><text class="vertical-line"></text>复制</text
        >
      </view>
      <view class="item">
        <text class="left">下单时间</text>
        <text class="right">{{
          dateToChineseDate(orderDetails.createTime)
        }}</text>
      </view>
      <view class="item">
        <text class="left">付款时间</text>
        <text class="right">{{
          orderDetails.status != 0 && orderDetails.status != 2
            ? dateToChineseDate(orderDetails.updateTime)
            : "/"
        }}</text>
      </view>
      <view
        v-if="
          orderDetails.status == 3 ||
          orderDetails.status == 4 ||
          orderDetails.status == 5
        "
      >
        <view class="item">
          <text class="left">申请退款时间</text>
          <text class="right">{{
            dateToChineseDate(orderDetails.updateTime)
          }}</text>
        </view>
        <view v-if="orderDetails.status == 4">
          <view class="item">
            <text class="left">退款时间</text>
            <text class="right">{{
              dateToChineseDate(orderDetails.updateTime)
            }}</text>
          </view>
          <view class="item">
            <text class="left">退款方式</text>
            <text class="right">原路返还</text>
          </view>
        </view>
      </view>
    </view>
    <view class="notice">
      <view
        @tap="notice"
        style="display: flex; align-items: center; margin-right: 35rpx"
      >
        <image src="https://cdn.law.xiaomugua.cn/minip/notice.png"></image>
        退款须知
      </view>
      <view @tap="invoicing" style="display: flex; align-items: center">
        <image src="https://cdn.law.xiaomugua.cn/minip/notice.png"></image>
        开票须知
      </view>
    </view>
    <view class="foot">
      <view
        @tap="toApplyInvoicing"
        class="btn"
        v-if="orderDetails.status == 1 || orderDetails.status == 5"
      >
        <image
          class="icon"
          src="https://cdn.law.xiaomugua.cn/minip/invoice_icon.png"
        ></image>
        申请开票
      </view>
      <view
        @tap="
          toApplicationDrawback(
            orderDetails.orderId,
            orderDetails.feFinalAmount
          )
        "
        class="btn"
        v-if="orderDetails.status == 1 || orderDetails.status == 5"
      >
        <image
          class="icon"
          src="https://cdn.law.xiaomugua.cn/minip/refund_icon.png"
        ></image>
        申请退款
      </view>
      <view class="btn" @tap="clearOrder" v-if="orderDetails.status == 0">
        <image
          class="icon"
          src="https://cdn.law.xiaomugua.cn/minip/cancel_order_icon.png"
        ></image>
        取消订单
      </view>
      <view open-type="contact" class="btn">
        <button open-type="contact" class="contact">联系客服</button>
        <image
          class="icon"
          src="https://cdn.law.xiaomugua.cn/minip/customer_service_icon.png"
        ></image>
        联系客服
      </view>
      <!-- <text>申请退款的条件：7天内的订单可退，且订单状态为未激活状态</text> -->
    </view>
  </view>

  <uni-popup ref="popup" background-color="none" type="center">
    <!--  :class="{ 'popup-height': type === 'left' || type === 'right' }" -->
    <view class="popup-content">
      <image
        class="background-image"
        src="https://cdn.law.xiaomugua.cn/minip/order_refund_error_tips.png"
        mode="aspectFill"
      ></image>
      <view class="title">{{ popupTitle }}</view>
      <view class="content">
        {{ popupText }}
      </view>
      <view class="contact">
        <image
          src="https://cdn.law.xiaomugua.cn/minip/popup_contact_icon.png"
          class="img"
        ></image>
        <text class="text">联系客服</text>
        <button open-type="contact" class="btn">联系客服</button>
      </view>
      <view class="footer">
        <view class="btn" @tap="closePopup">我知道了</view>
      </view>
    </view>
  </uni-popup>

  <uni-popup ref="noticePopup" background-color="none" type="center">
    <!--  :class="{ 'popup-height': type === 'left' || type === 'right' }" -->
    <view class="popup-content" style="width: 562rpx; height: 566rpx">
      <image
        class="background-image"
        src="https://cdn.law.xiaomugua.cn/minip/notice_popup_bg.png"
        mode="aspectFill"
      ></image>
      <view
        class="title"
        style="margin-top: 32rpx; font-size: 39rpx; color: #262626"
        >{{ popupTitle }}</view
      >
      <view
        class="content"
        style="font-size: 27rpx; color: #444444; line-height: 50rpx"
      >
        {{ popupText }}
      </view>
      <view class="footer">
        <view
          class="btn"
          @tap="noticePopup.close()"
          style="border-radius: 16rpx"
          >我知道了</view
        >
      </view>
    </view>
  </uni-popup>

  <u-modal
    :show="showPayModal"
    confirmText="返回主页"
    cancelText="我知道了"
    showCancelButton
    buttonReverse
    @cancel="() => (showPayModal = false)"
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

  <RefundPopup ref="clearOrderPopup" @confirm="handleClearOrderConfirm">
  </RefundPopup>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { onLoad, onUnload, onShow } from "@dcloudio/uni-app";
import { request } from "../../utils/request";
import { dateToChinese } from "@/utils/formDate.js";
import { timeFormat, toast } from "@/uni_modules/uview-plus";
import { dateToChineseDate } from "@/utils/formDate.js";
import { continueOrder } from "@/api/operation.js";
import { useUserStore } from "../../store";

const orderDetails = ref();
const statusName = ref();
const popupText = ref("");
const popupTitle = ref("");
const radiovalue = ref("weChat-pay");
const showPayModal = ref(false);
const paySuccess = ref(false);
const confirmLoading = ref(false);
const userStore = useUserStore();
const clearOrderPopup = ref();

watch(orderDetails, (newVal) => {
  if (newVal.status == 0) {
    statusName.value = "未支付";
  } else if (newVal.status == 1) {
    statusName.value = "已支付";
  } else if (newVal.status == 2) {
    statusName.value = "已取消";
  } else if (newVal.status == 3) {
    statusName.value = "退款中...";
  } else if (newVal.status == 4) {
    statusName.value = "退款成功";
  } else if (newVal.status == 5) {
    statusName.value = "退款失败";
  }
});
const groupChange = (n) => {
  console.log("groupChange", n);
  console.log(radiovalue.value);
};
const handleGoBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};
// onLoad(async (option)=>{
// 	// orderDetails.value = JSON.parse(decodeURIComponent(option.item));
// 	// console.log(option);
// 	const res = await request('/api2/order/getOrderByOrderId','POST',{
// 		orderId:option.orderId
// 	}).catch(e=>{
// 		console.log(e);
// 	})
// 	if(res.code == 200){
// 		orderDetails.value = res.data;
// 	}
// 	console.log("orderDetails:",orderDetails.value);
// })
onShow(async () => {
  let pagearr = getCurrentPages(); //获取应用页面栈
  let currentPage = pagearr[pagearr.length - 1]; //获取当前页面信息
  console.log("option:", currentPage.options); //获取页面传递的信息
  let option = currentPage.options;
  console.log(option, "option");
  if (option.orderId) {
    getOrderByOrderId(option.orderId);
  }
});

const handlePayConfirm = () => {
  uni.switchTab({
    url: `/pages/index/index`,
  });
};

const getOrderByOrderId = async (orderId) => {
  await request("/api2/order/getOrderByOrderId", "POST", {
    orderId: orderId,
  })
    .then((res) => {
      if (res.code == 200) {
        orderDetails.value = res.data;

        // orderDetails.value.status = 1
      }
    })
    .catch((e) => {
      console.log(e);
    });

  console.log("orderDetails:", orderDetails.value);
};

// 申请退款
const toApplicationDrawback = (orderId, feFinalAmount) => {
  request("/api2/order/checkRefundOrder", "POST", {
    userId: uni.getStorageSync("userId") || uni.getStorageSync("wxuserId"),
    orderId: orderId,
  })
    .then((res) => {
      if (res.code == 19007 || res.code == 19006) {
        popupTitle.value = "提示";
        popupText.value = `抱歉，您的订单不符合退款条件（${res.message}），无法申请退款。如有疑问，请联系客服。`;
        popup.value.open();
      } else {
        uni.navigateTo({
          url: `/subpackage/applicationDrawback/applicationDrawback?orderId=${orderId}&feFinalAmount=${feFinalAmount}`,
        });
      }
    })
    .catch((e) => {
      if (e.code == 19007 || e.code == 19006) {
        popupTitle.value = "提示";
        popupText.value = `抱歉，您的订单不符合退款条件（${e.message}），无法申请退款。如有疑问，请联系客服。`;
        popup.value.open();
      } else {
        toast(e.message);
      }
    });
};

const toApplyInvoicing = () => {
  uni.navigateTo({
    url: `/subpackage/applyInvoicing/applyInvoicing?orderId=${orderDetails.value.orderId}&finalAmount=${orderDetails.value.finalAmount}`,
  });
};

//关闭订单
const clearOrder = () => {
  clearOrderPopup.value.show();
};

const handleClearOrderConfirm = () => {
  console.log("用户点击确定");
  request("/api2/alipay/clearOrder", "POST", {
    orderId: orderDetails.value.orderId,
  })
    .then((res) => {
      if (res.code == 200) {
        uni.showToast({
          title: "订单已取消",
          icon: "none",
          mask: true,
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    })
    .catch((e) => {
      if ((e.code = 40004)) {
        uni.showToast({
          title: "订单已取消",
          icon: "none",
          mask: true,
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
      console.log(e);
    });
};

//继续支付
const continueCreatePhoneWebOrder = async () => {
  try {
    const res = await continueOrder(orderDetails.value.orderId);
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

//复制
const copy = (text) => {
  uni.setClipboardData({
    data: text,
    success: function () {
      uni.showToast({
        title: "复制成功",
        icon: "none",
      });
    },
  });
};

const countdown = (time) => {
  const now = new Date();
  let _time = new Date(time);
  const diff = _time.getTime() + 35 * 60 * 1000 - now.getTime();
  return diff;
};

const popup = ref();
const noticePopup = ref();
const notice = () => {
  popupTitle.value = "退款须知";
  popupText.value =
    "您的订单在完成支付后7日内可申请退款，若7日内您已使用购买的权益或超过7日后申请，则不符合退款条件。";
  noticePopup.value.open();
};
const invoicing = () => {
  popupTitle.value = "开票说明";
  popupText.value = "订单完成后第七个工作日后才可申请开票";
  noticePopup.value.open();
};
const closePopup = () => {
  popup.value.close();
};
const reloadFlag = ref(true);
const reload = () => {
  if (reloadFlag.value) {
    getOrderByOrderId(orderDetails.value.orderId);
    reloadFlag.value = false;
  }
};
</script>

<style lang="scss">
.topTitle {
  display: flex;
  align-items: center;
  font-size: 18px;
  padding: 110rpx 0 20rpx 30rpx;
}
.container {
  display: flex;
  flex-direction: column;
  background: #f6f6f6;
  height: 100vh;
  padding: 0 28rpx 42rpx 28rpx;
  .head {
    display: flex;
    flex-direction: row;
    opacity: 1;
    height: 200rpx;
    margin-top: 75rpx;
    margin-bottom: 60rpx;
    padding: 0 25rpx;
    .left {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .amount {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 23rpx;
        color: #777777;
      }
      .name {
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 31rpx;
        color: #101010;
      }
      .time {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 23rpx;
        color: #767676;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      flex: 1;
      .amount {
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 57rpx;
        color: #101010;
        margin-right: 15rpx;
        margin-top: 5rpx;
        margin-bottom: 25rpx;
      }
      .btn {
        height: 61rpx;
        min-width: 212rpx;
        background: #4d6ef1;
        border-radius: 30rpx;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 23rpx;
        color: #ffffff;
        white-space: nowrap;
        margin: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .u-count-down__text {
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 23rpx;
          color: #ffffff;
          line-height: 0;
        }
      }
      .statu-icon {
        width: 165rpx;
        height: 165rpx;
        transform: translateY(-90rpx) translateX(-20rpx);
      }
    }
  }
  .main {
    padding: 30rpx 50rpx;
    opacity: 1;
    border-radius: 8rpx;
    background: rgba(255, 255, 255, 1);
    .title {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 28rpx;
      color: #121212;
    }
    .item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 70rpx;
      flex-wrap: wrap;
      .left {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 24rpx;
        color: #181818;
        flex: 1;
        text-align: left;
        white-space: nowrap;
      }
      .copy {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 23rpx;
        color: #0d0d0d;
        .vertical-line {
          height: 25rpx; /* 线的高度 */
          border-left: 1px solid #e9e9e9; /* 左边框作为竖线 */
          margin: 0 14rpx; /* 可选：居中 */
        }
      }
      .right {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 23rpx;
        color: #929292;
        text-align: right;
        white-space: nowrap;
        margin-left: auto;
      }
    }
  }
  .foot {
    display: flex;
    // justify-content: center;
    align-items: center;
    margin-top: 32rpx;
    flex-direction: row;
    width: 695rpx;
    height: 107rpx;
    background: #ffffff;
    border-radius: 22rpx;
    justify-content: space-around;
    // padding: 0 50rpx;
    .btn {
      // width: 184rpx;
	  flex: 1;
      height: 68rpx;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      font-size: 27rpx;
      color: #0c0c0e;
      // margin-left: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      white-space: nowrap;
      position: relative;
      .icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 12rpx;
      }
      .contact {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
}

.notice {
  font-size: 28rpx;
  font-weight: 400;
  letter-spacing: 0rpx;
  color: rgba(148, 148, 148, 1);
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20rpx;
  margin-right: 42rpx;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 20rpx;
  color: #bbbbbb;
  image {
    margin-right: 10rpx;
    width: 22rpx;
    height: 22rpx;
  }
}

.popup-content {
  width: 560rpx;
  height: 772rpx;
  opacity: 1;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50rpx 40rpx;
  box-sizing: border-box;
  overflow: hidden;

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  :not(.background-image) {
    z-index: 2;
  }
  .title {
    font-family: MicrosoftYaHei;
    font-weight: bold;
    font-size: 33rpx;
    color: #343434;
    margin-top: 235rpx;
  }
  .content {
    justify-self: center;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    font-size: 28rpx;
    color: #2d2d2d;
    line-height: 35rpx;
  }
  .footer {
    .btn {
      width: 496rpx;
      height: 90rpx;
      background: #4d6ef1;
      border-radius: 8rpx;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }
  .contact {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: fit-content;
    margin-bottom: 46rpx;
    .img {
      width: 105rpx;
      height: 55rpx;
      margin-right: 10rpx;
    }
    .text {
      font-family: MicrosoftYaHei;
      font-weight: 400;
      font-size: 27rpx;
      color: #4c89fb;
    }
    .btn {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}
</style>
