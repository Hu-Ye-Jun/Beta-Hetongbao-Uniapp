import {
	defineStore
} from "pinia";

const useUserStore = defineStore("user", {
	state: () => ({
		userInfo: {},
		displayHomePagePopupWindow: false,
		newUserHomePageEventTips: false,
		contractTypeList: [],
		selectTypeItem: {},
		contractType: true,
		selectCoupon: {},
		system: ''
	}),
	getters: {},
	actions: {
		setUserInfo(info) {
			this.userInfo = info;
		},
		setContractTypeList(list) {
			this.contractTypeList = list
		},
		setSelectTypeItem(item) {
			this.selectTypeItem = item
		},
		setDisplayHomePagePopupWindow(flag) {
			this.displayHomePagePopupWindow = flag
		},
		setNewUserHomePageEventTips(flag) {
			this.newUserHomePageEventTips = flag
		},
		setContractType(flag) {
			this.contractType = flag
		},
		setSelectCoupon(coupon) {
			this.selectCoupon = coupon
		},
		setSystem(name) {
			this.system = name
		}
	},
});

export default useUserStore;