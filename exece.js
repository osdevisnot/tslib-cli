const path = require('path')
const exists = require('fs').existsSync
const sync = require('child_process').execSync
const chalk = require('chalk')

module.exports = {
  run: (command, configFile, options) => {
    if (typeof configFile === 'undefined') {
      sync(command, { stdio: 'inherit', ...options })
    } else if (exists(configFile)) {
      sync(command, { stdio: 'inherit', ...options })
    } else {
      let cmd = command.replace('node_modules/.bin/', '')
      console.error(chalk.gray(`-----> Skipping Command: ${cmd} (${configFile} not found.)`))
    }
  },
  getBin: p => path.join('node_modules', '.bin', p),
  getRoot: p => path.join(__dirname, p)
}
