<template>
	<view class="container">
		<view class="content" v-for="(item,index) in props.text">
			<view class="text left">
				{{item.leftText}}
			</view>
			<view class="text right">
				{{item.rightText}}
			</view>
		</view>
	</view>

</template>

<script setup>

const props=defineProps(["text"])



</script>

<style lang="scss" scoped>
	.container {
		margin-top: 30%;
		padding: 20rpx;

		.content {
			width: 100%;
			display: flex;

			.text {
				word-wrap: break-word;
				word-break: normal;
				padding: 20rpx;
				text-align: center;
				border: 2rpx solid #8DC0DC;
			}

			// background-color: red;
			.left {
				width: 30%;
			}

			.right {
				border-left: none;
				width: 70%;
			}



		}


	}
</style>