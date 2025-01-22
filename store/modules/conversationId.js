import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'
import {
	getConversationIdAPI
} from "@/api/user.js"

const useConversationIdStore = defineStore('conversationId', () => {
	const conversationId = ref("")
	const getConversationId = async () => {
		const res = await getConversationIdAPI({
			userPhoneNumber: "13871391512",
			verificationCode: 1
		})
		conversationId.value = res
	}
	return {
		conversationId,
		getConversationId
	}
})

export default useConversationIdStore