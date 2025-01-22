<template>
  <view class="content" style="background-color: #e7ecf6">
    <scroll-view scroll-y="true" style="height: 100vh">
      <view class="container" style="height: 100%; padding-bottom: 100rpx">
        <view class="my">
          <view class="topBg">
            <view class="titleText">个人中心</view>
            <image
              class="bgImg"
              src="https://cdn.law.xiaomugua.cn/minip/homeBg.png"
            ></image>
          </view>
          <view class="userinfo" @tap="handleLogin">
            <view class="avatarImg">
              <image
                style="width: 100%; height: 100%"
                src="https://cdn.law.xiaomugua.cn/minip/avatarImg.png"
              ></image>
            </view>
            <view class="info" v-if="userId">
              <view style="display: flex">
                <view>
                  <view class="nameBox">
                    <view class="nickname">
                      {{ nickName || "用户名" }}
                    </view>
                    <image
                      style="margin-left: 10rpx; width: 30rpx; height: 24rpx"
                      src="https://cdn.law.xiaomugua.cn/minip/vip.png"
                      v-if="userId && userIsUsingRights"
                    ></image>
                  </view>
                  <view class="rights">
                    <view v-if="!userIsUsingRights">暂无权益</view>
                    <view v-else>
                      <view style="font-size: 24rpx; font-weight: 400"
                        >您的会员于{{ dateToYear(expirationTime) }}到期</view
                      >
                    </view>
                  </view>
                </view>
              </view>

              <image
                style="width: 60rpx; height: 60rpx"
                src="https://cdn.law.xiaomugua.cn/minip/QRCode.png"
                v-if="userId"
                @tap.stop="handleQRCode"
              ></image>
            </view>
            <view class="login" v-else>
              <view class="notBox">
                <view class="not">未登录</view>
                <view class="rights" style="font-size: 24rpx; font-weight: 400"
                  >登录合同宝, 体验更多功能</view
                >
              </view>
              <view class="gologin">立即登录</view>
            </view>
          </view>

          <view class="rightsCount">
            <view class="countCard">
              <view class="count">{{ contractReviewCount }}</view>
              <view class="countName">合同审查</view>
            </view>
            <view class="countCard">
              <view class="count">{{ bodyReviewCount }}</view>
              <view class="countName">主体审查</view>
            </view>
            <view class="countCard">
              <view class="count">{{ templateViewCount }}</view>
              <view class="countName">查看合同模版</view>
            </view>
            <view class="countCard" @click="handleCountRights">
              <view
                class="count"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #4d6ef1;
                "
              >
                <text style="font-style: italic; font-weight: 700">3</text>
                <view
                  style="
                    font-size: 20rpx;
                    font-weight: 400;
                    color: #4d6ef1;
                    padding-top: 8rpx;
                    margin-left: 10rpx;
                  "
                  >项 ></view
                >
              </view>
              <view class="countName" style="color: #4d6ef1">全部权益</view>
            </view>
          </view>

          <view class="rightsInfoBox">
            <image
              style="width: 100%; height: 100%"
              src="https://cdn.law.xiaomugua.cn/minip/vipBar.png"
            ></image>
            <view class="buy-btn">
              <!-- <u-button style="width: 100rpx; border-radius: 15rpx; background-color: #feca82; color: #9f743f">立即开通</u-button> -->
              <button @tap="handleToBuy" hover-class="none" class="buyBtn">
                <view style="display: flex; align-items: center">
                  <view style="margin-right: 10rpx">立即开通</view>
                </view>
              </button>
            </view>
          </view>

          <view class="tool">
            <view class="currency" @tap="handleIntegral">
              <image
                style="width: 32rpx; height: 28rpx"
                src="https://cdn.law.xiaomugua.cn/minip/integralIcon.png"
              ></image>
              <text class="serve">积分</text>
              <text class="num">
                {{ integral > -1 ? integral : "0" }}
              </text>
            </view>
            <view style="height: 40rpx; border-left: 1px solid #ccc"></view>
            <view class="currency" @tap="handleCoupon">
              <image
                style="width: 36rpx; height: 28rpx"
                src="https://cdn.law.xiaomugua.cn/minip/coupon.png"
              ></image>
              <text class="serve">优惠券</text>
              <text class="num">
                {{ couponsList.length }}
              </text>
            </view>
          </view>
          <view class="points-box" @tap="handleIntegral">
            <view class="points-text">
              <view class="points-title">领取积分</view>
              <view class="points-content">
                <view>今日有待领取积分</view>
                <view
                  style="
                    color: #fff;
                    background-color: #4463ef;
                    border-radius: 30rpx;
                    width: 120rpx;
                    text-align: center;
                    font-size: 24rpx;
                    padding: 10rpx 0;
                    margin-left: 10rpx;
                  "
                >
                  去领取
                </view>
              </view>
            </view>
            <view class="points-img">
              <image
                style="width: 260rpx; height: 150rpx"
                src="https://cdn.law.xiaomugua.cn/minip/points.png"
              ></image>
            </view>
          </view>
          <view class="functionBar">
            <view style="font-size: 36rpx; margin-bottom: 50rpx">我的工具</view>
            <view class="serviceBox">
              <view class="service" @tap="handleTemplateCollection">
                <image
                  src="https://cdn.law.xiaomugua.cn/minip/templatePng.png"
                  mode=""
                ></image>
                <view class="text">合同模板</view>
              </view>
              <view class="service" @tap="handleHistory">
                <image
                  src="https://cdn.law.xiaomugua.cn/minip/historyIcon.png"
                  mode=""
                ></image>
                <view class="text">历史记录</view>
              </view>
              <template v-for="(item, index) in path" :key="index">
                <view class="service">
                  <Feedback :path="item"></Feedback>
                </view>
              </template>
              <view class="service" @tap="handleContact" v-if="userId">
                <image
                  src="https://cdn.law.xiaomugua.cn/minip/customer.png"
                  mode=""
                ></image>
                <text class="text">联系客服</text>
              </view>
              <view class="service" @tap="handleoutLogin" v-if="userId">
                <image
                  src="https://cdn.law.xiaomugua.cn/minip/loginoutIcon.png"
                ></image>
                <text class="text">退出登录</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { onLoad, onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import {
  shareToUse,
  fixedSignIn,
  getUserById,
  getRightListApi,
} from "@/api/user.js";
import {
  getUserIsUsingRights,
  getUserCouponsApi,
  getContractCount,
} from "@/api/template.js";
import { getUserCouponsToPhone } from "@/api/operation.js";
import { useUserStore } from "@/store/index.js";
import { dateToYear } from "@/utils/formDate.js";
import { toast } from "../../uni_modules/uview-plus";
import { useAlbumStore } from "@/store/index.js";
const AlbumStore = useAlbumStore();
const userId = ref("");
const userInfo = ref({});
const userName = ref("");
const userPhoneNumber = ref("");
const feedBackWhether = ref(false);
// 木瓜豆
const papayaBeans = ref(0);
const whether = ref(false);
// 木瓜积分
const integral = ref(0);
const shareToUser = ref(0);
const bodyReviewCount = ref(0);
const templateViewCount = ref(0);
const contractReviewCount = ref(0);
const nickName = ref("");
const shares = ref(false);
const userIsUsingRights = ref(false);
const expirationTime = ref("");
const couponsList = ref([]);
const rightsList = ref([]);
const userStore = useUserStore();
const isIos = ref(userStore.system === "ios");
// const isIos = ref(true);
const path = ref([
  {
    path: "myOrder",
    title: "我的订单",
    pictrue: "https://cdn.law.xiaomugua.cn/minip/myOrder.png",
  },
  {
    path: "feedback",
    title: "意见反馈",
    pictrue: "https://cdn.law.xiaomugua.cn/minip/feedbackIcon.png",
  },
  {
    path: "invoiceManagement",
    title: "发票管理",
    pictrue: "https://cdn.law.xiaomugua.cn/minip/bill.png",
  },
  {
    path: "teenMode",
    title: "青少年模式",
    pictrue: "https://cdn.law.xiaomugua.cn/minip/teenager.png",
  },
]);

const handleCoupon = () => {
  if (userId.value) {
    uni.navigateTo({
      url: "/subpackage/coupon/coupon",
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};

const handleIntegral = () => {
  if (userId.value) {
    uni.navigateTo({
      url: "/subpackage/register/register",
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};

const handleScanCode = () => {
  uni.scanCode({
    onlyFromCamera: true, // 限制只允许从相机扫码
    success: function (res) {
      const result = res.result; // 扫描得到的二维码内容
      console.log("扫码结果:", result);
      // 发起请求，将扫码结果发送到后端
      // loginPC(result);
    },
    fail: function (err) {
      console.error("扫码失败", err);
    },
  });
};

const handleShare = () => {
  if (userId.value) {
    uni.showShareMenu({
      withShareTicket: true,
      success: async (res) => {
        console.log(res);
        if (res.errMsg === "showShareMenu:ok") {
          console.log("分享成功");
          await shareToUse(userId.value)
            .then((res) => {
              console.log(res, "shareToUse");
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              console.log(111);
            });
        }
      },
      fail: (err) => {
        console.log(err, "分享err");
      },
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};
onShareAppMessage((res) => {
  return {
    path: "/pages/index/index",
    title: "木瓜合同宝",
    imageUrl: "https://cdn.law.xiaomugua.cn/minip/mugua-ai.png",
    success(res) {
      console.log(res);
    },
    fail(err) {
      console.log(err);
    },
  };
});
const handleaFeedback = () => {
  if (feedBackWhether.value) return;
  if (userId.value) {
    uni.navigateTo({
      url: "/subpackage/feedback/feedback",
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};
const handleContact = () => {
  console.log("handleContact");
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
const handleNavge = (e) => {
  console.log(e);
  if (userId.value) {
    uni.navigateTo({
      url: `/subpackage/${e}/${e}`,
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};

const handleRegister = async () => {
  if (userId.value) {
    if (whether.value) return;
    uni.navigateTo({
      url: "/subpackage/register/register",
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};

const handleRule = () => {
  if (userId.value) {
    return;
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};
const handleLogin = () => {
  if (!userId.value) {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  } else {
    uni.navigateTo({
      url: "/subpackage/user/user",
    });
  }
};

const clearData = () => {
  uni.removeStorageSync("userId");
  uni.removeStorageSync("userInfo");
  uni.removeStorageSync("wxInfo");
  uni.removeStorageSync("wxuserId");
  uni.removeStorageSync("wxcookies");
  uni.removeStorageSync("cookies");
  uni.removeStorageSync("replace");
  AlbumStore.clearAlbum();
  // 重置所有状态变量
  userId.value = "";
  userInfo.value = {};
  userName.value = "";
  userPhoneNumber.value = "";
  feedBackWhether.value = false;
  papayaBeans.value = 0;
  whether.value = false;
  integral.value = 0;
  shareToUser.value = 0;
  bodyReviewCount.value = 0;
  templateViewCount.value = 0;
  contractReviewCount.value = 0;
  nickName.value = "";
  shares.value = false;
  userIsUsingRights.value = false;
  expirationTime.value = "";
  couponsList.value = [];
  userStore.setUserInfo({});
};

const handleoutLogin = () => {
  uni.showModal({
    content: "是否确认退出登录？",
    success: (res) => {
      if (res.confirm) {
        clearData();
        uni.navigateTo({
          url: "/pages/login/login",
        });
      }
    },
    fail: (err) => {
      console.log(err);
    },
  });
};

onShow(async () => {
  userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  userInfo.value =
    uni.getStorageSync("userInfo") || uni.getStorageSync("wxInfo");

  const RightsRes = await getRightListApi(null);
  if (RightsRes.code === 200) {
    rightsList.value = RightsRes.data;
  }

  // 获取
  if (userId.value) {
    try {
      await getUserById(userId.value)
        .then((res) => {
          console.log(res, "getUserById");
          if (res.code === 200) {
            userName.value = res.data.userName;
            nickName.value = res.data.nickName;
            userPhoneNumber.value = res.data.userPhoneNumber;
            papayaBeans.value = res.data.papayaBeans;
            integral.value = res.data.integral;
            whether.value = res.data.whether;
            feedBackWhether.value = res.data.feedBackWhether;
            shareToUser.value = res.data.shareToUser;
            userStore.setUserInfo(res.data);
            if (res.data.shareToUser == 3) {
              shares.value = true;
            }
          } else {
            uni.showToast({
              title: res.message,
              icon: "error",
            });
          }
        })
        .catch((err) => {
          console.log(395, err);
          if (err.code === 202) {
            clearData();
          }
        });
    } catch (err) {
      console.error("getPapayaBeansByUserId error:", err);
    }
    await getUserIsUsingRights(userId.value)
      .then((res) => {
        if (res.code === 200) {
          userIsUsingRights.value = true;
          expirationTime.value = res.data.expirationTime;
        } else {
          userIsUsingRights.value = false;
        }
      })
      .catch((err) => {
        console.log(err);
        userIsUsingRights.value = false;
      });

    await getContractCount(userId.value)
      .then((res) => {
        if (res.code === 200) {
          console.log("test", res.data);
          bodyReviewCount.value = res.data.combination.bodyReviewCount;
          templateViewCount.value = res.data.combination.templateViewCount;
          contractReviewCount.value =
            res.data.combination.freeCount + res.data.combination.cardCount;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await getUserCouponsToPhone()
      .then((res) => {
        console.log(res);
        if (res.code === 200 && res.data && res.data.unused) {
          couponsList.value = res.data.unused;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

const { query } = uni.getLaunchOptionsSync();
console.log("query", query);

const handleQRCode = () => {
  uni.navigateTo({
    url: `/subpackage/mySunCode/mySunCode?nickName=${nickName.value}&userPhoneNumber=${userPhoneNumber.value}`,
  });
};

const handleToBuy = () => {
  if (userId.value) {
    if (!userInfo.value.isTeenager) {
      uni.navigateTo({
        url: "/subpackage/buyVip/buyVip",
      });
    } else {
      toast("青少年模式下无法购买");
    }
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};

const handleCountRights = () => {
  if (userId.value) {
    uni.navigateTo({
      url: "/subpackage/allRights/allRights",
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};

const handleTemplateCollection = () => {
  if (userId.value) {
    uni.navigateTo({
      url: "/subpackage/collect/collect",
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};

const handleHistory = () => {
  if (userId.value) {
    uni.navigateTo({
      url: "/pages/record/record",
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};
</script>

<style lang="scss">
.planning {
  margin: 20rpx 40rpx;
  padding: 40rpx;
  background: #ffffffff;
  box-shadow: 0px 4px 8px #eee;
  border-radius: 8px;

  .planning-title {
    font-size: 40rpx;
    font-weight: 700;
  }

  .planning-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 34rpx 0;

    .box-left {
      display: flex;
      width: 360rpx;
      .img {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 80rpx;
        height: 80rpx;
        border-radius: 20rpx;
        background: rgba(153, 153, 153, 0.08);
        margin-right: 40rpx;

        image {
          width: 40rpx;
          height: 36rpx;
        }
      }

      .planning-name {
        text {
          display: block;
        }

        .title {
          swidth: 260rpx;
          font-size: 28rpx;
          font-weight: 400;
        }

        .tips {
          padding-top: 6rpx;
          font-size: 24rpx;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }

  .btn {
    transform: translateX(58rpx);
    border-radius: 20px;
    width: 136rpx;
    height: 48rpx;
    line-height: 48rpx;
    color: #fff;
    text-align: center;
    font-size: 24rpx;

    &.unchecked {
      background: linear-gradient(106.65deg, #4683ffff 0%, #1864feff 100%);
    }

    &.active {
      &::after {
        border: none;
      }

      background-color: #eee;
      border: none !important;
    }
  }
}

.functionBar {
  background-color: #fff;
  border-radius: 30rpx;
  margin: 0 30rpx;
  padding: 40rpx;
}

.serviceBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* 允许换行 */
  justify-content: start; /* 均匀分布元素 */
  gap: 10px; /* 元素之间的间距 */
  .service {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: calc(25% - 10px);
    margin-bottom: 20rpx;
    .service-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    &::after {
      border: none;
    }

    border: none !important;

    image {
      width: 40rpx;
      height: 40rpx;
      vertical-align: middle;
    }

    .text {
      font-size: 24rpx;
      color: rgba(0, 0, 0, 1);
      margin-top: 15rpx;
    }

    .iconfont {
      display: inline-block;
      font-size: 26rpx;
    }
  }
}

.my {
  height: 100%;
  width: 100%;
  .points-box {
    background-color: #fff;
    border-radius: 30rpx;
    margin: 20rpx 30rpx;
    padding: 40rpx;
    display: flex;
    align-items: center;
    .points-text {
      flex: 1;
      .points-title {
        font-size: 36rpx;
        margin-bottom: 20rpx;
      }
      .points-content {
        display: flex;
        align-items: center;
        color: #848484;
      }
    }
  }
  .topBg {
    height: 400rpx;
    width: 100%;
    padding-top: 110rpx;
    position: absolute;
    .titleText {
      padding-left: 5vw;
      position: relative;
      z-index: 1;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 47rpx;
      color: #111111;
    }
    .bgImg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .userinfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 30rpx;
    position: relative;
    padding-top: 15vh;
    z-index: 2;

    .avatarImg {
      width: 140rpx;
      height: 112rpx;
      margin-right: 24rpx;
    }

    .login {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 40rpx 30rpx 0;
      // color: #ffffff;

      .notBox {
        .not {
          font-weight: 700;
          font-size: 40rpx;
        }
        .rights {
          font-size: 28rpx;
          color: #6a6f75;
          margin-top: 15rpx;
        }
      }

      .gologin {
        width: 150rpx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        border-radius: 40rpx;
        padding: 10rpx;
        font-size: 28rpx;
        background-color: #0571ff;
        color: #fff;
      }
    }

    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30rpx;
      width: 100%;
      font-weight: 700;
      vertical-align: middle;
      margin-right: 30rpx;

      image {
        padding: 8rpx;
        width: 40rpx;
        height: 40rpx;
      }

      .nameBox {
        display: flex;
        align-items: center;
      }

      .nickname {
        max-width: 300rpx;
        white-space: nowrap;
        /* 保证文本不会换行 */
        overflow: hidden;
        /* 超出容器部分隐藏 */
        text-overflow: ellipsis;
        font-size: 40rpx;
      }

      .rights {
        font-size: 28rpx;
        color: #6a6f75;
        margin-top: 15rpx;
      }
    }
  }

  .tool {
    display: flex;
    margin-top: 20rpx;
    justify-content: space-evenly;
    align-items: center;
    background-color: #fff;
    border-radius: 20rpx;
    // box-shadow: 1px 1px 1px #ccc;
    margin: 0 30rpx;
    padding: 20rpx 0;
    .currency {
      text-align: center;
      display: flex;
      align-items: center;
      .serve {
        display: block;
        font-size: 28rpx;
        margin: 0 10rpx;
      }

      .num {
        font-size: 36rpx;
      }
    }
  }
}

.rightsInfoBox {
  border-radius: 15rpx;
  margin: 30rpx 30rpx;
  height: 200rpx;
  position: relative;
  .buy-btn {
    position: absolute;
    top: 40rpx;
    right: 40rpx;
    .buyBtn {
      background-color: #feca81;
      color: #9f743f;
      border-radius: 30rpx;
      font-size: 28rpx;
      font-weight: 600;
      z-index: 1;
    }
  }
}

.rightsCount {
  display: flex;
  justify-content: space-around;
  margin-top: 30rpx;
  position: relative;
  z-index: 2;
  .countCard {
    padding: 20rpx 30rpx;
    text-align: center;
    .count {
      font-size: 32rpx;
      font-weight: 700;
    }
    .countName {
      margin-top: 5rpx;
      font-size: 24rpx;
      color: #555555;
    }
  }
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 12px;
}

.title {
  font-weight: bold;
  font-size: 16px;
}

.more {
  font-size: 14px;
  color: #999;
}

.card-list {
  display: flex;
  overflow-x: auto;
  padding: 12px 0;
}

.card {
  position: relative;
  width: 240px;
  margin-right: 12px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  width: 200px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.card-desc {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.card-price {
  margin-top: 8px;
}

.discount-price {
  font-size: 18px;
  color: #ff4d4f;
  font-weight: bold;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.card-label {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #ff4d4f;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.swipe-tip {
  font-size: 12px;
  color: red;
  margin-top: 8px;
}

.preferential {
  padding: 40rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .priture {
    .priture-box {
      width: 112rpx;
      height: 112rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: #308bf219;

      image {
        width: 64rpx;
        height: 64rpx;
      }
    }

    .text {
      padding-top: 16rpx;
      text-align: center;
      font-size: 24rpx;
      font-weight: 500;
    }
  }
}
</style>
