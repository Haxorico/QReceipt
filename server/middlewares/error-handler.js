export const ErrorHandler = (err, req, res, next) => {
	console.warn("path >>| ", req.path);
	console.warn("err >>| ", err);
	if (err.code === 404) err.message += req.path
	return res.status(err.code || 505).json({ message: err.message });
}