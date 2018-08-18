import path = require("path");

import ensurePrerequisites from "./ensurePrerequisites";
import getOS from "./getOS";
import help from "./help";
import link from "./link";
import readConfig from "./readConfig";

const argv = require("minimist")(process.argv.slice(2));

async function main() {
  await ensurePrerequisites();
  const operatingSystem = getOS();

  if (operatingSystem !== "unsupported") {
    const cwd = argv.config
      ? path.resolve(process.cwd(), argv.config)
      : process.cwd();
    const cmd = process.argv[2];
    if (cmd === "link") {
      const config = await readConfig(cwd);
      if (config) {
        link(cwd, config, { alreadyBuilt: [] });
      } else {
        console.log(`Missing wireman.json in ${cwd}.`);
      }
    } else {
      console.log(help(cmd));
    }
  } else {
    console.log(
      `Right now only Linux and OSX is supported. Pull requests are welcome.`
    );
  }
}

main();
