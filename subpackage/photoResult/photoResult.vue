<template>
	<view class="container">
		<!-- 拍摄的主要内容 -->
		<view class="content">
			<view class="banner">
				<swiper :current="currentIndex" @change="onSwiperChange">
					<swiper-item v-for="(item, index) in AlbumStore.Album" :key="index">
						<image :src="item" mode="aspectFill" />
					</swiper-item>
				</swiper>
			</view>

			<!-- 页码部分 -->
			<view class="pagination">
				<view
					@click="clickPagenum(index)"
					v-for="(page, index) in displayedPages"
					:key="index"
					:class="['page', { active: page === currentIndex + 1 }]"
					:style="{ backgroundColor: page >= 0 ? '#fff' : '' }"
				>
					{{ page }}
				</view>
			</view>

			<!-- 识别结果的展示 -->
			<view class="result">
				<scroll-view :scroll-y="true" class="text" style="padding-bottom: 100rpx">
					<view>
						<mp-html :content="html" :editable="false" />
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer">
			<view class="backEdit" @click="backEdit">
				<text>返回编辑</text>
			</view>

			<view class="confirmAll">
				<text>确定全部</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
// import mpHtml from "@/components/mp-html/mp-html.vue";

//引入Pinia中的相册数据
import { useAlbumStore } from '@/store/index.js';
const AlbumStore = useAlbumStore();
// 当前 swiper 的索引
const currentIndex = ref(0);

//定义应该展示的页码
const displayedPages = ref<number[]>([]);

const backData = ref<any[]>([]);

//原有问题的内容
const originalContent = ref<any[]>([]);

//合同风险
const businessRisk = ref<any[]>([]);

//建议改变
const proposedChanges = ref<any[]>([]);

//改变的内容
const modifiedContent = ref<any[]>([]);

//原法律条款
const relatedRegulation = ref<any[]>([]);

//要展示的文本通过HTML展示，格式方便进行排版
const html = ref<string>();

onShow(() => {
	changeNum();
	//获取返回的合同数据
	backData.value = uni.getStorageSync('backData');
	console.log(133, backData.value);
	originalContent.value = backData.value.map((item) => item.originalContent);
	businessRisk.value = backData.value.map((item) => item.businessRisk);
	console.log('businessRisk', businessRisk.value);
	proposedChanges.value = backData.value.map((item) => item.details.proposedChanges);
	modifiedContent.value = backData.value.map((item) => item.details.modifiedContent);
	relatedRegulation.value = backData.value.map(
		(item) =>
			item.details.relatedRegulation
				.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // 全局替换制表符
				.replace(/\r\n|\r|\n/g, '<br>') // 全局替换换行符
	);
	html.value = `
  ${businessRisk.value
		.map(
			(risk, index) =>
				`
        <div style="font-family: 'Times New Roman', serif; line-height: 1.8; padding: 30px; border: 1px solid #ddd; margin-bottom: 30px; background-color: #fdfdfd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 5px;">
          <h2 style="font-size: 28px; color: #000; margin-bottom: 15px; font-weight: bold; text-align: left; text-transform: uppercase;">${originalContent.value[index]}</h2>
          <h3 style="font-size: 22px; color: #333; margin-bottom: 20px; font-weight: normal; text-align: left;">${risk}</h3>

          <ul style="list-style: none; padding-left: 0; margin-top: 0;">
            <li style="margin-bottom: 20px;">
              <strong style="font-weight: bold; font-size: 18px;">我的建议:</strong>
              <div style="border: 1px solid #ccc; padding: 12px; background-color: #fff; border-radius: 4px; font-size: 16px; color: #444;">
                ${proposedChanges.value[index]}
              </div>
            </li>

            <li style="margin-bottom: 20px;">
              <strong style="font-weight: bold; font-size: 18px;">应修改的内容:</strong>
              <div style="border: 1px solid #ccc; padding: 12px; background-color: #fff; border-radius: 4px; font-size: 16px; color: #444;">
                ${modifiedContent.value[index]}
              </div>
            </li>

            <li style="margin-bottom: 20px;">
              <strong style="font-weight: bold; font-size: 18px;">相关法律条款:</strong>
              <div style="border: 1px solid #ccc; padding: 12px; background-color: #fff; border-radius: 4px; font-size: 16px; color: #444;">
                ${relatedRegulation.value[index]}
              </div>
            </li>
          </ul>
        </div>
      `
		)
		.join('')}
`;
});

const clickPagenum = (index: number) => {
	currentIndex.value = displayedPages.value[index] - 1;
	changeNum();
};

//页码的改变逻辑
const changeNum = () => {
	let nowMultiple = Math.floor(currentIndex.value / 5);
	let totalMultiple = Math.floor((AlbumStore.Album.length - 1) / 5);
	let solid = 0;
	if (currentIndex.value / 5 < totalMultiple) {
		solid = 5;
	} else {
		solid = AlbumStore.Album.length - nowMultiple * 5;
	}
	displayedPages.value = [];
	for (let i = 1; i <= solid; i++) {
		displayedPages.value[i - 1] = nowMultiple * 5 + i;
	}
};

//轮播图切换
const onSwiperChange = (e: any) => {
	currentIndex.value = e.detail.current;
	changeNum();
};

//返回上一页
const back = () => {
	uni.navigateTo({
		url: '/pages/detail/detail'
	});
};

const backEdit = () => {
	uni.navigateBack({
		delta: 1 // 返回的页面数，默认为1，即返回上一页面
	});
};
</script>

<style lang="scss" scoped>
.gray-background {
	background-color: gray;
}

.title {
	font-size: 16px;
}

.container {
	display: flex;
	flex-direction: column;
	height: 100vh;

	.navbar {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 20rpx;
		height: 195rpx;

		.back {
			position: absolute;
			left: 58rpx;
			bottom: 42rpx;
		}

		text {
			position: absolute;
			bottom: 42rpx;
			font-size: 34rpx;
			font-weight: bold;
		}
	}

	.content {
		position: relative;
		height: 1254rpx;
		display: flex;
		background-color: rgb(249, 250, 254);

		.banner {
			position: absolute;
			width: 100%;
			height: 100%;

			swiper {
				width: 100%;
				height: 100%;

				swiper-item {
					width: 100%;
					height: 100%;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.pagination {
			position: absolute;
			top: 85rpx;
		}

		.result {
			position: absolute;
			top: 176rpx;
			// height: calc(100vh - 200px);
			width: 100vw;
			height: 100%;
			bottom: 150rpx;
			background-color: white;
			pointer-events: none;
			/* 允许点击事件传递到轮播图 */
		}
	}

	.footer {
		display: flex;
		position: fixed;
		/* 固定在底部 */
		bottom: 0;
		left: 0;
		right: 0;
		justify-content: space-between;
		height: 100rpx;
		background-color: rgb(248, 248, 248);

		.continue,
		.next {
			position: absolute;
			top: 50%;
			/* 定位到父元素的中间 */
			transform: translateY(-50%);
			/* 通过偏移使其垂直居中 */
		}

		.backEdit {
			position: absolute;
			width: 195rpx;
			height: 65rpx;
			border: 1rpx solid rgb(183, 183, 183);
			border-radius: 65rpx;
			left: 178rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.confirmAll {
			position: absolute;
			width: 195rpx;
			height: 65rpx;
			border: 1rpx solid rgb(183, 183, 183);
			background-color: rgb(42, 129, 228);
			border-radius: 65rpx;
			right: 140rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.pageNum {
			position: absolute;
			top: 3rpx;
			right: 53rpx;
			background-color: rgb(204, 204, 204);
			width: 120rpx;
			height: 43rpx;
			border-radius: 20rpx;
			/* 使用 Flexbox 实现居中 */
			display: flex;
			/* 使父元素成为 Flexbox 容器 */
			justify-content: center;
			/* 水平居中 */
			align-items: center;

			/* 垂直居中 */
			text {
				font-size: 23rpx;
				font-weight: bold;
				/* 加粗 */
			}
		}
	}
}

.red {
	color: red;
}

.pagination {
	position: absolute;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	/* 每行 5 个 */
	grid-gap: 20rpx;
	/* 页码之间的间距 */
	left: 50%;
	/* 将元素左侧对齐到父元素的 50% */
	transform: translateX(-50%);
	/* 将元素向左移动自身宽度的一半，从而达到居中效果 */

	.page {
		width: 110rpx;
		height: 58rpx;
		border-radius: 58rpx;
		/* 圆形 */
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: white;
		/* 默认白色 */
		cursor: pointer;
		border: 1rpx solid #ccc;
		/* 边框 */

		&.active {
			background-color: rgb(42, 129, 228) !important;
			/* 当前页蓝色 */
			color: white;
			/* 字体颜色 */
		}
	}
}

.mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	/* 半透明黑色 */
	z-index: 1000;
	/* 保证蒙版在最顶层 */
}
</style>
