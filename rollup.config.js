const path = require('path')

const $ = require('rollup-load-plugins')({ cwd: path.join(__dirname) })

const isDev = !!process.env.ROLLUP_WATCH
const tsconfig = path.join(process.cwd(), 'tsconfig.json')

const config = options => ({
  input: options.input,
  output: options.output,
  external: options.external || [],
  plugins: [
    $.multiEntry(),
    // $.minifyHtmlLiterals.default(),
    $.replace({ 'process.env.NODE_ENV': isDev ? JSON.stringify('DEVELOPMENT') : JSON.stringify('PRODUCTION') }),
    $.html({ collapseWhitespace: true, quoteCharacter: "'", removeComments: true }),
    $.json({ preferConst: true }),
    $.nodeResolve(),
    $.typescript2({
      useTsconfigDeclarationDir: true,
      tsconfig,
      tsconfigOverride: options.tsconfigOverride,
      typescript: require('typescript')
    }),
    $.commonjs(),
    isDev && options.devServer && $.serve({ contentBase: ['public', 'dist'], historyApiFallback: true, port: 1234 }),
    isDev && options.devServer && $.livereload('dist'),
    !isDev &&
      options.minify &&
      $.terser.terser({
        ecma: 6,
        mangle: {
          properties: { regex: new RegExp('^_') }
        }
      }),
    !isDev && $.filesize({ showBrotliSize: true })
  ].filter(Boolean)
})

module.exports = function(bundles) {
  const dist = []
  bundles.forEach(bundle => dist.push(config(bundle)))
  return dist
}
