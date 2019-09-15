const path = require('path');
const json = require('rollup-plugin-json');
const nodeResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript');
const commonjs = require('rollup-plugin-commonjs');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const filesize = require('rollup-plugin-filesize');
const replace = require('rollup-plugin-replace');

const command = process.env.COMMAND;

const pkg = require(path.join(process.cwd(), 'package.json'));

let external = Object.keys(pkg.peerDependencies || {});

const config = options => ({
  input: options.input,
  output: options.output,
  external: options.external || external,
  plugins: [
    json(),
    nodeResolve({ mainFields: ['module', 'main'] }),
    typescript(),
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
  ].filter(Boolean),
});

const bundles =
  command === 'start'
    ? [{ input: 'public/index.tsx', output: { file: 'dist/index.js', format: 'es' } }]
    : [
        pkg.browser && { input: pkg.source, output: { file: pkg.browser, format: 'es' }, minify: true, replace: true },
        pkg.module && { input: pkg.source, output: { file: pkg.module, format: 'es' } },
        pkg.main && { input: pkg.source, output: { file: pkg.main, format: 'cjs' } },
      ].filter(Boolean);

module.exports = bundles.map(option => config(option));
