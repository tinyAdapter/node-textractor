const Textractor = require("../lib").Textractor;
const describe = require("mocha").describe;
const expect = require("chai").expect;
const validRelativePath = require("./constructor.spec").validRelativePath;

const validHCode = "/HW-1C@C8B8:advhd.exe";
const invalidCode = "//";

describe("#hook", () => {
  it("throws ReferenceError if Textractor process is not started", () => {
    let t = new Textractor(validRelativePath);
    expect(() => {
      t.hook(0, validHCode);
    }).to.throw(ReferenceError, "Textractor not started");
    t.stop();
  });

  it("throws ReferenceError if the process has not been attached", () => {
    let t = new Textractor(validRelativePath);
    t.start();
    expect(() => {
      t.hook(0, validHCode);
    }).to.throw(ReferenceError, "process has not been attached");
    t.stop();
  });

  it("throws SyntaxError if code is invalid", () => {
    let t = new Textractor(validRelativePath);
    t.start();
    t.attach(0);
    expect(() => {
      t.hook(0, invalidCode);
    }).to.throw(SyntaxError, "invalid code");
    t.stop();
  });
});
