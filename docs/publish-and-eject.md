# Publish & Eject

### The Publish Workflow

For an awesome package, we should of course automate as much as possible. Inspired by [np](https://www.npmjs.com/package/np), `tslib-cli` follows below workflow for publishing to NPM:

- Re-Installs dependencies to ensure your project works with the latest dependency tree.
- Formats your code to ensure unformatted code is not published.
- Lints your code to ensure published version meets the quality standards.
- Runs the tests.
- Ensures the working directory is clean
- Asks you new version to be published
- Publishes the new version to npm
- Pushes commits and tags \(newly & previously created\) to GitHub/GitLab

### Ejecting from `tslib-cli`'s defaults.

By default, we include reasonable and modern default to underlying tools. However, it's possible to configure these tools independently by ejecting a specific tool. Use `eject` command to get started.

```bash
tslib eject prettier
```

this will add `prettier.config.json` file at the root of your project for you to tweak configuration. All the CLI commands should now use your ejected config.

Similar to `prettier`, you can eject `jest`, `tslint` and `rollup` configurations.
