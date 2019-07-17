const { paths } = require('./utils')
const $ = require('rollup-load-plugins')({ cwd: paths.cli() })

const isDev = !!process.env.ROLLUP_WATCH

const tsconfig = paths.app('tsconfig.json')
const pkg = require(paths.app('package.json'))

let external = Object.keys({
  ...(pkg.devDependencies || {}),
  ...(pkg.peerDependencies || {}),
})

if (isDev) {
  pkg.source = 'public/index.tsx'
  external = []
}

const plugins = (options) => {
  return [
    $.replace({ 'process.env.NODE_ENV': isDev ? JSON.stringify('DEVELOPMENT') : JSON.stringify('PRODUCTION') }),
    $.json({ preferConst: true }),
    $.nodeResolve({ mainFields: ['module', 'main'] }),
    $.typescript2({
      useTsconfigDeclarationDir: true,
      tsconfig,
      tsconfigOverride: { exclude: ['dist', 'public', 'test'] },
      typescript: require('typescript'),
    }),
    $.commonjs(),
    isDev && $.serve({ contentBase: ['dist', 'public'], historyApiFallback: true, port: 1234 }),
    isDev && $.livereload('dist'),
    !isDev &&
      options.minify &&
      $.terser.terser({
        ecma: 6,
        mangle: {
          properties: { regex: new RegExp('^_') },
        },
      }),
    !isDev && options.sizes && $.filesize({ showBrotliSize: true }),
  ].filter(Boolean)
}

let config

if (isDev) {
  config = {
    input: pkg.source,
    output: { format: 'es', file: pkg.module },
    external,
    plugins: plugins({ sizes: true }),
  }
} else {
  config = [
    {
      input: pkg.source,
      output: { format: 'cjs', file: pkg.main },
      external,
      plugins: plugins({}),
    },
    {
      input: pkg.source,
      output: { format: 'es', file: pkg.module },
      external,
      plugins: plugins({}),
    },
    {
      input: pkg.source,
      output: { format: 'es', file: pkg.module.replace(/\.module.js/, '.module.min.js') },
      external,
      plugins: plugins({ minify: true, sizes: true }),
    },
  ]
}

console.log(config)

export default config
