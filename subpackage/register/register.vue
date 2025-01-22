<template>
	<TopTitle class="title" title="签到领积分"></TopTitle>
	<view class="sign-in-toGet-Points">
		<view class="task-revenue" style="position: relative;">
			<view class="top-left">
				<view style="color: white;
							position: absolute;
							top: 25rpx;left: 30rpx;
							font-size: large;">
					任务收益
				</view>
				<view class="my-points">
					<image style="height: 30rpx;width: 30rpx;" 
					class="top-jifen-icon" src="https://cdn.law.xiaomugua.cn/minip/register_points.png" mode=""></image>
					<text style="color: #f6f6f6;font-weight: 300;margin-left: 5px;">我的积分</text>
					<view class="points-count" style="font-size: 40px;color: white;">
						{{ integral }}
					</view>
				</view>
				<view style="color: white;opacity: 0.5;
							position: absolute;
							left: 19px;
							bottom: 40px;
							font-size: 23rpx;">
					积分可以用于查看积分类型的合同模版
				</view>
			</view>
			
			<view class="top-right">
				<button @click="goToHistoryPoints" class="history-points">
					<image style="width: 30rpx;height: 30rpx;"
					 src="https://cdn.law.xiaomugua.cn/minip/regsiter_history.png" mode=""></image>
					<text style="">历史积分</text>
				</button>
			</view>
		</view>
		<view class="middle-signTask">
			<view class="middle-top">
				<text>签到任务</text>
				<text style="opacity: 0.3;">未签到领取积分可能会导致断签</text>
				
			</view>
			<view class="middle-content-mid">
				<image class="sign-icon" src="https://cdn.law.xiaomugua.cn/minip/register_points.png" mode=""></image>
				
				<view class="sign-info">
					<view style="font-size: 30rpx;font-weight: bold;">连续签到{{signDay}}天</view>
					<view style="opacity: 0.5;font-size: 25rpx;">点击领取今天奖励</view>
				</view>
				<button @click="signIn"
				 class="sign-button" :disabled="isSignIn" style="font-size: 18px;">{{isSignIn ? '已签到' : '签到'}}</button>
				 <image v-show="signDay === 1"
				  style="width: 100rpx;
				 		height: 40rpx;
						position: absolute;
						top: 88%;left: 13%;"
				  src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
				  <image v-show="signDay === 0"
				   style="width: 100rpx;
				  		height: 40rpx;
						position: absolute;
						top: 88%;left: -1%;"
				   src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
				   <image
					v-show="signDay === 2"
				    style="width: 100rpx;
				   		height: 40rpx;
						position: absolute;
						top: 88%;left: 27%;"
				    src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
					<image
					v-show="signDay === 3"
					 style="width: 100rpx;
							height: 40rpx;
							position: absolute;
							top: 88%;left: 41%;"
					 src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
					 <image
					 v-show="signDay === 4"
					  style="width: 100rpx;
					 		height: 40rpx;
							position: absolute;
							top: 88%;left: 54%;"
					  src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
					  <image
					  v-show="signDay === 5"
					   style="width: 100rpx;
					  		height: 40rpx;
							position: absolute;
							top: 88%;left: 68%;"
					   src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
					   <image
						v-show="signDay === 6"
					    style="width: 100rpx;
					   		height: 40rpx;
							position: absolute;
							top: 88%;left: 82%;"
					    src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>		
						
						<image
						v-show="signDay === 12"
						 style="width: 100rpx;
								height: 40rpx;
								position: absolute;
								top: 280%;left: 13%;"
						 src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
						 <image
						 v-show="signDay === 13"
						  style="width: 100rpx;
						 		height: 40rpx;
								position: absolute;
								top: 280%;left: -1%;"
						  src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
						  <image
						  v-show="signDay === 11"
						   style="width: 100rpx;
						  		height: 40rpx;
								position: absolute;
								top: 280%;left: 27%;"
						   src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
						<image
						v-show="signDay === 10"
						 style="width: 100rpx;
								height: 40rpx;
								position: absolute;
								top: 280%;left: 41%;"
						 src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
						 <image
						 v-show="signDay === 9"
						  style="width: 100rpx;
								height: 40rpx;
								position: absolute;
								top: 280%;left: 54%;"
						  src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
						  <image
						  v-show="signDay === 8"
						   style="width: 100rpx;
								height: 40rpx;
								position: absolute;
								top: 280%;left: 68%;"
						   src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
						   <image
						   v-show="signDay === 7"
							style="width: 100rpx;
								height: 40rpx;
								position: absolute;
								top: 280%;left: 82%;"
							src="https://cdn.law.xiaomugua.cn/minip/register_dayGet.png" mode=""></image>
			</view>
			<scroll-view
			 style="background-image: url('https://cdn.law.xiaomugua.cn/minip/regsiter_Uback.png');
					background-size: 640rpx;
					background-repeat: no-repeat;
					background-position: 45% 65%;
					top: 75%;"
				 class="middle-content-end" scroll-x="true" scroll-with-animation="true">
				
				<view class="sign-path-total"
				 style="display: flex;
				 flex-direction: column;
				 justify-content: space-between;">
					
					<view class="sign-path-top"
							style="display: flex;
							justify-content: space-evenly;
							margin-bottom: 95rpx;">
						
						<view class="reward-day">
							
							<image v-if="signDay >= 1" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else class="reward-icon"  src="https://cdn.law.xiaomugua.cn/minip/register_points.png" mode=""></image>
							<text class="reward-text">5</text>
							<text class="reward-day-label">1天</text>
						</view>
						
						<view class="reward-day" >
							<image v-if="signDay >= 2" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">5</text>
							<text class="reward-day-label">2天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 3" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">10</text>
							<text class="reward-day-label">3天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 4" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">10</text>
							<text class="reward-day-label">4天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 5" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">5</text>
							<text class="reward-day-label">5天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 6" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">5</text>
							<text class="reward-day-label">6天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 7" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">20</text>
							<text class="reward-day-label">7天</text>
						</view>
					</view>
					<view
						  class="sign-path-bottom"
						  style="display: flex;
						  justify-content: space-evenly;
						  position: relative;
						  top: -13rpx;">
						<view class="reward-day">
							<image v-if="signDay >= 14"  src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">50</text>
							<text class="reward-day-label">14天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 13" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">10</text>
							<text class="reward-day-label">13天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 12" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">10</text>
							<text class="reward-day-label">12天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 11" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">10</text>
							<text class="reward-day-label">11天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 10" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">10</text>
							<text class="reward-day-label">10天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 9" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">5</text>
							<text class="reward-day-label">9天</text>
						</view>
						<view class="reward-day">
							<image v-if="signDay >= 8" src="https://cdn.law.xiaomugua.cn/minip/register_signed.png" class="reward-icon"></image>
							<image v-else src="https://cdn.law.xiaomugua.cn/minip/register_points.png" class="reward-icon"></image>
							<text class="reward-text">5</text>
							<text class="reward-day-label">8天</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="bottom-dayTask">
			<view class="bottom-top">
				日常任务
			</view>
			<view class="bottom-content">
				<view class="bottom-content-task">
					<image class="task-icon" src="https://cdn.law.xiaomugua.cn/minip/register_share2.png" mode=""></image>
					<view class="task-info">
						<text class="task-title">分享新用户注册登录</text>
						<text class="task-desc">成功分享给新用户得积分+30</text>
					</view>
					<view class="task-action" @click="goToInvite">去完成</view>
				</view>
				<view class="bottom-content-task">
					<image class="task-icon" src="https://cdn.law.xiaomugua.cn/minip/register_feedback.png" mode=""></image>
					<view class="task-info">
						<text class="task-title">反馈建议</text>
						<text class="task-desc">每日反馈获得积分+10</text>
					</view>
					<view class="task-action" @click="goToFeebBack">去完成</view>
				</view>
			</view>
			</view>
	</view>
</template>

<script>
	import {getContinueSignInResult, continueSignIn, getUserById } from '../../api/user.js';
	
	export default {
	  data() {
	    return {
	      userId: '1', // 用户 ID
	      isSignIn: false, // 签到状态
	      integral: 0, // 用户积分
		  signDay:0
	    };
	  },
	  methods: {
	   getRewardPoints(signDay) {
		  const rewardMap = {
			1: 5,  2: 5,  
			3: 10, 4: 10,
			5: 5,  6: 5,  
			7: 20,
			8: 5,  9: 5,
			10: 10, 11: 10, 12: 10, 13: 10,
			14: 50
		  };
		  return rewardMap[signDay] || 0; // 默认值 0
		},
	    // 跳转邀请页面
	    goToInvite() {
	      uni.navigateTo({
	        url: '/subpackage/invite/invite',
	      });
	    },
		// 跳转反馈页面
		goToFeebBack () {
			uni.navigateTo({
				url:'/subpackage/feedback/feedback'
			});
		},
		// 跳转历史积分
		goToHistoryPoints () {
			uni.navigateTo({
				url:'/subpackage/historicalPoints/historicalPoints'
			});
		},
	
	    // 签到逻辑
	    async signIn() {
			// console.log(1);
	       try {
	          const res = await continueSignIn(this.userId);
	          if (res.code === 200 && res.message === '签到成功') {
	            // 更新本地状态
	            this.isSignIn = true; 
	            
	            // 若没有返回，就手动自增
	            this.signDay++;
				// 获取签到对应的奖励积分
				const rewardPoints = this.getRewardPoints(this.signDay);
				this.integral += rewardPoints;

	      
	            uni.showToast({
	              title: '签到成功！',
	              icon: 'success',
	            });
	          } else {
	            uni.showToast({
	              title: '签到失败',
	              icon: 'error',
	            });
	          }
	        } catch (error) {
	          uni.showToast({
	            title: '网络异常',
	            icon: 'error'
	          });
	        }
	    },
	  },
	
	  // 页面加载时检查签到状态
	  async onShow() {
		
	    this.userId = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
	    
	      // 1. 获取连续签到信息
	      const signResult = await getContinueSignInResult(this.userId);
		  console.log(signResult);
	      // 仅更新当前连续签到天数，不自增
	      this.signDay = signResult.data.signDay;
	      // 2. 获取是否已签到
	      if (this.userId) {
	        try {
	          const res = await getUserById(this.userId);
	          if (res.code === 200) {
	            // 是否已签到（true/false）
	            this.isSignIn = res.data.whether;
	            this.integral = res.data.integral; // 用户积分
	          }
	        } catch (error) {
	          uni.showToast({
	            title: '加载信息失败',
	            icon: 'error'
	          });
	        }
	      }
	  },
	};
</script>

<style lang="scss" scoped>
.sign-in-toGet-Points {
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	
}

.task-revenue,
.middle-signTask,
.bottom-dayTask {
	width: 695.33rpx;
	height: 355rpx;
	border-radius: 7px;
}

.task-revenue {
	background-color: #546ceb;
	display: flex;
	align-items: center;

	.top-left {
		.my-points {
			position: absolute;
			left: 19px;
			top: 30%;
		}
	}
	.top-right {
		.history-points {
			position: absolute;
			border-radius: 20px;
			top: 30%;
			right: 19px;
			display: flex;
			align-items: center;

			image {
				margin-right: 5px;
			}
		}
	}
}
.reward-text {
	margin: 14rpx 0;
	position: relative;
	text-align: center;
	width: 40rpx;
	&::before {
		content: "·";
		position: absolute;
		bottom: -45rpx;
		left: 10rpx;
		font-size: 50rpx;
	}
}
.middle-signTask {
	background-color: white;
	height: 600rpx;
	margin: 20px 0;
	position: relative;

	.middle-top {
		display: flex;
		justify-content: space-around;
		height: 70rpx;
		align-items: center;
		border-bottom: 1px solid #e0e0e0;
	}

	.middle-content-mid {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		position: relative;
	}

	.sign-icon {
		width: 50rpx;
		height: 50rpx;
	}

	.sign-info {
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.sign-button {
		height: 70rpx;
		width: 155rpx;
		border-radius: 5px;
		margin-left: 110px;
		color: #546ceb;
		font-weight: bold;
		background-color: #edf0fe;
		border-color: #546ceb;
		border: none;
		line-height: 70rpx;
		outline: none;
	}

	.middle-content-end {
		display: flex;
		width: 100%;
		overflow-x: scroll;
		white-space: nowrap;
		padding: 20rpx 0;
		margin-top: 20rpx;

		.reward-day {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			margin-right: 30rpx;

			.reward-icon {
				width: 40rpx;
				height: 40rpx;
				margin-bottom: 5rpx;
			}

			.reward-text {
				font-size: 26rpx;
				font-weight: bold;
			}

			.reward-day-label {
				font-size: 20rpx;
				color: #888888;
			}
		}
	}
}

.bottom-dayTask {
	background-color: white;

	.bottom-top {
		height: 35rpx;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		align-items: center;
		font-size: 16px;
		padding: 35rpx;
		// margin-left: 35rpx;
	}

	.bottom-content {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.bottom-content-task {
		display: flex;
		align-items: center; 
		justify-content: space-between;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 15rpx;
	}

	.task-icon {
		width: 50rpx;
		height: 50rpx;
		margin-right: 20rpx;
	}

	.task-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center; 
	}

	.task-title {
		font-size: 30rpx;
		font-weight: bold;
		line-height: 1.5;
	}

	.task-desc {
		font-size: 24rpx;
		color: #888888;
		line-height: 1.5;
		margin-top: 10rpx;
	}

	.task-action {
		width: 155rpx;
		height: 65rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: red;
		border: 1px solid red;
		border-radius: 20px;
		background-color: white;
	}
}
</style>
