<template>
  <view class="feedback">
    <TopTitle title="意见反馈"></TopTitle>
    <view class="feedback-container">
      <view class="hello-advice-container">
        <h1 class="hello-message">Hello</h1>
        <h3 class="advice-tips">有什么好的建议可以分享下哦～</h3>
      </view>

      <!-- 文本框及图片上传区域 -->
      <view class="textArea">
        <textarea v-model="textContent" 
          placeholder="请填写10-300个字的内容，以便我们为您提供更好的服务">
        </textarea>
        <view class="image-container">
          <!-- 循环展示图片 -->
          <view class="image-wrapper" v-for="(image, index) in tempFilePaths" :key="index">
            <image :src="image" class="uploaded-image"></image>
            <image 
              src="https://cdn.law.xiaomugua.cn/minip/feedBack_error.svg" 
              class="close-pic" 
              @click="removeImage(index)">
            </image>
          </view>
          <!-- 图片上传按钮 -->
          <view 
            v-if="tempFilePaths.length < 3" 
            class="image-upload" 
            @click="chooseImage">
            <image 
			  style="width: 50rpx;height: 50rpx;"
              src="https://cdn.law.xiaomugua.cn/minip/feedBack_addImag.svg" 
              class="upload-icon">
            </image>
            <text class="upload-text">添加图片 {{ tempFilePaths.length }}/3</text>
          </view>
        </view>
      </view>

      <!-- 发送反馈按钮 -->
      <view class="bottom">
        <button @click="sendFeedBack" class="sendFeedback">发送反馈</button>
      </view>
    </view>
  </view>
</template>

<script>
	import {userFeedback} from '../../api/operation.js'
export default {
  data() {
    return {
      tempFilePaths: [], // 图片本地路径存储
	  textContent:'',
	  userId:''
    };
  },
  methods: {
    // 选择本地图片
    chooseImage() {
      const remainingCount = 3 - this.tempFilePaths.length; // 剩余可选图片数量
      uni.chooseImage({
        count: remainingCount,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log('图片选择成功：', res);
          this.tempFilePaths = [...this.tempFilePaths, ...res.tempFilePaths];
        },
        fail: (err) => {
          console.error('图片选择失败：', err);
        },
      });
    },
	// 发送反馈
	sendFeedBack () {
		console.log(1);
		
		userFeedback(this.userId,this.textContent).then ((res) => {
			if (res.code === 200) {
				uni.showToast({
					title:res.message,
					icon:'success'
				});
				setTimeout(() => {
					uni.navigateBack();
				},1500)
			}	
		}).catch((err) => {
			console.log(err);
		}).finally(() => {
			this.textContent = '';
			this.tempFilePaths = [];
		})
	},
    // 移除图片
    removeImage(index) {
      this.tempFilePaths.splice(index, 1);
	  console.log('图片删除成功:',index);
    },
    // 上传图片
    uploadImage() {
      if (this.tempFilePaths.length === 0) {
        uni.showToast({
          title: '请先选择图片',
          icon: 'none',
        });
        return;
      }
      this.tempFilePaths.forEach((filePath) => {
        uni.uploadFile({
          url: 'https://example.com/upload', // 替换为你的上传接口
          filePath: filePath,
          name: 'file',
          formData: { userId: '12345' },
          success: (uploadFileRes) => {
            console.log('上传成功：', uploadFileRes);
          },
          fail: (err) => {
            console.error('上传失败：', err);
          },
        });
      });
    },
  },
  onShow () {
	  this.userId = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
  }
};
</script>

<style lang="scss" scoped>
/* 通用样式 */
body {
  margin: 0;
  padding: 0;
  background-color: #f6f6f6;
}

.feedback {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.header {
  position: relative;
  left: 10%;
  top: 65px;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.back-arrow {
  font-size: 24px;
  margin-right: 10px;
  cursor: pointer;
}

.hello-advice-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: flex-start; /* 左对齐 */
  position: absolute;
  top: 15%; /* 调整到文本框顶部中间的垂直位置 */
  left: 6%; /* 保持左对齐，与图片中一致 */
}

.hello-message {
  font-size: 40px;
  margin-bottom: 10px; /* 调整 Hello 和提示语之间的间距 */
  
}

.advice-tips {
  font-size: 18px;
  color: #666;
  margin-top: 10px; /* 设置与 Hello 之间的垂直间隔 */
  font-weight: 400;
  color: black;
}

/* 调整 textArea 样式 */
.textArea {
  width: 630rpx;
  height: 680rpx;
  background-color: white;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  position: absolute;
  top: 53%; /* 将文本框向下调整 */
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0);
  padding: 20px;
  display: flex;
  flex-direction: column; /* 设置为列布局 */
  justify-content: space-between; /* 顶部和底部分布内容 */
  align-items: flex-start; /* 左对齐 */
}

textarea {
  width: 100%;
  height: 80%; /* 调整文本域高度 */
  border: none;
  outline: none;
  resize: none;
  text-align: left;
  line-height: 1.5;
  font-size: 16px;
}

.textArea::-webkit-input-placeholder {
  color: #999999;
  font-size: 16px;
  text-align: left;
}

/* 图片上传区域样式 */
.image-upload {
  width: 192rpx;
  height: 192rpx;
  background-color: #efefef;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.upload-icon {
  width: 100rpx;
  height: 100rpx;
}

.upload-text {
  color: #999999;
  font-size: 14px;
  margin-top: 8px;
}

.bottom {
  display: flex;
  justify-content: center;
}
.image-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px; /* 图片间隔 */
}

.image-wrapper {
  position: relative;
  width: 192rpx; /* 与上传区域保持一致 */
  height: 192rpx; /* 与上传区域保持一致 */
  border-radius: 8px;
  background-color: #f6f6f6; /* 背景色以防图片未加载 */
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片内容适配区域 */
  border-radius: 8px;
}

.close-pic {
  position: absolute;
  top: -25rpx;
  right: -25rpx;
  width: 50rpx;
  height: 50rpx;
  cursor: pointer;
  z-index: 10;
  pointer-events: auto;
}

.sendFeedback {
  width: 670rpx;
  background-color: #546ceb;
  border-radius: 10px;
  position: absolute;
  bottom: 30px;
  color: white;
  height: 66px;
  cursor: pointer;
  line-height: 66px;
}
</style>

