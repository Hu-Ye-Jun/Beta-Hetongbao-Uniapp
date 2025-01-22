<template>
  <view class="cropper-container">
    <image
      class="image"
      :src="imageSrc"
      :style="{ width: imageWidth + 'px', height: imageHeight + 'px' }"
      ref="imageRef"
    />
    <view
      class="cropper-box"
      :style="{
        top: cropper.top + 'px',
        left: cropper.left + 'px',
        width: cropper.width + 'px',
        height: cropper.height + 'px'
      }"
      @touchstart="onTouchStart('box', $event)"
      @touchmove="onTouchMove($event)"
    >
      <!-- 四个边 -->
      <view
        v-for="(edge, index) in edges"
        :key="index"
        class="cropper-edge"
        :class="edge.class"
        @touchstart="onTouchStart(edge.direction, $event)"
      ></view>
      <!-- 四个角 -->
      <view
        v-for="(corner, index) in corners"
        :key="index"
        class="cropper-corner"
        :class="corner.class"
        @touchstart="onTouchStart(corner.direction, $event)"
      ></view>
    </view>
    <canvas ref="canvas" style="display: none;"></canvas>
  </view>
</template>

<script setup>
import { reactive, ref, nextTick } from "vue";

// Props
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

// 双向绑定图片地址
const imageSrc = ref(props.modelValue);

// 图片宽高（假设固定）
const imageWidth = 300;
const imageHeight = 400;

// 裁剪框的初始位置和大小
const cropper = reactive({
  top: 50,
  left: 50,
  width: 200,
  height: 200,
  startX: 0,
  startY: 0,
  direction: "",
});

// 定义裁剪框的边和角
const edges = [
  { direction: "top", class: "edge-top" },
  { direction: "right", class: "edge-right" },
  { direction: "bottom", class: "edge-bottom" },
  { direction: "left", class: "edge-left" },
];

const corners = [
  { direction: "top-left", class: "corner-top-left" },
  { direction: "top-right", class: "corner-top-right" },
  { direction: "bottom-left", class: "corner-bottom-left" },
  { direction: "bottom-right", class: "corner-bottom-right" },
];

let isDragging = false;

// 开始触摸
const onTouchStart = (direction, event) => {
  const touch = event.touches[0];
  cropper.startX = touch.clientX;
  cropper.startY = touch.clientY;
  cropper.direction = direction;
  isDragging = true;
};

// 触摸移动
const onTouchMove = (event) => {
  if (!isDragging) return;

  const touch = event.touches[0];
  const deltaX = touch.clientX - cropper.startX;
  const deltaY = touch.clientY - cropper.startY;

  switch (cropper.direction) {
    case "top":
      cropper.top += deltaY;
      cropper.height -= deltaY;
      break;
    case "right":
      cropper.width += deltaX;
      break;
    case "bottom":
      cropper.height += deltaY;
      break;
    case "left":
      cropper.left += deltaX;
      cropper.width -= deltaX;
      break;
    case "top-left":
      cropper.top += deltaY;
      cropper.height -= deltaY;
      cropper.left += deltaX;
      cropper.width -= deltaX;
      break;
    case "top-right":
      cropper.top += deltaY;
      cropper.height -= deltaY;
      cropper.width += deltaX;
      break;
    case "bottom-left":
      cropper.left += deltaX;
      cropper.width -= deltaX;
      cropper.height += deltaY;
      break;
    case "bottom-right":
      cropper.width += deltaX;
      cropper.height += deltaY;
      break;
    case "box":
      cropper.top += deltaY;
      cropper.left += deltaX;
      break;
  }

  cropper.startX = touch.clientX;
  cropper.startY = touch.clientY;
};

// 触摸结束
const onTouchEnd = () => {
  isDragging = false;
};

// 导出裁剪后的图片
const exportCroppedImage = async () => {
  const canvas = ref(null);
  const imageElement = ref(null);

  await nextTick(); // 确保 DOM 渲染完成
  canvas.value = document.createElement("canvas");
  imageElement.value = document.querySelector(".image");

  const ctx = canvas.value.getContext("2d");

  // 设置 canvas 尺寸为裁剪框尺寸
  canvas.value.width = cropper.width;
  canvas.value.height = cropper.height;

  // 计算裁剪框相对于图片的比例
  const scaleX = imageElement.value.naturalWidth / imageWidth;
  const scaleY = imageElement.value.naturalHeight / imageHeight;

  // 裁剪区域的实际位置和大小
  const sx = cropper.left * scaleX;
  const sy = cropper.top * scaleY;
  const sWidth = cropper.width * scaleX;
  const sHeight = cropper.height * scaleY;

  // 绘制裁剪后的图像到 canvas
  ctx.drawImage(
    imageElement.value,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    cropper.width,
    cropper.height
  );

  // 导出为图片
  const croppedImage = canvas.value.toDataURL("image/png");

  // 返回裁剪结果
  return croppedImage;
};

// 暴露方法给父组件
defineExpose({
  exportCroppedImage,
});
</script>

<style>
.cropper-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
}

.cropper-box {
  position: absolute;
  border: 2px dashed #00aaff;
  box-sizing: border-box;
}

.cropper-edge {
  position: absolute;
  background: rgba(0, 170, 255, 0.5);
}

.edge-top {
  top: -5px;
  left: 0;
  right: 0;
  height: 10px;
  cursor: ns-resize;
}

.edge-right {
  top: 0;
  right: -5px;
  bottom: 0;
  width: 10px;
  cursor: ew-resize;
}

.edge-bottom {
  bottom: -5px;
  left: 0;
  right: 0;
  height: 10px;
  cursor: ns-resize;
}

.edge-left {
  top: 0;
  left: -5px;
  bottom: 0;
  width: 10px;
  cursor: ew-resize;
}

.cropper-corner {
  position: absolute;
  width: 15px;
  height: 15px;
  background: rgba(0, 170, 255, 0.8);
  z-index: 10;
}

.corner-top-left {
  top: -7px;
  left: -7px;
  cursor: nwse-resize;
}

.corner-top-right {
  top: -7px;
  right: -7px;
  cursor: nesw-resize;
}

.corner-bottom-left {
  bottom: -7px;
  left: -7px;
  cursor: nesw-resize;
}

.corner-bottom-right {
  bottom: -7px;
  right: -7px;
  cursor: nwse-resize;
}
</style>
