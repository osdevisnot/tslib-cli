# Input & Output

`tslib-cli` relies on entries in `package.json` to determine input and output for compilation. Specifically, it looks at following properties:

```javascript
{
    "main": "dist/index.cjs.js",
	"module": "dist/index.esm.js",
	"source": "src/index.tsx",
	"browser": "dist/index.js",
	"types": "dist/types/index.d.ts",
	"example": "public/index.tsx",
}
```

#### Input Files

- `source` determines files to compile when using `build` and `watch` commands.
- `example` determines files to compiler when using `start` command

#### Output Files

- `main` determines the target for common js output
- `module` determines the target for ESM output
- `browser` determines the target for minified ESM output
- `types` determines the target for Typescript Definition Files

### Node CLI packages

In addition to compiling source for browser, `tslib-cli` supports compiling for node js, for CLI applications. `tslib-cli` determines this based on if you have a bin property, pointing to a file in your `package.json`.

For example, below configuration in `package.json` will compile `src/index.tsx` to `dist/index.js`. Since this is a binary command, `tslib-cli` will automatically add the shebang line as first line in output and set the file as executable in `unix` like operating systems.

```javascript
"bin": {
    "unpkg": "dist/index.js"
},
"source": "src/index.tsx",
```
