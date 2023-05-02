export const CreateHttpError = (code, message) => {
	throw { code, message };
};
