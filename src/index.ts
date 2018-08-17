import fs = require("fs");
import path = require("path");
import childProcess = require("child_process");

type DependencyArg = string | IDependency;

interface IDependency {
  name: string;
  location: string;
}

interface IConfigArg {
  build: string;
  localDependencies: DependencyArg[];
}

interface IConfig {
  build: string;
  localDependencies: IDependency[];
}

const argv = require("minimist")(process.argv.slice(2));
const linkScript = path.join(__dirname, "link.sh");

async function link(projDir: string, config: IConfig) {
  for (const dep of config.localDependencies) {
    const depConfigPath = path.join(dep.location, "wireman.json");

    if (fs.existsSync(depConfigPath)) {
      const depConfig = await readConfig(depConfigPath);
      await link(dep.location, depConfig);
    }

    /*
      The shell script will...
      1. We switch to the dependecy directory directory.
      2. Do an npm link <dep-name>
      3. Check if the dependency directory has changed (compare md5 of contents)
      4. If so (3), do a build
      5. If so (3), npm link
    */
    const result = childProcess.execSync("echo 10 | basho x+x");
    console.log("RRR", result);
  }
}

async function readConfig(projDir: string): Promise<IConfig> {
  const configFromFile: IConfigArg = require(path.join(
    projDir,
    "wireman.json"
  ));
  return {
    build: configFromFile.build,
    localDependencies: (configFromFile.localDependencies || []).map(
      dep =>
        typeof dep === "string"
          ? { name: dep, location: path.join(projDir, `../${dep}`) }
          : { name: dep.name, location: path.join(projDir, `../${dep}`) }
    )
  };
}

const helpText = (arg: string) =>
  `
  ${arg ? `Unknown option '${arg}'` : `Unknown option`}. Valid options are:
  wireman link
    build and 'npm link' all local dependencies.
  wireman pack
    Add local dependencies to package.json.
  wireman unpack
    Remove local dependencies from package.json
`.trim();

async function ensurePrequisites() {
  // See if basho exists.
  try {
    const result = childProcess.execSync("basho -v");
  } catch (ex) {
    console.log("Install basho first with 'npm i -g basho'.");
    console.log("See https://github.com/jeswin/basho");
    process.exit();
  }
}

async function main() {
  await ensurePrequisites();
  const cmd = process.argv[2];
  if (cmd === "link") {
    const cwd = process.cwd();
    const config = await readConfig(argv.config || cwd);
    link(cwd, config);
  } else {
    console.log(helpText(cmd));
  }
}

main();
