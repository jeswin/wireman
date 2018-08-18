export type DependencyArg = string | IDependency;

export interface IDependency {
  name: string;
  location: string;
}

export interface IConfigArg {
  build: string;
  localDependencies: DependencyArg[];
}

export interface IConfig {
  name: string;
  build: string;
  localDependencies: IDependency[];
}
