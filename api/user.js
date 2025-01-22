import {
	request
} from "@/utils/request.js"
// 获取连续签到结果
export const getContinueSignInResult = (userId) => {
	return request("/api2/wx/getContinueSignInResult", "post", {
		userId
	})
}

// 连续签到
export const continueSignIn = (userId) => {
	// console.log('request', 13, userId)
	return request("/api2/wx/continueSignIn", "post", {
		userId
	})
}
// 每日签到
export const fixedSignIn = (userId) => {
	return request("/api2/wx/fixedSignIn", "post", {
		userId
	})
}
// 修改微信用户信息
export const wxUpdateUse = (userId, nickName) => {
	return request("/api2/wx/updateUser", "post", {
		userId,
		nickName
	})
}
// 修改用户名称
export const userUpdateUse = (userId, nickName) => {
	return request("/api2/users/updateUser", "post", {
		userId,
		nickName
	})
}


// 绑定手机号
// export const bindPhone = (userId, userPhoneNumber) => {
// 	return request("/api2/wx/bindPhone", "post", {
// 		userId,
// 		userPhoneNumber

// 	})
// }
// 获取用户信息
export const getUserById = (userId) => {
	return request("/api2/wx/getUserById", "post", {
		userId
	})
}
// 分享个人或群聊
// /api2/wx/shareToUser
export const shareToUse = (userId) => {
	return request("/api2/wx/shareToUser", "post", {
		userId
	})
}

export const getRightListApi = (isDelete) => {
	return request("/api2/rights/getRightsList", "post", {
		isDelete
	})
}

// 遮罩层引导
export const updateDisplayHomePagePopupApi = (displayHomePagePopupWindow) => {
	return request("/api2/users/updateDisplayHomePagePopupWindow", "post", {
		displayHomePagePopupWindow
	})
}

// 首页新用户弹窗
export const updateNewUserTipsApi = (newUserHomePageEventTips) => {
	return request("/api2/users/updateNewUserTips", "post", {
		newUserHomePageEventTips
	})
}

// 获取用户邀请码太阳码
export const getInviteSunCode = () => {
	return request("/api2/wx/createWeChatQrCode", "post")
}

// 获取用户邀请码记录
export const getInviteRecord = () => {
	return request("/api2/users/getInviteRecord", "post")
}

// 更改青少年模式
export const updateTeenagerModel = (data) => {
	return request("/api2/users/updateTeenagerModel", "post", data)
}

// 更改青少年模式密码
export const updateTeenagerPassword = (data) => {
	return request("/api2/users/updateTeenagerPassword", "post", data)
}

// 历史积分数据
export const getIntegralDesc = () => {
	return request("/api2/users/getIntegralDesc", "POST");
}

//获取conversationId
export const getConversationIdAPI = (data = {
	userPhoneNumber: "13871391512",
	verificationCode: 1
}) => {
	return new Promise((resolve, reject) => {
		request({
			url: "/api2/contractReview/getConversationId",
			method: "POST",
			data: data,
			success: (res) => {
				const response = res.data;
				console.log("conversationId", response.data);
				resolve(response.data); // 将结果传递出去
			},
			fail: (err) => {
				console.log(err);
				reject(err); // 错误处理
			}
		});
	});
};