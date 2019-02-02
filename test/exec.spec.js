const Textractor = require("../lib").Textractor;
const describe = require("mocha").describe;
const expect = require("chai").expect;
const validRelativePath = require("./constructor.spec").validRelativePath;

describe("#exec", () => {
  it("throws ReferenceError if Textractor process is not started", () => {
    let t = new Textractor(validRelativePath);
    expect(() => {
      t.exec("attach -P0");
    }).to.throw(ReferenceError, "Textractor not started");
  });
});
