const path = require('path')
const chalk = require('chalk')
const sync = require('child_process').execSync
const exists = require('fs').existsSync

module.exports = options => {
  return {
    debug: (...message) => options.verbose && console.log(chalk.gray(...message)),
    paths: {
      app: p => path.join(process.cwd(), p),
      cli: p => path.join(__dirname, p),
      bin: p => path.join(__dirname, 'node_modules', '.bin', p)
    },
    run: (command, config, options) => {
      if (typeof config === 'undefined') {
        sync(command, { stdio: 'inherit', ...options })
      } else if (exists(config)) {
        sync(command, { stdio: 'inherit', ...options })
      } else {
        const cmd = command.replace('node_modules/.bin/', '')
        console.error(chalk.gray(`-----> Skipping Command: ${cmd} (${config} not found.)`))
      }
    },
    commands: {
      INIT: 'init',
      START: 'start',
      BUILD: 'build',
      TEST: 'test',
      COVERAGE: 'coverage',
      DOCS: 'docs',
      PUB: 'pub',
      SETUP: 'setup'
    }
  }
}
