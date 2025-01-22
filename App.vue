<script setup>
import { useUserStore } from '@/store/index.js';
import { onShow, onHide, onLaunch } from '@dcloudio/uni-app';

const userStore = useUserStore();

onLaunch(() => {
	console.log('App Launch');
});

onShow(() => {
	console.log('App Show');
	wx.getSystemInfo({
		success(res) {
			console.log(res.platform); // 可以是 'ios', 'android', 'devtools' 等
			userStore.setSystem(res.platform);
		}
	});
});

onHide(() => {
	console.log('App Hide');
});
</script>

<style lang="scss">
@import url('@/static/iconfont/iconfont.css');
@import '@/uni_modules/uview-plus/index.scss';
page {
	background: #f9fafe;
}
</style>
