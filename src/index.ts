import fs = require("fs");
import path = require("path");

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
const updateScript = path.join(__dirname, "update.sh");

async function update(cwd: string, config: IConfig) {
  for (const dep of config.localDependencies) {
    const depConfigPath = path.join(dep.location, "wireman.json");

    if (fs.existsSync(depConfigPath)) {
      const depConfig = await readConfig(depConfigPath);
      await update(dep.location, depConfig);
    }
  }
}

async function readConfig(dir: string): Promise<IConfig> {
  const configFromFile: IConfigArg = require(path.join(dir, "wireman.json"));
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

const helpText = `
Unknown option. Valid options are:
  wireman update
    build and 'npm link' all local dependencies.
  wireman pack
    Add local dependencies to package.json.
  wireman unpack
    Remove local dependencies from package.json
`.trim();

async function main() {
  const cmd = process.argv[2];
  if (cmd === "update") {
    const cwd = process.cwd();
    const config = await readConfig(argv.config || cwd);
    update(cwd, config);
  } else {
    console.log(helpText);
  }
}

main();
