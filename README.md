# tslib-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/osdevisnot/tslib-cli.svg)](https://greenkeeper.io/)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fosdevisnot%2Ftslib-cli.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fosdevisnot%2Ftslib-cli?ref=badge_shield)

> Maximum Overkill for Typescript Library Authors

An opinionated wrapper around `typescript`, `rollup`, `jest` and `typedoc`

## Features

- [x] Scaffold a new library.
- [x] Provides a live-reloading developement server
- [x] Create production ready bundles
- [x] Test Infrastructure based on `jest`
- [x] Support Monorepo Infra (based on `lerna`)
- [x] API Documentation in MD (based on `typedoc`)
- [x] Provide a Publish Workflow
- [x] Minimal Config Files (only `tsconfig.json` and `package.json` needed)

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

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fosdevisnot%2Ftslib-cli.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fosdevisnot%2Ftslib-cli?ref=badge_large)
