const log = (msg, type) => console[type](`=====> ${type} =====> ${msg}`)

const warn = msg => log(msg, 'warn')

const error = msg => {
  log(msg, 'error')
  process.exit(1)
}

module.exports = {
  warn,
  error
}
