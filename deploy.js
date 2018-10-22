const path = require('path')
const fs = require('fs')
const sync = require('child_process').execSync
const paths = require('paths')

module.exports = function deploy() {
  const remote = sync('git remote get-url --push origin')
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
    console.error(`Git remote not configured. Tried executing command '${remote}'`)
  }
}
