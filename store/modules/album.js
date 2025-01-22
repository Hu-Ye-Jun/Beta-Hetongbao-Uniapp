import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'

const useAlbumStore = defineStore('Album', () => {
	const Album = ref([]);
	const photoContent = ref([])
	// 在 Pinia store 中定义 setAlbum 函数
	const setAlbum = (data) => { // 接收一个字符串或字符串数组
		if (Array.isArray(data)) {
			Album.value.push(...data); // 如果是数组，展开添加所有元素
		} else {
			Album.value.push(data); // 如果是单个字符串，直接添加
		}
	};
	const setPhotoContent = (data) => { // 接收一个字符串或字符串数组
		if (Array.isArray(data)) {
			photoContent.value.push(...data); // 如果是数组，展开添加所有元素
		} else {
			photoContent.value.push(data); // 如果是单个字符串，直接添加
		}
	};

	const replacePhoto = (index, photo) => {
		Album.value[index] = photo
	}

	const deletePhoto = (index) => {
		Album.value.splice(index, 1);
	}

	const clearAlbum = () => {
		Album.value = []
	}

	return {
		Album,
		photoContent,
		setAlbum,
		replacePhoto,
		deletePhoto,
		clearAlbum,
		setPhotoContent
	}
})

export default useAlbumStore;