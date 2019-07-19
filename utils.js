const path = require('path')
const fs = require('fs')
const replace = require('replacestream')
const sync = require('child_process').execSync
const exists = require('fs').existsSync

const paths = {
  app: (...p) => path.join(process.cwd(), ...p),
  cli: (...p) => path.join(__dirname, ...p),
  bin: (...p) => path.join(__dirname, 'node_modules', '.bin', ...p),
}

const commands = {
  INIT: 'init',
  START: 'start',
  BUILD: 'build',
  TEST: 'test',
  COVERAGE: 'coverage',
  DOCS: 'docs',
  PUB: 'pub',
  SETUP: 'setup',
  DEPLOY: 'deploy',
}

const run = (commands, options) => commands.forEach((cmd) => sync(cmd, { stdio: 'inherit', ...options }))

const transform = (replacement) => ({
  transform: (read, write) => read.pipe(replace('template', replacement)).pipe(write),
})

const rename = (src, dest) => fs.renameSync(paths.app(src), paths.app(dest))

const copy = (src, dest) => fs.copyFileSync(paths.app(src), paths.app(dest))

const serve = (dir, port = 5000) => {
  if (process.argv[3] === 'serve') {
    const server = require('rollup-plugin-serve')
    server({ contentBase: [dir], historyApiFallback: true, port }).generateBundle()
  }
}

module.exports = {
  paths,
  run,
  commands,
  transform,
  rename,
  copy,
  serve,
}
