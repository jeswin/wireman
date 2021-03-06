import childProcess = require("child_process");

export default async function ensurePrerequisites() {
  // See if basho exists.
  try {
    const result = childProcess.execSync("basho -v");
  } catch (ex) {
    console.log("Install basho first with 'npm i -g basho'.");
    console.log("See https://github.com/jeswin/basho");
    process.exit();
  }

  // See if yarn exists.
  try {
    const result = childProcess.execSync("yarn -v");
  } catch (ex) {
    console.log("Install yarn first with 'npm i -g yarn'.");
    process.exit();
  }
}
