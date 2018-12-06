# tslib-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/osdevisnot/tslib-cli.svg)](https://greenkeeper.io/)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fosdevisnot%2Ftslib-cli.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fosdevisnot%2Ftslib-cli?ref=badge_shield)

> Maximum Overkill for Typescript Library Authors

## Usage:

Install this package as dev dependency:

```
yarn add --dev tslib-cli
```

Create a rollup.config.js file at root of your project:

```
const bundles = require('tslib-cli');

export default bundles([
  {
    input: 'src/library.ts', // your library src code
    output: { format: 'cjs', file: 'dist/cjs/index.js' },
    tsconfigOverride: { compilerOptions: { target: 'es5' } },
    external: ['lit-html']
  },
  {
    input: 'src/library.ts', // your library src code
    output: { format: 'es', file: 'dist/esm/index.js' },
    external: ['lit-html']
  },
  {
    input: 'src/library.ts', // your library src code
    output: { format: 'iife', file: 'dist/mylib.js', name: 'mylib' },
    tsconfigOverride: { compilerOptions: { target: 'es5' } }
  },
]);
```

Add scripts to your package json:

```
"scripts": {
  "build": "rollup -c",
  "start": "rollup -wc"
}
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fosdevisnot%2Ftslib-cli.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fosdevisnot%2Ftslib-cli?ref=badge_large)