#!/usr/bin/env node

const path = require('path')
const getopts = require('getopts')
const chalk = require('chalk')
const del = require('del')
const { run, paths, commands } = require('./utils')

const {
  _: [command, ...args],
  ...options
} = getopts(process.argv.slice(2), {
  default: {
    template: 'osdevisnot/starter-typescript-library',
  },
  alias: {
    t: 'template',
  },
})

let cmd = []

switch (command) {
  case commands.INIT:
    let [dest] = args
    if (dest) {
      const gittar = require('gittar')
      gittar.fetch('github:osdevisnot/starter-typescript-library').then((res) =>
        gittar.extract(res, dest).then(() => {
          run('node setup.js', path.join(dest, 'setup.js'), { cwd: dest })
        }),
      )
    } else {
      console.log(chalk.red.bold('Insufficient Arguments. See Usage!!'))
    }
    break
  case commands.START:
    run(`${paths.bin('rollup')} -wc`, 'rollup.config.js')
    break
  case commands.BUILD:
    del('dist').then((_) => {
      run(`${paths.bin('rollup')} -c`, 'rollup.config.js')
    })
    break
  case commands.TEST:
    run(`${paths.bin('jest')} --watch`, 'jest.config.js')
    break
  case commands.COVERAGE:
    run(`${paths.bin('jest')} --coverage`, 'jest.config.js')
    break
  case commands.SETUP:
    run('git clean -fdX')
    del('package-lock.json').then((_) => {
      del('yarn.lock').then((_) => {
        run('yarn')
        run('tslib build')
        run('tslib coverage')
      })
    })
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
