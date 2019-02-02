const Textractor = require("../lib").Textractor;
const describe = require("mocha").describe;
const expect = require("chai").expect;
const validRelativePath = require("./constructor.spec").validRelativePath;

describe("#detach", () => {
  it("throws ReferenceError if the process has not been attached", () => {
    let t = new Textractor(validRelativePath);
    expect(() => {
      t.detach(0);
    }).to.throw(ReferenceError, "process has not been attached");
  });
});
