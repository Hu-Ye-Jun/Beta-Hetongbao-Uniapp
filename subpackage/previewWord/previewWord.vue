<template>
  
  <view class="share-btn">
	<button
    hover-class="none"
    open-type="share"
    @tap="handleShare"
	class="btn"
  >
    分享
	</button>
	<image src="https://cdn.law.xiaomugua.cn/minip/contract_share_icon.png" class="img"></image>
  </view>
  <watermarker
    :font_color="
      userId ? 'rgba(201, 201, 201, 0.5)' : 'rgba(201, 201, 201, 0.7)'
    "
    v-if="reviewDetail || reviewDetail.length > 0"
    :rotate="-20"
    :spacing="userId ? 3 : 1"
    :info="
      userId
        ? '此结果由木瓜AI合同宝审核生成'
        : '此结果由木瓜合同宝审核生成，\n供参考登录后，您将获得更清晰的审核结果展示'
    "
    :watermark="userId ? 100 : 250"
    :width="windowWidth"
    :height="'100vh'"
    class="watermarker"
  />
  <!-- <watermarker
		:font_color="userId ? 'rgba(201, 201, 201, 0.5)' : 'rgba(201, 201, 201, 0.7)'"
		:rotate="-20"
		v-for="item in 2"
		:key="item"
		:info="userId ? '此结果由木瓜AI合同宝审核生成' : '此结果由木瓜合同宝审核生成，\n仅供参考登录后，您将获得更清晰的审核结果展示'"
		:spacing="userId ? 3 : 1"
		:watermark="userId ? 100 : 250"
		:width="windowWidth"
		:height="'100vh'"
		class="watermarker"
	/> -->
  <view class="resols-box">
    <view class="title">
      {{ fileName }}
    </view>
    <view class="result">审核结果（{{ num }}）</view>
    <!-- {{reviewDetail}} -->
    <view class="collapse" v-for="item in reviewDetail" :key="item">
      <view class="result-title">{{ item.businessRisk }}</view>
      <view class="collapse-title">
        <view class="subtitle">解释说明</view>
        <view class="text">
          {{ item.details.proposedChanges }}
        </view>
      </view>
      <view class="collapse-title">
        <view class="subtitle">
          <span class="suggestion">修改建议</span>
        </view>
        <view class="text">
          {{ item.details.modifiedContent }}
        </view>
      </view>
      <view class="collapse-title">
        <view class="subtitle">相关法规</view>
        <view class="text">
          {{ item.details.relatedRegulation }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad, onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import { getConversationFile, getContractById } from "@/api/upload.js";
import { shareView } from "@/api/operation.js";
// const shareState=ref(false)
const reviewDetail = ref([]);
const num = ref(0);
const userId = ref("");
const conversationId = ref("");
const fileName = ref("");
const linkUrl = ref("");
const reviewNum = ref(0);
const updatafileName = ref("");
const windowWidth = ref(0);
const windowHeight = ref(0);
const handleShare = () => {
	console.log(1);
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
};
onShareAppMessage(() => {
  uni.$u.mpShare = ref({
    title: fileName.value, // 默认为小程序名称
    path: `/subpackage/previewWord/previewWord?conversationId=${conversationId.value}`, // 默认为当前页面路径
    imageUrl: "https://cdn.law.xiaomugua.cn/minip/mugua-ai.png", // 默认为当前页面的截图
  });
  return {
    path: `/subpackage/previewWord/previewWord?conversationId=${conversationId.value}`,
    title: fileName.value,
    success: (res) => {
      console.log("分享成功onShareAppMessage", res);
      // 这里可以进行成功的回调处理，例如发送分享成功的统计到服务器
    },
    fail: (err) => {
      console.log("分享失败onShareAppMessage", err);
    },
  };
});

const getSystemInfo = () => {
  uni.getSystemInfo({
    success: function (res) {
      windowWidth.value = res.windowWidth;
      windowHeight.value = res.windowHeight;

      // console.log('屏幕宽度:', screenWidth);
      // console.log('屏幕高度:', screenHeight);
      // console.log('窗口宽度:', windowWidth.value);
      // console.log('窗口高度:', windowHeight.value);
    },
  });
};
onLoad(async (e) => {
  console.log(e, "onload");
  conversationId.value = e.conversationId;
  userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  getSystemInfo();
  if (userId.value) {
    await getContractById(e.conversationId).then((res) => {
      console.log(res, "getContractById");
      reviewDetail.value = res.data.contractReviewHistoryRecord.reviewDetail;
      num.value = res.data.contractReviewHistoryRecord.reviewDetail.length;
    });
    await getConversationFile(e.conversationId)
      .then((res) => {
        console.log(res, "getConversationFile");
        if (res.code === 200) {
          updatafileName.value = res.data[0].fileName;
          fileName.value = res.data[0].fileName.split(".").shift();
        } else {
          uni.showToast({
            title: res.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    await shareView(e.conversationId).then((res) => {
      if (res.code === 200) {
        console.log(res, "shareView");
        reviewDetail.value = res.data.reviewDetail;
        num.value = res.data.reviewDetail.length;
      }
    });
  }
});
</script>

<style lang="scss" scoped>
.watermarker {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1; // 确保水印在最底层
  pointer-events: none; // 确保水印不影响用户交互
}

.resols-box {
  z-index: 10; // 保证内容在水印之上
  position: relative; // 让它覆盖在水印上
  width: 100%;
  margin: 30rpx;

  .title {
    font-size: 40rpx;
    font-weight: 700;
    text-align: center;
  }

  .result {
    font-size: 36rpx;
    font-weight: 600;
  }

  .collapse {
    .result-title {
      margin-top: 36rpx;
      font-size: 32rpx;
      font-weight: 600;
    }

    .subtitle {
      margin-top: 26rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .text {
      padding-top: 10rpx;
      width: 90%;
      font-size: 24rpx;
      font-weight: 400;
      word-wrap: break-word;
      color: rgba(51, 51, 51, 1);
    }
  }
}

.share-btn {
  display: flex;
  justify-content: flex-end;
  z-index: 20; // 确保按钮在最上层
  position: fixed;
  bottom: 77rpx;
  right: 65rpx;
  width: 152rpx;
  height: 152rpx;
  .btn{
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  opacity: 0;
  }
  .img{
	  width: 152rpx;
	  height: 152rpx;
  }
}

.suggestion {
  background-color: #bcdcff;
}
</style>
