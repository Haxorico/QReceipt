import mongoose from "mongoose";

export const DB_PORT = 27017;
export const DB_URL = "mongodb://127.0.0.1:";
export const DB_NAME = "qreceipt"
export const SECRETE = "qrcode is 2d";

export const MongoConnect = async (dbName) => {
	if (!dbName) dbName = DB_NAME;
    try {
		if (mongoose.connection.readyState == 1 && mongoose.connection.name === dbName) return mongoose.connection;
		await mongoose.disconnect();
		mongoose.set("strictQuery", false);
		await mongoose.connect(`${DB_URL}${DB_PORT}/${dbName}`);
		console.log(`connected to db at ${DB_URL}${DB_PORT}/${dbName}`);
	} catch (err) {
		console.warn("mognodb error >>| ", err);
		process.exit();
	}
};

export const EmptyDB = async (dbName) => {
	if (dbName) await MongoConnect(dbName);
	await mongoose.connection.db.dropDatabase();
};
