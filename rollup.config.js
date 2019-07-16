const { paths } = require('./utils')
const $ = require('rollup-load-plugins')({ cwd: paths.cli() })

const isDev = !!process.env.ROLLUP_WATCH

const tsconfig = paths.app('tsconfig.json')
const pkg = require(paths.app('package.json'))

let external = []

if (isDev) {
  pkg.source = 'public/index.tsx'
  external = Object.keys({
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
    ...(pkg.peerDependencies || {}),
  })
}

console.log('pkg now : ', pkg.source, pkg.module)

export default {
  input: pkg.source,
  output: [{ format: 'es', file: pkg.module }, { format: 'cjs', file: pkg.main }],
  external,
  plugins: [
    $.replace({ 'process.env.NODE_ENV': isDev ? JSON.stringify('DEVELOPMENT') : JSON.stringify('PRODUCTION') }),
    $.json({ preferConst: true }),
    $.nodeResolve(),
    $.typescript2({
      useTsconfigDeclarationDir: true,
      tsconfig,
      tsconfigOverride: { exclude: ['node_modules', 'dist', 'public', 'test'] },
      typescript: require('typescript'),
    }),
    $.commonjs(),
    isDev && $.serve({ contentBase: ['dist', 'public'], historyApiFallback: true, port: 1234 }),
    isDev && $.livereload('dist'),
    !isDev &&
      $.terser.terser({
        ecma: 6,
        mangle: {
          properties: { regex: new RegExp('^_') },
        },
      }),
    !isDev && $.filesize({ showBrotliSize: true }),
  ].filter(Boolean),
}
