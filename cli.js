#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const sync = require('child_process').execSync
const del = require('del')

const command = process.argv[2] || 'start'

const paths = require('./paths')

const exec = cmd => sync(cmd, { stdio: [0, 1, 2] })

const commands = {
  build: `${paths.forBin('rollup')} -c ${paths.forCli('rollup.config.js')}`,
  test: `${paths.forBin('jest')} --watch`
}
commands['start'] = `${commands['build']} -w`

del(['dist/', 'docs/']).then(() => {
  switch (command) {
    case 'start':
      exec(commands[command])
      break
    case 'build':
      exec(commands[command])
      break
    case 'test':
      exec(commands[command])
      break
  }
})
