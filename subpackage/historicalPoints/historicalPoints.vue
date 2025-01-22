
<script setup>
	import {ref,reactive} from 'vue';
	import {getIntegralDesc} from '../../api/user.js';
	//ref：可以定义任意类型的响应式数据，包括基本数据类型和对象。对于对象或数组，必须通过 .value 访问。
	//reactive：只能用来定义对象类型（如对象、数组、Map、Set等）的响应式数据，直接返回代理对象。
	const historyItem = ref([]);
	
	// 格式化时间
	const formatTime = (time) => {
	  const date = new Date(time);
	  const year = date.getFullYear();
	  const month = String(date.getMonth() + 1).padStart(2, '0');
	  const day = String(date.getDate()).padStart(2, '0');
	  const hours = String(date.getHours()).padStart(2, '0');
	  const minutes = String(date.getMinutes()).padStart(2, '0');
	  const seconds = String(date.getSeconds()).padStart(2, '0');
	  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	};
	// 请求方法
	const fetchHistoryItem = async () => {
	  try {
	    const response = await getIntegralDesc();
		console.log(response);
	    if (response.code === 200 && response.data) {
	      // 接口数据 更新到 historyItem
	      historyItem.value = response.data.map(item => ({
	        id: item.id,
	        historyTitle: item.content, 
	        historyTime: formatTime(item.createTime), 
	        historyPoints:item.integralChange, 
	        pointsIcon: 'https://cdn.law.xiaomugua.cn/minip/register_points.png', 
	      }));
	    } else {
	      console.error('请求错误:', response.message);
	    }
	  } catch (error) {
	    console.error('获取历史积分失败:', error);
	  }
	};
	// 获取	
	fetchHistoryItem();
</script>

<template>
	<view class="topBar">
		<TopTitle title="积分历史"></TopTitle>
	</view>
	<view class="container">
		<view v-for="item in historyItem" class="history-item" :key="item.id">
			<view class="item-left">
				<view class="left-content">
					<view class="item-title">{{item.historyTitle}}</view>
					<view class="item-time">
						{{item.historyTime}}
					</view>
				</view>
			</view>
			<view class="item-right">
				<view class="right-content">
					<!-- 动态设置样式 需要在样式外面包裹大括号,样式之间用逗号隔开而不是分号 -->
					<text :style="{color: item.historyPoints < 0 ? 'red' : 'black', marginRight: '10rpx'}">
							{{ item.historyPoints > 0 ? '+' : '' }}{{ item.historyPoints }}
					</text>
					<image v-bind:src="item.pointsIcon" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.topBar {
	background-color: white;
}	

.container {
	height: 100%;
	width: 100%;
	position: absolute;
	top:12%;
	
}
.history-item {
    height: 150rpx;
    display: flex;
    background-color: white;
    position: relative; 

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 6%; 
        width: 95%; 
        border-bottom: 1px solid #e0e0e0;
    }

    .item-left {
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        width: 50%;
        margin-left: 12rpx;
        flex-direction: column;
        justify-content: center;
        position: relative;

        .left-content {
            position: absolute;
            left: 9%; 
        }

        .item-title {
            font-size: 37rpx;
			margin-bottom: 10rpx;
        }

        .item-time {
            opacity: 0.6;
        }
    }

    .item-right {
        width: 50%;
        display: flex;
        align-items: center;
        background-color: white;
        position: relative;

        .right-content {
            position: absolute;
            right: 6%;
            display: flex;
            align-items: center;
            font-size: 35rpx;
        }

        image {
            width: 40rpx;
            height: 40rpx;
        }
    }
}
</style>
