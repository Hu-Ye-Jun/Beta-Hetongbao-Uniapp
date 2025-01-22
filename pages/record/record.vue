<template>
  <view class="container">
    <view class="navBar">
      <view class="navIcon" @tap="handleGoBack">
        <u-icon size="24" name="arrow-left" color="#000"></u-icon>
      </view>
      <view class="navText">合同历史记录</view>
    </view>
    <view class="header">
      <view class="history">
        记录
        <text>({{ num }})</text>
      </view>
      <view class="relo" v-if="flag" @tap="() => (flag = false)">
        <image
          src="https://cdn.law.xiaomugua.cn/minip/rubbish.png"
          mode=""
        ></image>
      </view>
      <view v-else @tap="() => (flag = true)">取消</view>
    </view>
    <!-- 		<uni-swipe-action ref="swipeAction" v-if="history && history.length > 0">
			<uni-swipe-action-item v-for="item in history" :key="item.conversationId">
				<view class="content" @tap="handledetail(item.conversationId)">
					<image src="https://cdn.law.xiaomugua.cn/minip/feedback (2).png"></image>
					<view class="title">
						<view class="text">
							{{ item.name }}
						</view>
						<view class="time">
							{{ dateToChinese(item.createDate) }}
						</view>
					</view>
				</view>
				<template v-slot:right>
					<view @tap="handledelect(item.conversationId)" class="round">
						<text class="iconfont icon-shanchu"></text>
					</view>
				</template>
			</uni-swipe-action-item>
		</uni-swipe-action> -->
    <u-checkbox-group
      v-if="history && history.length > 0"
      v-model="checkboxValue"
      @change="checkboxChange"
      iconPlacement="right"
      placement="row"
    >
      <view
        class="historyItem"
        v-for="(item, index) in history"
        :key="item.conversationId"
      >
        <view class="thumbnail" @tap="handledetail(item.conversationId)">
          <image :src="getTemplateImg(index)" mode="aspectFill"></image>
          <image
            class="templateType"
            :src="getTemplateTypeImg(item.suffixName)"
            mode="aspectFill"
          ></image>
        </view>
        <view class="info">
          <view
            style="flex: 1; max-width: 90%"
            @tap="handledetail(item.conversationId)"
          >
            <view class="historyTitle">
              {{ item.name }}
            </view>
            <view class="time"
              >{{
                dateToMinute(item.createDate)
              }}
              &nbsp;&nbsp;来自木瓜合同宝</view
            >
          </view>
          <u-checkbox
            style="width: 50rpx"
            v-if="!flag"
            activeColor="#627FF0"
            :name="item.conversationId"
          ></u-checkbox>
        </view>
      </view>
    </u-checkbox-group>
    <view class="historys" v-else>
      <image
        src="https://cdn.law.xiaomugua.cn/minip/noContent.png"
        mode=""
      ></image>
      <view class="title">暂无记录</view>
    </view>
    <u-tabbar
      v-if="!flag"
      :border="false"
      :fixed="true"
      :placeholder="true"
      :safeAreaInsetBottom="true"
    >
      <u-tabbar-item
        text="删除"
        icon="https://cdn.law.xiaomugua.cn/minip/loginoutIcon.png"
        @click="handleDelete"
      ></u-tabbar-item>
    </u-tabbar>
  </view>
</template>

<script setup>
import { onLoad, onShow, onHide, onShareAppMessage } from "@dcloudio/uni-app";
import { onBeforeUnmount, onUnmounted, ref } from "vue";
import {
  getContractList,
  clearContractHistorys,
  deleteContractHistory,
  batchDeleteContractHistory,
} from "@/api/upload.js";
import { dateToChinese, dateToMinute } from "@/utils/formDate.js";
const userId = ref("");
const history = ref([]);
const num = ref(0);
const isSwipedRight = ref("");
const swipeAction = ref();
const checkboxValue = ref([]);
const flag = ref(true);

const templateImgList = [
  "https://cdn.law.xiaomugua.cn/minip/template1.png",
  "https://cdn.law.xiaomugua.cn/minip/template2.png",
  "https://cdn.law.xiaomugua.cn/minip/template3.png",
  "https://cdn.law.xiaomugua.cn/minip/template4.png",
  "https://cdn.law.xiaomugua.cn/minip/template5.png",
];

const templateTypeImgList = [
  "https://cdn.law.xiaomugua.cn/minip/docx.png",
  "https://cdn.law.xiaomugua.cn/minip/pdf.png",
  "https://cdn.law.xiaomugua.cn/minip/screenshot.png",
];

const checkboxChange = (n) => {
  console.log("change", n);
  console.log(79, checkboxValue.value);
};

const handleGoBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const handleDelete = async () => {
  if (checkboxValue.value && checkboxValue.value.length > 0) {
    const data = checkboxValue.value.join(",");
    await batchDeleteContractHistory(data)
      .then((res) => {
        if (res.code === 200) {
          uni.showToast({
            title: res.message,
            icon: "success",
          });
          getHistoryData();
          flag.value = true;
        } else {
          uni.showToast({
            title: res.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: "error",
        });
      });
  }
};

// 获取模板图片
const getTemplateImg = (index) => {
  // 循环使用 templateImgList 中的图片
  const imgIndex = index % templateImgList.length;
  return templateImgList[imgIndex];
};

const getTemplateTypeImg = (type) => {
  if (type === "docx" || type === "doc") {
    return templateTypeImgList[0];
  } else if (type === "pdf") {
    return templateTypeImgList[1];
  } else {
    return templateTypeImgList[2];
  }
};

// 根据id删除
const handledelect = async (conversationId) => {
  // const index = history.value.findIndex((item) => item.conversationId === conversationId);
  // history.value.splice(index, 1);
  // num.value = history.value.length;
  await deleteContractHistory(conversationId)
    .then((res) => {
      if (res.code === 200) {
        getHistoryData();
        uni.showToast({
          title: res.message,
          icon: "success",
        });
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
};

// 清空历史
const handlereover = () => {
  if (history.value && history.value.length <= 0) return;
  uni.showModal({
    title: "提示",
    content: "是否清空历史记录",
    success: async (res) => {
      if (res.confirm) {
        await clearContractHistorys(userId.value)
          .then((res) => {
            if (res.code === 200) {
              history.value = [];
              num.value = 0;
            } else {
              uni.showToast({
                title: res.message,
                icon: "error",
              });
            }
          })
          .catch((error) => {
            uni.showToast({
              title: "网路波动异常，请检查网络后重试",
              icon: "error",
            });
          });
      }
    },
  });
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

// 历史进入详情
const handledetail = (conversationId) => {
  uni.navigateTo({
    url: `/pages/uploadtext/uploadtext?conversationId=${conversationId}`,
  });
};

const getHistoryData = async () => {
  await getContractList(userId.value)
    .then((res) => {
      if (res.code === 200) {
        history.value = res.data;
        num.value = res.data.length;
      } else {
        history.value = [];
        num.value = 0;
        uni.showToast({
          title: res.message,
          icon: "error",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      history.value = [];
      num.value = 0;
    });
};

onShow(async () => {
  if (swipeAction.value) {
    swipeAction.value.closeAll();
  }
  userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  if (userId.value) {
    getHistoryData();
  } else {
    history.value = [];
    num.value = 0;
  }
});

onHide(() => {
  if (swipeAction.value) {
    swipeAction.value.closeAll();
  }
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  .navBar {
    padding: 0 30rpx;
    padding-top: 6vh;
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
  .historys {
    text-align: center;
    margin: 200rpx auto;

    image {
      width: 240rpx;
      height: 240rpx;
    }

    .title {
      font-size: 36rpx;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 40rpx;
    .history {
      // font-size: 36rpx;
      color: #141414;
      // font-weight: 600;
    }

    .relo {
      width: 26rpx;
      height: 26rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .content {
    display: flex;
    align-content: center;
    margin: 20rpx 40rpx;
    padding: 40rpx;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0px 4px 8px #eee;

    image {
      max-width: 32rpx;
      max-height: 32rpx;
      min-width: 32rpx;
      min-height: 32rpx;

      margin-right: 20rpx;
    }

    .title {
      overflow: hidden;

      .text {
        font-size: 28rpx;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);

        /* 条件三.用省略号代替超出的部分 */
        white-space: nowrap;
        /* 不换行 */
        text-overflow: ellipsis;
        /* 当文本溢出时显示省略号 */
        overflow: hidden;
        /* 隐藏溢出的部分 */
      }

      .time {
        padding-top: 12rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
        vertical-align: top;
      }
    }
  }

  .round {
    width: 88rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    color: #fff;
    font-size: 26rpx;
    border-radius: 50%;
    background-color: rgba(232, 86, 86, 1);
  }
}

.historyItem {
  padding: 0 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100vw;
  margin-bottom: 30rpx;
  .thumbnail {
    min-width: 130rpx;
    height: 180rpx;
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 1px 1px 5px #eff2fe;
    position: relative;
    image {
      width: 100%;
      height: 100%;
    }
    .templateType {
      width: 55rpx;
      height: 20rpx;
      position: absolute;
      bottom: 20rpx;
      right: 15rpx;
    }
  }
  .info {
    margin-left: 50rpx;
    display: flex;
    width: 67vw;
    align-items: center;
    justify-content: space-between;
    .historyTitle {
      max-width: 70%;
      margin-bottom: 20rpx;
      flex-flow: wrap;
      word-wrap: break-word;
    }
    .time {
      font-weight: 400;
      font-size: 24rpx;
      color: #787878;
    }
  }
}

:deep(.uni-swipe_button-group) {
  top: 30%;
  // margin-right: 2rpx;
  // text-align: center;
}

:deep(.uni-swipe_button) {
  width: 88rpx;
  height: 88rpx;
  padding: 0;
  border-radius: 50%;
  background: rgba(232, 86, 86, 1);
}

// :deep(.uni-swipe_text--center) {
// 	display: flex;
// }
</style>
