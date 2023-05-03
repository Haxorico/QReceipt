import { expect } from "chai";
import { MongoConnect } from "../../libs/mongodb.js";
import User from "../../models/user.js";

describe("Model-User", function () {
	before(async () => {
		await MongoConnect("test-model-user");
		await User.deleteMany();
		await User.create({
			firstname: "Ronen",
			surname: "Goland",
			username: "RonenGN",
			password: "135790",
			email: "ronen.goland@gmail.com",
		});
	});

	describe("#Static - Create", () => {
		beforeEach(async () => {
			await User.deleteOne({ firstname: "f" });
			//TODO add fixtures
		});
		it("Should create a user", async () => {
			const oldUsersAmount = await User.countDocuments();
			await User.create({ firstname: "f", surname: "s", username: "u", password: "123456", email: "e" });
			const newUsersAmount = await User.countDocuments();
			expect(oldUsersAmount + 1).eq(newUsersAmount);
		});

		it("Should create a user with encrypted password", async () => {
			const user = await User.create({ firstname: "f", surname: "s", username: "u", password: "123456", email: "e" });
			expect(user.password.length).greaterThan(10);
		});

		it("Should NOT create a user with existing email", async () => {
			const oldUsersAmount = await User.countDocuments();
			try {
				await User.create({ firstname: "f", surname: "s", username: "u", password: "123456", email: "ronen.goland@gmail.com" });
			} catch (err) {
				expect(err.message).contain("Email already exists");
			} finally {
				const newUsersAmount = await User.countDocuments();
				expect(oldUsersAmount).eq(newUsersAmount);
			}
		});

		it("Should NOT create a user with existing email (case-insensitive)", async () => {
			const oldUsersAmount = await User.countDocuments();
			try {
				await User.create({ firstname: "f", surname: "s", username: "u", password: "123456", email: "rOneN.golaNd@gmAil.com" });
			} catch (err) {
				expect(err.message).contain("Email already exists");
			} finally {
				const newUsersAmount = await User.countDocuments();
				expect(oldUsersAmount).eq(newUsersAmount);
			}
		});

		it("Should NOT create a user with missing email", async () => {
			const oldUsersAmount = await User.countDocuments();
			try {
				await User.create({ firstname: "f", surname: "s", username: "u", password: "123456" });
			} catch (err) {
				expect(err.message).contain("email is missing");
			} finally {
				const newUsersAmount = await User.countDocuments();
				expect(oldUsersAmount).eq(newUsersAmount);
			}
		});

		it("Should NOT create a user with existing username", async () => {
			const oldUsersAmount = await User.countDocuments();
			try {
				await User.create({ firstname: "f", surname: "s", username: "RonenGN", password: "123456", email: "e" });
			} catch (err) {
				expect(err.message).contain("Username already exists");
			} finally {
				const newUsersAmount = await User.countDocuments();
				expect(oldUsersAmount).eq(newUsersAmount);
			}
		});

		it("Should NOT create a user with existing username (case-sensitive)", async () => {
			const oldUsersAmount = await User.countDocuments();
			try {
				await User.create({ firstname: "f", surname: "s", username: "RoNenGN", password: "123456", email: "e" });
			} catch (err) {
				expect(err.message).contain("Username already exists");
			} finally {
				const newUsersAmount = await User.countDocuments();
				expect(oldUsersAmount).eq(newUsersAmount);
			}
		});

		it("Should NOT create a user with missing username", async () => {
			const oldUsersAmount = await User.countDocuments();
			try {
				await User.create({ firstname: "f", surname: "s", password: "123456", email: "e" });
			} catch (err) {
				expect(err.message).contain("Username is missing");
			} finally {
				const newUsersAmount = await User.countDocuments();
				expect(oldUsersAmount).eq(newUsersAmount);
			}
		});

		it("Should NOT create a user with out password", async () => {
			const oldUsersAmount = await User.countDocuments();
			try {
				await User.create({ firstname: "f", surname: "s", username: "u", email: "e" });
			} catch (err) {
				expect(err.message).contain("Password is missing");
			} finally {
				const newUsersAmount = await User.countDocuments();
				expect(oldUsersAmount).eq(newUsersAmount);
			}
		});

		it("Should NOT create a user with short password", async () => {
			const oldUsersAmount = await User.countDocuments();
			try {
				await User.create({ firstname: "f", surname: "s", password: "p", username: "u", email: "e" });
			} catch (err) {
				expect(err.message).contain("Password is too short");
			} finally {
				const newUsersAmount = await User.countDocuments();
				expect(oldUsersAmount).eq(newUsersAmount);
			}
		});
	});

	describe("#Static - Login", () => {
		it("Should not login with bad username", async () => {
			try {
				await User.login("1", "2");
			} catch (err) {
				expect(err.message).includes("Username/Password are incorrect");
			}
		});

		it("Should not login with bad password", async () => {
			try {
				const user = await User.login("RonenGN", "2");
			} catch (err) {
				expect(err.message).includes("Username/Password are incorrect");
			}
		});

		it("Should login with good auth", async () => {
			const user = await User.login("RonenGN", "135790");
			expect(user.firstname).eq("Ronen");
		});

		it("Should login with good username not case-sensitive", async () => {
			const user = await User.login("rOneNgN", "135790");
			expect(user.firstname).eq("Ronen");
		});

		it("Should get token with good login", async () => {
			const user = await User.login("RonenGN", "135790");
			expect(user.token.length).greaterThan(10);
		});
	});

	describe("#Static - Verify", () => {
		it("Should not verify with bad token", async () => {
			try {
				const user = await User.verify("1");
			} catch (err) {
				expect(err.message).includes("jwt malformed");
			}
		});
		it("Should not verify with expired token", async () => {
			try {
				await User.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2VhZDYxMjFlODI3YTlhNDI1NjNlMGEiLCJpYXQiOjE2NzYzMzQ2NDMsImV4cCI6MTY3NjQyMTA0M30.U5X8FLEUBUMNOiosyjgAL8QjGl2ELKou6JlrTZJMJk0");
			} catch (err) {
				expect(err.message).includes("invalid signature");
			}
		});

		it("Should verify with good token", async () => {
			const { token } = await User.login("RonenGN", "135790");
			const user = await User.verify(token);
			expect(user.username).eq("ronengn");
		});
	});

});
