const path = require('path')
const sync = require('child_process').execSync

const forBin = p => path.join('node_modules', '.bin', p)
const forCli = p => path.join('node_modules', 'tslib-cli', p)
const forProject = p => path.join(process.cwd(), p)

module.exports = {
  forBin,
  forCli,
  forProject
}
