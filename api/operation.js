// operation
import {
	request
} from "@/utils/request.js";
// 反馈
export const userFeedback = (userId, content) => {
	return request("/api2/wx/feedback", "post", {
		userId,
		content
	})
}
// 分享
export const wxExport = (conversationId) => {
	return request("/api2/contractReview/wxExport", "post", {
		conversationId,

	})
}
// 分享显示
// /api2/contractReview/shareView/
export const shareView = (conversationId) => {
	return request(`/api2/contractReview/shareView/${conversationId}`, 'get')
}

// 创建手机订单
export const createPhoneWebOrder = (
	rightsId,
	userCouponId,
) => {
	return request(
		`/api2/alipay/createPhoneWebOrderNew`,
		"post", {
			rightsId,
			userCouponId,
		})
}

// 创建微信订单
export const createWxOrder = (
	rightsId,
	userCouponId,
	paymentMethod
) => {
	return request(
		`/api2/order/createOrder`,
		"post", {
			rightsId,
			userCouponId,
			paymentMethod
		})
}

// 使用优惠券计算的价格
export const getCalculateFinalPrice = (userId, userCouponId, rightsId) => {
	return request(
		`/api2/order/calculateFinalPrice`,
		"post", {
			userId,
			userCouponId,
			rightsId,
		})
}

// 用户所有的优惠券列表
export const getUserCouponsToPhone = () => {
	return request(`/api2/userCoupon/getUserCouponsToPhone`, "post")
}

// 用户购买对应商品可使用的优惠券列表
export const getUserCouponList = (userId, rightsId) => {
	return request(
		`/api2/userCoupon/wxGetUserCouponList`,
		"post", {
			userId,
			rightsId,
		})
}

// 继续支付接口
export const continueOrder = (orderId) => {
	return request(
		`/api2/order/continueOrder`,
		"post", {
			orderId
		})
}