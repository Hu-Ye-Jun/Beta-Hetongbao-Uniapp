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
    <!-- LoadingPage 组件，控制是否显示加载状态 -->
    <u-loading-page v-if="loading" />
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
    <u-sticky zIndex="1">
      <view class="sticky">
        <view class="VIcon">
          <image
            src="https://cdn.law.xiaomugua.cn/minip/VActive.png"
            v-if="isVip"
          ></image>
          <image v-else src="https://cdn.law.xiaomugua.cn/minip/V.png"></image>
        </view>
        <view class="vipText" v-if="isVip">尊贵的VIP权益生效中</view>
        <view class="text" v-else>您的VIP权益暂未激活</view>
        <view class="rights" v-if="isVip" @tap="openAllRights"
          >剩余权益&gt</view
        >
        <view class="rights" v-else @tap="handleBuyVip">立即激活&gt</view>
      </view>
    </u-sticky>

    <scroll-view class="container" enable-flex="true" v-if="!loading">
      <view class="grid">
        <view
          class="item"
          v-for="(item, index) in contractTemplateByTypeId"
          :key="item.id"
          @click="toPreview(item.id, item.buyTypeId)"
        >
          <view class="tag" v-if="item.buyTypeId == 2">
            <image
              style="width: 100%; height: 100%"
              src="https://cdn.law.xiaomugua.cn/minip/pointsTemplate.png"
            ></image>
          </view>
          <view class="tag" v-else-if="item.buyTypeId == 4">
            <image
              style="width: 100%; height: 100%"
              src="https://cdn.law.xiaomugua.cn/minip/redeemedTemplate.png"
            ></image>
          </view>
          <view
            class="tag"
            v-else-if="item.buyTypeId >= 1 && item.buyTypeId <= 5"
          >
            <image
              style="width: 100%; height: 100%"
              src="https://cdn.law.xiaomugua.cn/minip/freeTemplate.png"
            ></image>
          </view>
          <view class="tag" v-else-if="item.buyTypeId == 6">
            <image
              style="width: 100%; height: 100%"
              src="https://cdn.law.xiaomugua.cn/minip/lock.png"
            ></image>
          </view>
          <view class="tag" v-else-if="item.buyTypeId == 7">
            <image
              style="width: 100%; height: 100%"
              src="https://cdn.law.xiaomugua.cn/minip/unlock.png"
            ></image>
          </view>
          <view class="thumbnail"
            ><image :src="getTemplateImg(index)" mode="aspectFill"></image
          ></view>
          <view
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 90%;
            "
          >
            <view class="title">{{ item.name }}</view>
            <view class="collect" @tap.stop="collect(item.id)">
              <image
                src="https://cdn.law.xiaomugua.cn/minip/tempCollectActive.png"
                v-if="item.isCollection"
              ></image>
              <image
                src="https://cdn.law.xiaomugua.cn/minip/tempCollect.png"
                class="collect"
                v-else-if="!item.isCollection"
              ></image>
            </view>
          </view>
        </view>
      </view>
      <view class="nomore">没有更多了～</view>
    </scroll-view>

    <BuyPopup
      ref="buyPopup"
      @onBuy="onBuy"
      @close="handlePopupClose"
    ></BuyPopup>
  </view>

  <uni-popup ref="allRights" type="center">
    <AllRights @close="() => allRights.close()"></AllRights>
  </uni-popup>
</template>

<script setup>
import { onLoad, onShow, onHide } from "@dcloudio/uni-app";
import { request } from "@/utils/request.js";
import toast from "@/libs/function/toast.js";
import { reactive, ref } from "vue";
import { addCollectionTemplate } from "@/api/template.js";
import throttle from "../../libs/function/throttle.js";
import AllRights from "@/components/AllRights/AllRights.vue";
onLoad((option) => {
  title.value = decodeURIComponent(option.title);
  typeId.value = option.id;
});

onShow(() => {
  userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  userInfo.value =
    uni.getStorageSync("userInfo") || uni.getStorageSync("wxInfo");
  getContractTemplateByTypeId(typeId.value);
  getIsUsingRights();
});

onHide(() => {
  contractTemplateByTypeId.length = 0;
});

const contractTemplateByTypeId = reactive([]);
const toIntegralPaid = ref(false);
const userId = ref(
  uni.getStorageSync("userId") || uni.getStorageSync("wxuserId")
);
const isVip = ref(false);
const loading = ref(false); // 添加loading状态
const allRights = ref(null);
const typeId = ref();
const title = ref("");
const userInfo = ref();

const templateImgList = [
  "https://cdn.law.xiaomugua.cn/minip/template1.png",
  "https://cdn.law.xiaomugua.cn/minip/template2.png",
  "https://cdn.law.xiaomugua.cn/minip/template3.png",
  "https://cdn.law.xiaomugua.cn/minip/template4.png",
  "https://cdn.law.xiaomugua.cn/minip/template5.png",
];

// 获取模板图片
const getTemplateImg = (index) => {
  // 循环使用 templateImgList 中的图片
  const imgIndex = index % templateImgList.length;
  return templateImgList[imgIndex];
};

// 处理弹窗关闭事件
const handlePopupClose = () => {
  getIsUsingRights(); // 重新获取用户的VIP状态
};

const handleGoBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};

// 获取模板详细
const getContractTemplateByTypeId = async function (id) {
  try {
    loading.value = true; // 开始加载时显示LoadingPage
    const res = await request(
      "/api2/contractTemplate/getContractTemplateByTypeId",
      "POST",
      {
        typeId: id,
      }
    );
    if (res) {
      if (res.data) {
        contractTemplateByTypeId.push(...res.data);
        console.log(contractTemplateByTypeId);
      } else throw new Error(res.message);
    } else throw new Error();
  } catch (e) {
    if (e.message) toast(e.message);
    else toast("加载失败");
  } finally {
    loading.value = false; // 加载完成后隐藏LoadingPage
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
    console.log(isVip.value);
  }
};
//收藏
const collect = async function (id) {
  addCollectionTemplate(userId.value, id)
    .then((res) => {
      if (res.code === 200) {
        uni.showToast({
          title: res.data ? "收藏成功" : "取消收藏",
          icon: "success",
        });
        contractTemplateByTypeId.forEach((item) => {
          if (item.id === id) {
            item.isCollection = !item.isCollection;
          }
        });
      } else {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: "none",
      });
    });
};

const openAllRights = function () {
  allRights.value.open();
};

// 跳转合同模板预览
const toPreview = async function (id, buyTypeId = 2) {
  throttle(
    async () => {
      if (loading.value) return; // 如果正在加载中，直接返回，防止重复点击

      loading.value = true; // 设置loading为true，防止重复点击
      try {
        const res = await request(
          "/api2/contractTemplate/getTemplateById",
          "GET",
          {
            templateId: id,
            toIntegralPaid: toIntegralPaid.value,
          }
        );
        const pdfUrl = res.data.htmlUrl;
        const pdfName = res.data.htmlName;
        if (isVip.value) {
          setTimeout(() => {
            uni.navigateTo({
              url: `/subpackage/documentDetail/documentDetail?pdfUrl=${pdfUrl}&templateId=${id}&pdfName=${pdfName}`,
            });
          }, 800);
          if (buyTypeId == 2 || buyTypeId == 3 || buyTypeId == 7) {
            uni.showToast({
              title: "VIP权益生效中，已为你直接打开文档",
              icon: "none",
              duration: 1500,
            });
          }
        } else {
          uni.navigateTo({
            url: `/subpackage/documentDetail/documentDetail?pdfUrl=${pdfUrl}&templateId=${id}&pdfName=${pdfName}`,
          });
        }
      } catch (err) {
        console.log(err);
        // if (err.code === 24012) {
        if (err.code) {
          if (err.code === 18014) {
            toast(err.message + "77");
          }
          if (err.code === 202) {
            uni.navigateTo({
              url: "/pages/login/login",
            });
            return;
          }
          if (
            buyTypeId != 1 &&
            buyTypeId != 4 &&
            buyTypeId != 5 &&
            buyTypeId != 7
          ) {
            if (buyTypeId == 2) {
              showBuyPopup(0, false, id);
              return;
            }
            if (buyTypeId == 6 && !isVip.value) {
              if (!userInfo.value.isTeenager) {
                showBuyPopup(1, true, id);
              } else {
                toast("青少年模式下无法购买");
              }
              return;
            }
          }
        } else {
          toast(err.message + err.code + "66");
        }
      } finally {
        loading.value = false; // 请求结束后，重置loading状态
      }
    },
    1000,
    true
  );
};
//弹窗触发兑换按钮
const onBuy = async function (id) {
  console.log("buy!");
  console.log(id);
  try {
    const res = await request(
      "/api2/contractTemplate/getContractTemplateById",
      "POST",
      {
        id: id,
        toIntegralPaid: true,
      }
    );

    const pdfUrl = res.data.playUrl;
    const pdfName = res.data.name;
    // toast('🎉恭喜您！可解锁兑换该功能');
    uni.showToast({
      title: "🎉恭喜您！可解锁兑换该功能",
      icon: "none",
    });
    setTimeout(() => {
      uni.navigateTo({
        url: `/subpackage/documentDetail/documentDetail?pdfUrl=${pdfUrl}&templateId=${id}&pdfName=${pdfName}`,
      });
    }, 1000);
  } catch (e) {
    console.log(e);
  }
};
const handleBuyVip = function () {
  if (!userInfo.value.isTeenager) {
    showBuyPopup(1, true);
  } else {
    toast("青少年模式下无法购买");
  }
};

const buyPopup = ref();
const showBuyPopup = (typeId = 0, isOnly = false, id) => {
  buyPopup.value.show(typeId, isOnly, isVip.value, true, id);
};
</script>

<style lang="scss" scoped>
.topTitle {
  display: flex;
  align-items: center;
  font-size: 18px;
  padding: 110rpx 0 20rpx 30rpx;
}
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 32rpx;
    margin-top: 42rpx;
    .item {
      width: 320rpx;
      height: 448rpx;
      opacity: 1;
      // border-radius: 8rpx;
      border-radius: 10rpx;
      overflow: hidden;
      margin-bottom: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      background-color: #fff;
      .title {
        align-self: flex-start;
        font-size: 28rpx;
        font-weight: 1000;
        padding-left: 20rpx;
        flex: 1;
      }
      .tag {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        width: 100rpx;
        height: 30rpx;
        font-size: 24rpx;
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-bottom-left-radius: 10rpx;
        image {
          width: 30rpx;
          height: 30rpx;
          margin-left: 10rpx;
        }
        &.vip {
          background: rgba(254, 221, 132, 1);
          color: rgba(88, 54, 0, 1);
        }
        &.integral {
          background: rgba(42, 130, 228, 1);
          color: rgba(255, 244, 244, 1);
        }
      }
      .thumbnail {
        width: 254rpx;
        height: 332rpx;
        overflow: hidden;
        opacity: 1;
        background: rgba(255, 255, 255, 1);
        margin: 30rpx 0;
        image {
          width: 254rpx;
          height: 332rpx;
        }
      }
      .collect {
        width: 40rpx;
        height: 40rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .nomore {
    text-align: center;
    font-size: 24rpx;
    font-weight: 400;
    color: rgba(204, 204, 204, 1);
    margin-bottom: env(safe-area-inset-bottom);
    margin-top: 30rpx;
  }
}
.sticky {
  height: 90rpx;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 18rpx;
  .VIcon {
    width: 100rpx;
    height: 30rpx;
    display: flex;
    justify-self: center;
    align-items: center;
    padding: 0 30rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .text {
    flex: 1;
    font-size: 28rpx;
  }
  .vipText {
    flex: 1;
    font-size: 28rpx;
    color: #99784b;
  }
  .rights {
    padding-right: 30rpx;
    font-size: 28rpx;
    font-weight: 400;
  }
}
</style>
