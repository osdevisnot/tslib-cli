# Introduction

> maximum overkill for typescript and javascript library authors

![](.gitbook/assets/intro.jpeg)

### TL;DR

* [OcJS](https://twitter.com/hashtag/0cJS) - Rollup + Jest + Typescript + TSLint
* Best Practices setup for build, format, lint and publish workflows
* Save Hours \(often days\) setting up tooling to release a library to NPM

### Why Typescript ?

As a superset of Javascript, Typescript provides optional typing and deep intellisense. When it comes to package development, this is my personal opinion:

> I believe that all packages should be build in Typescript

Some of you might feel that the strong typing decreases productivity and it's not worth the efforts. I can agree when it comes to small scale projects, however, when it comes to package development, Typescript has some serious advantages:

* More robust code that is easier to maintain
* The package can be used both for Typescript and Javascript users!
* If your library becomes popular, there will sooner or later be a demand for type definitions, and writing those manually is time-consuming, error-prone and harder to update.
* With type definitions in the package, the user don't have to download the types from another package
* Strong typing are more self documenting and makes the code more understandable.
* Even if you consumer doesn't use Typescript, some editors, like vscode will use type definitions for much better intellisense.

### Installation

Install `tslib-cli` globally, like you normally would.

```bash
npm install -g tslib-cli
```

or with yarn

```bash
yarn global add tslib-cli
```

