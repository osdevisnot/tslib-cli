const path = require('path')

const forCli = p => path.join(process.cwd(), 'node_modules', '.bin', p)
const forBin = p => path.join(__dirname, 'node_modules', '.bin', p)

module.exports = {
  forCli,
  forBin
}
