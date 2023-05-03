import { expect } from "chai";
import { MongoConnect } from "../../libs/mongodb.js";
import Unum from "../../models/unum.js";

describe("Model-Unum", function () {
  before(async () => {
    await MongoConnect("test-model-unum");
    await Unum.deleteMany();
  });

  describe("#Static - new", () => {
    it("Should create a new unum", async () => {
      let test1Amount = await Unum.countDocuments({ name: "test1" });
      expect(test1Amount).eq(0);
      await Unum.new("test1");
      test1Amount = await Unum.countDocuments({ name: "test1" });
      expect(test1Amount).eq(1);
    });
    it("Should increase unum number of same test", async () => {
      let val = await Unum.new("test2");
      expect(val).eq(1);
      val = await Unum.new("test2");
      expect(val).eq(2);
    });
  });
  describe("#Static - clear", () => {
    it("Should remove unum name", async () => {
      let test1Amount = await Unum.countDocuments({ name: "test3" });
      expect(test1Amount).eq(0);
      await Unum.new("test3");
      test1Amount = await Unum.countDocuments({ name: "test3" });
      expect(test1Amount).eq(1);
      await Unum.clear("test3")
      test1Amount = await Unum.countDocuments({ name: "test3" });
      expect(test1Amount).eq(0);
    });
    
  });
});
