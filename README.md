# wireman

Build tools for node.js multi-module projects - without having to deploy them to npm for every little change you make. For instance, if you have a project A which depends on B which depends on C, you can use wireman to automatically build (and npm link) project C and project B while building project A.

# Installation

Install yarn and basho first. These are required dependencies for now.
We need yarn because npm has long standing bugs - someone tell them.

```bash
npm i -g basho
```

Then install wireman

```bash
npm i -g wireman
```

# Usage

Create a file called 'wireman.json' in the project's root directory, containing:

- the name of the the build script
- a list of local dependencies which need to be built and linked

The dependencies must be checked out into the same parent directory. For instance, in the above example projects A, B and C must be cloned into the same parent directory.

Here's an example wireman.json

```js
{
  "build": "./build.sh",
  "localDependencies": [
    "some-dep",
    "some-other-dep"
  ]
}
```

Similarly, if the project "some-dep" has its own local dependencies, create a wireman.json in "some-dep" as well.

Once you're done defining wireman config files for all your projects, do this every time you change a project. It will build and link all your projects which have changes since the last time it was run.

```bash
# cd into your project directory
wireman link

# or otherwise
wireman link --config /path/to/project
```

To force a rebuild of all local dependencies (irrespective of whether changed or not):

```bash
wireman link --force
```