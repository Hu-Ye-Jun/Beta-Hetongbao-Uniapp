<template>
  <TopTitle title="签到领积分"></TopTitle>
  <view class="invite-container">
    <!-- 背景图片 -->
    <image src="https://cdn.law.xiaomugua.cn/minip/invite_back.png" mode="" class="background-image"></image>

    <!-- 顶部文本区域 -->
    <view class="top-area">
      <view class="invite-new">
        <text class="top-text">邀请好友注册</text>
      </view>
      <view class="inner-text">每成功邀请1人得100积分红包</view>
      <!-- 活动规则按钮 -->
      <view class="rules-btn" @click="openModal">
        <text class="rules-text">活动规则</text>
      </view>
    </view>

    <!-- 模态框 -->
    <view class="modal-container" v-if="showModal">
      <!-- 背景遮罩 -->
      <view class="modal-background" @click="closeModal"></view>

      <!-- 模态框内容 -->
      <view class="modal-content" @click.stop>
        <!-- 图片背景 -->
        <image class="giftimg" src="https://cdn.law.xiaomugua.cn/minip/invite_modelBack.png" mode=""></image>
        <!-- 文字内容 -->
        <view class="modal-text-overlay">
          <view class="modal-title">邀请活动规则</view>
          <view class="modal-text">
            <p><strong style="color: #546ceb;">1. 邀请码有效期：</strong></p>
            <p style="opacity: 0.7;"><text style="opacity: 0;">xxxx</text>您的专属邀请码将永久有效，随时欢迎您分享给亲朋好友。</p>
            <p><strong style="color: #546ceb;">2. 奖励说明：</strong></p>
            <p style="text-indent: 2em;opacity: 0.7;">
              <span style="color: red;opacity: 1;">我们承诺</span>，活动奖励以页面展示为准，确保透明公正。
              每成功邀请一位新用户加入我们的大家庭，您将获得100积分的奖励。
            </p>
            <p><strong style="color: #546ceb;">3. 奖励发放：</strong></p>
            <p style="text-indent: 2em;opacity: 0.7;">
              您的奖励将在您邀请的新用户成功注册后的24小时内自动到账，无需额外操作。
            </p>
          </view>
        </view>
        <!-- 关闭按钮 -->
        <view class="modal-close-btn" @click="closeModal">关闭</view>
      </view>
    </view>

    <!-- 中部区域 -->
    <view class="mid-area" style="background-color: white;">
      <view class="mid-top-text">
        <image src="https://cdn.law.xiaomugua.cn/minip/invite_shareBack.png" mode=""></image>
      </view>
      <view class="mid-content">
        <view class="item1">
          <image src="https://cdn.law.xiaomugua.cn/minip/invite_share.png" mode=""></image>
          <view class="item1-text">分享邀请新人/
		  <view>新人好友</view>
		  </view>
        </view>
        <view class="item2">
          <image src="https://cdn.law.xiaomugua.cn/minip/invite_newUser.png" mode=""></image>
          <view class="item2-text">新人用户注册/
		  <view>登录</view>
		  </view>
        </view>
        <view class="item3">
          <image src="https://cdn.law.xiaomugua.cn/minip/invite_vip.png" mode=""></image>
          <view class="item3-text">获得积分奖励
		  <view style="opacity: 0;">xxx</view>
		  </view>
        </view>
      </view>
    </view>

    <!-- 底部区域 -->
    <view class="bottom-area">
      <view @click="getInviteRecord" class="invite-history">邀请记录</view>
		<view
		 class="sunCode-area"
		  style="width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;">
			<image
			 style="height: 295rpx;
			 width: 295rpx;
			 position: absolute;
			 top: 13%;"
			 class="sunCode" :src="`data:image/png;base64,${sunCodeUrl}`" mode=""></image>
		</view>
      <view class="bottom-content">
        <view class="save" @click="saveSunCode">
          <image src="https://cdn.law.xiaomugua.cn/minip/invite_save.png" mode=""></image>
          <text>保存</text>
        </view>
        <view @click="shareSunCode" class="resend" style="background-color: #ffc0cb;">
          <image src="https://cdn.law.xiaomugua.cn/minip/invite_resend.png" mode=""></image>
          <text>转发</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
	import { getInviteSunCode,getInviteRecord } from '../../api/user.js';
	
	export default {
	  data() {
	    return {
	      showModal: false, // 控制模态框显示
	      sunCodeUrl: '', // 存储太阳码 URL
		  inviteRecord:[]
	    };
	  },
	  methods: {
	    // 显示
	    openModal() {
	      this.showModal = true;
	    },
	    // 隐藏
	    closeModal() {
	      this.showModal = false;
	    },
	  
	    // 获取太阳码
	    async fetchSunCode() {
	      try {
	        const res = await getInviteSunCode();
	        console.log(res);
	        if (res.code === 200 && res.data) {
	          this.sunCodeUrl = res.data.qrCode; // Update Sun Code URL
	        } else {
	          uni.showToast({
	            title: '获取太阳码失败',
	            icon: 'error',
	          });
	        }
	      } catch (error) {
	        console.error('获取太阳码失败:', error);
	        uni.showToast({
	          title: '网络异常',
	          icon: 'error',
	        });
	      }
	    },
	  
	    // 保存太阳码功能
	    saveSunCode() {
	      if (!this.sunCodeUrl) {
	          uni.showToast({
	            title: '没有太阳码可保存',
	            icon: 'none',
	          });
	          return;
	        }
	      
	        // 去掉前缀 "data:image/png;base64," 并将 Base64 转换为临时文件
	        const base64Data = this.sunCodeUrl.replace(/^data:image\/\w+;base64,/, '');
	        const buffer = wx.base64ToArrayBuffer(base64Data);
	      
	        const filePath = `${wx.env.USER_DATA_PATH}/sunCode.png`; // 临时保存路径
	      
	        wx.getFileSystemManager().writeFile({
	          filePath,
	          data: buffer,
	          encoding: 'binary',
	          success: () => {
	            // 保存图片到相册
	            wx.saveImageToPhotosAlbum({
	              filePath,
	              success: () => {
	                uni.showToast({
	                  title: '已保存',
	                  icon: 'success',
	                });
	              },
	              fail: (err) => {
	                console.error('保存到相册失败:', err);
	                uni.showToast({
	                  title: '保存取消',
	                  icon: 'error',
	                });
	              },
	            });
	          },
	          fail: (err) => {
	            console.error('写入文件失败:', err);
	            uni.showToast({
	              title: '保存失败，请重试',
	              icon: 'error',
	            });
	          },
	        });
	    },
	  
	    // 获取邀请记录
	    async getInviteRecord() {
			uni.navigateTo({
				url:"/subpackage/inviteHistory/inviteHistory"
			})
	    //   try {
	    //     const res = await getInviteRecord();
	    //     console.log(res);
	    //     if (res.code === 200 && res.test) {
	    //       this.inviteRecord.push(res.test.combination);
			  // uni.navigateTo({
			  // 	url:"/subpackage/inviteHistory/inviteHistory"
			  // })
	    //     } else {
	    //       uni.showToast({
	    //         title: '获取邀请记录失败',
	    //         icon: 'error',
	    //       });
	    //     }
	    //   } catch (error) {
	    //     console.error('获取邀请记录失败:', error);
	    //     uni.showToast({
	    //       title: '网络异常',
	    //       icon: 'error',
	    //     });
	    //   }
	    },
			// 实现转发功能
		  shareSunCode() {
		    if (!this.sunCodeUrl) {
		      uni.showToast({
		        title: '没有太阳码可转发',
		        icon: 'none',
		      });
		      return;
		    }
		
		    // 调用小程序的转发功能
		    uni.showShareMenu({
		      title: '邀请好友领取积分红包',
		      imageUrl: this.sunCodeUrl, // 使用太阳码图片作为转发封面
		      path: '/pages/invite/invite', // 转发的页面路径
		      success: () => {
		        uni.showToast({
		          title: '转发成功',
		          icon: 'success',
		        });
		      },
		      fail: (err) => {
		        console.error('转发失败:', err);
		        uni.showToast({
		          title: '转发失败',
		          icon: 'error',
		        });
		      },
		    });
		  },
	  },
	
	  // 页面加载完成后获取太阳码
	  onLoad() {
		
	    this.fetchSunCode();
	  },
	};
</script>

<style lang="scss" scoped>
.invite-container {
  position: relative;
  width: 100%;
  height: 100vh; /* 设置容器高度为视口高度 */
  overflow: hidden;

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; /* 图片高度覆盖整个容器 */
    object-fit: cover; /* 确保图片按比例缩放 */
    z-index: -1; /* 确保图片在文本下方 */
  }

  .top-area {
    position: absolute;
    top: 43rpx; /* 调整文本的垂直位置 */
    left: 0;
    width: 100%;
    text-align: center; /* 居中显示文本 */
    z-index: 1; /* 确保文本在图片上方 */
  }

  .top-text {
    font-family: Benmo;
    font-size: 80rpx; /* 调整字体大小 */
    color: #ffffff; /* 设置白色文本颜色 */
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* 添加文本阴影效果 */
  }

  .inner-text {
    color: whitesmoke;
    font-size: 24rpx;
  }

  /* 活动规则按钮样式 */
  .rules-btn {
    position: absolute;
    right: -40rpx; /* 距离右侧边距 */
    top: 150rpx; /* 距离顶部位置 */
    width: 180rpx; /* 按钮宽度 */
    height: 50rpx; /* 按钮高度 */
     background-color: rgba(255, 255, 255, 0.3);
     border-radius: 30rpx;  
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    z-index: 2; /* 确保按钮在内容上方 */
	
  }

  .rules-text {
    color: #ffffff; /* 白色字体 */
    font-size: 26rpx; /* 调整字体大小 */
    opacity: 0.7;
	position: absolute;
	right: 60rpx;
	
  }
  
  .mid-area {
	   width: 93%;
	  height: 290rpx;
	  background-color: white; /* 背景颜色 */
	  position: absolute;
	  top: 33%;
	  left: 50%;
	  transform: translateX(-50%);
	  border-radius: 30rpx; /* 圆角 */
	  position: relative;

  // /* 添加渐变边框 */
	 //  &::before {
		// content: '';
		// position: absolute;
		// top: -2px; /* 边框厚度 */
		// left: -2px; /* 边框厚度 */
		// right: -2px;
		// bottom: -2px;
		// background: linear-gradient(0deg, #B3DBFB, #C2A398); /* 渐变边框 */
		// border-radius: 32rpx; /* 比背景圆角略大 */
		// z-index: -1; /* 确保在背景下 */
	 //  }
	  .mid-top-text {
		  height: 70rpx;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  image {
			  width: 600rpx;
			  height: 55rpx;
			  
		  }
	  }
	  .mid-content {
	    display: flex;
	    justify-content: space-around; /* 均匀分布子项 */
	    align-items: center; /* 子项垂直居中 */
	    height: 220rpx;
		position: relative;
	  
	    .item1, .item2, .item3 {
	      display: flex;
	      flex-direction: column; /* 垂直布局 */
	      align-items: center; /* 居中对齐 */
	      text-align: center; /* 文本居中 */
	      width: 30%; /* 每个模块占 30% 宽度 */
	    }
		
	    image {
	      width: 70rpx;
	      height: 70rpx;
	      margin-bottom: 10rpx; /* 图片与文字的间距 */
	    }
		
	  
	    .item1-text, .item2-text, .item3-text {
	      font-size: 26rpx;
	      color: #333;
	      line-height: 1.5;
		  opacity: 0.6;
	    }
	  }
  }
  .bottom-area {
	  width: 93%;
	  height: 460rpx; /* 保持高度不变 */
	  background-color: white;
	  position: absolute;
	  bottom: 0; /* 保持底部位置 */
	  left: 50%;
	  transform: translateX(-50%); /* 水平居中 */
	  border-radius: 30rpx; /* 保持圆角与 mid-area 一致 */
	  position: relative; /* 确保子元素定位有效 */
	  top: 36%;

  /* 邀请记录布局 */
  .invite-history {
    position: absolute;
    top: 20rpx; /* 距离顶部的间距 */
    right: 20rpx; /* 距离右侧的间距 */
    padding: 10rpx 20rpx;
    font-weight: bold;
    font-size: 35rpx;
    color: #333;
    z-index: 2;
	
  }

  /* 保存和转发按钮布局 */
  .bottom-content {
    position: absolute;
    bottom: 20rpx; /* 距离底部的间距 */
    width: 100%;
    display: flex;
    justify-content: space-around; /* 按钮均匀分布 */
    align-items: center;
	bottom: 35rpx;
	
	
	.content-bottom {
		height: 120rpx;
		width: 100%;
	
		display: flex;
		justify-content: space-around;
		position: absolute;
		top: 90%;
		left: 50%;
		transform: translateX(-50%);
		
		
	}
    .save, .resend {
      display: flex;
      flex-direction: row; 
      align-items: center;
      justify-content: center;
      width: 100rpx; /* 按钮宽度 */
      // text-align: center;
	  height: 50rpx;
	  width: 190rpx;
	  border-radius: 12rpx;
	  background-color: #e7edfd;
	  padding: 10rpx;
	  
	  
	  

      image {
        width: 35rpx;
        height: 35rpx;
        margin-bottom: 5rpx; /* 图片和文字之间的间距 */
		margin-right: 10rpx;
      }

      text {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}
	  .modal-container {
	    position: fixed;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0, 0, 0, 0.5); /* 背景变暗 */
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    z-index: 1000; /* 确保在所有内容之上 */
	  }
	  
	  .modal-background {
	    position: absolute;
	    width: 100%;
	    height: 100%;
	    background-color: transparent;
	  }
	  
	  .modal-content {
	    position: relative;
	    width: 90%;
	    // max-width: 600rpx;
	    border-radius: 20rpx;
	    overflow: hidden; /* 确保内容不会超出边界 */
	    z-index: 1001;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    background-color: transparent;
		height: 900rpx;
	  }
	  
	  .giftimg {
	    width: 100%;
	    height: 100%;
	    position: absolute;
	    top: 0;
	    left: 0;
	    z-index: 1;
	  }
	  
	  .modal-text-overlay {
	    position: relative;
	    z-index: 2; /* 确保文字在图片上方 */
	    padding: 20rpx;
	    text-align: left;
	    color: #333;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		
		
	  }
	  
	  .modal-title {
	    font-size: 40rpx;
	    font-weight: bold;
	    color: #333;
	    text-align: center;
	    margin-bottom: 20rpx;
	  }
	  
	  .modal-text p {
	    font-size: 28rpx;
	    line-height: 1.8;
	    margin: 10rpx 0;
	    color: #666;
	  }
	  
	  .modal-close-btn {
	    width: 85%;
	    height: 80rpx;
	    background-color: #546ceb;
	    color: #fff;
	    font-size: 35rpx;
	    text-align: center;
	    line-height: 80rpx;
	    border-radius: 10rpx;
	    cursor: pointer;
	    margin-top: 20rpx;
	    z-index: 2; /* 确保按钮在图片上方 */
		position: absolute;
		bottom: 45rpx;
	  }
}
</style>
