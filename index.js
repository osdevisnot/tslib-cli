const path = require('path');

const multiEntry = require('rollup-plugin-multi-entry');
const replace = require('rollup-plugin-replace');
const html = require('rollup-plugin-html');
const json = require('rollup-plugin-json');
const nodeResolve = require('rollup-plugin-node-resolve');
const typescript2 = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const terser = require('rollup-plugin-terser').terser;
const filesize = require('rollup-plugin-filesize');

const isDev = !!process.env.ROLLUP_WATCH;
const tsconfig = path.join(process.cwd(), 'tsconfig.json');

const config = options => ({
  input: options.input,
  output: options.output,
  external: options.external,
  globals: options.globals,
  plugins: [
    multiEntry(),
    replace({ 'process.env.NODE_ENV': isDev ? JSON.stringify('DEVELOPMENT') : JSON.stringify('PRODUCTION') }),
    html({ collapseWhitespace: true, quoteCharacter: "'", removeComments: true }),
    json({ preferConst: true }),
    nodeResolve({ jsnext: true }),
    typescript2({
      useTsconfigDeclarationDir: true,
      tsconfig,
      tsconfigOverride: options.tsconfigOverride,
      typescript: require('typescript')
    }),
    commonjs(),
    isDev && options.devServer && serve({ contentBase: ['public', 'dist'], historyApiFallback: true, port: 1234 }),
    isDev && options.devServer && livereload('dist'),
    !isDev && options.minify && terser(),
    !isDev && filesize()
  ]
});

module.exports = function(bundles) {
  const dist = [];
  bundles.forEach(bundle => {
    dist.push(config(bundle));
  });
  return dist;
};
