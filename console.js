const chalk = require('chalk')

module.exports = options => {
  return {
    log: (...message) => options.verbose && console.log(chalk.gray(...message)),
    error: (...message) => console.log(chalk.red.bold(...message))
  }
}
