import { ref } from "vue";
export default {
  onLaunch() {
    // 设置默认的转发参数
    uni.$u.mpShare = ref({
      title: "木瓜合同宝", // 默认为小程序名称
      path: "pages/index/index", // 默认为当前页面路径
      imageUrl: "https://cdn.law.xiaomugua.cn/minip/mugua-ai.png", // 默认为当前页面的截图
    });
  },
  onHide() {
    uni.$u.mpShare = ref({
      title: "木瓜合同宝", // 默认为小程序名称
      path: "pages/index/index", // 默认为当前页面路径
      imageUrl: "https://cdn.law.xiaomugua.cn/minip/mugua-ai.png", // 默认为当前页面的截图
    });
  },
  onShareAppMessage() {
    return uni.$u.mpShare.value;
  },
  // #ifdef MP-WEIXIN
  onShareTimeline() {
    return uni.$u.mpShare.value;
  },
  // #endif
};
