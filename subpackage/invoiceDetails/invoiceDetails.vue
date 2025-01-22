<template>
  <view class="container">
	  <TopTitle title="发票详情页"></TopTitle>
    <view class="head">
      <view class="title" @tap="reload">
        <text>发票开具{{ invoiceDetails.invoiceStatusName }}</text>
        <button
          :loading="confirmLoading"
          @tap="downloadInvoice"
          v-if="invoiceDetails.invoiceStatus == 5"
          class="btn"
        >
          下载发票
          <!-- <u-count-down :time="countdown(invoiceDetails.createDate)" format="mm:ss" v-if="invoiceDetails.invoiceStatus == 5" @finish="reload()"></u-count-down> -->
        </button>
      </view>
      <view class="priceView">
        <view class="row">
          <text class="item-title">
            {{ orderDetails.rightsName || orderDetails.couponName }}
          </text>
          <text class="price"><text style="font-size: 27rpx;">¥</text>{{ orderDetails.finalAmount }}</text>
        </view>
        <view class="row">
          <text class="time">{{
            dateToChineseDate(orderDetails.createTime)
          }}</text>
        </view>
      </view>
    </view>
    <view class="main">
      <view class="title">订单详情</view>
      <view class="item">
        <text class="left">商品总价</text>
        <text class="right">{{ orderDetails.totalAmount }}</text>
      </view>
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
		<text class="copy" @tap="copy(orderDetails.orderId)"><text class="vertical-line"></text>复制</text>
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
    <view class="foot">
      <view open-type="contact" class="btn">
        <button open-type="contact" class="contact">联系客服</button>
        <image
          class="icon"
          src="https://cdn.law.xiaomugua.cn/minip/customer_service_icon.png"
        ></image>
        联系客服
      </view>
    </view>
  </view>

  <uni-popup ref="popup" background-color="#fff" type="center">
    <view class="popup-content">
      <view class="title">{{ popupTitle }}</view>
      <view class="content">
        {{ popupText }}
      </view>
      <view class="footer">
        <view class="btn" @tap="closePopup">我知道了</view>
      </view>
      <view class="contact">
        <image
          src="https://cdn.law.xiaomugua.cn/minip/earphone.png"
          class="img"
        ></image>
        <text class="text">联系客服</text>
        <button open-type="contact" class="btn">联系客服</button>
      </view>
    </view>
  </uni-popup>
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

const orderDetails = ref({});
const invoiceDetails = ref({});
const statusName = ref();
const popupText = ref("");
const popupTitle = ref("");
const radiovalue = ref("weChat-pay");
const showPayModal = ref(false);
const paySuccess = ref(false);
const confirmLoading = ref(false);
const userStore = useUserStore();

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
onShow(async () => {
  // let pagearr = getCurrentPages(); //获取应用页面栈
  // let currentPage = pagearr[pagearr.length - 1]; //获取当前页面信息
  // console.log('option:', currentPage.options); //获取页面传递的信息
  // let invoice = JSON.parse(decodeURIComponent(currentPage.options.invoice));
  // invoiceDetails.value = invoice;
  // orderDetails.value = invoice.order;
});

onLoad((options) => {
  if (options && options.invoice) {
    let invoice = JSON.parse(decodeURIComponent(options.invoice));
    console.log(146, invoice);
    invoiceDetails.value = invoice;
    orderDetails.value = invoice.order;
  }
});

const downloadInvoice = async () => {
  // uni.showModal({
  // 	title: '提示',
  // 	content: '请点击点击右上角按钮保存发票',
  // 	success: async (res) => {
  // 		if (res.confirm) {
  await request("/api2/invoice/downloadInvoicing", "GET", {
    invoiceId: invoiceDetails.value.invoiceId,
  })
    .then((res) => {
      if (res.code === 200 && res.data) {
        const downloadUrl = res.data.invoiceUrl;
        const downloadName = res.data.invoiceName.split("_")[1];
        uni.downloadFile({
          url: downloadUrl,
          success: function (downloadRes) {
            if (downloadRes.statusCode === 200) {
              const tempFilePath = downloadRes.tempFilePath;
              const fs = uni.getFileSystemManager();
              const newFileName = `${downloadName}`;
              const savePath = `${uni.env.USER_DATA_PATH}/${newFileName}`;

              fs.saveFile({
                tempFilePath: tempFilePath,
                filePath: savePath,
                success: function (saveRes) {
                  console.log("文件已保存到", saveRes.savedFilePath);
                  setTimeout(() => {
                    uni.openDocument({
                      filePath: saveRes.savedFilePath,
                      fileType: "pdf",
                      showMenu: true,
                      success: function () {
                        console.log("文档打开成功");
                      },
                      fail: function (err) {
                        console.error("文档打开失败", err);
                        uni.showToast({
                          title: "文档打开失败",
                          icon: "none",
                        });
                      },
                    });
                  }, 800);
                },
                fail: function (err) {
                  uni.showToast({
                    title: "文件保存失败",
                    icon: "none",
                  });
                  console.error("文件保存失败", err);
                },
              });
            } else {
              uni.showToast({
                title: "文件下载失败",
                icon: "none",
              });
              console.error("文件下载失败，状态码:", downloadRes.statusCode);
            }
          },
          fail: function (err) {
            uni.showToast({
              title: "文件下载失败",
              icon: "none",
            });
            console.error("文件下载失败", err);
          },
        });
      } else {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        console.error("获取下载地址失败", res);
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: "none",
      });
      console.error("请求失败", err);
    });
  // 		}
  // 	}
  // });
};

const getOrderByOrderId = async (orderId) => {
  await request("/api2/order/getOrderByOrderId", "POST", {
    orderId: orderId,
  })
    .then((res) => {
      if (res.code == 200) {
        orderDetails.value = res.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });

  console.log("orderDetails:", orderDetails.value);
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

const popup = ref();

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
.container {
  display: flex;
  flex-direction: column;
  background: rgba(249, 250, 254, 1);
  height: 100vh;
  padding: 42rpx 36rpx;
  padding-top: 0;
  .head {
    width: 100%;
    // height: 350rpx;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    // align-items: center;
    opacity: 1;
    border-radius: 8rpx;
    background: rgba(255, 255, 255, 1);
    border-bottom: 2rpx solid rgba(245, 245, 245, 1);
    margin-bottom: 44rpx;
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 50rpx;
      box-sizing: border-box;
      font-size: 32rpx;
      font-weight: 500;
      height: 130rpx;
      border-radius: 8rpx;
      border-bottom: 1px dashed #EEEEEE;

      text {
        flex: 1;
		font-family: Microsoft YaHei;
		font-weight: bold;
		font-size: 29rpx;
		color: #101010;
      }
      .btn {
        width: 163rpx;
        height: 61rpx;
        opacity: 1;
        border-radius: 40rpx;
        background: rgba(42, 130, 228, 1);
        border: 2rpx solid rgba(224, 224, 224, 1);
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 23rpx;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10rpx;
        // margin-left: 30rpx;
        .u-count-down {
          height: 72rpx;
          box-sizing: border-box;
          padding: 0;
          .u-count-down__text {
            color: rgba(255, 255, 255, 1);
            font-size: 24rpx;
            font-weight: 200;
            // height: 48rpx;
            margin: 0;
            line-height: 48rpx;
          }
        }
      }
    }
    .priceView {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 50rpx;
      // align-items: flex-end;
      border-radius: 8rpx;
      height: 130rpx;
	  font-family: Microsoft YaHei;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:first-child {
          margin-bottom: 25rpx;
        }
        .item-title {
          font-weight: 400;
          font-size: 27rpx;
          color: #101010;
        }
        .price {
          font-weight: bold;
          font-size: 45rpx;
          color: #101010;
		  transform: translateY(25rpx);
        }
        .time {
          font-weight: 400;
          font-size: 23rpx;
          color: #777777;
        }
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
	  margin-bottom: 30rpx;
    }
    .item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 70rpx;
      flex-wrap: wrap;
	  padding-left: 2rpx;
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
  justify-content: space-around;
  margin-top: 20rpx;
  image {
    margin-top: 5rpx;
    margin-right: 5rpx;
    width: 28rpx;
    height: 28rpx;
  }
}

.popup-content {
  width: 550rpx;
  height: 614rpx;
  opacity: 1;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50rpx 40rpx;
  box-sizing: border-box;
  .title {
    font-size: 32rpx;
    font-weight: 500;
  }
  .content {
    justify-self: center;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 50rpx;
  }
  .footer {
    .btn {
      width: 238rpx;
      height: 80rpx;
      opacity: 1;
      border-radius: 40rpx;
      background: rgba(42, 130, 228, 1);
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
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    width: fit-content;
    margin-top: 10rpx;
    .img {
      width: 30rpx;
      height: 30rpx;
      margin-right: 10rpx;
    }
    .text {
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(42, 130, 228, 1);
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
