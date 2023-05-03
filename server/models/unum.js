import mongoose from "mongoose";

const unumSchema = new mongoose.Schema({
	name: { type: String, required: true },
	value: { type: Number, required: true },
});

unumSchema.static("new", async function (name) {
	const testUnum = await this.findOne({ name });
	if (testUnum) {
		testUnum.value++;
		await testUnum.save();
		return testUnum.value;
	}
	await this.create({ name, value: 1 });
	return 1;
});

unumSchema.static("clear", async function (name) {
	this.deleteOne({ name });
});

const Unum = mongoose.model("Unum", unumSchema);
export default Unum;
