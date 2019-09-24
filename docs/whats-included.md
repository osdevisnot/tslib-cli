# What's Included

## typescript ¯\\_\(ツ\)\_/¯

We use typescript compiler to build and publish our code. The scaffold includes a `tsconfig.json` with modern and reasonable defaults.

Most notably, we use `"target": "esnext"` to publish modern code without a boilerplate, and `"module": "esnext"` to use modern ES modules in our code. You might tweak this if you like. 

Please note that, `tslib-cli` depends on certain properties in `tsconfig.json`.

> Try not to change `module`, `target` and `outDir` properties as `tslib-cli` assumes these for now.

## Builds \(based on `rollup`\)

We use rollup to produce dist files in `esm`, and `cjs` format. The default configuration intentionally avoids producing `umd` bundles.

`tslib-cli` reads the `entry` file from `source` property in `package.json`. The `main`, `module` and `browser` property determines output formats to be produced during build.

> If you would like, try removing`main` property to disable `cjs` output.

The only difference between `module` and `browser` is that the`browser` output is minified.

## Testing \(based on `jest`\)

We use `jest` for testing. Additional configuration needed for `jest` to use `typescript` is also included by default.

Both the test and coverage commands will run all tests found in `tests` directory.

> `test` command will skip watching files under `CI` environments.

## Formatting and Linting

An awesome package should include strict rules for linting and formatting. Especially, if you anticipate more collaborators later on. 

`tslib-cli` uses `prettier` and `tslint` with reasonable default configuration for these tools.

`prettier` is setup to use default prettier options except these overrides:

```javascript
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120,
  "useTabs": true
}
```

`tslint` is setup to use `tslint:recommended` and `tslint-config-prettier` by default, except these overrides:

```javascript
"forin": false,
"interface-name": false,
"no-bitwise": false,
"no-conditional-assignment": false,
"no-console": false,
"no-empty": false,
"no-shadowed-variable": false,
"object-literal-sort-keys": false,
"one-variable-per-declaration": false,
"only-arrow-functions": false,
"variable-name": false
```

## Don't include more than you need in your package !

In the `.gitignore` file, we have `dist` since we don’t want the build-files in our git repository. The opposite goes for a published package. We don’t want the source code, only the build-files!`tslib-cli` whitelists the `files/folders` you want to publish. This is done by adding the files property in package.json:

```javascript
“files”: ["dist”]
```

For more information about whitelisting vs blacklisting in NPM packages see [this post from the NPM blog](https://blog.npmjs.org/post/165769683050/publishing-what-you-mean-to-publish)

