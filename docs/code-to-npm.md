# vscode to NPM \(3 easy steps\)

## vscode to NPM in 3 easy steps

### Step 1: Pick a great Project name

This one is definitely harder than it sounds. Considering the fact that NPM is now world's largest library of reusable software packages, it is very likely, the name that you had in mind, might already be taken.

I personally use [`english-words-that-are-not-yet-npm-packages`](https://www.npmjs.com/package/english-words-that-are-not-yet-npm-packages) or [`available`](https://www.npmjs.com/package/available) and look through the list to see if I can find a meaningful name that resembles what I had in mind.

After wasting a lot of time, I would finally settle on [Creating and publishing an Org scoped package](https://docs.npmjs.com/creating-and-publishing-an-org-scoped-package)

### Step 2: Initialize the project

Assuming you did pick up a meaningful name, initialize the project with one simple command:

```bash
tslib init <insert-project-name>
```

This will ask you few questions for the metadata of the package, populate all the appropriate places with the metadata you entered and prepare your library to be released to NPM.

### Step 3: Release to NPM

Assuming Step 1 and 2 was ok, you are now ready to publish to NPM. Use built-in `pub` command to 🚀 your project.

```bash
tslib pub
```

Similar to `init` command, `pub` will also ask you for metadata. Thankfully, just the version number you want to publish.

> Pro Tip: This is good time to publish your package to claim the name on NPM. Often times, the names that are first shown as available, won't actually be available as NPM restricts names that closely match an existing name.

