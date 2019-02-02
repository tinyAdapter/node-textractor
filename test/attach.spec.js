const Textractor = require("../lib").Textractor;
const describe = require("mocha").describe;
const expect = require("chai").expect;
const validRelativePath = require("./constructor.spec").validRelativePath;

describe("#attach", () => {
  it("throws ReferenceError if Textractor process is not started", () => {
    let t = new Textractor(validRelativePath);
    expect(() => {
      t.attach(0);
    }).to.throw(ReferenceError, "Textractor not started");
  });

  it("throws RangeError if pid is invalid", () => {
    let t = new Textractor(validRelativePath);
    t.start();
    expect(() => {
      t.attach(-1);
    }).to.throw(RangeError, "invalid process ID");
    expect(() => {
      t.attach(65536);
    }).to.throw(RangeError, "invalid process ID");
    t.stop();
  });
});
