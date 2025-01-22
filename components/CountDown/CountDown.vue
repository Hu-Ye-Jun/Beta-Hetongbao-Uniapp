<template>
	<text>
		{{ countdown }}
	</text>
</template>

<script setup>
	import { computed, onBeforeUnmount, ref } from 'vue';
	import { onShow ,onUnload } from '@dcloudio/uni-app'
	const props = defineProps(['time'])
	const countdown = ref()
	let timer
	
	const startCountdown = ()=>{
		timer = setInterval(()=>{
			const now = new Date();
			let _time = new Date(props.time)
			const diff = _time.getTime() + 35 * 60 * 1000 - now.getTime();
			if(diff <= 0){
				clearInterval('timer')
				countdown.value = ''
			}else{
				const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((diff % (1000 * 60)) / 1000);
				
				// console.log(`${minutes}:${seconds}`);
				countdown.value = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
				// console.log(countdown.value);
				// return `${minutes}:${seconds}`;
				}
		},1000)
	}
	// onShow(()=>{
	// 	console.log('start');
	// 	startCountdown()
	// })
	startCountdown()
	onUnload(()=>{
		console.log('stop');
		clearInterval('timer')
	})
</script>

<style lang="scss">

</style>