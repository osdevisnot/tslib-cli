const path = require('path');
const json = require('rollup-plugin-json');
const nodeResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const filesize = require('rollup-plugin-filesize');
const replace = require('rollup-plugin-replace');
const shebang = require('rollup-plugin-add-shebang');
const nodeGlobals = require('rollup-plugin-node-globals');
const executable = require('rollup-plugin-executable');
const builtins = require('builtin-modules');
// const minifyHtml = require('rollup-plugin-minify-html-literals');

const command = process.env.COMMAND;

const snakeToCamel = str =>
	str.replace(/([-_][a-z])/g, group =>
		group
			.toUpperCase()
			.replace('-', '')
			.replace('_', ''),
	);

const saneName = str => snakeToCamel(str.replace('@', '').replace('/', '.'));

const pkg = require(path.join(process.cwd(), 'package.json'));

let external = Object.keys(Object.assign({}, pkg.peerDependencies || {}, pkg.dependencies || {}));

const config = options => ({
	input: options.input,
	output: options.output,
	external: options.bin ? [...builtins, ...external] : external,
	plugins: [
		json(),
		options.bin && nodeGlobals(),
		nodeResolve({ mainFields: ['module', 'main'], preferBuiltins: !!options.bin }),
		typescript({
			useTsconfigDeclarationDir: true,
			tsconfigOverride: {
				include: [command === 'deploy' ? 'public' : 'src'],
				compilerOptions: { declaration: command === 'build' },
			},
			typescript: require('typescript'),
		}),
		commonjs(),
		(command === 'start' || command === 'watch' || options.replace) &&
			replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
		command === 'start' && serve({ contentBase: ['dist', 'public'], historyApiFallback: true, port: 1234 }),
		command === 'start' && livereload('dist'),
		(options.minify || command === 'deploy') &&
			terser({
				ecma: 6,
				mangle: { properties: { regex: new RegExp('^_') } },
				compress: { drop_console: true, drop_debugger: true, passes: 3 },
			}),
		options.minify && filesize({ showBrotliSize: true }),
		options.bin && shebang({ include: options.output.file }),
		options.bin && executable(),
	].filter(Boolean),
});

const bundles =
	command === 'start'
		? [{ input: pkg.example, output: { file: pkg.browser || pkg.module, format: 'es' } }]
		: [
				pkg.browser && {
					input: pkg.source,
					output: { file: pkg.browser, format: 'umd', name: saneName(pkg.name) },
					minify: true,
					replace: true,
				},
				pkg.unpkg && { input: pkg.source, output: { file: pkg.browser, format: 'es' }, minify: true, replace: true },
				pkg.module && { input: pkg.source, output: { file: pkg.module, format: 'es' } },
				pkg.main && { input: pkg.source, output: { file: pkg.main, format: 'cjs' } },
				pkg.bin && { input: pkg.source, output: { file: Object.values(pkg.bin)[0], format: 'cjs' }, bin: true },
		  ].filter(Boolean);

module.exports = bundles.map(option => config(option));
