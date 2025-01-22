<template>
  <u-popup
    :show="isVisible"
    mode="center"
    @close="closeModal"
    custom-style="width: 80%; height: auto;"
  >
    <view class="modal-content">
      <image
        src="https://cdn.law.xiaomugua.cn/minip/templatip.png"
        width="100%"
        height="260rpx"
        class="icon"
        mode="aspectFit"
      ></image>
      <view style="text-align: center; margin: 20rpx 0">
        <view>预览下载将消耗次数</view>
        <view>请点击右上角按钮进行本地存储</view>
      </view>
      <u-button type="primary" @click="closeModal" class="close-button"
        >我知道了</u-button
      >
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 10rpx;
  padding: 40rpx;
}
.close-button {
  margin-top: 20rpx;
}
</style>
