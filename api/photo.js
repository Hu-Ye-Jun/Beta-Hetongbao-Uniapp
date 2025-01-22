import {
	request
} from "@/utils/request.js"

export const getContractResult = (data) => {
	return request("/api2/wxcontract/getContractResult", "post", data)
}

export const createConversationIdResult = () => {
	return request("/api2/pictureReview/createConversationId", "get")
}

export const getPictureContent = (conversationId) => {
	return request('/api2/pictureReview/getPictureContent', 'get', {
		conversationId: conversationId
	})
}

export const updatePictureContent = (data) => {
	return request('/api2/pictureReview/updatePictureContent', 'post', data)
}