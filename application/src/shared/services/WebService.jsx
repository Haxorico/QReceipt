import { LoadToken } from "./AuthService";

export const BE_URL = process.env.REACT_APP_BE_URL || "/api/";

const serialize = (obj) => {
	if (!obj) return "";
	const str = [];
	for (const p in obj) {
		if (obj.hasOwnProperty(p)) {
			if (typeof obj[p] == typeof []) str.push(encodeURIComponent(p) + "[]=" + obj[p].join("&" + encodeURIComponent(p) + "[]="));
			else str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	}
	return "?" + str.join("&");
};

const sendRequest = async (sendType, url, dataToSend) => {
	const token = LoadToken();
	const response = await fetch(url, {
		method: sendType,
		body: JSON.stringify(dataToSend),
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	});

	if (!response.ok) throw await response.json();

	return await response.json();
};

export const GetData = async (route, queryData) => {
	const queryString = serialize(queryData);
	const URL = BE_URL + route + queryString;
	return await sendRequest("GET", URL, undefined);
};

export const AddData = async (route, dataToAdd) => {
	const URL = BE_URL + route;
	return await sendRequest("POST", URL, dataToAdd);
};

export const UpdateData = async (route, dataToUpdate) => {
	const URL = BE_URL + route;
	return await sendRequest("PUT", URL, dataToUpdate);
};