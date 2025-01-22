<template>
  <view class="title-container">
    <TopTitle title="青少年模式"></TopTitle>
  </view>

  <!-- 青少年模式未开启页面 -->
  <view v-if="!isTeenModeEnabled && !showSetPasswordPage && !showConfirmClosePage && !showEnterPasswordPage && !showOldPasswordPage && !showNewPasswordPage" class="teenMode">
    <view class="top-imgArea">
      <image class="teenImg" src="https://cdn.law.xiaomugua.cn/minip/teenMode_back.png" mode="aspectFit"></image>
    </view>
    <view class="bottom-textArea">
      <view class="teenMode-state">青少年模式未开启</view>
      <view class="details-content">
        <view class="detail-item">
          <view class="bullet-point"></view>
          在青少年模式中，无法进行充值、购买等行为
        </view>
        <view class="detail-item second-item">
          <view class="bullet-point"></view>
          进入青少年模式需设置密码，并使用密码开启和关闭
        </view>
      </view>
      <view class="btn-container">
        <button class="enable-btn" @click="goToSetPasswordPage">开启青少年模式</button>
      </view>
    </view>
  </view>

  <!-- 设置密码页面 -->
  <view v-if="showSetPasswordPage" class="setPasswordPage">
    <view class="container">
      <view class="title">设置密码</view>
      <view class="tips1">请输入密码</view>
      <view class="password-input-box">
        <input ref="input0" type="password" class="password-input" maxlength="1" v-model="password[0]" @input="checkPasswordCompletion"  />
        <input ref="input1" type="password" class="password-input" maxlength="1" v-model="password[1]" @input="checkPasswordCompletion"  />
        <input ref="input2" type="password" class="password-input" maxlength="1" v-model="password[2]" @input="checkPasswordCompletion" />
        <input ref="input3" type="password" class="password-input" maxlength="1" v-model="password[3]" @input="checkPasswordCompletion" />
      </view>
      <view style="position: absolute;top: 39%;" class="hint">关闭青少年模式时，需输入该密码</view>
    </view>
  </view>

  <!-- 青少年模式已开启页面 -->
  <view v-if="isTeenModeEnabled && !showSetPasswordPage && !showConfirmClosePage && !showEnterPasswordPage && !showOldPasswordPage && !showNewPasswordPage" class="teenMode">
    <view class="top-imgArea">
      <image class="teenImg" src="https://cdn.law.xiaomugua.cn/minip/teenMode_back.png" mode="aspectFit"></image>
    </view>
    <view class="bottom-textArea">
      <view class="teenMode-state">青少年模式已开启</view>
      <view class="details-content">
        <view class="detail-item">
          <view class="bullet-point"></view>
          在青少年模式中，无法进行充值、购买等行为
        </view>
        <view class="detail-item second-item">
          <view class="bullet-point"></view>
          进入青少年模式需设置密码，并使用密码开启和关闭
        </view>
      </view>
      <view class="btn-container">
        <button class="enable-btn" @click="goToConfirmClosePage">关闭青少年模式</button>
      </view>
      <view style="margin-top: 30rpx;" class="updatePassword" @click="goToUpdatePasswordPage">
        修改密码
      </view>
    </view>
  </view>

  <!-- 确认关闭页面 -->
  <view v-if="showConfirmClosePage" class="teenMode">
    <view class="top-imgArea">
      <image class="teenImg" src="https://cdn.law.xiaomugua.cn/minip/teenMode_back.png" mode="aspectFit"></image>
    </view>
    <view class="bottom-textArea">
      <view class="teenMode-state">退出后将解除内容限制</view>
      <view class="details-content">
        <view class="detail-item">
          <view class="bullet-point"></view>
          在青少年模式中，无法进行充值、购买等行为
        </view>
        <view class="detail-item second-item">
          <view class="bullet-point"></view>
          进入青少年模式需设置密码，并使用密码开启和关闭
        </view>
      </view>
      <view class="btn-container">
        <button class="enable-btn" @click="goToEnterPasswordPage">确认关闭</button>
      </view>
    </view>
  </view>

  <!-- 请输入密码页面 -->
  <view v-if="showEnterPasswordPage" class="setPasswordPage">
    <view class="container">
      <view class="title">请输入密码</view>
      <view class="password-input-box">
        <input ref="input0" type="password" class="password-input" maxlength="1" v-model="password[0]" @input="checkPasswordCompletion" />
        <input ref="input1" type="password" class="password-input" maxlength="1" v-model="password[1]" @input="checkPasswordCompletion" />
        <input ref="input2" type="password" class="password-input" maxlength="1" v-model="password[2]" @input="checkPasswordCompletion" />
        <input ref="input3" type="password" class="password-input" maxlength="1" v-model="password[3]" @input="checkPasswordCompletion" />
      </view>
    </view>
  </view>

  <!-- 修改密码页面（输入原密码） -->
  <view v-if="showOldPasswordPage" class="setPasswordPage">
    <view class="container">
      <view class="title">请输入原密码</view>
      <view class="password-input-box">
        <input ref="input0" type="password" class="password-input" maxlength="1" v-model="password[0]" @input="checkPasswordCompletion" />
        <input ref="input1" type="password" class="password-input" maxlength="1" v-model="password[1]" @input="checkPasswordCompletion" />
        <input ref="input2" type="password" class="password-input" maxlength="1" v-model="password[2]" @input="checkPasswordCompletion" />
        <input ref="input3" type="password" class="password-input" maxlength="1" v-model="password[3]" @input="checkPasswordCompletion" />
      </view>
    </view>
  </view>

  <!-- 修改密码页面（输入新密码） -->
  <view v-if="showNewPasswordPage" class="setPasswordPage">
    <view class="container">
      <view class="title">请输入新密码</view>
      <view class="password-input-box">
        <input ref="input0" type="password" class="password-input" maxlength="1" v-model="password[0]" @input="checkPasswordCompletion" />
        <input ref="input1" type="password" class="password-input" maxlength="1" v-model="password[1]" @input="checkPasswordCompletion" />
        <input ref="input2" type="password" class="password-input" maxlength="1" v-model="password[2]" @input="checkPasswordCompletion" />
        <input ref="input3" type="password" class="password-input" maxlength="1" v-model="password[3]" @input="checkPasswordCompletion" />
      </view>
    </view>
  </view>
</template>

<script setup>
	import { ref,reactive,nextTick } from 'vue';
	import {onShow} from "@dcloudio/uni-app"
	// 更改青少年模式接口
	import {updateTeenagerModel,updateTeenagerPassword,getUserById} from '../../api/user.js';
	// 更改密码接口
	const password = ref(['', '', '', '']);
	const isTeenModeEnabled = ref(false); // 控制青少年模式状态
	// 设置密码页面
	const showSetPasswordPage = ref(false);
	// 确认关闭青少年模式页面
	const showConfirmClosePage = ref(false);
	const showEnterPasswordPage = ref(false);
	const showOldPasswordPage = ref(false);
	const oldPassword = ref();
	const showNewPasswordPage = ref(false);
	// 用一个变量区分当前是否是关闭青少年模式的操作
	const isClosingMode = ref(false);
	// 保存当前有效密码
	const storedPassword = ref('');
	
	// 区分当前是不是修改密码的操作
	const isUpdatePassword = ref(false);
	
	// 跳转到设置密码页面
	const goToSetPasswordPage = () => {
	  
	  password.value = ['','','',''];
	  // 隐藏其他页面
	  showSetPasswordPage.value = true;
	  showConfirmClosePage.value = false;
	  showEnterPasswordPage.value = false;
	  showOldPasswordPage.value = false;
	  showNewPasswordPage.value = false;
	};
	onShow( async () => {
		const userId = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
		const res = await getUserById(userId);
		console.log(res);
		
		if (res.code === 202) {
			uni.navigateTo({
				url:"/pages/login/login",
			})
			return;
		}
		if (res.data.isTeenager) {
			enableTeenMode();
		}else {
			resetToTeenModeDisabled();
		}
	})
	
	// 进入青少年模式后
	const enableTeenMode = async () => {
	 
	  isTeenModeEnabled.value = true;
	  showSetPasswordPage.value = false;
	};
	
	// 确认关闭青少年模式
	const goToConfirmClosePage = () => {
	  showConfirmClosePage.value = true;
	  showSetPasswordPage.value = false;
	  showEnterPasswordPage.value = false;
	  showOldPasswordPage.value = false;
	  showNewPasswordPage.value = false;
	  password.value = ['','','',''];
	};
	
	// 跳转到输入密码页面
	const goToEnterPasswordPage = () => {
	  showEnterPasswordPage.value = true;
	  showConfirmClosePage.value = false;
	  isClosingMode.value = true;
	};
	
	// 跳转到修改密码页面（原密码）
	const goToUpdatePasswordPage = () => {
	  isUpdatePassword.value = true;
	  showOldPasswordPage.value = true;
	  showConfirmClosePage.value = false;
	  showEnterPasswordPage.value = false;
	  showNewPasswordPage.value = false;
	  password.value = ['','','',''];
	};
	
	// 跳转到新密码页面
	const goToNewPasswordPage = () => {
	  password.value = ['','','',''];
	  showNewPasswordPage.value = true;
	  showOldPasswordPage.value = false;
	};
	
	const resetToTeenModeDisabled = () => {
	   // 清空所有页面状态
	    showSetPasswordPage.value = false;
	    showConfirmClosePage.value = false;
	    showEnterPasswordPage.value = false;
	    showOldPasswordPage.value = false;
	    showNewPasswordPage.value = false;
	  
	    // 设置青少年模式未开启
	    isTeenModeEnabled.value = false;
	};
	const toTeenModeDisabled = () => {
	  isTeenModeEnabled.value = false;
	  showSetPasswordPage.value = false;
	  showConfirmClosePage.value = false;
	  showEnterPasswordPage.value = false;
	  showOldPasswordPage.value = false;
	  showNewPasswordPage.value = false;
	};
	
	// 检查密码是否输入完整
	const checkPasswordCompletion = async () => {
	if (password.value.every(p => p !== '')) {
	    
	    // --- 场景1：设置密码 ---
	    if (showSetPasswordPage.value) {
			
	
			try {
				const res = await updateTeenagerModel({
						  isTeenager:true,
						  password:password.value.join(''),
						  
				 })
				uni.showToast({
					title:res.message,
					icon:'success'
				})
				enableTeenMode(); // 切换到青少年模式已开启页面
					      
			} catch (err) {
				uni.showToast({
					title:err.message,
					icon:'error'
				})
			}
		  
	    }
		
	    // --- 场景2：修改密码（输入原密码，直接跳转新密码页面）---
	    if (showOldPasswordPage.value) {
			console.log(password.value.join(''));
			oldPassword.value = password.value.join('');
	      goToNewPasswordPage(); // 切换到输入新密码页面
	      return;
	    }
	
	    // --- 场景3：修改密码（输入新密码后）---
	    if (showNewPasswordPage.value) {
	      storedPassword.value = password.value.join(''); // 更新存储的新密码
		 console.log(oldPassword.value);
		 console.log(storedPassword.value);
			  
		 try {
			 const res = await updateTeenagerPassword({
				  oldPassword:oldPassword.value,
				  newPassword:storedPassword.value,
				  confirmPassword:storedPassword.value
			  })
			 uni.showToast({
				title:res.message,
				icon:'success'
			 })
			  resetToTeenModeDisabled(); // 切换到青少年模式未开启页面
		 } catch (err) {
			 enableTeenMode(); // 切换到青少年模式已开启页面
			 uni.showToast({
			 	title:err.message,
				icon:'error'
			 })
		 }
	     
	      return;
	    }
	
	    // --- 场景4：关闭青少年模式 ---
	    if (showEnterPasswordPage.value) {
			
		 try {
			 const res = await updateTeenagerModel({
			 	isTeenager:false,
			 	password:password.value.join('')
			 })
			 uni.showToast({
			 	title:res.message,
			 	icon:'success'
			 })
			  resetToTeenModeDisabled(); // 切换到青少年模式未开启页面
		 }	catch (err) {
			 uni.showToast({
			 	title:err.message,
			 	icon:'error'
			 })
			  enableTeenMode(); // 切换到青少年模式已开启页面
		 }
	     
	      return;
	    }
	
	    // 清空输入框
	    password.value = ['', '', '', ''];
	  }
	};
	
	
	
	// 提升用户体验
	// 实现输入密码 自动聚焦到下一输入框功能
	
	
	// 实现回车键删除功能同理，自动聚焦到下一目标
	

</script>

<style lang="scss" scoped>

.setPasswordPage {
  display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
    background-color: transparent;
  
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 90%;
      margin-top: 15%;
      padding: 20px;
      background-color: transparent;
      border-radius: 8px;
    }
  
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }
  
    .tips1 {
      font-size: 18px;
      color: #666;
      margin-bottom: 20px;
      text-align: center;
    }
  
    .password-input-box {
      display: flex;
      justify-content: space-between;
      width: 100%;
      max-width: 300rpx;
	  position: absolute;
	  top: 30%;
    }
  
    .password-input {
      width: 60px;
      height: 50rpx;
      text-align: center;
      font-size: 20px;
      border: none;
      outline: none;
      border-bottom: 2px solid #ccc;
	  
    }
	.password-input-box input:not(:last-child) {
	    margin-right: 10px; /* 添加输入框之间的间距 */
	  }
	
  
    .hint {
      font-size: 14px;
      color: #999;
      text-align: center;
      margin-top: 10px;
    }
}

.teenMode {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #f8f9fb;
}

.top-imgArea {
	height: 50%; /* 图片区域占 50% 高度 */
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: transparent;

	.teenImg {
		width: 80%; /* 调整图片的宽度 */
		max-width: 300px;
		object-fit: contain;
	}
}

.bottom-textArea {
	width: 90%;
	padding: 20px 10px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;

	.teenMode-state {
		font-size: 22px;
		font-weight: bold;
		margin-bottom: 20px;
		color: #333;
	}

	.details-content {
		width: 100%;
		margin-bottom: 30px;
	
		.detail-item {
			display: flex;
			align-items: flex-start;
			margin: 10px 0;
			font-size: 16px;
			color: #666;
			line-height: 1.6;
	
			.bullet-point {
				width: 8px;
				height: 8px;
				background-color: #546ceb;
				border-radius: 50%;
				margin-right: 8px;
				margin-top: 6px;
				flex-shrink: 0; /* 防止圆点缩小 */
			}
		}
	
		/* 单独调整第二个条目 */
		.second-item {
			display: flex;
			position: relative;
		}
	
		/* 圆点后文字换行从头开始 */
		.second-item::after {
			// content: "进入青少年模式需设置密码，并使用密码开启和关闭青少年模式";
			display: block;
			text-indent: 0; /* 取消缩进 */
			margin-left: 16px; /* 调整与圆点的距离 */
			line-height: 1.6; /* 确保行间距一致 */
			word-break: break-word;
		}
	}

	.btn-container {
		width: 100%;
		display: flex;
		justify-content: center;
		
		.enable-btn {
			width: 90%;
			padding: 12px 0;
			background-color: #546ceb;
			color: #fff;
			font-size: 20px;
			font-weight: bold;
			text-align: center;
			border: none;
			border-radius: 6px;
			cursor: pointer;
			margin-top: 60rpx;
			cursor: pointer;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
		}
	}
	
}
</style>