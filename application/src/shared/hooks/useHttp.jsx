import { useState, useCallback } from "react";

const useHttp = (requestFunction, defaultRunningStatus = false) => {
	const [isRunning, setIsRunning] = useState(defaultRunningStatus);
	const sendRequest = useCallback(
		async (requestData, onFinish, onError) => {
			setIsRunning(true);
			try {
				const responseData = await requestFunction(requestData);
				setIsRunning(false);
				if (onFinish) onFinish(responseData);
			} catch (error) {
				setIsRunning(false);
				if (onError) onError(error.message || "Something went wrong!");
			}
		},
		[requestFunction]
	);

	return { ...isRunning, sendRequest };
};

export default useHttp;