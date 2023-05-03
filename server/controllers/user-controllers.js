import User from "../models/user.js";

export const Login = async (req, res, next) => {
	try {
		const { username, password, token } = req.body;
		const user = token ? await User.verify(token) : await User.login(username, password);
		res.json({ user });
	} catch (err) {
		next(err);
	}
};

export const List = async (req, res, next) => {
	try {
		const users = await User.find({}, { __v: 0, password: 0 }, { lean: true });
		res.json({ users });
	} catch (err) {
		next(err);
	}
};

export const Register = async (req, res, next) => {};
