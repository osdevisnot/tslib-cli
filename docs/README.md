# Introduction

> Maximum overkill for typescript & javascript library authors.

![](.gitbook/assets/intro%20%281%29.jpeg)

## TL;DR

- [OcJS](https://twitter.com/hashtag/0cJS) - Rollup + Jest + Typescript + TSLint + Prettier
- Best Practices setup for build, format, lint and publish workflows
- Save Hours setting up tooling to release a library to NPM.

## Why Typescript ?

As a superset of Javascript, Typescript provides optional typing and deep IntelliSense. When it comes to package development, this is my personal opinion:

> I believe that all packages should be build in Typescript.

Often times, strong typing might seem counter productive and not worth the efforts. I agree when it comes to small scale projects, however for package development, Typescript has some serious advantages:

- More robust code that is easier to maintain.
- The package can be used both by Typescript and Javascript users.
- If your library becomes popular, there will sooner or later be a demand for type definitions and writing those manually is time-consuming, error-prone and harder to update.
- With type definitions in the package, the user don't have to download the types from another package
- Strong typing are more self documenting and makes the code more understandable.
- Even if you consumer doesn't use Typescript, some editors like vscode will use type definitions for much better IntelliSense.

## Installation

Install `tslib-cli` globally, like you normally would.

```bash
yarn global add tslib-cli
```

or if you are still using NPM

```bash
npm install -g tslib-cli
```
