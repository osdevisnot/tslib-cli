const path = require('path')
const pkg = require(path.join(process.cwd(), 'package.json'))

module.exports = {
  theme: 'markdown',
  suppressImplicitAnyIndexErrors: 'true',
  suppressExcessPropertyErrors: 'true',
  stripInternal: 'true',
  readme: 'none',
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
