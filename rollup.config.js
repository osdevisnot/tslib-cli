const fs = require('fs')
const paths = require('./paths')
const $ = require('rollup-load-plugins')({ cwd: __dirname })
const externals = require('rollup-node-externals')

const log = require('./logger')
const pkg = require(paths.forProject('./package.json'))

const isDev = !!process.env.ROLLUP_WATCH

const packageName = pkg.name.split('/').pop()

const libName = packageName.replace(/-([a-z])/g, match => match[1].toUpperCase())

const tsconfig = paths.forProject('tsconfig.json')

const htmlMinifierOptions = {
  collapseWhitespace: true,
  quoteCharacter: "'",
  removeComments: true
}

const banner = `Bundle <%= pkg.name %>@<%= pkg.version %> generated on <%= new Date().toISOString() %>`

let input = null
;[`src/${packageName}.ts`, 'src/exports.ts'].forEach(file => {
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
    isDev && $.nodeResolve({ jsnext: true }),
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

const bundles = []

if (isDev && fs.existsSync('src/index.ts')) {
  bundles.push({
    ...config,
    output: [{ file: 'dist/index.js', format: 'cjs', sourcemap: true }],
    external: [],
    input: 'src/index.ts'
  })
} else {
  if (pkg.main) {
    bundles.push({ ...config, output: [{ file: pkg.main, format: 'cjs', sourcemap: true }] })
  }
  if (pkg.module) {
    bundles.push({ ...config, output: [{ file: pkg.module, format: 'es', sourcemap: true }] })
  }
  if (pkg.browser) {
    bundles.push({
      ...config,
      output: [{ file: pkg.browser, format: 'iife', sourcemap: true, name: libName }],
      plugins: [...config.plugins, $.terser.terser()]
    })
  }
}

export default bundles
