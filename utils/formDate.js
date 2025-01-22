export const dateToChinese = (dateString) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2);
	const day = ("0" + date.getDate()).slice(-2);
	const hour = ("0" + date.getHours()).slice(-2);
	const minute = ("0" + date.getMinutes()).slice(-2);
	const second = ("0" + date.getSeconds()).slice(-2);
	return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
}

export const dateToChineseDate = (dateString) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2);
	const day = ("0" + date.getDate()).slice(-2);
	const hour = ("0" + date.getHours()).slice(-2);
	const minute = ("0" + date.getMinutes()).slice(-2);
	const second = ("0" + date.getSeconds()).slice(-2);
	return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export const dateToYear = (dateString) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2);
	const day = ("0" + date.getDate()).slice(-2);
	return `${year}-${month}-${day}`;
}

export const dateToMinute = (dateString) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2);
	const day = ("0" + date.getDate()).slice(-2);
	const hour = ("0" + date.getHours()).slice(-2);
	const minute = ("0" + date.getMinutes()).slice(-2);
	return `${year}.${month}.${day} ${hour}:${minute}`;
}