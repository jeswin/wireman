import childProcess = require("child_process");
import fs = require("fs");
import path = require("path");

import getOS from "./getOS";
import printErrorsAndExit from "./printErrorsAndExit";
import readConfig from "./readConfig";
import { IConfig } from "./types";

export interface ILinkingContext {
  alreadyBuilt: string[];
}

export default async function link(
  projDir: string,
  config: IConfig,
  context: ILinkingContext
) {
  for (const dep of config.localDependencies) {
    const depConfig = await readConfig(dep.location);
    if (depConfig && !context.alreadyBuilt.includes(dep.location)) {
      await link(dep.location, depConfig, context);
      context.alreadyBuilt.push(dep.location);
    }
  }

  /*
    The shell script will...
    1. We switch to the dependecy directory directory.
    2. Do an npm link <dep-name>
    3. Check if the dependency directory has changed (compare md5 of contents)
    4. If so (3), do a build
    5. If so (3), npm link
  */
  console.log(`Building ${projDir}...`);
  for (const dep of config.localDependencies) {
    console.log(`Linking ${dep.name} (${dep.location})`);
    try {
      childProcess.execSync(`npm link ${dep.name}`);
    } catch (ex) {
      printErrorsAndExit(ex, config.name);
    }
  }

  try {
    const linkScript = path.join(__dirname, `link-${getOS()}.sh`);
    const result = childProcess.execSync(
      `${linkScript} "${projDir}" "${config.build}"`
    );
    console.log(result.toString());
  } catch (ex) {
    printErrorsAndExit(ex, config.name);
  }
}