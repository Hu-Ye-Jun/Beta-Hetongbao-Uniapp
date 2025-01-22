<template>
  <view class="container">
    <view class="topBg">
      <image
        class="bgImg"
        src="https://cdn.law.xiaomugua.cn/minip/templateBg.png"
      ></image>
    </view>
    <view class="header">
      <view class="navBar">
        <view class="navIcon" @tap="handleGoBack">
          <u-icon size="24" name="arrow-left" color="#000"></u-icon>
        </view>
        <view class="navText"
          >收藏合同模板（{{ collectionTemplateList.length }}）</view
        >
      </view>
    </view>
    <view class="list">
      <view
        class="historyItem"
        v-if="collectionTemplateList && collectionTemplateList.length > 0"
        v-for="(item, index) in collectionTemplateList"
        :key="item.id"
      >
        <view class="thumbnail" @tap="handledetail(item.templateId)">
          <image :src="getTemplateImg(index)" mode="aspectFill"></image>
          <image
            class="templateType"
            :src="getTemplateTypeImg(item.suffixName)"
            mode="aspectFill"
          ></image>
        </view>
        <view class="info">
          <view style="flex: 1" @tap="handledetail(item.templateId)">
            <view class="historyTitle">
              {{ item.contractTemplate.name }}
            </view>
            <view class="time">{{ dateToMinute(item.collectionTime) }}</view>
            <view class="tagBox">
              <view style="width: 64rpx; height: 36rpx">
                <image
                  src="https://cdn.law.xiaomugua.cn/minip/freeIcon.png"
                  style="width: 100%; height: 100%"
                  v-if="item.buyTypeId === 1"
                ></image>
                <image
                  src="https://cdn.law.xiaomugua.cn/minip/pointIcon.png"
                  style="width: 100%; height: 100%"
                  v-else-if="item.buyTypeId === 2"
                ></image>
                <image
                  src="https://cdn.law.xiaomugua.cn/minip/VIPIcon.png"
                  style="width: 100%; height: 100%"
                  v-else-if="item.buyTypeId === 3"
                ></image>
                <text class="tag integral" v-else-if="item.buyTypeId === 4">{{
                  item.buyTypeName
                }}</text>
              </view>
              <view @tap.stop="handledelect(item.templateId)" class="btnBox">
                <image
                  src="https://cdn.law.xiaomugua.cn/minip/collectDel.png"
                  style="width: 30rpx; height: 30rpx; margin-right: 8rpx"
                ></image>
                <text>删除</text>
              </view>
            </view>
          </view>
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
        <text>暂无收藏模版</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { request } from "@/utils/request.js";
import toast from "@/libs/function/toast.js";
import { dateToChinese, dateToMinute } from "@/utils/formDate.js";

const swipeAction = ref();

const collectionTemplateList = ref([]);
const userId = ref();
const toIntegralPaid = ref(false);

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

onLoad(() => {
  userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  getContractTemplateByTypeId();
});

const handleGoBack = () => {
  uni.navigateBack({
    delta: 1,
  });
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

// 获取收藏模板
async function getContractTemplateByTypeId() {
  try {
    const res = await request(
      "/api2/contractTemplate/getCollectionTemplateList",
      "POST",
      {
        userId: userId.value,
        // "userId":"ojPgh7Y69kJmA981Rl27rGMtrD2g"
      }
    );
    if (res) {
      if (res.data) {
        collectionTemplateList.value = res.data;
      } else throw new Error(res.message);
    } else throw new Error();
  } catch (e) {
    console.log(userId);
    console.log(e);
    collectionTemplateList.value = [];
    if (e.message) toast(e.message);
    else toast("加载失败");
  }
}

// 查看详情
const handledetail = async function (id) {
  if (!userId.value) {
    return uni.navigateTo({
      url: "/pages/login/login",
    });
  }

  try {
    const res = await request(
      "/api2/contractTemplate/getContractTemplateById",
      "POST",
      {
        id: id,
        toIntegralPaid: toIntegralPaid.value,
      }
    );

    const pdfUrl = res.data.playUrl;
    const pdfName = res.data.name;
    uni.navigateTo({
      url: `/subpackage/documentDetail/documentDetail?pdfUrl=${pdfUrl}&templateId=${id}&pdfName=${pdfName}`,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 24012) {
      uni.showModal({
        content: err.message,
        showCancel: true,
        success: async (res) => {
          if (res.confirm) {
            toIntegralPaid.value = true;
            try {
              const res = await request(
                "/api2/contractTemplate/getContractTemplateById",
                "POST",
                {
                  id: id,
                  toIntegralPaid: toIntegralPaid.value,
                }
              );
              const pdfUrl = res.data.playUrl;
              uni.navigateTo({
                url: `/subpackage/documentDetail/documentDetail?pdfUrl=${pdfUrl}&templateId=${id}`,
              });
            } catch (err) {
              console.log(err);
              uni.showToast({
                icon: "none",
                title: err.message,
              });
            } finally {
              toIntegralPaid.value = false;
            }
          } else if (res.cancel) {
            console.log("用户点击了取消");
          }
        },
      });
    } else {
      toast(err.message);
    }
  }
};
// 取消收藏
const handledelect = async function (id) {
  console.log(id);
  uni.showModal({
    title: "提示",
    content: "是否删除该收藏模版",
    success: async (res) => {
      if (res.confirm) {
        try {
          const res = await request(
            "/api2/contractTemplate/collectionTemplate",
            "POST",
            {
              templateId: id,
            }
          );
          if (res.code === 200) {
            getContractTemplateByTypeId();
            toast("删除成功");
          } else throw new Error(res.message);
        } catch (e) {
          if (e.message) toast(e.message);
          else toast("加载失败");
        }
      } else {
        //点击取消按钮
        console.log("点击取消按钮");
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  position: relative;
  background-color: #fff;
  .topBg {
    height: 180rpx;
    width: 100%;
    padding-top: 110rpx;
    position: absolute;
    pointer-events: none;
    .bgImg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
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
    padding: 40rpx 30rpx;
    padding-top: 6vh;

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

    .history {
      font-size: 36rpx;
      color: #141414;
      font-weight: 600;
    }

    .relo {
      padding: 10rpx;
      font-size: 28rpx;
      color: rgba(89, 89, 89, 0.45);
      font-weight: 400;
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
    position: relative;
    overflow: hidden;

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
    .tag {
      position: absolute;
      top: 0;
      right: 0;
      width: 108rpx;
      height: 50rpx;
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
      flex: 1;
      align-items: center;
      justify-content: space-between;
      .historyTitle {
        max-width: 70%;
        flex-flow: wrap;
        word-wrap: break-word;
      }
      .time {
        font-weight: 400;
        font-size: 24rpx;
        color: #787878;
        margin-bottom: 10rpx;
      }
      .tagBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btnBox {
          padding: 10rpx 25rpx;
          background-color: #f2f6f9;
          border-radius: 15rpx;
          cursor: pointer;
          font-size: 26rpx;
          display: flex;
          align-items: center;
        }
        .tag {
          width: 72rpx;
          height: 40rpx;
          font-size: 20rpx;
          font-weight: 400;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          border-radius: 6rpx;
          &.vip {
            background: rgba(254, 221, 132, 1);
            color: rgba(88, 54, 0, 1);
          }
          &.integral {
            background: rgba(42, 130, 228, 1);
            color: rgba(255, 244, 244, 1);
          }
        }
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
}

:deep(.uni-swipe_button-group) {
  top: 30%;
}

:deep(.uni-swipe_button) {
  width: 88rpx;
  height: 88rpx;
  padding: 0;
  border-radius: 50%;
  background: rgba(232, 86, 86, 1);
}
</style>
