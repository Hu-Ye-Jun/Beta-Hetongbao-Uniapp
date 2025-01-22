// 获取验证码：
import {
	request
} from "@/utils/request.js";
export const getVerificationCode = (userPhoneNumber) => {
	return request("/api2/users/getVerificationCode", "post", {
		userPhoneNumber
	})
}