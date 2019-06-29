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

  it("output correct object in the end when multiple line data arrives", done => {
    let t = new Textractor(validRelativePath);
    var times = 0;
    t.on("output", output => {
      if (++times < 3) {
        return;
      }
      expect(output.handle).to.equal(0x17);
      expect(output.pid).to.equal(0x3388);
      expect(output.addr).to.equal(0x67A78E);
      expect(output.ctx).to.equal(0);
      expect(output.ctx2).to.equal(0x19F95C);
      expect(output.name).to.equal("System43");
      expect(output.text)
          .to
          .equal(
              "わずかな灯りに照らされた道の真ん中で、わずかな灯りに照らされた道の真ん中で、" +
              "わずかな灯りに照らされた道の真ん中で、" +
              "大柄の男が、ずぶ濡れで立っていた。");
      done();
    });
    t.onData(
        "[17:3388:67A78E:0:19F95C:System43:HSN4:-14@27A78E:Haharanman.exe] " +
        "わずかな灯りに照らされた道の真ん中で、わずかな灯りに照らされた道の真ん中で、");
    t.onData("わずかな灯りに照らされた道の真ん中で、");
    t.onData("大柄の男が、ずぶ濡れで立っていた。");
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
