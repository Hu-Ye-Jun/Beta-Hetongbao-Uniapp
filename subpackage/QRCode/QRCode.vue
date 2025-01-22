<template>
  <view class="container">
    <image mode="aspectFit" :src="src"></image>

    <!-- 生成海报的canvas -->
    <!-- 	<canvas class="my-canvas" canvas-id="myCanvas" @longpress.stop="saveSharePic"></canvas>
			<view class="canvas-tip">长按可保存海报</view>
			<view class="canvas-tip" @click="share">分享海报</view>
			<button open-type="share">点击分享</button> -->
  </view>
</template>

<script setup>
import { request } from "../../utils/request";
import { onLoad, onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { onMounted, ref } from "vue";

const src = ref("");
const shareImg = ref("");
const createQrCode = async () => {
  const res = await request("/api2/wx/createQrCode", "POST");
  if (res.data) {
    src.value = res.data;
    console.log(src.value);
  } else {
    console.log(res);
  }
};
createQrCode();

// const generatePoster = async()=>{
// 	let ctx = uni.createCanvasContext('myCanvas');
// 	//背景
// 	// 绘制白色矩形
// 	ctx.setFillStyle('#fff');
// 	ctx.fillRect(0, 0, 300, 500)

// 	// 绘制黑色矩形
// 	// ctx.setFillStyle('#000');
// 	// ctx.fillRect(20, 20, 300, 400);
// 	// ctx.draw();
// 	ctx.font = "48px serif";
// 	ctx.setFillStyle('#000')
// 	ctx.fillText("测试",20,60)

// 	// await createQrCode()
// 	//小程序码
// 	if (src.value) {
// 		ctx.drawImage(src.value, 0, 100, 200, 200);
// 	}
// 	// ctx.drawImage("https://cdn.law.xiaomugua.cn/minip/mugua-ai.png", 175, 250, 60, 60);

// 	ctx.save()
// 	ctx.beginPath();
// 	ctx.moveTo(235, 310);
// 	ctx.lineTo(175, 310);
// 	ctx.lineTo(235, 250);
// 	ctx.closePath()
// 	ctx.clip();
// 	ctx.drawImage("https://cdn.law.xiaomugua.cn/minip/mugua-ai.png", 175, 250, 60, 60);
// 	ctx.restore()

// 	ctx.draw()
// }
// onMounted(()=>{
// 	generatePoster()
// 	setTimeout(()=>canvasToTempFilePath(),500)
// })
// 分享海报
// const share =()=>{
// 	console.log(1);
//       wx.showShareImageMenu({
//         path: shareImg.value
//       })
// }

// onShow(()=>{
// 	uni.$u.mpShare.value = {
// 		title: '测试',
// 		path: '/subpackage/QRCode/QRCode',
// 		imageUrl: shareImg.value
// 	}
// })
// onShareAppMessage(()=>{
// })
// 长按保存生成的海报
// const saveSharePic = ()=> {
// 	uni.showModal({
// 		title: '提示',
// 		content: '确定要保存分享海报吗？',
// 		success: function(res) {
// 			if (res.confirm) {
// 				if (!shareImg.value) {
// 					canvasToTempFilePath()
// 					setTimeout(()=>saveImage(),500)
// 				}
// 				else {
// 					saveImage()
// 				}
// 			}
// 		}
// 	});
// }
// canvas生成图片
// const canvasToTempFilePath = ()=> {
// 	uni.canvasToTempFilePath({
// 		// 这里修改保存的图片格式
// 		fileType: 'jpg',
// 		canvasId: 'myCanvas',
// 		quality: 1,
// 		success: function(res) {
// 			shareImg.value = res.tempFilePath
// 		}
// 	});
// }
// const saveImage = ()=>{
// 	console.log(shareImg.value);
// 	uni.saveImageToPhotosAlbum({
// 		filePath: shareImg.value,
// 		success: function() {
// 			uni.showToast({
// 				title: '保存海报成功',
// 				icon: 'none',
// 				duration: 3000
// 			});
// 		},
// 		fail: function() {
// 			uni.showToast({
// 				title: '保存海报失败',
// 				icon: 'none',
// 				duration: 3000
// 			});
// 		}
// 	});
// }
</script>

<style lang="scss">
.container {
  background-color: rgba(249, 250, 254, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  .canvas-tip {
    color: #000;
    font-size: 24rpx;
    margin-top: 30rpx;
  }
  /* #ifdef MP-WEIXIN */
  .my-canvas {
    width: 300px;
    height: 500px;
    background-color: #ffffff;
    // margin: 160rpx auto;
    // border: solid #000 ;
  }
  /* #endif */

  /* #ifdef APP-PLUS || H5 */
  .my-canvas {
  }
  /* #endif */
}
</style>
