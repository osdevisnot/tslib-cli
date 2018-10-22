#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const sync = require('child_process').execSync
const del = require('del')

const command = process.argv[2] || 'start'

const paths = require('./paths')

const commands = {
  start: `${paths.forBin('rollup')} -c ${paths.forCli('rollup.config.js')} -w`
}

del(['dist/', 'docs/']).then(() => {
  switch (command) {
    case 'start':
      console.log(commands[command])
      break
  }
})
