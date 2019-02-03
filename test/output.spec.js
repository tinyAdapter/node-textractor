const Textractor = require("../lib").Textractor;
const describe = require("mocha").describe;
const expect = require("chai").expect;
const validRelativePath = require("./constructor.spec").validRelativePath;

describe("#output", () => {
  it("outputs correct object when data arrives", done => {
    let t = new Textractor(validRelativePath);
    t.on("output", output => {
      expect(output.handle).to.equal(2);
      expect(output.pid).to.equal(4);
      expect(output.addr).to.equal(8);
      expect(output.ctx).to.equal(16);
      expect(output.ctx2).to.equal(31);
      expect(output.name).to.equal("SomeName");
      expect(output.text).to.equal("「あ、あの、お嬢様……！」");
      done();
    });
    t.onData("[2:4:8:10:1F:SomeName] 「あ、あの、お嬢様……！」");
  });

  it("does not output anything if non-data arrives", done => {
    let somethingOutput = false;

    let t = new Textractor(validRelativePath);
    t.on("output", () => {
      somethingOutput = true;
    });
    t.onData("Usage: {'attach'|'detach'|hookcode} -Pprocessid");
    process.nextTick(() => {
      expect(somethingOutput).to.equal(false);
      done();
    });
  });
});
