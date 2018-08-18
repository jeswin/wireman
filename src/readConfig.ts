import fs = require("fs");
import path = require("path");
import { IConfig, IConfigArg } from "./types";

export default async function readConfig(
  projDir: string
): Promise<IConfig | undefined> {
  const configPath = path.join(projDir, "wireman.json");
  if (fs.existsSync(configPath)) {
    const configFromFile: IConfigArg = require(configPath);
    const packageJson = require(path.join(projDir, "package.json"));
    return {
      build: configFromFile.build,
      localDependencies: (configFromFile.localDependencies || []).map(dep => {
        return typeof dep === "string"
          ? (() => {
              const depPackageJson = require(path.resolve(
                projDir,
                `../${dep}`,
                "package.json"
              ));
              return {
                location: path.resolve(projDir, `../${dep}`),
                name: depPackageJson.name
              };
            })()
          : (() => {
              const depPackageJson = require(path.resolve(
                projDir,
                `../${dep.name}`,
                "package.json"
              ));
              return {
                location: path.resolve(projDir, `../${dep}`),
                name: depPackageJson.name
              };
            })();
      }),
      name: packageJson.name
    };
  }
}
