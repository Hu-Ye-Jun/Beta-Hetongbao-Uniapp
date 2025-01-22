<template>
	<view>
		<view class="topTitle">
			<image
				@tap="handleGoBack"
				style="width: 18rpx; height: 30rpx; margin-right: 20rpx; transform: rotate(180deg)"
				src="https://cdn.law.xiaomugua.cn/minip/back.png"
				mode="scaleToFill"
			></image>
			<view>合同类别选择</view>
		</view>
		<!-- 搜索框 -->
		<view style="padding: 30rpx">
			<u-input
				:focus="true"
				v-model:modelValue="searchInput"
				style="border: 2px solid #000"
				clearable
				placeholder="搜索合同类型"
				@confirm="onSearchConfirm"
				@clear="onSearchClear"
			>
				<template #suffix>
					<!-- <u-button type="success" size="mini">搜索</u-button> -->
					<button @click="onSearchConfirm" class="searchBtn">搜索</button>
				</template>
			</u-input>
			<!-- <input @change="onSearchConfirm" placeholder="搜索合同类型" type="text" /> -->
		</view>

		<!-- Tab分页 -->
		<!-- <u-tabs v-if="!showSearchResults" :list="tabList" @change="onTabChange" :scrollable="false"></u-tabs> -->

		<view v-if="!showSearchResults" style="padding: 0 30rpx">
			<!-- <view v-if="currentTab === 0">
				<view class="hot-contracts-container">
					<view v-for="(item, index) in hotContracts" :key="index" @click="onHotContractClick(item)" class="grid-item">
						<u-button style="margin: 30rpx 30rpx" plain shape="circle" type="primary">{{ item }}</u-button>
					</view>
					<view v-if="contractFlag" @click="onHotContractClick('通用合同')" class="grid-item">
						<u-button style="margin: 30rpx 30rpx" plain shape="circle" type="primary">通用合同</u-button>
					</view>
				</view>
			</view>

			<view v-if="currentTab === 1">
				<u-index-list :index-list="indexList" @select="clickSelect">
					<template v-for="(item, index) in contractTreeByIndex" :key="indexList[index]" :id="indexList[index]">
						<u-index-item>
							<u-index-anchor :text="indexList[index]" :id="indexList[index]" :index="indexList[index]"></u-index-anchor>
							<view>
								<u-collapse accordion>
									<u-collapse-item :title="contract[indexList[index]].type" @change="handleCollapseChange(index)">
										<view v-for="(cell, cellIndex) in item" :key="cellIndex">
											<u-cell @click="handleCell(cell)" :title="cell.type !== '' ? cell.type : '暂无内容'"></u-cell>
										</view>
									</u-collapse-item>
								</u-collapse>
							</view>
						</u-index-item>
					</template>
				</u-index-list>
			</view> -->
			<view class="hot" style="margin-bottom: 15rpx">
				<view style="font-weight: 600; margin-bottom: 15rpx; color: #191919">热门合同</view>
				<view class="hot-contracts-container">
					<view v-for="(item, index) in hotContracts" :key="index" @click="onHotContractClick(item)" class="grid-item">
						<button class="hotItem">{{ item }}</button>
					</view>
					<view v-if="contractFlag" @click="onHotContractClick('通用合同')" class="grid-item">
						<button class="hotItem">通用合同</button>
					</view>
				</view>
			</view>
			<view class="contactType">
				<view style="font-weight: 600; margin-bottom: 15rpx; color: #191919">合同分类</view>
				<u-collapse accordion :border="false">
					<u-collapse-item
						v-for="(item, index) in contractTreeByIndex"
						:key="indexList[index]"
						:id="indexList[index]"
						:title="contract[indexList[index]].type"
						@change="handleCollapseChange(index)"
						:border="false"
					>
						<template #icon>
							<view style="color: #aaaaaa; font-size: 32rpx; width: 30rpx">{{ index + 1 }}</view>
						</template>
						<view v-for="(cell, cellIndex) in item" :key="cellIndex">
							<u-cell :border="false" @click="handleCell(cell)">
								<template #title>
									<view class="u-slot-title">
										<image
											style="width: 20rpx; height: 20rpx; margin-right: 12rpx"
											src="https://cdn.law.xiaomugua.cn/minip/oval.png"
											mode="scaleToFill"
										></image>
										<text style="color: #777777">{{ cell.type !== '' ? cell.type : '暂无内容' }}</text>
									</view>
								</template>
							</u-cell>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>
		</view>

		<!-- 搜索结果 -->
		<view v-if="showSearchResults">
			<view v-if="searchResults && searchResults.length > 0">
				<view v-for="(item, index) in searchResults" :key="index" @click="handleCell(item)" class="grid-item">
					<!-- <u-button style="margin: 30rpx 30rpx" plain shape="circle" type="primary">{{ item.type }}</u-button> -->
					<button class="hotItem">{{ item.type }}</button>
				</view>
			</view>
			<u-empty v-else mode="search" text="未搜索到相关内容~"></u-empty>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import pinyin from 'pinyin';
import { useUserStore } from '@/store/index.js';
import { getContractTemplateTypeListApi, searchContractTemplateTypeApi, searchContractTemplateTypeByHotTypeApi } from '@/api/template.js';
import toast from '@/libs/function/toast.js';

const tabList = reactive([{ name: '热门合同' }, { name: '合同分类' }]);
const currentTab = ref(0);
const userStore = useUserStore();
const contractFlag = ref(userStore.contractType);
const userId = ref('');
const searchInput = ref('');

// 热门合同
const hotContracts = ['买卖合同(通用)', '劳动合同', '实习协议', '离婚协议', '办公室租赁合同'];

// 索引列表
const indexList = ref([]);

// 按索引分类的合同数据
const contractTreeByIndex = ref([]);

const contract = ref([]);

// 是否显示搜索结果
const showSearchResults = ref(false);

// 搜索结果
const searchResults = ref([]);

// 切换Tab
const onTabChange = (index) => {
	currentTab.value = index.index;
	console.log(index.index);
};

// 搜索输入
const onSearchInput = (value) => {
	// 搜索逻辑
	console.log('搜索输入:', value);
};

// 确认搜索
const onSearchConfirm = async () => {
	if (searchInput.value === '') {
		searchResults.value = [];
		showSearchResults.value = false;
		return;
	}
	console.log(167, searchInput.value);
	try {
		const res = await searchContractTemplateTypeApi(searchInput.value);
		if (res.code === 200) {
			searchResults.value = res.data;
			showSearchResults.value = true; // 显示搜索结果
		} else {
			searchResults.value = [];
		}
	} catch (err) {
		console.log(searchResults.value);
		searchResults.value = [];
	}
};

const handleGoBack = () => {
	uni.navigateBack({
		delta: 1
	});
};

// 清除搜索结果
const onSearchClear = () => {
	searchResults.value = [];
	showSearchResults.value = false; // 隐藏搜索结果
};

const clickSelect = (e) => {
	//从当前位置到达目标位置
	console.log('>>>当前节点', e, this.scrollTop);
	try {
		uni.createSelectorQuery()
			.select('#' + e)
			.boundingClientRect((data) => {
				console.log('>>data', data);
				//目标位置的节点：类或者id
				uni.createSelectorQuery()
					.select('.container')
					.boundingClientRect((res) => {
						console.log(data, res);
						console.log('>>res.top', res.top);

						//最外层盒子的节点：类或者id
						this.$nextTick(() => {
							uni.pageScrollTo({
								scrollTop: data.top - res.top,
								// selector: '#' + e,
								duration: 100 //app端这个必须设置成0
							});
						});
					})
					.exec();
			})
			.exec();
	} catch (err) {
		console.log(err, 'err');
	}
};

// 点击热门合同
const onHotContractClick = (item) => {
	console.log('点击热门合同：', item);
	const data = {
		id: new Date(),
		parentId: new Date(),
		type: item
	};
	userStore.setSelectTypeItem(data);
	if (contractFlag.value) {
		uni.switchTab({
			url: `/pages/index/index`
		});
	} else {
		if (userId.value) {
			searchContractTemplateTypeByHotTypeApi(item)
				.then((res) => {
					if (res.data && res.data.id) {
						uni.navigateTo({
							url: `/subpackage/documentList/documentList?id=${res.data.id}&title=${item}`
						});
					} else {
						toast(res.message);
					}
				})
				.catch((err) => {
					console.log(err);
					toast(err.message);
				});
		} else {
			uni.navigateTo({
				url: '/pages/login/login'
			});
		}
	}
};

const handleCell = (item) => {
	console.log(item);
	if (contractFlag.value) {
		userStore.setSelectTypeItem(item);
		uni.switchTab({
			url: `/pages/index/index`
		});
	} else {
		uni.navigateTo({
			url: `/subpackage/documentList/documentList?id=${item.id}&title=${item.type}`
		});
	}
};

// 加载合同数据
const loadContractData = async () => {
	try {
		const res = await getContractTemplateTypeListApi();
		console.log(res);
		if (res.code === 200) {
			userStore.setContractTypeList(res.data);
			// 处理树状结构和索引列表数据
			processIndexList(res.data);
		}
	} catch (err) {
		console.log(err);
	}
};

// 处理索引列表
const processIndexList = (data) => {
	const list = [];
	const treeByIndex = [];
	const contractMap = {};

	data.forEach((item) => {
		// 使用 pinyin 库将合同类型转换为拼音，并获取首字母
		const pinyinFirstLetter = pinyin(item.type, {
			style: pinyin.STYLE_FIRST_LETTER
		})[0][0].toUpperCase();
		let index = list.indexOf(pinyinFirstLetter);
		if (index === -1) {
			list.push(pinyinFirstLetter);
			treeByIndex.push([]);
			index = list.length - 1;
		}
		// 将合同类型的 children 数组添加到 treeByIndex 中对应的首字母数组中
		if (item.children) {
			treeByIndex[index].push(...item.children);
		}
		// 将合同类型添加到 contractMap 中
		contractMap[pinyinFirstLetter] = item;
	});

	// 对索引列表进行排序
	list.sort();
	const sortedTreeByIndex = list.map((letter) => {
		const index = Object.keys(contractMap).indexOf(letter);
		return treeByIndex[index];
	});

	indexList.value = list;
	contract.value = contractMap;
	contractTreeByIndex.value = sortedTreeByIndex;
	console.log(list, 'list');
	console.log(sortedTreeByIndex, 'sortedTreeByIndex');
};

// 索引变更
const onIndexChange = (index) => {
	console.log('索引变更为：', index);
};

// 点击合同类型
const onContractTypeClick = (node) => {
	console.log('点击合同类型：', node);
};

const handleCollapseChange = (index) => {
	setTimeout(() => {
		const element = document.getElementById(indexList.value[index]);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}, 100); // 延时让页面先渲染完成再滚动
};

// 页面加载时调用
onMounted(() => {
	userId.value = uni.getStorageSync('userId') || uni.getStorageSync('wxuserId');
	loadContractData();
});
</script>

<style lang="scss">
/* 自定义样式 */
.grid-item {
	display: inline-block;
	margin: 12rpx;
	.hotItem {
		height: 64rpx;
		line-height: 64rpx;
		border: none;
		background-color: #f5f6fa;
		border-radius: 32rpx;
		font-size: 30rpx;
		color: #3a3a3c;
	}
	.hotItem::after {
		border: none;
	}
}

.hot-contracts-container {
	text-align: left; /* 居中对齐 */
}

.topTitle {
	display: flex;
	align-items: center;
	font-size: 18px;
	padding: 110rpx 0 20rpx 30rpx;
}

.searchBtn {
	height: 65rpx;
	line-height: 65rpx;
	font-size: 30rpx;
	background-color: #d6defc;
	color: #4d6ef1;
}

.searchBtn::after {
	border: none;
}

:deep(.u-input.data-v-df79975b.u-border) {
	border: 2px solid #2c2e2d !important;
	border-radius: 15rpx !important;
	height: 60rpx !important;
}
:deep(.u-collapse-item__content__text.content-class.data-v-82f3baf9) {
	padding: 0 15px;
}
</style>
