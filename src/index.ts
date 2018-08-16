const path = require("path");
const argv = require("minimist")(process.argv.slice(2));

const cmd = process.argv[2];

type DependencyArg = string | IDependency;

interface IDependency {
  name: string;
  location?: string;
}

interface IConfigArg {
  build: string;
  localDependencies: DependencyArg[];
}

interface IConfig {
  build: string;
  localDependencies: IDependency[];
}

async function update(cwd: string, config: IConfig) {
  for (const dep of config.localDependencies) {
    if (fs.existsSync(dep.location)) {
      await update(dep.location, await readConfig(dep.location));
    }
    // npm link
  }
}

async function readConfig(dir: string): IConfig {
  const configFromFile: IConfigArg = require(path.join(dir, "linkman.json"));
  return {
    build: configFromFile.build,
    localDependencies: configFromFile.localDependencies.map(
      dep =>
        typeof dep === "string"
          ? { name: dep, location: path.join(dir, `../${dep}`) }
          : { name: dep.name, location: path.join(dir, `../${dep}`) }
    )
  };
}

async function main() {
  const cwd = process.cwd();
  const config = readConfig(argv.config || cwd);

  if (cmd === "update") {
    update(cwd, config);
  } else {
    console.log("Unknown option. Valid options are:");
    console.log("   linkman update");
    console.log("       'npm link' all local dependencies.");
    console.log("   linkman package");
    console.log("       Add local dependencies to package.json.");
  }
}

main();
