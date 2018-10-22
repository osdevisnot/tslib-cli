const fs = require('fs')
const paths = require('./paths')
const $ = require('rollup-load-plugins')({ cwd: __dirname })
const externals = require('rollup-node-externals')

const log = require('./logger')
const pkg = require(paths.forProject('./package.json'))

const isDev = !!process.env.ROLLUP_WATCH

const libName = pkg.name
  .split('/')
  .pop()
  .replace(/-([a-z])/g, match => match[1].toUpperCase())

const tsconfig = paths.forProject('tsconfig.json')

const htmlMinifierOptions = {
  collapseWhitespace: true,
  quoteCharacter: "'",
  removeComments: true
}

const banner = `
Bundle of <%= pkg.name %>
Version: <%= pkg.version %>
Generated: <%= new Date().toISOString() %>
`

let input = null
;['src/index.ts', 'src/exports.ts', `src/${pkg.name}.ts`].forEach(file => {
  if (!input && fs.existsSync(file)) {
    input = file
  }
})
if (!input) {
  log.error(`Missing input file. Tried ${inputFiles.join(',')}`)
}

const config = {
  input,
  external: isDev ? [] : externals(),
  watch: { include: 'src/**' },
  plugins: [
    $.replace({ 'process.env.NODE_ENV': isDev ? JSON.stringify('DEVELOPMENT') : JSON.stringify('PRODUCTION') }),
    $.html(htmlMinifierOptions),
    $.json({ preferConst: true }),
    isDev && $.nodeResolve({ jsnext: true, browser: true }),
    $.typescript2({ useTsconfigDeclarationDir: true, tsconfig, typescript: require('typescript') }),
    isDev && $.tslint(),
    $.commonjs(),
    $.cleanup({ comments: 'none' }),
    $.license({ banner }),
    $.sourcemaps(),
    isDev && $.serve({ contentBase: ['public', 'dist'], historyApiFallback: true, port: 4444 }),
    isDev && $.livereload('dist')
  ].filter(Boolean)
}

export default [
  {
    ...config,
    output: [{ file: pkg.main, format: 'cjs', sourcemap: true }, { file: pkg.module, format: 'es', sourcemap: true }]
  },
  {
    output: [{ file: pkg.browser, format: 'iife', sourcemap: true, name: libName }],
    ...config,
    plugins: [...config.plugins, $.terser.terser()]
  }
]
