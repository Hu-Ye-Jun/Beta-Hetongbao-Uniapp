import {
	getBaseUrl
} from "../config.js";

export const baseUrl = getBaseUrl();

export const request = (url, method, data) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: method,
			timeout: 60000,
			header: {
				"Content-Type": "application/json",
				cookie: uni.getStorageSync("wxcookies") ||
					uni.getStorageSync("cookies") ||
					"",
			},
			data: data || {},
			success: (res) => {
				const {
					data
				} = res;

				if (data.code === 200) {
					resolve(data);
				} else {
					reject(data); // 在这里添加对非200状态码的处理
				}
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
};