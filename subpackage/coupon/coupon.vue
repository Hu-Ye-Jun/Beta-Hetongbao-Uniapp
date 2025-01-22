<template>
  <view class="container">
    <view class="navBar">
      <view class="navIcon" @tap="handleGoBack">
        <u-icon size="24" name="arrow-left" color="#000"></u-icon>
      </view>
      <view class="navText">优惠券</view>
    </view>
    <!-- 顶部标签切换 -->
    <!-- <u-tabs :list="tabList" v-model="activeTab" @change="changeTab"></u-tabs> -->
    <view class="tabBox">
      <view class="tabTitle" v-for="(item, index) in tabList" :key="index">
        <view class="content" @click="changeTab(index)">
          <view class="name" :class="{ activeName: activeTab === index }">{{
            item.name
          }}</view>
          <view class="count" :class="{ activeCount: activeTab === index }"
            >{{ item.count }}张</view
          >
        </view>
        <view v-if="index !== tabList.length - 1" class="line"></view>
      </view>
    </view>

    <!-- 优惠券列表 -->
    <scroll-view v-if="activeTab === 0" enable-flex scroll-y>
      <view v-if="allCoupons && allCoupons.length > 0">
        <!-- 循环遍历所有优惠券 -->
        <view v-for="(item, index) in allCoupons" :key="item.id">
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
                      <text>{{ item.couponViewName }}</text>
                    </view>
                    <!-- 倒计时显示 -->
                    <view>
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

                  <view v-if="item.status === 'unused'">
                    <u-button
                      @tap="handleToUse(item)"
                      color="#4D6EF1"
                      class="use-button"
                      type="primary"
                      >立即使用</u-button
                    >
                  </view>
                  <view
                    v-else-if="item.status === 'expired'"
                    class="imageTransform"
                  >
                    <u-image
                      width="60"
                      height="60"
                      src="https://cdn.law.xiaomugua.cn/minip/expired.png"
                      :fade="true"
                      duration="450"
                    ></u-image>
                  </view>
                  <view
                    v-else-if="item.status === 'used'"
                    class="imageTransform"
                  >
                    <u-image
                      width="60"
                      height="60"
                      src="https://cdn.law.xiaomugua.cn/minip/used.png"
                      :fade="true"
                      duration="450"
                    ></u-image>
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

    <!-- 未使用 -->
    <scroll-view enable-flex v-else-if="activeTab === 1" scroll-y>
      <view v-if="availableCoupons && availableCoupons.length > 0">
        <view v-for="(item, index) in availableCoupons" :key="index">
          <u-card
            :head-style="{ padding: 0 }"
            :border="false"
            :head-border-bottom="false"
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
                      <text>{{ item.couponViewName }}</text>
                    </view>
                    <view>
                      <view v-if="item.countdown" class="countdown coupon-time"
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
                    <u-button color="#4D6EF1" class="use-button" type="primary"
                      >立即使用</u-button
                    >
                  </view>
                </view>
                <!-- <view class="coupon-tag">
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

    <!-- 已失效 -->
    <scroll-view enable-flex v-else-if="activeTab === 2" scroll-y>
      <view v-if="overdueCoupons && overdueCoupons.length > 0">
        <view v-for="(item, index) in overdueCoupons" :key="index">
          <u-card
            :head-style="{ padding: 0 }"
            :border="false"
            :head-border-bottom="false"
            class="coupon-card expired"
          >
            <template #body>
              <view class="coupon-content">
                <view class="content-left">
                  <view class="coupon-title">
                    <text
                      v-if="item.coupon.couponTypeId !== 2"
                      style="font-size: 18px"
                      >¥</text
                    >
                    <text>{{ item.couponViewName }}</text>
                  </view>
                  <view>
                    <view class="coupon-description coupon-time"
                      >有效期至：{{ formatDate(item.expireDate) }}</view
                    >
                    <view class="coupon-use-rules">
                      {{ item.useRules }}
                    </view>
                  </view>
                </view>
                <view class="imageTransform">
                  <u-image
                    width="60"
                    height="60"
                    src="https://cdn.law.xiaomugua.cn/minip/used.png"
                    :fade="true"
                    duration="450"
                  ></u-image>
                </view>
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

    <!-- 已过期 -->
    <scroll-view enable-flex v-else-if="activeTab === 3" scroll-y>
      <view v-if="expiredCoupons && expiredCoupons.length > 0">
        <view v-for="(item, index) in expiredCoupons" :key="index">
          <u-card
            :head-style="{ padding: 0 }"
            :border="false"
            :head-border-bottom="false"
            class="coupon-card overdue"
          >
            <template #body>
              <view class="coupon-content">
                <view class="content-left">
                  <view class="coupon-title">
                    <text
                      v-if="item.coupon.couponTypeId !== 2"
                      style="font-size: 18px"
                      >¥</text
                    >
                    <text>{{ item.couponViewName }}</text>
                  </view>
                  <view>
                    <view class="coupon-description coupon-time"
                      >有效期至：{{ formatDate(item.expireDate) }}</view
                    >
                    <view v-if="item.showRules" class="coupon-use-rules">
                      {{ item.useRules }}
                    </view>
                  </view>
                </view>
                <view class="imageTransform">
                  <u-image
                    width="60"
                    height="60"
                    src="https://cdn.law.xiaomugua.cn/minip/expired.png"
                    :fade="true"
                    duration="450"
                  ></u-image>
                </view>
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
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getUserCouponsToPhone } from "@/api/operation.js";
import toast from "../../libs/function/toast";
import { getUserIsUsingRights } from "@/api/template.js";
import { useUserStore } from "../../store";

const activeTab = ref(0);
const tabList = ref([
  { name: "全部", count: 0 },
  { name: "未使用", count: 0 },
  { name: "已使用", count: 0 },
  { name: "已过期", count: 0 },
]);
const buyPopup = ref();
const availableCoupons = ref([]);
const expiredCoupons = ref([]);
const overdueCoupons = ref([]);
const allCoupons = ref([]);
const isVip = ref(false);
const userId = ref("");
const userInfo = ref();
const userStore = useUserStore();

const handleGoBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const handleToUse = (coupon) => {
  if (!userInfo.value.isTeenager) {
    uni.navigateTo({
      url: "/subpackage/buyVip/buyVip",
    });
  } else {
    toast("青少年模式下无法购买");
  }
  console.log(coupon, "coupon");
  userStore.setSelectCoupon(coupon);
  uni.navigateTo({
    url: "/subpackage/buyVip/buyVip",
  });
  // buyPopup.value.show(0, false, isVip.value);
};

const changeTab = (index) => {
  activeTab.value = index;
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

onShow(async () => {
  userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  userInfo.value =
    uni.getStorageSync("userInfo") || uni.getStorageSync("wxInfo");
  if (userId.value) {
    await getUserIsUsingRights(userId.value)
      .then((res) => {
        if (res.code === 200) {
          isVip.value = true;
        } else {
          isVip.value = false;
        }
      })
      .catch((err) => {
        isVip.value = false;
      });
  }
  await getUserCouponsToPhone()
    .then((res) => {
      console.log(res);
      const dataFromBackend = res.data;

      // 处理优惠券数据并添加 status 字段
      const processedExpiredCoupons = dataFromBackend.expired.map((coupon) => ({
        ...coupon,
        status: "expired", // 添加已过期状态
        showRules: false, // 添加一个属性控制规则显示
      }));
      expiredCoupons.value = processedExpiredCoupons;
      tabList.value[3].count = expiredCoupons.value.length;

      const processedUnusedCoupons = dataFromBackend.unused.map((coupon) => {
        // 检查优惠券是否快过期
        const countdown = checkIsExpiringSoon(coupon.coupon.endTime)
          ? formatCountdown(coupon.coupon.endTime)
          : null;
        return {
          ...coupon,
          status: "unused", // 添加未使用状态
          showRules: false, // 添加一个属性控制规则显示
          countdown,
        };
      });
      availableCoupons.value = processedUnusedCoupons;
      tabList.value[1].count = availableCoupons.value.length;

      const processedUsedCoupons = dataFromBackend.used.map((coupon) => ({
        ...coupon,
        status: "used", // 添加已使用状态
        showRules: false, // 添加一个属性控制规则显示
      }));
      overdueCoupons.value = processedUsedCoupons;
      tabList.value[2].count = overdueCoupons.value.length;

      // 将所有数据合并到 allCoupons 列表
      allCoupons.value = [
        ...processedUnusedCoupons,
        ...processedUsedCoupons,
        ...processedExpiredCoupons,
      ];
      tabList.value[0].count = allCoupons.value.length;

      // 定时更新倒计时
      setInterval(() => {
        availableCoupons.value.forEach((coupon, index) => {
          if (checkIsExpiringSoon(coupon.coupon.endTime)) {
            availableCoupons.value[index].countdown = formatCountdown(
              coupon.coupon.endTime
            );
          }
        });
        allCoupons.value.forEach((coupon, index) => {
          if (checkIsExpiringSoon(coupon.coupon.endTime)) {
            allCoupons.value[index].countdown = formatCountdown(
              coupon.coupon.endTime
            );
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

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  background: #f6f6f6;
  position: relative;
  height: 100vh;
  .navBar {
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    padding-top: 6vh;
    .navText {
      font-size: 38rpx;
      color: #000;
    }
    .navIcon {
      z-index: 10;
      margin-right: 16rpx;
    }
  }
  .tabBox {
    display: flex;
    align-items: center;
    padding-left: 30rpx;
    margin-top: 40rpx;
    margin-bottom: 20rpx;
    .tabTitle {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 20%;
      .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .name {
          font-size: 36rpx;
          font-weight: 700;
        }
        .count {
          font-size: 20rpx;
          color: #555b6c;
          font-weight: 400;
          padding: 2rpx 35rpx;
          border-radius: 25rpx;
        }
        .activeName {
          color: #4d6ef1;
        }
        .activeCount {
          color: #fff;
          background-color: #4d6ef1;
        }
      }
      .line {
        border-right: 1rpx solid #d4d8db;
        height: 50rpx;
      }
    }
  }
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
.coupon-title {
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
</style>
