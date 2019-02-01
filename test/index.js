const Textractor = require("../lib").Textractor;

let t = new Textractor("../../Textractor86/TextractorCLI.exe");

t.on("output", output => {
  console.log(output);
});
t.start();
t.attach(parseInt(process.argv[2]));
