import mongoose from "mongoose";
import md5 from "md5";
import jsonwebtoken from "jsonwebtoken";
import { CreateHttpError } from "../services/utility-services.js";
import { SECRETE } from "../libs/mongodb.js";
import Unum from "./unum.js";

const userSchema = new mongoose.Schema({
	firstname: { type: String, required: true },
	surname: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	unum: { type: Number, required: true },
	role: { type: Number, default: 0 },
});

userSchema.static("create", async function (userData) {
	if (!userData?.password || userData.password.length === 0) CreateHttpError(500, "Password is missing");
	if (!userData.username || userData.username.length === 0) CreateHttpError(500, "Username is missing");
	if (!userData.email || userData.email.length === 0) CreateHttpError(500, "email is missing");
	if (userData.password.length < 6) CreateHttpError(500, "Password is too short: 6 characters minimum");
	userData.password = md5(userData.password);
	userData.email = userData.email.toLowerCase();
	userData.username = userData.username.toLowerCase();
	//check for existing email
	const existingUser = await this.findOne(
		{ $or: [{ email: userData.email }, { username: userData.username }] },
		{ username: 1, email: 1 },
		{ lean: true }
	);
	if (existingUser) {
		const { username, email } = existingUser;
		if (username === userData.username) CreateHttpError(500, `Username already exists: ${userData.username}`);
		if (email === userData.email) CreateHttpError(500, `Email already exists: ${userData.email}`);
	}
	const unum = await Unum.new("user");
	const user = new User({ ...userData, unum });
	await user.save();
	return user;
});

userSchema.static("login", async function (username, password) {
	// db.collection.find({name:{'$regex' : '^string$', '$options' : 'i'}})

	const user = await this.findOne(
		{ username: { $regex: username, $options: "i" }, password: md5(password) },
		{ _v: 0, password: 0 },
		{ lean: true }
	).orFail(() => CreateHttpError(500, "Username/Password are incorrect"));
	user.token = jsonwebtoken.sign({ userId: user._id }, SECRETE, { expiresIn: "24h" });
	return user;
});

userSchema.static("verify", async function (token) {
	const { userId } = jsonwebtoken.verify(token, SECRETE);
	const user = await this.findById(userId, { _v: 0, password: 0 }, { lean: true });
	if (!user) CreateHttpError(500, "invalid userId")
	user.token = token;
	return user;
});


const User = mongoose.model("user", userSchema);
export default User;
