const Textractor = require("../lib").Textractor;
const describe = require("mocha").describe;
const expect = require("chai").expect;

exports.expectedAbsolutePath = "E:\\yagt\\Textractor86\\TextractorCLI.exe";
exports.validAbsolutePath = "E:/yagt/Textractor86/TextractorCLI.exe";
exports.validRelativePath = "../../Textractor86/TextractorCLI.exe";
exports.PID = 8104;

describe("#Textractor", () => {
  it("accepts absolute path", () => {
    let t = new Textractor(exports.validAbsolutePath);
    expect(t.path).to.equal(exports.expectedAbsolutePath);
  });

  it("accepts relative path", () => {
    let t = new Textractor(exports.validRelativePath);
    expect(t.path).to.equal(exports.expectedAbsolutePath);
  });
});
