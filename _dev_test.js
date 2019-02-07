const Textractor = require("./lib").Textractor;

let t = new Textractor("../Textractor86/TextractorCLI.exe");

let PID = parseInt(process.argv[2]);

t.on("output", output => {
  console.log(`[${output.code}] ${output.text}`);
});
t.start();
setTimeout(() => {
  t.attach(PID);
}, 2000);
