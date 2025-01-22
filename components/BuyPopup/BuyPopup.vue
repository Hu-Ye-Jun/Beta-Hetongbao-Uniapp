<template>
  <view>
    <uni-popup
      ref="popup"
      type="bottom"
      background-color="#fff"
      :safe-area="false"
    >
      <view class="buy-popup">
        <view class="message active" v-if="isVip">
          <image src="https://cdn.law.xiaomugua.cn/minip/VActive.png"></image>
          您的VIP生效中
        </view>
        <view class="message" v-else>
          <image src="https://cdn.law.xiaomugua.cn/minip/V.png"></image>
          您的VIP权益暂未激活
        </view>
        <view class="type">
          <u-tabs
            :list="typeList"
            :scrollable="false"
            lineWidth="37rpx"
			lineColor="#4D6EF1"
            :current="current"
            @click="handleChange"
			activeStyle="
				font-family: MicrosoftYaHei;
				font-weight: bold;
				font-size: 28rpx;
				color: #4D6EF1;
			"
          ></u-tabs>
        </view>
        <view v-if="activeIndex === 0" style="width: 100%">
          <view class="points-header">
            <view class="left">做任务领积分</view>
            <view class="right">
              <text class="points-gap" v-if="userInfo?.integral < 20"
                >还差{{ 20 - userInfo?.integral }}积分</text
              >
              <text class="points">积分剩余{{ userInfo?.integral }}</text>
            </view>
          </view>
          <view class="task-list">
            <view class="task-list-item" v-for="(task, index) in taskList" :key="index">
              <view class="icon">
                <image :src="task.icon"></image>
              </view>
              <view class="content">
                <view class="title">{{ task.title }}</view>
                <view class="subtitle">{{ task.subtitle }}</view>
              </view>
              <view class="btn">
                <view @tap="task.click" :class="{ done: task.isCompleted }">
                  {{ task.isCompleted ? "已完成" : "去完成" }}
                </view>
              </view>
            </view>
          </view>
          <view class="tips">
            <image
              src="https://cdn.law.xiaomugua.cn/minip/points_tips.png"
            ></image>
            <text style="color: #ff7368">温馨提示：单次兑换需要</text>
            20积分
          </view>
          <!-- <u-collapse :border="false">
            <u-collapse-item :border="false">
              <template #title>
                <view
                  :class="{ red: userInfo?.integral < 20 }"
                  v-if="userInfo?.integral !== undefined"
                >
                  {{
                    userInfo?.integral >= 20
                      ? "你的积分剩余" + userInfo?.integral
                      : "您还差" + (20 - userInfo?.integral) + "积分即可解锁"
                  }}
                </view>
              </template>
              <template #value>
                <text class="u-page__item__title__slot-title"
                  >做任务领积分</text
                >
              </template>

              <view>
                <view class="rule">
                  规则领积分 
                  <view class="planning">
                    <view class="planning-box">
                      <view class="box-left">
                        <view class="img">
                          <image
                            src="https://cdn.law.xiaomugua.cn/minip/plan.png"
                            mode=""
                          ></image>
                        </view>
                        <view class="planning-name">
                          <text class="title">每日签到</text>
                          <text class="tips">每日签到获得积分</text>
                        </view>
                      </view>
                      <button
                        class="btn"
                        @tap="handleRegister"
                        hover-class="none"
                        :class="whether ? 'active' : 'unchecked'"
                      >
                        {{ whether ? "已完成" : "去完成" }}
                      </button>
                    </view>
                    <view class="planning-box">
                      <view class="box-left">
                        <view class="img">
                          <image
                            src="https://cdn.law.xiaomugua.cn/minip/avatar.png"
                            mode=""
                          ></image>
                        </view>
                        <view class="planning-name">
                          <text class="title">分享新用户注册登录</text>
                          <text class="tips">成功分享给新用户得积分</text>
                        </view>
                      </view>
                      <button
                        class="btn"
                        @tap="handleShare"
                        :class="'unchecked'"
                      >
                        去完成
                      </button>
                    </view>
                    <view class="planning-box">
                      <view class="box-left">
                        <view class="img">
                          <image
                            src="https://cdn.law.xiaomugua.cn/minip/unread.png"
                            mode=""
                          ></image>
                        </view>

                        <view class="planning-name">
                          <text class="title">反馈建议</text>
                          <text class="tips">每日反馈获得积分10</text>
                        </view>
                      </view>
                      <button
                        class="btn"
                        hover-class="none"
                        :class="feedBackWhether ? 'active' : 'unchecked'"
                        @tap="handleaFeedback"
                      >
                        {{ feedBackWhether ? "已完成" : "去完成" }}
                      </button>
                    </view>
                  </view>
                </view>
              </view>
            </u-collapse-item>
          </u-collapse> -->
          <!-- <view class="select">
            <view class="item" style="width: 610rpx">
              <view class="item-title">单次兑换</view>
              <view class="price">20积分</view>
            </view>
          </view> -->
        </view>
        <view v-if="activeIndex === 1" class="buy-vip">
          <view v-if="!isIos" class="remaining-count">
            您的合同审查剩余次数：
            <text style="color: #ed6555">{{ contractReviewCount }}次</text>
          </view>
          <scroll-view scroll-x="true" class="scroll-select" v-if="!isIos">
            <view class="select">
              <view
                class="item"
                v-for="(item, index) in rightsList"
                :key="item.rightsId"
                :class="{ active: item.rightsId === activeRightsId }"
                @tap="toggleRightsActive(item.rightsId, item)"
              >
                <view class="tag" v-if="index === 0">AI体验价</view>
                <view class="tag" v-else-if="index === 1">限时活动</view>
                <view class="other">
                  <view class="inner">
                    <view class="item-title">
                      {{ item.rightsName }}
                    </view>
                    <view class="original-price"
                      >¥{{ item.rightsOriginalPrice }}元</view
                    >
                    <view class="price">
                      <text style="font-size: 28rpx">¥</text>
                      {{ item.rightsDiscountPrice }}元
                    </view>
                  </view>
                  <view
                    class="bottom-info"
                    v-if="item.rightsName.includes('次卡')"
                    >包月/年更优惠</view
                  >
                  <view
                    class="bottom-info"
                    v-if="item.rightsName.includes('月卡')"
                    >企业适用，￥0.2/天</view
                  >
                  <view
                    class="bottom-info"
                    v-if="item.rightsName.includes('年卡')"
                    >推荐开通，量大优惠</view
                  >
                </view>
                <view class="triangle"></view>
              </view>
            </view>
          </scroll-view>
          <view
            v-else
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              color: #ccc;
            "
          >
            <!-- <u-icon color="#ccc" size="28" name="info-circle"></u-icon> -->
			<image src="https://cdn.law.xiaomugua.cn/minip/ios_lock.png" style="width: 530rpx;height: 370rpx;"></image>
            <view
              style="
                margin-top: 20rpx;
                font-family: Microsoft YaHei;
                font-weight: 400;
                font-size: 33rpx;
                color: #666666;
              "
              >IOS手机不支持购买</view
            >
          </view>
          <u-collapse :border="false" :value="isIos ? ['ios'] : []">
            <u-collapse-item :border="false" name="ios" title="会员权益">
              <!-- <template #value>
		        <text class="u-page__item__title__slot-title">会员权益</text>
		      </template> -->
              <view class="vip-box">
                <image
                  src="https://cdn.law.xiaomugua.cn/minip/vip-rights.png"
                ></image>
                <!-- <view class="title">
		          <view class="left">权益详情</view>
		          <view class="right">
		            <view>普通用户</view>
		            <view>月卡VIP</view>
		            <view>年卡VIP</view>
		          </view>
		        </view>
		        <view class="row">
		          <view class="left right-text">合同审查</view>
		          <view class="right">
		            <view>0次</view>
		            <view class="right-text">20次/月</view>
		            <view class="right-text">600次/年</view>
		          </view>
		        </view>
		        <view class="row">
		          <view class="left right-text">主体审查</view>
		          <view class="right">
		            <view>0次</view>
		            <view class="right-text">5次/月</view>
		            <view class="right-text">60次/年</view>
		          </view>
		        </view>
		        <view class="row">
		          <view class="left right-text">积分模板</view>
		          <view class="right">
		            <view>0次</view>
		            <view class="right-text">免积分</view>
		            <view class="right-text">免积分</view>
		          </view>
		        </view>
		        <view class="row">
		          <view class="left right-text">VIP模板</view>
		          <view class="right">
		            <view>0次</view>
		            <view class="right-text">50次/月</view>
		            <view class="right-text">不限次</view>
		          </view>
		        </view> -->
              </view>
            </u-collapse-item>
          </u-collapse>
        </view>
        <view class="couponBox" v-if="activeIndex == 1">
          <!-- 优惠券部分 -->
          <!-- <view v-if="!isIos" class="coupon-section">
            <view class="left-section">
              <text class="coupon-label">优惠券</text>
              <text class="no-coupon">
                {{
                  selectCouponItem &&
                  selectCouponItem.coupon &&
                  selectCouponItem.coupon.couponName
                    ? selectCouponItem.coupon.couponName
                    : "暂未选择优惠券"
                }}
              </text>
            </view>
            <view class="right-section" @tap="selectOtherCoupon">
              <text class="select-other">选择其他优惠券</text>
              <u-icon
                :name="otherCoupon ? 'arrow-up' : 'arrow-down'"
                size="16"
                color="#d3d3d3"
              ></u-icon>
            </view>
          </view> -->

          <view class="coupon-other" v-if="otherCoupon">
            <u-loading-page
              :loading="loading"
              bg-color="#e8e8e8"
            ></u-loading-page>
            <scroll-view
              scroll-y="true"
              style="max-height: 15vh; overflow: hidden"
              v-if="availableCoupons && availableCoupons.length > 0"
            >
              <view
                v-for="(item, index) in availableCoupons"
                :key="item.id"
                class="cardBox"
              >
                <u-card :head-style="{ padding: 0 }" class="coupon-card">
                  <template #body>
                    <view class="couponCardBody">
                      <view class="coupon-content">
                        <view class="content-left">
                          <view class="coupon-title">{{
                            item.coupon.couponName
                          }}</view>
                          <view
                            v-if="item.countdown"
                            class="countdown coupon-time"
                            style="color: red"
                            >仅剩{{ item.countdown }}</view
                          >
                          <view v-else class="coupon-description coupon-time"
                            >有效期至：{{ formatDate(item.expireDate) }}</view
                          >
                          <view
                            style="display: flex"
                            @click="toggleUseRules(availableCoupons, index)"
                          >
                            <view>使用规则</view>
                            <u-icon
                              :name="item.showRules ? 'arrow-down' : 'arrow-up'"
                            ></u-icon>
                          </view>
                          <view v-if="item.showRules" class="coupon-use-rules">
                            {{ item.useRules }}
                          </view>
                        </view>

                        <view>
                          <u-checkbox
                            usedAlone
                            shape="circle"
                            @change="selectCoupon(item.id)"
                            :checked="isCouponSelected(item.id)"
                          />
                        </view>
                      </view>
                    </view>
                  </template>
                </u-card>
                <view class="coupon-tag">
                  <u-tag
                    shape="circle"
                    text="超值福利"
                    size="mini"
                    type="error"
                  ></u-tag>
                </view>
              </view>
            </scroll-view>
            <u-empty v-else mode="coupon"></u-empty>
          </view>

          <!-- 价格和按钮部分 -->
          <view class="price-section">
            <view class="price-info">
              <view v-if="!isIos">
                <!-- <text style="margin-left: 15rpx">合计：</text> -->
                <text style="margin-left: 15rpx; color: #ff5722">¥</text>
                <text class="price-total">{{ feFinalAmount }}</text>
                <view @tap="selectOtherCoupon">
                  <text class="quan-icon">券</text>
                  <text class="no-coupon">
                    {{
                      selectCouponItem &&
                      selectCouponItem.coupon &&
                      selectCouponItem.coupon.couponName
                        ? selectCouponItem.coupon.couponName
                        : "暂未选择优惠券"
                    }}
                  </text>
                  <text style="color: #ccc">></text>
                </view>
                <!-- <text class="discount">已优惠{{ feDiscountAmount }}元</text> -->
              </view>
              <view v-else>解锁更多优质服务</view>
            </view>
            <view class="buy-btn">
              <u-button
                v-if="!isIos"
                :loading="confirmLoading"
                @tap="handlePay"
                :hairline="false"
                color="#fff"
                type="primary"
                custom-style="background: linear-gradient(-90deg, #EC6955 0%, #EE8A3E 100%);border-radius: 24rpx; padding: 0 40rpx; color:#fff; font-weight: 700;margin-right: 30rpx"
              >
                同意协议并立即支付
              </u-button>
              <u-button
                v-else
                @tap="handleContact"
                :hairline="false"
                color="#fff"
                type="primary"
                custom-style="background: linear-gradient(-90deg, #EC6955 0%, #EE8A3E 100%);border-radius: 24rpx; padding: 0 40rpx; color:#fff; font-weight: 700;margin-right: 30rpx"
              >
                联系客服
              </u-button>
            </view>
          </view>
          <view class="agreement-notice"
            >点击支付表明您已阅读并同意《会员服务协议、隐私政策》</view
          >
        </view>
        <button
          class="pay-btn"
          v-if="activeIndex == 0"
          @click="$emit('onBuy', tempId)"
        >
          立即兑换
        </button>
        <!-- :disabled="userInfo.integral < 20" -->
      </view>
    </uni-popup>

    <u-modal
      :show="showPayModal"
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
import { computed, reactive, ref, watchEffect } from "vue";
import { request } from "../../utils/request";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { getUserById, shareToUse } from "@/api/user.js";
import toast from "@/libs/function/toast.js";
import { useUserStore } from "../../store";
import {
  getCalculateFinalPrice,
  getUserCouponsToPhone,
  getUserCouponList,
  createPhoneWebOrder,
  createWxOrder,
} from "@/api/operation.js";
import { getContractCount } from "@/api/template.js";

const emit = defineEmits(["onBuy", "close"]);
const popup = ref();
const userId = ref();
const userInfo = ref();
const activeRightsId = ref();
const activeRights = ref();
const activeTypeIndex = ref(0);
const tempId = ref();
const isVip = ref(false);
const rightsList = ref([]);
const activeIndex = ref(0);
const isTemp = ref(false);
const feTotalAmount = ref();
const feDiscountAmount = ref();
const feFinalAmount = ref();
const userStore = useUserStore();
const isIos = ref(userStore.system === "ios");
// const isIos = ref(true);
const selectCouponItem = ref();
const otherCoupon = ref(false);
const availableCoupons = ref([]);
const selectedCoupon = ref("");
const loading = ref(false);
const radiovalue = ref("weChat-pay");
const showPayModal = ref(false);
const payOrderId = ref("");
const paySuccess = ref(false);

const typeList = ref([
  { id: 0, name: "积分兑换" },
  { id: 1, name: "开通VIP" },
]);
const current = ref(0);
const isOnly = ref(false);
const confirmLoading = ref(false);
const templateViewCount = ref(0);
const contractReviewCount = ref(0);
const taskList = reactive([
  {
    title: "每日签到",
    subtitle: "每日签到获得积分+10",
    icon: "https://cdn.law.xiaomugua.cn/minip/points_sign_in.png",
    click: () => handleRegister(),
    isCompleted: computed(() => whether.value),
  },
  {
    title: "分享新用户注册登录",
    subtitle: "成功分享给新用户获得积分+10",
    icon: "https://cdn.law.xiaomugua.cn/minip/points_share.png",
    click: () => handleShare(),
    isCompleted: ref(false),
  },
  {
    title: "反馈建议",
    subtitle: "每日反馈获得积分+10",
    icon: "https://cdn.law.xiaomugua.cn/minip/points_feedback.png",
    click: () => handleaFeedback(),
    isCompleted: computed(() => feedBackWhether.value),
  },
]);
/**
 * 弹框显示
 * @Param {Number} typeId 选中权益的索引
 * @Param {Boolean} isOnly 是否只显示一个权益
 * @param {Boolean} isVip 是否是开通VIP
 * @Param {Number} tempId 选中权益的id
 */
const show = async (
  typeId = 0,
  _isOnly = false,
  _isVip = false,
  _isTemp = false,
  _tempId = null
) => {
  isVip.value = _isVip;
  tempId.value = _tempId;
  isOnly.value = _isOnly;
  isTemp.value = _isTemp;
  if (_isTemp) {
    await getTemplateSecondaryCard();
  } else {
    await getSecondaryCard();
  }
  typeList.value = [
    { id: 0, name: "积分兑换" },
    { id: 1, name: "开通VIP" },
  ];
  if (typeId === 0) {
    getUserById(userId.value).then((res) => {
      if (res.code === 200) {
        userInfo.value = res.data;
      }
    });
  }
  await getCouponList();
  popup.value.open();
  // current.value = 1
  activeIndex.value = typeId;
  // console.log(activeIndex.value);
  if (isOnly.value) typeList.value = [typeList.value[typeId]];
  // console.log(typeList.value[typeId]);
  // console.log(typeList.value);
  setTimeout(() => {
    if (isOnly.value) current.value = 0;
    else current.value = typeId;
  }, 100);
  await getContractCount(userId.value)
    .then((res) => {
      if (res.code === 200) {
        console.log("test", res.data);
        templateViewCount.value = res.data.combination.templateViewCount;
        contractReviewCount.value =
          res.data.combination.freeCount + res.data.combination.cardCount;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(activeIndex.value);
};

const handlePopupClose = () => {
  popup.value.close();
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

watchEffect(() => {
  if (!isOnly.value) {
    activeIndex.value = current.value;
  }
});

const handlePayConfirm = () => {
  uni.navigateTo({
    url: `/subpackage/orderDetails/orderDetails?orderId=${payOrderId.value}`,
  });
};

const handlePayCancel = () => {
  showPayModal.value = false;
  emit("close");
};

const groupChange = (n) => {
  console.log("groupChange", n);
  console.log(radiovalue.value);
};

const toggleUseRules = (couponList, index) => {
  couponList[index].showRules = !couponList[index].showRules;
};

// 选择优惠券
const selectCoupon = (id) => {
  if (selectedCoupon.value !== id) {
    selectedCoupon.value = id;
  } else {
    selectedCoupon.value = "";
  }
  if (selectedCoupon.value) {
    const selectItem = availableCoupons.value.filter(
      (item) => item.id === selectedCoupon.value
    );
    // console.log(selectItem);
    userStore.setSelectCoupon(selectItem[0]);
  } else {
    userStore.setSelectCoupon({});
  }
  if (
    userStore.selectCoupon &&
    Object.keys(userStore.selectCoupon).length > 0
  ) {
    selectCouponItem.value = userStore.selectCoupon;
    countProce();
  } else {
    selectCouponItem.value = {};
    feTotalAmount.value = activeRights.value.rightsOriginalPrice;
    feDiscountAmount.value = 0;
    feFinalAmount.value = activeRights.value.rightsDiscountPrice;
  }
};

const isCouponSelected = (id) => {
  if (selectedCoupon.value && selectedCoupon.value === id) {
    return true;
  } else {
    return false;
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const selectOtherCoupon = () => {
  uni.navigateTo({
    url: `/subpackage/selectCoupon/selectCoupon?rightsId=${activeRightsId.value}`,
  });
};

// 切换权益的选中状态
const toggleRightsActive = (id, rights) => {
  activeRightsId.value = id;
  activeRights.value = rights;
  feTotalAmount.value = activeRights.value.rightsOriginalPrice;
  feDiscountAmount.value = 0;
  feFinalAmount.value = activeRights.value.rightsDiscountPrice;
  selectCouponItem.value = {};
  userStore.setSelectCoupon({});
  selectedCoupon.value = "";
  getCouponList();
};
//获取权益列表
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
        activeRightsId.value = res.data[0].rightsId;
        activeRights.value = res.data[0];
        feTotalAmount.value = activeRights.value.rightsOriginalPrice;
        feDiscountAmount.value = 0;
        feFinalAmount.value = activeRights.value.rightsDiscountPrice;
        countProce();
      } else {
        activeRightsId.value = res.data[1].rightsId;
        activeRights.value = res.data[1];
        feTotalAmount.value = activeRights.value.rightsOriginalPrice;
        feDiscountAmount.value = 0;
        feFinalAmount.value = activeRights.value.rightsDiscountPrice;
        countProce();
      }
    } else {
      activeRightsId.value = res.data[0].rightsId;
      activeRights.value = res.data[0];
      feTotalAmount.value = activeRights.value.rightsOriginalPrice;
      feDiscountAmount.value = 0;
      feFinalAmount.value = activeRights.value.rightsDiscountPrice;
    }
  }
};
//获取模板次卡
const getTemplateSecondaryCard = async () => {
  try {
    const res = await request("/api2/rights/getTemplateSecondaryCard", "POST");
    if (res.data) {
      let flag = true;
      rightsList.value.forEach((e) => {
        if (e.rightsId == res.data.rightsId) {
          flag = false;
        }
      });
      if (flag) {
        rightsList.value.push(res.data);
      }

      console.log(res);
    } else {
      toast(res.message + ":次卡");
    }
  } catch (e) {
    toast(e.message + ":次卡");
  }
};
//获取次卡
const getSecondaryCard = async () => {
  try {
    const res = await request("/api2/rights/getSecondaryCard", "POST");
    if (res.data) {
      let flag = true;
      rightsList.value.forEach((e) => {
        if (e.rightsId == res.data.rightsId) {
          flag = false;
        }
      });
      if (flag) {
        rightsList.value.push(res.data);
      }
      console.log(res);
    } else {
      toast(res.message + ":次卡");
    }
  } catch (e) {
    toast(e.message + ":次卡");
  }
};
//获取用户信息
// const getUserById = async () => {
// 	const res = await request('/api2/users/getUserById', 'POST', {
// 		userId: userId.value
// 	});
// 	if (res.code === 200) {
// 		userInfo.value = res.data
// 		console.log(res);
// 	}
// };
const handleChange = ({ index }) => {
  current.value = index;
  console.log(current.value);
};
//支付
const handlePay = async () => {
  try {
    const res = await createWxOrder(
      activeRightsId.value,
      selectedCoupon.value,
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
        },
        fail: function (err) {
          // 支付失败处理逻辑...
          console.log(err);
          paySuccess.value = false;
          showPayModal.value = true;
        },
        complete: function () {
          console.log("complete");
          handlePopupClose();
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

const getCouponList = async () => {
  loading.value = true;
  await getUserCouponList(userId.value, activeRightsId.value)
    .then((res) => {
      console.log(res);
      const dataFromBackend = res.data;

      const processedUnusedCoupons = dataFromBackend.available.map((coupon) => {
        // 检查优惠券是否快过期
        const countdown = checkIsExpiringSoon(coupon.coupon.endTime)
          ? formatCountdown(coupon.coupon.endTime)
          : null;
        return {
          ...coupon,
          status: "available", // 添加未使用状态
          showRules: false, // 添加一个属性控制规则显示
          countdown,
        };
      });
      availableCoupons.value = processedUnusedCoupons;

      // 定时更新倒计时
      setInterval(() => {
        availableCoupons.value.forEach((coupon, index) => {
          if (checkIsExpiringSoon(coupon.coupon.endTime)) {
            availableCoupons.value[index].countdown = formatCountdown(
              coupon.coupon.endTime
            );
          }
        });
      }, 1000); // 每秒更新一次
    })
    .catch((err) => {
      console.log(err);
      availableCoupons.value = [];
      toast(err.message);
    })
    .finally(() => {
      loading.value = false;
    });
};

// 检查是否距离过期时间小于24小时
const checkIsExpiringSoon = (endTime) => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = end - now;

  return diff > 0 && diff <= 24 * 60 * 60 * 1000; // 小于24小时
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

//获取积分模块

const feedBackWhether = ref(false);
const whether = ref(false);
const shareToUser = ref(0);
const shares = ref();

onShow(async () => {
  console.log("popShow");
  userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  userInfo.value =
    uni.getStorageSync("userInfo") || uni.getStorageSync("wxInfo");
  await getRightsList();
  // 获取
  if (userId.value) {
    try {
      await getUserById(userId.value).then((res) => {
        console.log(res, "getUserById");
        if (res.code === 200) {
          whether.value = res.data.whether;
          feedBackWhether.value = res.data.feedBackWhether;
          shareToUser.value = res.data.shareToUser;
          userInfo.value = res.data;
          if (res.data.shareToUser == 3) {
            shares.value = true;
          }
        } else {
          uni.showToast({
            title: res.message,
            icon: "error",
          });
        }
      });
    } catch (err) {
      console.error("getPapayaBeansByUserId error:", err);
    }
  }
  if (
    userStore.selectCoupon &&
    Object.keys(userStore.selectCoupon).length > 0
  ) {
    selectCouponItem.value = userStore.selectCoupon;
    countProce();
  } else {
    selectCouponItem.value = {};
    feTotalAmount.value = activeRights.value.rightsOriginalPrice;
    feDiscountAmount.value = 0;
    feFinalAmount.value = activeRights.value.rightsDiscountPrice;
  }
});

const countProce = async () => {
  await getCalculateFinalPrice(
    userId.value,
    selectCouponItem.value.id,
    activeRights.value.rightsId
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

// 签到
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
// 反馈
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
// 分享
const handleShare = () => {
  if (userId.value) {
    uni.navigateTo({
      url: "/subpackage/invite/invite",
    });
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};

defineExpose({ show });
</script>

<style lang="scss">
.buy-popup {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 25rpx;
  background-color: white;
  border-radius: 18rpx 18rpx 0rpx 0rpx;
  .message {
    width: 680rpx;
    height: 95rpx;
    display: flex;
    padding-left: 20rpx;
    align-items: center;
    border-radius: 8rpx;
    background: #eeeeee;
    font-size: 25rpx;
    image {
      width: 95rpx;
      height: 26rpx;
      margin-right: 20rpx;
    }
    &.active {
      background: #f9d19d;
      color: #b36211;
    }
  }
  .type {
    width: 100%;
    font-size: 32rpx;
    font-weight: 700;
    // margin-bottom: 45rpx;
    display: flex;
    flex-direction: row;
    padding-left: 50rpx;
    .item {
      margin-right: 35rpx;
      &.active {
        text-decoration: underline rgba(42, 130, 228, 1) 8rpx;
        text-underline-offset: 6rpx;
        // transition: all 0.5s;
      }
    }
  }
  .select {
    display: flex;
    flex-direction: row;
    // justify-content: center;
    margin: 0 36rpx;
    margin-top: 45rpx;
    // margin-bottom: 60rpx;
    .item {
      // margin-right: 26rpx;
      margin: 0 13rpx;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: visible;
      .tag {
        width: 115rpx;
        height: 39rpx;
        background: #ec6555;
        border-radius: 8rpx 16rpx 8rpx 0rpx;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        font-size: 19rpx;
        color: #ffffff;
        position: absolute;
        top: -9rpx;
        left: 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
      }
      .other {
        background: #f3f3f3;
        border-radius: 23rpx 38rpx 23rpx 23rpx;
        padding: 5px; /* 边框厚度 */
        padding-bottom: 0;
        width: 219rpx;
        height: 268rpx;
        display: flex;
        flex-direction: column;
        z-index: 2;
        .inner {
          background: #ffffff;
          border-radius: 23rpx 38rpx 23rpx 23rpx;
          width: 100%;
          height: 200rpx;
          padding-top: 25rpx;
          .item-title {
            display: flex;
            margin-left: 15rpx;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            font-size: 25rpx;
            color: #000000;
          }
          .price {
            font-weight: bold;
            font-size: 44rpx;
            color: #000000;
            margin-left: 29rpx;
            margin-top: 32rpx;
          }
        }
        .bottom-info {
          height: 50rpx;
          background: transparent;
          font-family: MicrosoftYaHei;
          font-weight: 400;
          font-size: 18rpx;
          color: #898989;
          display: flex;
          align-items: center;
          justify-content: center;
          // border-radius: 23rpx 38rpx 23rpx 23rpx;
        }
      }
      &.active {
        .other {
          background: linear-gradient(-90deg, #ec6955, #ee8a3e);
          .bottom-info {
            font-family: MicrosoftYaHei;
            font-weight: 400;
            font-size: 18rpx;
            color: #ffffff;
          }
          .price {
            color: #ed6a54;
          }
          .original-price {
            color: #f1b3ac;
          }
        }
        .triangle {
          display: block;
        }
      }
      .triangle {
        height: 50rpx;
        width: 50rpx;
        transform: translateY(-18px) rotate(45deg);
        background: linear-gradient(-90deg, #ec6955, #ee8a3e);
        border-radius: 20%;
        box-sizing: border-box;
        align-self: center;
        z-index: 1;
        display: none;
        // margin-top: 20rpx;
      }
    }
  }
  .buy-vip {
    display: flex;
    flex-direction: column;
    margin-bottom: 30rpx;
    width: 100%;
    .remaining-count {
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      margin-left: 34rpx;
      // margin-bottom: 30rpx;
    }
    .vip-box {
      // width: 714rpx;
      width: 100%;
      // height: 388rpx;
      opacity: 1;
      border-radius: 8rpx;
      // background: rgba(247, 249, 250, 1);
      display: flex;
      flex-direction: column;
      // padding: 22rpx 16rpx 0rpx 16rpx;
      box-sizing: border-box;
      // align-items: center;
      justify-content: center;
      image {
        width: 680rpx;
        height: 590rpx;
      }
      .title {
        width: 100%;
        height: 100rpx;
        font-size: 24rpx;
        font-weight: 400;
        margin-bottom: 20rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 8rpx;
        align-content: space-between;
        background: #faf1e3;
        color: #c27f38;
        .left {
          flex: 1;
          text-align: center;
          color: #c27f38 !important;
        }
        .right {
          display: flex;
          flex-direction: row;
          width: 410rpx;
          margin-right: 20rpx;
          view {
            // margin-right: 35rpx;
            font-weight: 500;
            flex: 1;
            text-align: center;
          }
        }
      }
      .row {
        width: 100%;
        height: 70rpx;
        font-size: 24rpx;
        font-weight: 400;
        margin-bottom: 30rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: space-between;
        .left {
          flex: 1;
          text-align: center;
        }
        .right {
          display: flex;
          flex-direction: row;
          width: 410rpx;
          font-weight: 400;
          margin-right: 20rpx;
          view {
            // margin-right: 35rpx;
            text-align: center;
            flex: 1;
            &:first-child {
              font-size: 24rpx;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.45);
            }
          }
        }
      }
    }
    .scroll-select {
      padding-top: 10rpx;
      margin-bottom: 10rpx;
      overflow-x: hidden;
      height: 360rpx;
      width: 100%;
    }
  }

  .pay-btn {
    width: 690rpx;
    height: 100rpx;
    background: #4d6ef1;
    border-radius: 13rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin-bottom: 60rpx;
  }
}

.rule {
  .planning-title {
    font-size: 40rpx;
    font-weight: 700;
    margin: 20rpx 40rpx;
  }
  .planning {
    padding: 0 20rpx;
    .planning-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24rpx 0;
      border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);
      .box-left {
        display: flex;
        width: 360rpx;
        .img {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          min-width: 80rpx;
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
            white-space: nowrap;
          }

          .tips {
            padding-top: 6rpx;
            font-size: 24rpx;
            color: rgba(0, 0, 0, 0.45);
            white-space: nowrap;
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
}
.red {
  color: #ff0000;
}
// .u-page__item__title__slot-title {
//   color: #2b7be1;
// }

/* 优惠券部分 */
.coupon-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding-left: 30rpx;
  padding-right: 15rpx;
}

.left-section {
  display: flex;
  align-items: center;
  height: 50rpx;
}

.coupon-label {
  color: #ff5722;
  border: 1px solid #ff5722;
  padding: 4rpx 8rpx;
  border-radius: 10rpx;
  font-size: 24rpx;
  margin-right: 10rpx;
}

.no-coupon {
  color: #ff5722;
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
  padding-left: 15rpx;
  width: 100%;
}

.price-info {
  display: flex;
  align-items: baseline;
}

.price-info text {
  font-size: 26rpx;
}

.quan-icon {
  color: white;
  background-color: #ff5722;
  border-radius: 20%;
  width: 32rpx;
  height: 32rpx;
  box-sizing: border-box;
  text-align: center;
  font-size: 24rpx;
  line-height: 32rpx;
  display: inline-block;
  margin-right: 20rpx;
  margin-left: 16rpx;
}

.agreement-notice {
  font-size: 20rpx;
  color: #999;
  margin-top: 20rpx;
  margin-left: 28rpx;
}

.price-total {
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
  margin-right: 20rpx;
}

.couponBox {
  width: 100%;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: 28rpx;
}

.coupon-tag {
  position: absolute;
  left: 0;
  top: -18rpx;
  transform: translate(0.8);
  z-index: 2;
}

.coupon-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.couponCardBody {
  display: flex;
  justify-content: space-between;
}

.cardBox {
  position: relative;
}

.original-price {
  text-decoration: line-through;
  margin-left: 15rpx;

  font-weight: 400;
  font-size: 23rpx;
  color: #000;
}

.right-text {
  color: #c27f38 !important;
}

:deep(.uni-popup__wrapper.bottom) {
  padding-bottom: 0;
}

:deep(.u-card.data-v-040f828b) {
  overflow: visible !important;
}

// 积分
.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 28rpx 47rpx 28rpx;
  border-bottom: solid 1px #efefef;
  height: 100rpx;
  .left {
    flex: 1;
    font-size: 27rpx;
  }
  .right {
    font-size: 24rpx;
    .points-gap {
      color: #ed6555;
    }
    .points {
      color: #999;
    }
  }
}

.task-list {
  padding-left: 35rpx;
  padding-right: 45rpx;
  .task-list-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-bottom: 58rpx;
    .content {
      flex: 1;
      .title {
        font-size: 28rpx;
        font-weight: bold;
        margin-bottom: 18rpx;
      }
      .subtitle {
        font-size: 21rpx;
        color: #979797;
      }
    }
    .btn view {
      width: 136rpx;
      height: 65rpx;
      border-radius: 33rpx;
      border: 2px solid #ed6555;
      font-weight: bold;
      font-size: 21rpx;
      color: #ed6555;
	  font-family: MicrosoftYaHei;
	  font-weight: bold;
	  display: flex;
	  align-items: center;
	  justify-content: center;
      &.done {
        width: 136rpx;
        height: 65rpx;
        background: #d5d5d5;
        border: 2px solid #d5d5d5;
        border-radius: 33rpx;
        font-weight: bold;
        font-size: 21rpx;
        color: #ffffff;
      }
    }
    .icon image {
      width: 58rpx;
      height: 58rpx;
      margin-right: 30rpx;
    }
  }
}

.tips {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 19rpx;
  line-height: 23rpx;
  margin-bottom: 22rpx;
  image {
    width: 25rpx;
    height: 25rpx;
    margin-right: 14rpx;
  }
}
</style>
