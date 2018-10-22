const path = require('path')
const fs = require('fs')
const sync = require('child_process').execSync
const paths = require('./paths')
const log = require('./logger')

module.exports = function deploy() {
  let remote = null
  try {
    const remote = sync('git remote get-url --push origin')
  } catch (e) {
    log.error('Unable to locate git remote. Git might not be initialized correctly.')
  }
  if (remote) {
    const docs = path.join(__dirname, 'docs')

    const commands = [
      'git init',
      'git add .',
      'git commit -m "(docs): update gh-pages"',
      `git push --force --quiet ${remote} master:gh-pages`
    ]
    commands.forEach(cmd => sync(cmd, { stdio: [0, 1, 2], cwd: docs }))
  } else {
    log.error(`Git remote not configured. Tried executing command '${remote}'`)
  }
}
