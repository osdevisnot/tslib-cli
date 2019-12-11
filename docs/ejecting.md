# Ejecting

## Ejecting from `tslib-cli`'s defaults.

By default, `tslib-cli` include reasonable and modern default to underlying tools. However, it's possible to configure these tools independently by ejecting a configuration for specific tool. You can use `eject` command to get started.

```bash
tslib eject <tool>
```

this will add `<tool>.config.json` or `<tool>.config.js` file at the root of your project for you to tweak configuration. All the CLI commands should now use your ejected config.

### Ejecting `jest`

```bash
tslib eject jest
```

This will create a `jest.config.js` file at root of the project. Both `test` and `coverage` commands should now use this config.

### Ejecting `rollup`

```bash
tslib eject rollup
```

This will create a `rollup.config.js` file at the root of project. `build`, `watch` and `start` commands should now use this config.

### Ejecting `tslint`

```bash
tslib eject tslint
```

This will create a `tslint.config.json` at the root of project. The `lint` command should now use this config.

### Ejecting `prettier`

```bash
tslib eject prettier
```

This will create `prettier.config.json` at the root of the project.

> For `prettier`, you need to manually change a `prettier` property in `package.json`. This might change in future.
