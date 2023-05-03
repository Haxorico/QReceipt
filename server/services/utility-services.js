import HttpError from "../models/http-error.js";

export const CreateHttpError = (code, message) => {
	throw new HttpError(code,message);
};
