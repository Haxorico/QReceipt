class HttpError extends Error {
	constructor(errorCode, message) {
		super(message);
        // this.message = message;
		this.code = errorCode;
	}
}

export default HttpError;
