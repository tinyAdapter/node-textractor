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

  it("output correct object in the end when multiple line data arrives and first line is empty"
      , done => {
    let t = new Textractor(validRelativePath);
    var times = 0;
    t.on("output", output => {
      if (++times < 2) {
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
          .equal("わずかな灯りに照らされた道の真ん中で、");
      done();
    });
    t.onData(
        "[17:3388:67A78E:0:19F95C:System43:HSN4:-14@27A78E:Haharanman.exe] ");
    t.onData("わずかな灯りに照らされた道の真ん中で、");
  });

  it("output correct object when content starts with square bracket", done => {
    let t = new Textractor(validRelativePath);
    var times = 0;
    t.on("output", output => {
      if (++times < 2) {
        return;
      }
      expect(output.handle).to.equal(0x28);
      expect(output.pid).to.equal(0x08D4);
      expect(output.addr).to.equal(0x1FF7399AF90);
      expect(output.ctx).to.equal(0x1FF7399AEC2);
      expect(output.ctx2).to.equal(0);
      expect(output.name).to.equal("string");
      expect(output.text)
          .to
          .equal(
              "それでいて　みちた　つきのように、" +
              "[カレンダー]:CHECK^1:\"ケン「カレンダーです。\":PAUSE:\"ケン\":\":PAUSE:\"ケン「やはり、ペフルのママの\":\"");
      done();
    });
    t.onData(
      "[28:8D4:1FF7399AF90:1FF7399AEC2:0:string:ReplaceUnchecked (string,string):HQFX14+-1C@1FF7399AF90] " +
        "それでいて　みちた　つきのように、");
    t.onData("[カレンダー]:CHECK^1:\"ケン「カレンダーです。\":PAUSE:\"ケン\":\":PAUSE:\"ケン「やはり、ペフルのママの\":\"");
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
