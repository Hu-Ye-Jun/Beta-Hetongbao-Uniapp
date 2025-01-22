import {
	createPinia
} from "pinia";
import useUserStore from './modules/user.js'
import useAlbumStore from './modules/album.js'
import useConversationIdStore from './modules/conversationId.js'

const pinia = createPinia();

export {
	useUserStore,
	useAlbumStore,
	useConversationIdStore
};

export default pinia;