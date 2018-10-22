#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const sync = require('child_process').execSync
const del = require('del')
const paths = require('./paths')
const log = require('./logger')

const command = process.argv[2] || 'start'

const exec = cmd => sync(cmd, { stdio: [0, 1, 2] })

const commands = {
  build: `${paths.forBin('rollup')} -c ${paths.forCli('rollup.config.js')}`,
  test: `${paths.forBin('jest')} --watch`,
  coverage: `${paths.forBin('jest')} --coverage`,
  lint: `${paths.forBin('tslint')} 'src/**/*.{ts,tsx}'`
}
commands['start'] = `${commands['build']} -w`

del(['dist/', 'docs/']).then(() => {
  switch (command) {
    case 'start':
    case 'build':
    case 'test':
    case 'coverage':
    case 'lint':
      exec(commands[command])
      break
    case 'docs':
      require('./docs')()
      break
    case 'deploy':
      require('./docs')()
      exec(commands['coverage'])
      require('./deploy')()
      break
    case 'publish':
      const version = process.argv[3] || log.error('Missing version. Try `tslib publish <major|minor|patch>`')
      exec(commands['build'])
      const pub = [`npm version ${version}`, `npm publish`]
      pub.forEach(cmd => exec(cmd))
      break
  }
})
