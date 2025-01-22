import {
	request
} from "@/utils/request.js";
export const getId = (userId) => {
	return request('/api2/contractReview/getConversationId', "post", {
		userId
	})
}
// http://127.0.0.1:8083/api2/contractType/get

export const contractType = () => {
	return request('/api2/contractType/get', "post")
}

// 发起合同审查
export const getContractResult = (userId, conversationId) => {
	return request("/api2/wxcontract/getContractResult", "post", {
		userId,
		conversationId
	})
}
// 获取合同任务列表
export const getContractList = (userId) => {
	return request("/api2/contractHistory/getContractList", "post", {
		userId,

	})
}
// api2/contractReview/getContractById
// 根据ID查询合同信息
export const getContractById = (conversationId) => {
	return request("/api2/contractReview/getContractById", "post", {
		conversationId,

	})
}
// 根据ID删除合同信息
export const deleteContractHistory = (conversationId) => {
	return request("/api2/contractHistory/deleteContractHistory", "post", {
		conversationId,
	})
}

// 根据ID批量删除合同信息
export const batchDeleteContractHistory = (conversationId) => {
	return request(`/api2/contractHistory/batchDeleteContractHistory/${conversationId}`, "delete")
}


// 获取文件名
export const getConversationFile = (conversationId) => {
	return request("/api2/dialogPro/getConversationFile", "post", {
		conversationId
	})
}

// 获取合同类型和审查立场
export function getContractType() {
	return request("/api2/contractType/get", "post")
}

// 清空历史记录
export const clearContractHistorys = (userId) => {
	return request("/api2/contractHistory/clearContractHistory", "post", {
		userId
	})
}

// 中断合同审查
export const interruptContract = (conversationId) => {
	return request('/api2/wxcontract/cancel', 'post', {
		conversationId
	})
}

// 主体审查接口
export const mainExamination = (conversationId, searchName, toBodyReview) => {
	return request('/api2/qcc/bodyReview', 'post', {
		searchName,
		conversationId,
		toBodyReview
	})
}

// 主体审查接口
export const exportClean = (conversationId) => {
	return request('/api2/contractReview/wxExportClearContract', 'post', {
		conversationId
	})
}

// 查询主体审查剩余次数
export const getUserMainBodyCount = (userId) => {
	return request('/api2/contractReview/getContractCount', 'post', {
		userId
	})
}