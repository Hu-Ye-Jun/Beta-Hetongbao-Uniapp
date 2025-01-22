<template>
  <view class="container">
    <view class="topBg">
      <view class="titleText">{{
        listShow ? "合同模版榜单" : "合同模版"
      }}</view>
      <image
        class="bgImg"
        src="https://cdn.law.xiaomugua.cn/minip/templateBg.png"
      ></image>
    </view>
    <!-- 搜索 -->
    <view class="search">
      <view class="input" @click.stop="focusInput">
        <!-- 阻止事件冒泡 -->
        <input
          disabled
          v-model="searchText"
          placeholder="搜索合同模板"
          placeholder-style="placeholder"
          confirm-type="search"
        />
        <view
          style="width: 40rpx; height: 40rpx; margin-right: 30rpx; z-index: 1"
          @tap.stop="handleHotList"
        >
          <image
            style="width: 100%; height: 100%"
            src="https://cdn.law.xiaomugua.cn/minip/rankingIcon.png"
            mode="widthFix"
          ></image>
          <!-- <image v-else style="width: 100%; height: 100%" src="https://cdn.law.xiaomugua.cn/minip/listIcon.png" mode="widthFix"></image> -->
        </view>
        <button class="button-hover">搜索</button>
      </view>
    </view>
    <view class="main" v-if="!listShow">
      <!-- 左边内容 -->
      <scroll-view class="left" enable-flex="true">
        <view
          v-for="(item, index) in firstContractTemplateType"
          :key="item.id"
          class="left-item"
          :class="{ active: activeTitle == index }"
          @click="toggleActive(index)"
        >
          <text>
            {{ item.type }}
          </text>
        </view>
      </scroll-view>
      <!-- 右边内容 -->
      <scroll-view
        scroll-y="true"
        @scroll="scroll"
        class="right"
        :scroll-top="scrollTop"
      >
        <view
          v-for="(item, index) in firstContractTemplateType"
          :key="item.id"
          v-if="!showSearchRes"
        >
          <view class="title">
            <image
              :src="getImageSrc(item.type)"
              mode="aspectFit"
              class="type-image"
            ></image>
            <text>{{ item.type }}</text>
          </view>
          <view class="grid">
            <view
              class="item"
              v-for="item in secondContractTemplateType.filter(
                (v) => v.parentId == item.id
              )"
              :key="item.id"
              @click="toList(item.id, item.type)"
            >
              <text>{{ item.type }}</text>
            </view>
          </view>
        </view>
        <view class="title" v-if="showSearchRes">
          <text>搜索结果</text>
        </view>
        <view class="grid">
          <view
            class="item"
            v-for="item in searchRes"
            :key="item.id"
            @click="toList(item.id, item.type)"
            v-if="showSearchRes"
          >
            <text>{{ item.type }}</text>
          </view>
        </view>

        <view class="bottom-space" :style="bottomSpaceStyle"></view>
      </scroll-view>
    </view>
    <view v-else>
      <u-tabs
        lineHeight="0"
        :list="list"
        @click="clickTabs"
        activeStyle="color:#4D6EF1; font-weight: 700; font-family: Microsoft YaHei;"
      ></u-tabs>
      <u-list v-if="indexList.length > 0">
        <u-list-item v-for="(item, index) in indexList" :key="index">
          <u-cell
            :border="false"
            :title="item.templateName"
            @click="toPreview(item.templateId, item.buyTypeId)"
          >
            <template #icon>
              <view style="width: 20px; height: 20px; margin-right: 10rpx">
                <view
                  v-if="item.sortByList <= 3"
                  style="color: #f25847; text-align: center; font-weight: 500"
                  >{{ item.sortByList }}</view
                >
                <view
                  v-else
                  style="color: #d3d7d6; text-align: center; font-weight: 500"
                  >{{ item.sortByList }}</view
                >
              </view>
            </template>
            <template #right-icon style="width: 64rpx; height: 40rpx">
              <image
                src="https://cdn.law.xiaomugua.cn/minip/freeIcon.png"
                style="width: 100%; height: 100%"
                v-if="item.buyTypeId === 1"
              ></image>
              <image
                src="https://cdn.law.xiaomugua.cn/minip/pointIcon.png"
                style="width: 100%; height: 100%"
                v-else-if="item.buyTypeId === 2"
              ></image>
              <image
                src="https://cdn.law.xiaomugua.cn/minip/VIPIcon.png"
                style="width: 100%; height: 100%"
                v-else-if="item.buyTypeId === 3"
              ></image>
            </template>
          </u-cell>
        </u-list-item>
      </u-list>
      <view v-else style="margin-top: 80px">
        <u-empty mode="list" text="暂无内容"></u-empty>
      </view>
    </view>
    <BuyPopup ref="buyPopup" @onBuy="onBuy"></BuyPopup>
  </view>
</template>

<script setup>
import {
  onMounted,
  reactive,
  ref,
  getCurrentInstance,
  toRef,
  computed,
  nextTick,
  watchEffect,
  watch,
} from "vue";
import {
  onLoad,
  onShow,
  onReady,
  onShareAppMessage,
  onShareTimeline,
} from "@dcloudio/uni-app";
import { request } from "@/utils/request.js";
import toast from "@/libs/function/toast.js";
import { useUserStore } from "../../store";
import throttle from "../../libs/function/throttle.js";

var searchText = ref("");
const firstContractTemplateType = reactive([]);
const secondContractTemplateType = reactive([]);
const bottomSpaceStyle = reactive({});
const searchRes = reactive([]);
const showSearchRes = ref(false);
const loading = ref(true);
const userStore = useUserStore();
const userId = ref();
const listShow = ref(false);
const list = reactive([
  { name: "热门合同榜" },
  { name: "免费热门榜" },
  { name: "积分热门榜" },
  { name: "VIP热门榜" },
]);
const tabsIndex = ref(8);
const indexList = ref([]);
const toIntegralPaid = ref(false);
const isVip = ref(false);
const buyPopup = ref();

// 图片名映射对象
const imageMap = {
  劳动用工: "labor_employment.png",
  买卖转让: "buy_sell_transfer.png",
  租赁合同: "lease_contract.png",
  婚姻家事: "marriage_family.png",
  公司管理: "company_management.png",
  知识产权: "intellectual_property.png",
  服务合同: "service_contract.png",
  借款合同: "loan_contract.png",
  特定行业: "specific_industry.png",
};

onLoad(async () => {
  await getFirstContractTemplateType();
  getIsUsingRights();
});

onMounted(() => {
  getTop();
  console.log(127, topArr);
});
onShow(() => {
  userId.value = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  listShow.value = false;
});

// 获取图片路径的函数
const getImageSrc = (type) => {
  const imageName = imageMap[type];
  return `https://cdn.law.xiaomugua.cn/minip/${imageName}`; // 根据实际情况调整图片路径
};

//弹窗触发兑换按钮
const onBuy = async function (id) {
  console.log("buy!");
  console.log(id);
  try {
    const res = await request(
      "/api2/contractTemplate/getContractTemplateById",
      "POST",
      {
        id: id,
        toIntegralPaid: true,
      }
    );
    const pdfUrl = res.data.playUrl;
    const pdfName = res.data.name;
    uni.showToast({
      title: "🎉恭喜您！可解锁兑换该功能",
      icon: "none",
    });
    setTimeout(() => {
      uni.navigateTo({
        url: `/subpackage/documentDetail/documentDetail?pdfUrl=${pdfUrl}&templateId=${id}&pdfName=${pdfName}`,
      });
    }, 1000);
  } catch (e) {
    console.log(e);
  }
};

const showBuyPopup = (typeId = 0, isOnly = false, id) => {
  buyPopup.value.show(typeId, isOnly, isVip.value, true, id);
};

// 获取是否是会员
const getIsUsingRights = async () => {
  const res = await request("/api2/userRights/getIsUsingRights", "POST", {
    userId: userId.value,
  });
  if (res.code === 200) {
    isVip.value = res.data.isUsing;
    console.log(isVip.value);
  }
};

// 跳转合同模板预览
const toPreview = async function (id, buyTypeId = 2) {
  throttle(
    async () => {
      try {
        const res = await request(
          "/api2/contractTemplate/getContractTemplateById",
          "POST",
          {
            id: id,
            toIntegralPaid: toIntegralPaid.value,
          }
        );
        if (res.code === 200) {
          const pdfUrl = res.data.playUrl;
          const pdfName = res.data.name;
          if (isVip.value) {
            setTimeout(() => {
              uni.navigateTo({
                url: `/subpackage/documentDetail/documentDetail?pdfUrl=${pdfUrl}&templateId=${id}&pdfName=${pdfName}`,
              });
            }, 800);
            if (buyTypeId == 2 || buyTypeId == 3 || buyTypeId == 7) {
              uni.showToast({
                title: "VIP权益生效中，已为你直接打开文档",
                icon: "none",
                duration: 1500,
              });
            }
          } else {
            uni.navigateTo({
              url: `/subpackage/documentDetail/documentDetail?pdfUrl=${pdfUrl}&templateId=${id}&pdfName=${pdfName}`,
            });
          }
        } else {
          toast(res.message);
        }
      } catch (err) {
        console.log(err);
        // if (err.code === 24012) {
        if (err.code) {
          if (err.code === 18014) {
            toast(err.message + "77");
          }
          if (err.code === 202) {
            uni.navigateTo({
              url: "/pages/login/login",
            });
            return;
          }
          if (
            buyTypeId != 1 &&
            buyTypeId != 4 &&
            buyTypeId != 5 &&
            buyTypeId != 7
          ) {
            console.log(204, buyTypeId);
            if (buyTypeId == 2) {
              showBuyPopup(0, false, id);
              return;
            }
            if (buyTypeId == 3 && !isVip.value) {
              showBuyPopup(1, true, id);
              return;
            }
          }
          toast(err.message);
        }
      }
    },
    1000,
    true
  );
};

const getListData = async () => {
  try {
    const res = await request(
      "/api2/contractTemplate/getContractList",
      "POST",
      {
        ofContractList: tabsIndex.value,
      }
    );
    if (res) {
      if (res.data) {
        indexList.value = res.data;
      } else throw new Error(res.message);
    } else throw new Error();
  } catch (e) {
    if (e.message) toast(e.message);
    else toast("加载失败");
  }
};

const clickTabs = (item) => {
  console.log(item);
  if (item.index === 0) {
    tabsIndex.value = 8;
  } else {
    tabsIndex.value = item.index;
  }
  getListData();
};

const handleHotList = () => {
  if (userId.value) {
    listShow.value = !listShow.value;
    getListData();
  } else {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
};

//获取数据
async function getFirstContractTemplateType() {
  try {
    const res = await request(
      "/api2/contractTemplate/getFirstContractTemplateType",
      "POST"
    );
    if (res) {
      if (res.data) {
        firstContractTemplateType.push(...res.data);
        await getSecondContractTemplateType();
      } else throw new Error(res.message);
    } else throw new Error();
  } catch (e) {
    if (e.message) toast(e.message);
    else toast("加载失败");
  }
}

async function getSecondContractTemplateType() {
  try {
    const res = await request(
      "/api2/contractTemplate/getSecondContractTemplateType",
      "POST"
    );
    if (res) {
      if (res.data) {
        secondContractTemplateType.push(...res.data);
      } else throw new Error(res.message);
    } else throw new Error();
  } catch (e) {
    if (e.message) toast(e.message);
    else toast("加载失败");
  }
  loading.value = false;
}

//模糊查询
async function search() {
  try {
    const res = await request(
      "/api2/contractTemplate/getContractTemplateTypeByType",
      "POST",
      {
        type: searchText.value,
      }
    );
    if (res) {
      if (res.data) {
        searchRes.splice(0, searchRes.length, ...res.data);
        showSearchRes.value = true;
      } else throw new Error(res.message);
    } else throw new Error();
  } catch (e) {
    if (e.message) toast(e.message);
    else toast("加载失败");
  }
}

const focusInput = () => {
  userStore.setContractType(false);
  uni.navigateTo({
    url: `/subpackage/contractType/contractType`,
  });
};

// 滚动控制
const activeTitle = ref(0);
const topArr = [];
const scrollTop = ref(0);

function scroll(e) {
  //已滚动距离
  const _scrollTop = e.detail.scrollTop + 212;
  let _activeTitle = 0;
  topArr.forEach((top, index) => {
    if (top < _scrollTop) {
      _activeTitle = index;
    }
  });
  //更改左侧选中状态
  if (!showSearchRes.value) activeTitle.value = _activeTitle;
}

// 获取二级菜单距顶部距离
function getTop() {
  const { ctx } = getCurrentInstance();
  const query = uni.createSelectorQuery().in(ctx);
  query.selectAll(".title").boundingClientRect((data) => {
    data.forEach((item) => {
      topArr.push(item.top);
    });
  });
  setTimeout(() => {
    query.exec();
  }, 500);
}

//切换一级活动状态
function toggleActive(index) {
  if (showSearchRes.value) {
    showSearchRes.value = false;
  }
  activeTitle.value = index;
  scrollTop.value = topArr[index] - 192;
}

// 页面跳转
function toList(id, title) {
  if (!userId.value) {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  } else {
    uni.navigateTo({
      url: `/subpackage/documentList/documentList?id=${id}&title=${title}`,
    });
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: rgba(249, 250, 254, 1);
  box-sizing: border-box;
  height: 100vh;
  .topBg {
    height: 560rpx;
    width: 100%;
    padding-top: 110rpx;
    position: absolute;
    .titleText {
      padding-left: 5vw;
      position: relative;
      z-index: 1;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 47rpx;
      color: #111111;
    }
    .bgImg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .search {
    padding: 18rpx 30rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 120rpx;
    margin-top: 180rpx;
    .input {
      flex: 1;
      padding: 15rpx;
      height: 80rpx;
      opacity: 1;
      border-radius: 15rpx;
      background: #fff;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 28rpx;
      z-index: 1;
      input {
        flex: 1;
        font-size: 28rpx;
      }
      button {
        width: 154rpx;
        height: 80rpx;
        opacity: 1;
        border-radius: 40rpx;
        background: rgba(5, 113, 255, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        /** 文本 */
        font-size: 28rpx;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        vertical-align: center;
      }
      .button-hover {
        width: 130rpx;
        height: 70rpx;
        opacity: 1;
        border-radius: 10rpx;
        background: #eff2fe;
        color: #4d6ef1;
        border: none;
      }
      .button-hover::after {
        border: none;
      }
      .placeholder {
        font-size: 28rpx;
      }
    }
  }
  .main {
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow: hidden;
    padding: 0 30rpx;
    .left {
      width: 186rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      .left-item {
        padding: 35rpx 0;
        font-size: 28rpx;
        width: 100%;
        text-align: center;
        display: flex;
        text {
          flex: 1;
        }
      }
      // .active::before {
      // 	content: '';
      // 	border-left: rgba(5, 113, 255, 1) solid 8rpx;
      // }
      .active {
        background-color: #fff;
        border-radius: 20rpx 0 0 20rpx;
      }
    }
    .right {
      overflow-y: auto;
      background: #fff;
      flex: 1;
      scroll-behavior: smooth;
      z-index: 1;
      padding-left: 20rpx;
      .title {
        font-weight: 700;
        color: rgba(0, 0, 0, 1);
        font-size: 28rpx;
        margin-left: 0;
        margin-bottom: 28rpx;
        margin-top: 54rpx;
        display: flex;
        align-items: center;
        .type-image {
          width: 36rpx; /* 根据需要调整图片大小 */
          height: 36rpx;
          margin-right: 20rpx; /* 调整图片与文本的间距 */
        }
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 28rpx;
        margin-left: 0;
        .item {
          width: 210rpx;
          padding: 20rpx 10rpx;
          border-radius: 12rpx;
          background: #f8f9ff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 24rpx;
        }
      }
      .bottom-space {
      }
    }
  }
}
</style>
