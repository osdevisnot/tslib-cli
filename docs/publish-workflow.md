# The Publish Workflow

For an awesome package, we should of course automate as much as possible. Inspired by [np](https://www.npmjs.com/package/np), `tslib-cli` follows below workflow for publishing to NPM:

* Re-Installs dependencies to ensure your project works with the latest dependency tree.
* Formats your code to ensure unformatted code is not published.
* Lints your code to ensure published version meets the quality standards.
* Runs the tests.
* Ensures the working directory is clean
* Asks you new version to be published
* Publishes the new version to npm
* Pushes commits and tags \(newly & previously created\) to GitHub/GitLab

## 

