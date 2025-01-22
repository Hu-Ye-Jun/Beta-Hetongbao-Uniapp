<template>
	<view class="container">
		<TopTitle title="邀请记录"></TopTitle>
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
		<view class="no-data" v-else>
		  <u-image src="https://cdn.law.xiaomugua.cn/minip/invite_history_no_data.png"></u-image>
		  <view>暂无邀请记录</view>
		</view>
	</view>
</template>

<script setup>
	import { getInviteRecord } from "@/api/user.js";
	import { onShow } from "@dcloudio/uni-app";
	import toast from "@/libs/function/toast.js";
	import { ref } from "vue";
	const inviteRecords = ref([]);
	
	onShow(async () => {
	  try {
	    const recordResponse = await getInviteRecord();
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
	
	// 格式化日期
	const formatDate = (dateStr) => {
	  const date = new Date(dateStr);
	  const year = date.getFullYear();
	  const month = (date.getMonth() + 1).toString().padStart(2, "0");
	  const day = date.getDate().toString().padStart(2, "0");
	  return `${year}-${month}-${day}`;
	};
	
</script>

<style lang="scss">
	.container{
		background-color: #f6f6f6;
		padding: 0 30rpx;
		display: flex;
		flex-direction: column;
		height: 100vh;
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
	
	.no-data {
	    width: inherit;
	    height: 100vh;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    flex-direction: column;
	    u-image {
	      width: 555rpx;
	      height: 363rpx;
	      margin-bottom: 96rpx;
	    }
	    view {
	      font-family: Microsoft YaHei;
	      font-weight: 400;
	      font-size: 41rpx;
	      color: #666666;
	    }
	  
	}
</style>
