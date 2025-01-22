<template>
  <view class="container">
    <view class="topBg">
      <view class="topTitle">
        <image
          @tap="handleGoBack"
          style="
            width: 18rpx;
            height: 30rpx;
            margin-right: 20rpx;
            transform: rotate(180deg);
            z-index: 2;
          "
          src="https://cdn.law.xiaomugua.cn/minip/back.png"
          mode="scaleToFill"
        ></image>
        <view>我的邀请码</view>
      </view>
      <image
        class="bgImg"
        src="https://cdn.law.xiaomugua.cn/minip/templateBg.png"
      ></image>
    </view>
    <view class="barBox">
      <view class="avatarImg">
        <image
          style="width: 100%; height: 100%"
          src="https://cdn.law.xiaomugua.cn/minip/avatarImg.png"
        ></image>
      </view>
      <view class="userInfo">
        <view class="nickname">{{ nickName }}</view>
        <view class="mobile">{{ userPhoneNameber }}</view>
        <!-- <view>{{ data }}</view> -->
      </view>
      <!-- <view class="invite" @tap="handleRecord">邀请记录</view> -->
    </view>

    <!-- 二维码区域 -->
    <view class="qr-code-section">
      <image
        style="width: 400rpx; height: 60rpx; margin-bottom: 10rpx"
        src="https://cdn.law.xiaomugua.cn/minip/gesture.png"
      ></image>
      <image
        :src="`data:image/png;base64,${sunCode}`"
        class="qr-code"
        mode="aspectFit"
      ></image>
      <!-- 保存和转发操作按钮 -->
      <view class="action-buttons" style="margin-top: 20rpx">
        <button class="btn" @click="saveToAlbum">
          <view
            style="display: flex; align-items: center; justify-content: center"
          >
            <image
              style="width: 35rpx; height: 35rpx; margin-right: 6rpx"
              src="https://cdn.law.xiaomugua.cn/minip/save.png"
            ></image>
            <text>保存</text>
          </view>
        </button>
        <button class="btn" @click="generateShareImage">
          <view
            style="display: flex; align-items: center; justify-content: center"
          >
            <image
              style="width: 35rpx; height: 35rpx; margin-right: 6rpx"
              src="https://cdn.law.xiaomugua.cn/minip/forward.png"
            ></image>
            <text>转发</text>
          </view>
        </button>
      </view>
    </view>

    <view class="recordContent">
      <!-- <view class="recordTitle">邀请记录</view> -->
      <image
        style="width: 280rpx; height: 35rpx"
        src="https://cdn.law.xiaomugua.cn/minip/invitationTitle.png"
      ></image>
      <view class="table-body" v-if="inviteRecords && inviteRecords.length > 0">
        <view
          v-for="(item, index) in inviteRecords"
          :key="index"
          class="table-row"
        >
          <view class="avatarImg">
            <image
              style="width: 100%; height: 100%"
              src="https://cdn.law.xiaomugua.cn/minip/avatarImg.png"
            ></image>
          </view>
          <view class="recordUserInfo">
            <view class="info">
              <view class="nickName">
                {{ item.nickName }}
              </view>
              <view class="creatTime">
                {{ formatDate(item.invitedDate) }}
              </view>
            </view>
            <view class="describe">
              {{ item.contribute }}
            </view>
          </view>
        </view>
      </view>
      <u-empty text="暂无邀请记录" mode="list" v-else></u-empty>
    </view>

    <!-- 邀请记录弹层 -->
    <!-- 		<u-popup :show="show" @close="handleCloseRecord" round="8" mode="bottom" v-show="show" closeable>
			<view class="popup-content">
				<text class="title">邀请记录</text>
				<view class="table-container">
					<view class="table-header">
						<text class="header-cell sort-cell">序号</text>
						<text class="header-cell">用户</text>
						<text class="header-cell">贡献</text>
					</view>
					<scroll-view class="table-body" scroll-y="true" v-if="inviteRecords && inviteRecords.length > 0">
						<view v-for="(item, index) in inviteRecords" :key="index" class="table-row">
							<text class="table-cell sort-cell">{{ index + 1 }}</text>
							<view class="table-cell">
								<text>{{ formatPhone(item.userPhoneNumber) }}</text>
								<br />
								<text class="date">{{ formatDate(item.invitedDate) }}</text>
							</view>
							<text class="table-cell">{{ item.contribute }}</text>
						</view>
					</scroll-view>
					<up-empty mode="list" v-else></up-empty>
				</view>
			</view>
		</u-popup> -->
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { getInviteSunCode, getInviteRecord } from "@/api/user.js";
import toast from "@/libs/function/toast.js";

const { safeAreaInsets } = uni.getSystemInfoSync();
// 获取头部安全距离
const top = computed(() => {
  return safeAreaInsets.top + 24 + "px";
});
const sunCode = ref("");
const open = ref(false);
const show = ref(false);

const inviteRecords = ref([]);
const nickName = ref("");
const userPhoneNameber = ref("");
const data = ref("");
// 用于格式化手机号
const formatPhone = (phone) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
};

const handleGoBack = () => {
  console.log("back");
  uni.navigateBack({
    delta: 1,
  });
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

onLoad((option) => {
  console.log(option, "option");
  nickName.value = option.nickName ? option.nickName : "用户名";
  userPhoneNameber.value = option.userPhoneNumber;
  // data.value = uni.getLaunchOptionsSync().query.scene;
});

onShow(async () => {
  try {
    const sunCodeResponse = await getInviteSunCode();
    const recordResponse = await getInviteRecord();
    console.log(sunCodeResponse, recordResponse);
    sunCode.value = sunCodeResponse.data.qrCode;
    inviteRecords.value = recordResponse.data;
  } catch (err) {
    console.log(err);
    toast(err.message);
    if (err.code === 202) {
      uni.navigateTo({
        url: "/pages/login/login",
      });
    }
  }
});

const handleOpen = () => {
  open.value = true;
};

const handleClose = () => {
  open.value = !open.value;
};

const handleRecord = () => {
  show.value = true;
};

const handleCloseRecord = () => {
  show.value = false;
};

// 显示活动规则
const showRule = () => {
  const rulePopup = ref(null);
  rulePopup.value.open();
};

// 保存二维码到相册
const saveToAlbum = () => {
  // 使用 FileSystemManager 将 base64 数据转成临时文件
  const fs = uni.getFileSystemManager();
  const base64Data = sunCode.value.replace(/^data:image\/\w+;base64,/, "");
  const filePath = `${uni.env.USER_DATA_PATH}/temp_image.png`;

  fs.writeFile({
    filePath,
    data: base64Data,
    encoding: "base64",
    success: () => {
      // 保存图片到相册
      uni.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          uni.showToast({ title: "保存成功", icon: "success" });
        },
      });
    },
    fail: (err) => {
      console.error(err);
      uni.showToast({ title: "保存失败", icon: "none" });
    },
  });
};

// 将 Base64 转换为临时文件
const getTempImagePath = (base64Data, callback) => {
  const fs = wx.getFileSystemManager();
  const filePath = `${wx.env.USER_DATA_PATH}/temp_share_image.png`;
  const data = base64Data.replace(/^data:image\/\w+;base64,/, "");

  fs.writeFile({
    filePath,
    data: data,
    encoding: "base64",
    success: () => {
      callback(filePath);
    },
    fail: (err) => {
      console.error("生成临时文件失败", err);
      wx.showToast({
        title: "生成图片失败",
        icon: "none",
      });
    },
  });
};

// 生成临时图片并触发分享
const generateShareImage = () => {
  getTempImagePath(sunCode.value, (tempFilePath) => {
    // 保存临时文件路径
    wx.setStorageSync("shareImageUrl", tempFilePath);

    // 调用 showShareImageMenu 分享图片
    wx.showShareImageMenu({
      path: tempFilePath,
      success: () => {
        wx.showToast({
          title: "分享成功",
          icon: "success",
        });
      },
      fail: (err) => {
        console.error("分享失败", err);
        wx.showToast({
          title: "分享失败",
          icon: "none",
        });
      },
    });
  });
};
</script>
<style scoped lang="scss">
/* 整体页面布局 */
.container {
  display: flex;
  flex-direction: column;
  background-color: rgba(249, 250, 254, 1);
  box-sizing: border-box;
  height: 100vh;
  .topBg {
    height: 200rpx;
    width: 100%;
    padding-top: 90rpx;
    position: absolute;
    .topTitle {
      display: flex;
      align-items: center;
      font-size: 18px;
      padding: 20rpx 0 0 30rpx;
    }
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
}

.main-title {
  text-align: center;
  /* margin-top: 40rpx; */
  height: 540rpx;
  position: relative;
}

.role {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  color: #fff;
  font-size: 12px;
}

.invite-title {
  font-size: 38rpx;
  font-weight: bold;
  color: #ff3366;
}

.invite-subtitle {
  font-size: 26rpx;
  color: #999;
  margin-top: 10rpx;
}

.stepBox {
  width: 100vw;
  position: relative;
}

/* 三步操作样式 */
.steps {
  position: absolute;
  bottom: -230rpx;
  margin: 0 40rpx;
  width: 90%;
  box-sizing: border-box;
}

.itemText {
  text-align: center;
  margin-bottom: 30rpx;
}

.stepTitle {
  margin-bottom: 15rpx;
  text-align: right;
}

.stepItemBox {
  background-color: #f3f3f3;
  padding: 50rpx 30rpx;
  border-radius: 20rpx;
}

.itemContent {
  display: flex;
  justify-content: space-around;
}

.step-item {
  text-align: center;
  width: 150rpx;
  background: #fff;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10rpx;
}

.step-item text {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
}

/* 二维码区域 */
.qr-code-section {
  text-align: center;
  margin: 30rpx 30rpx;
  background: linear-gradient(180deg, #edf3fd, 10%, #ffffff);
  padding: 50rpx 0;
  padding-top: 60rpx;
  border-radius: 50rpx;
}

.recordContent {
  text-align: center;
  margin: 0 30rpx;
  background: linear-gradient(180deg, #edf3fd, 10%, #ffffff);
  padding: 50rpx 0;
  border-radius: 50rpx;
  .recordTitle {
    font-size: 32rpx;
    font-weight: 700;
    margin-bottom: 20rpx;
  }
  .table-body {
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 0 30rpx;
    .table-row {
      background-color: #f0f3fe;
      border-radius: 16rpx;
      padding: 45rpx;
      display: flex;
      align-items: center;
      margin-top: 20rpx;
      .avatarImg {
        width: 90rpx;
        height: 90rpx;
        margin-right: 24rpx;
      }
      .recordUserInfo {
        flex: 1;
        .info {
          display: flex;
          align-items: center;
          margin-bottom: 15rpx;
          .creatTime {
            margin-left: 15rpx;
            color: #fff;
            background-color: #64c3a6;
            padding: 5rpx 20rpx;
            border-radius: 20rpx;
            font-size: 22rpx;
          }
        }
        .describe {
          text-align: left;
          color: #6a6f75;
          font-size: 24rpx;
        }
      }
    }
  }
}

.qr-code {
  width: 450rpx;
  height: 450rpx;
}

.qr-desc {
  font-size: 22rpx;
  color: #999;
  margin-top: 20rpx;
  line-height: 30rpx;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: space-around;
  width: 70vw;
  margin: 0 auto;
  margin-top: 40rpx;
  .btn {
    width: 200rpx;
    height: 60rpx;
    line-height: 60rpx;
    background: #f3f7fe;
    border-radius: 22rpx;
  }
  .btn::after {
    border: none;
  }
}

.save-btn {
  width: 220rpx;
  background-color: #e5e5e5;
  border-radius: 30rpx;
  margin-right: 30rpx;
}

.share-btn {
  width: 220rpx;
  background-color: #e5e5e5;
  border-radius: 30rpx;
}

.invite-record {
  margin-top: 20rpx;
  text-align: left;
  font-size: 24rpx;
  color: #666;
}

.popup-content {
  padding: 30rpx;
  text-align: center;
  .title {
    margin-bottom: 20rpx;
  }
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

/* 表格容器，限制高度并添加滚动 */
.table-container {
  max-height: 800rpx;
  border: 1rpx solid #eee;
  border-radius: 10rpx;
  overflow: hidden;
}

/* 表头样式 */
.table-header {
  display: flex;
  background-color: #f3f3f3;
  padding: 10rpx 0;
  font-weight: bold;
  height: 60rpx;
  align-items: center;
}

.header-cell {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #333;
}

.date {
  font-size: 12px;
}

.barBox {
  display: flex;
  align-content: center;
  font-size: 30rpx;
  width: 100%;
  font-weight: 700;
  vertical-align: middle;
  position: relative;
  margin-top: 12vh;
  padding: 0 30rpx;
  .avatarImg {
    width: 100rpx;
    height: 100rpx;
    margin-right: 24rpx;
  }
  .nameBox {
    display: flex;
  }
  .nickname {
    max-width: 300rpx;
    white-space: nowrap;
    /* 保证文本不会换行 */
    overflow: hidden;
    /* 超出容器部分隐藏 */
    text-overflow: ellipsis;
    font-size: 40rpx;
    margin-bottom: 20rpx;
  }
  .mobile {
    font-size: 28rpx;
    font-weight: 400;
    color: #6a6f75;
  }
}
</style>
