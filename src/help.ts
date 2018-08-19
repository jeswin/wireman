export default function(arg: string) {
  return `
  ${arg ? `Unknown option '${arg}'` : `Unknown option`}. Valid options are:
  wireman link
    build and 'npm link' all local dependencies.
  wireman build
    build and 'npm link' all local dependencies and builds the main project.
  wireman pack
    Add local dependencies to package.json.
  wireman unpack
    Remove local dependencies from package.json
`.trim();
}
