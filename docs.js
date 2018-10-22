const paths = require('./paths')
const sync = require('child_process').execSync

function docs() {
  const command = `${paths.forBin('typedoc')} --out ${paths.forProject(
    'docs'
  )} --theme minimal --target es6 --mode file --hideGenerator`
  sync(command, { stdio: [0, 1, 2] })
}

module.exports = docs
