# tslib-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/osdevisnot/tslib-cli.svg)](https://greenkeeper.io/)

> Maximum Overkill for Typescript Library Authors

An opinionated wrapper around `typescript`, `rollup`, `jest` and `typedoc`

## Features

- [x] Scaffold a new library based on [starter-typescript-library](https://github.com/osdevisnot/starter-typescript-library)
- [x] Provides a live-reloading developement server
- [x] Create production ready bundles
- [x] Test Infrastructure based on `jest`
- [x] API Documentation in MD (based on `typedoc`)
- [x] Provide a Publish Workflow

### TODOS

- [ ] Support Javascript only projects
- [ ] Reduce config files (0cJS)

## Usage

First, install `tslib-cli` globally:

```bash
npm install -g tslib-cli
```

## Commands

To create a new Library:

```bash
tslib init my-lib
```

To start a development server:

```bash
tslib start
```

To build release ready dist of your library:

```bash
tslib build
```

Run tests for your library:

```bash
tslib test
```

Get coverage reports:

```bash
tslib coverage
```

To create documentation:

```bash
tslib docs
```

To publish a new version:

```bash
tslib pub
```

To clean CWD:

```bash
tslib setup
```
