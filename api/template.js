import {
	request
} from "@/utils/request.js";
// 收藏合同模板
export const addCollectionTemplate = (userId, templateId) => {
	return request("/api2/contractTemplate/collectionTemplate", "post", {
		userId,
		templateId
	})
}

// 下载合同模板
export const downloadTemplate = (id) => {
	return request("/api2/contractTemplate/downloadTemplate", "post", {
		id
	})
}

// 查询用户是否为VIP
export const getUserIsUsingRights = (userId) => {
	return request("/api2/userRights/getIsUsingRights", "post", {
		userId
	})
}

// 查询用户权益
export const getContractCount = (userId) => {
	return request("/api2/contractReview/getContractCount", "post", {
		userId
	})
}

// 查询用户是否为VIP
export const getUserCouponsApi = (userId) => {
	return request("/api2/userCoupon/getUserCoupons", "post", {
		userId
	})
}

// 查询模板类型树状
export const getContractTemplateTypeListApi = () => {
	return request("/api2/contractTemplate/getContractTemplateTypeList", "post")
}

// 模糊查询
export const searchContractTemplateTypeApi = (type) => {
	return request("/api2/contractTemplate/getContractTemplateTypeByType", "post", {
		type
	})
}

// 根据热门合同名称查询合同类型信息
export const searchContractTemplateTypeByHotTypeApi = (type) => {
	return request("/api2/contractTemplate/getContractTemplateTypeByHotType", "post", {
		type
	})
}