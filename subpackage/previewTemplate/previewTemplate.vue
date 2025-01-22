<template>
  <view class="contianer">
    <watermarker
      :rotate="-45"
      :info="'木瓜合同宝合同模板'"
      :watermark="200"
      :width="windowWidth - 36"
      :height="'100vh'"
      :spacing="10"
    >
      <!-- <web-view :src="playUrl"></web-view> -->
      <!-- <image :src="playUrl"></image> -->
      <rich-text :nodes="tempHtml"></rich-text>
    </watermarker>
    <view class="buttomMenu">
      <view @click="collect()">
        <image
          src="https://cdn.law.xiaomugua.cn/minip/collect.png"
          mode="aspectFit"
        ></image>
        收藏
      </view>
      <view>
        <image
          src="https://cdn.law.xiaomugua.cn/minip/share.png"
          mode="aspectFit"
        ></image>
        分享
      </view>
      <view>
        <image
          src="https://cdn.law.xiaomugua.cn/minip/download.png"
          mode="aspectFit"
        ></image>
        下载
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import toast from "@/libs/function/toast.js";
import { request } from "@/utils/request.js";

const playUrl = ref(
  "https://beta.law.mugua.team/muguafile/testfile/%E5%8A%B3%E5%8A%A8%E5%90%88%E5%90%8C%EF%BC%88%E5%AE%9A%EF%BC%89.html"
);
const windowWidth = ref(0);
const templateId = ref("");
const tempHtml = ref("");
const userId = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");

const getSystemInfo = () => {
  uni.getSystemInfo({
    success: function (res) {
      windowWidth.value = res.windowWidth;
      // windowHeight.value = res.windowHeight;
      // console.log('屏幕宽度:', screenWidth);
      // console.log('屏幕高度:', screenHeight);
      // console.log('窗口宽度:', windowWidth.value);
      // console.log('窗口高度:', windowHeight.value);
    },
  });
};
onLoad(async (option) => {
  getSystemInfo();
  templateId.value = option.id;
  const res = await uni.request({
    url: playUrl.value,
  });
  tempHtml.value = res.data;
  console.log(res.data);
  // uni.downloadFile({
  //   url: 'https://beta.law.mugua.team/muguafile/privacy/ServiceAgreement.docx',
  //   success: function (res) {
  //     var filePath = res.tempFilePath;
  //     uni.openDocument({
  //       filePath: filePath,
  // 	  fileType:"docx",
  //       showMenu: true,
  //       success: function (res) {
  //         console.log('打开文档成功');
  //       }
  //     });
  //   }
  // });
});

//收藏
async function collect() {
  try {
    const res = await request(
      "/api2/contractTemplate/addCollectionTemplate",
      "POST",
      {
        userId: userId,
        templateId: templateId.value,
      }
    );
    if (res) {
      toast(res.massage);
    }
  } catch (e) {
    toast("加载失败");
    console.log(e);
  }
}
</script>

<style lang="scss">
.container {
  background: rgba(249, 250, 254, 1);
  .watermarker {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1; // 确保水印在最底层
    pointer-events: none; // 确保水印不影响用户交互
  }
}
.buttomMenu {
  position: fixed;
  bottom: 0rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0rpx -8rpx 16rpx rgba(0, 0, 0, 0.04);
  height: 100rpx;
  width: 750rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  z-index: 10;
  view {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 196rpx;
    height: 70rpx;
    opacity: 1;
    border-radius: 40rpx;
    background: rgba(245, 245, 245, 1);
    font-size: 24rpx;
    font-weight: 400;
    image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 4rpx;
    }
  }
}
</style>
