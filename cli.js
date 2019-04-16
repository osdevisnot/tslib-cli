#!/usr/bin/env node

const path = require('path')
const getopts = require('getopts')
const del = require('del')
const commands = require('./commands.json')
const { run, getBin, getRoot } = require('./exece')

const {
  _: [command, ...args],
  ...options
} = getopts(process.argv.slice(2), {
  default: {
    cache: true,
    verbose: false,
    force: false,
    template: 'osdevisnot/starter-typescript-library'
  },
  alias: {
    t: 'template'
  }
})
const { log, error } = require('./console')(options)

log('TCL: Firing command', command)
log('TCL: with args', args)
log('TCL: and options', JSON.stringify(options))

let cmd = []

switch (command) {
  case commands.INIT:
    let [dest] = args
    log('TCL: dest', dest)
    if (dest) {
      const gittar = require('gittar')
      gittar.fetch('github:osdevisnot/starter-typescript-library').then(res =>
        gittar.extract(res, dest).then(() => {
          run('node setup.js', path.join(dest, 'setup.js'), { cwd: dest })
        })
      )
    } else {
      error('Insufficient Arguments. See Usage!!')
    }
    break
  case commands.START:
    run(`${getBin('rollup')} -wc`, 'rollup.config.js')
    break
  case commands.BUILD:
    run(`${getBin('rollup')} -c`, 'rollup.config.js')
    break
  case commands.TEST:
    run(`${getBin('jest')} --watch`, 'jest.config.js')
    break
  case commands.COVERAGE:
    run(`${getBin('jest')} --coverage`, 'jest.config.js')
    break
  case commands.SETUP:
    run('git clean -fdX')
    del('package-lock.json')
    run('yarn')
    run('tslib build')
    run('tslib coverage')
    run('tslib docs')
    break
  case commands.DOCS:
    run(`${getBin('typedoc')} --options ${getRoot('typedoc.js')}`)
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
