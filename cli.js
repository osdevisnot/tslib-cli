#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const exists = require('fs').existsSync;
const sync = require('child_process').execSync;

const commands = {
  START: 'start',
  BUILD: 'build',
  TEST: 'test',
  COVERAGE: 'coverage',
  SETUP: 'setup',
  DOCS: 'docs',
  PUB: 'pub'
};

const command = process.argv[2];
let cmd = [];

const getBin = p => path.join('node_modules', '.bin', p);
const scheduleCommand = (shell, file) => {
  if (exists(file)) {
    cmd.push(shell);
  } else {
    console.log(
      chalk.gray('-----> Skipping Command: ') +
        chalk.gray(shell.replace('node_modules/.bin/', '') + ` (${file} not found.)`)
    );
  }
};

switch (command) {
  case commands.START:
    scheduleCommand(`${getBin('rollup')} -wc`, 'rollup.config.js');
    break;
  case commands.BUILD:
    scheduleCommand(`${getBin('rollup')} -c`, 'rollup.config.js');
    break;
  case commands.TEST:
    scheduleCommand(`${getBin('jest')} --watch`, 'jest.config.js');
    break;
  case commands.COVERAGE:
    scheduleCommand(`${getBin('jest')} --coverage`, 'jest.config.js');
    break;
  case commands.SETUP:
    cmd.push('git clean -fdX', 'rm -rf package-lock.json', 'yarn', 'pika-web', 'tslib build', 'tslib coverage');
    break;
  case commands.DOCS:
    scheduleCommand(`${getBin('typedoc')}`, 'typedoc.js');
    break;
  case commands.PUB:
    cmd.push('tslib setup', 'tslib docs', `yarn publish`, 'git push --follow-tags');
    break;
  default:
    console.log('Available Commands: ', Object.values(commands));
}

cmd.forEach(shell => {
  console.log(chalk.green('-----> Executing Command: ') + chalk.green.bold(shell.replace('node_modules/.bin/', '')));
  sync(shell, { stdio: 'inherit' });
});
