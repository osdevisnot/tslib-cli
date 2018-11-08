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

const author = pkg.author
  ? pkg.author.name && pkg.author.email
    ? `<%= pkg.author.name <pkg.author.email> %>`
    : `<%= pkg.author %>`
  : null

const banner =
  (author
    ? `
/*! *****************************************************************************
Copyright (c) <%= new Date().getFullYear() %> <%= pkg.author.name <pkg.author.email> %>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
***************************************************************************** */
`
    : '') + `// Bundle <%= pkg.name %>@<%= pkg.version %> generated on <%= new Date().toISOString() %>`

let input = null
;['src/index.ts', 'src/exports.ts', `src/${packageName}.ts`].forEach(file => {
  if (!input && fs.existsSync(file)) {
    input = file
  }
})
if (!input) {
  log.error(`Missing input file. Tried ${inputFiles.join(',')}`)
}

const config = {
  input,
  // external: isDev ? [] : externals(),
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
