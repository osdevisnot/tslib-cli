# What's Included

#### typescript ¯\\_\(ツ\)\_/¯

We use typescript compiler to build and publish our code. The scaffold included a `tsconfig.json` with modern and resonable defaults. Most notably, we use

```javascript
"target": "esnext"
```

to publish modern code without a boilerplate. However, you might tweak this as you might prefer. `tslib-cli` depends on certain properties in `tsconfig.json`. Try not to change `module`, `target` and `outDir` properties.

#### Builds \(based on `rollup`\)

We use rollup to produce dist files in `esm`, and `cjs` format.

The `entry` file for rollup is read from `source` property in `package.json`. The `main`, `module` and `browser` property determines output formats to be produced during build. If you would like, you can remove `main` property to disable generating `cjs` output.

The only different between `module` and `browser` is `browser` output is minified.

If you want to tweak the configuration, you can use eject command like so:

```bash
tslib eject rollup
```

and configure `rollup` as you prefer. Doing so, will use your configuration for builds.

#### Testing \(based on `jest`\)

We use `jest` for testing. Additional configuration needed for `jest` is also included by default. Both the test and coverage commands will run all tests found in `tests` directory.

Note: `test` command will skip watching files under `CI` environments. This is needed as some `CI` environments rely on `test` command in `package.json`

#### Formatting and Linting

An awesome package should include strict rules for linting and formatting. Especially if you want more collaborators later on. `tslib-cli` uses `prettier` and `tslint` with reasonable default configuration for these tools. If you want to tweak the configuration, you can use eject command like so:

```bash
tslib eject prettier
# or
tslib eject tslint
```

and configure the tools as you prefer. Doing so, will use your configuration for `prettier` and/or `tslint`, but use default for other tools.

#### Don't include more than you need in your package !

In our `.gitignore` file, we added `dist` since we don’t want the build-files in our git repository. The opposite goes for a published package. We don’t want the source code, only the build-files!

`tslib-cli` whitelists the files /folders you want to publish. This can be done by adding the files property in package.json:

```javascript
“files”: ["dist”]
```

For more information about whitelisting vs blacklisting in NPM packages see [this post from the NPM blog](https://blog.npmjs.org/post/165769683050/publishing-what-you-mean-to-publish)

