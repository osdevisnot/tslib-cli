const { paths } = require('./utils')
const pkg = require(paths.app('package.json'))

module.exports = {
  // theme: paths.cli('node_modules', 'typedoc-plugin-markdown', 'dist', ''),
  theme: 'minimal',
  suppressImplicitAnyIndexErrors: 'true',
  suppressExcessPropertyErrors: 'true',
  stripInternal: 'true',
  readme: paths.app('README.md'),
  out: 'docs',
  name: pkg.name,
  moduleResolution: 'node',
  mode: 'modules',
  mdHideSources: true,
  includeDeclarations: false,
  hideGenerator: true,
  excludePrivate: true,
  excludeExternals: true,
  exclude: ['**/test/**/*', '**/dist/**/*', '**/public/**/*'],
}
