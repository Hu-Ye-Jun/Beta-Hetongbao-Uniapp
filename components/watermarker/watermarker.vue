<template>
	<view class="mainbox" :style="{ width: width + 'px', height: height }">
		<view class="make" :class="['make_position', posi]">
			<view class="list" :style="{ transform: 'rotate(' + rotate + 'deg)' }">
				<view class="item" v-for="i in watermark" :key="i" :style="{ padding: spacing * 10 + 'rpx', color: font_color }">
					<text>{{ info }}</text>
				</view>
			</view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
export default {
	props: {
		watermark: {
			type: Number,
			default: 100
		},
		font_color: {
			type: String,
			default: 'rgba(220, 220, 220, 0.3)'
		},
		spacing: {
			type: Number,
			default: 1
		},
		width: {
			type: Number,
			default: 120
		},
		height: {
			type: String,
			default: '120px'
		},
		rotate: {
			type: Number,
			default: 45
		},
		posi: {
			type: String,
			default: 'fixed' // 修改为 fixed
		},
		info: {
			type: String,
			default: '此结果由木瓜AI合同宝审核生成'
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
.mainbox {
	position: relative;
	width: 100vw;
	height: 100vh;
}
.make {
	overflow: hidden;
	position: fixed; // 修改为 fixed
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	pointer-events: none;
	.list {
		width: 500%;
		height: 400%;
		position: absolute;
		top: -50%;
		left: -50%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		pointer-events: none;
		.item {
			font-size: 15px;
			font-weight: bold;
			pointer-events: none;
		}
	}
}
</style>
