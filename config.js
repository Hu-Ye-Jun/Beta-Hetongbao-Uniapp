// config.js

const ENV = __wxConfig.envVersion || "release"; // 微信小程序提供的环境变量，可能值为 'develop', 'trial', 'release'
// 检查当前环境是否为微信小程序，如果是则使用 __wxConfig，否则设置为默认值
// const ENV = 'production'; // H5环境时将使用'release'

export function getBaseUrl() {
	let baseUrl = "";

	switch (ENV) {
		case "production":
			baseUrl = '';
			break;
		case "develop":
			baseUrl = "http://192.168.1.12:8083"; // 开发环境
			// baseUrl = "https://beta.law.mugua.team"; // 开发环境
			// baseUrl = "https://law.xiaomugua.cn"; // 开发环境
			break;
		case "trial":
			baseUrl = "https://beta.law.mugua.team"; // 体验版环境
			break;
			163
		case "release":
			baseUrl = "https://beta.law.mugua.team"; // 正式版环境
			break;
		default:
			baseUrl = "https://beta.law.mugua.team"; // 默认地址
			break;
	}

	return baseUrl;
}