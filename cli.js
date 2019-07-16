#!/usr/bin/env node

const path = require('path')
const del = require('del')
const { run, paths, commands } = require('./utils')

const command = process.argv[2]

switch (command) {
  case commands.INIT:
    require('./init')(process.argv[3])
    break
  case commands.START:
    run([`${paths.bin('rollup')} -wc ${paths.cli('rollup.config.js')}`])
    break
  case commands.BUILD:
    del('dist').then((_) => {
      run([`${paths.bin('rollup')} -c ${paths.cli('rollup.config.js')}`])
    })
    break
  case commands.TEST:
    run([`${paths.bin('jest')} --config ${paths.cli('jest.config.js')} --watch`])
    break
  case commands.COVERAGE:
    run([`${paths.bin('jest')} --config ${paths.cli('jest.config.js')} --coverage`])
    break
  case commands.SETUP:
    run(['git clean -fdX', 'yarn'])
    break
  case commands.DOCS:
    run(`${paths.bin('typedoc')} --options ${paths.cli('typedoc.js')}`)
    break
  case commands.PUB:
    run('tslib setup')
    run('tslib docs')
    run('git diff --quiet')
    run('yarn publish')
    run('git push --follow-tags')
    break
  default:
    console.log('Available Commands: ', Object.values(commands).join(', '))
}
