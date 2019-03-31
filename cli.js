#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const sync = require('child_process').execSync;

const command = process.argv[2];

const getBin = p => path.join('node_modules', '.bin', p);

let cmd = [];
switch (command) {
  case 'start':
    cmd.push(`${getBin('rollup')} -wc`);
    break;
  case 'build':
    cmd.push(`${getBin('rollup')} -c`);
    break;
  case 'test':
    cmd.push(`${getBin('jest')} --watch`);
    break;
  case 'coverage':
    cmd.push(`${getBin('jest')} --coverage`);
    break;
  case 'setup':
    cmd.push('git clean -fdX', 'yarn', 'tslib build', 'tslib coverage');
    break;
  case 'docs':
    cmd.push(`${getBin('typedoc')}`);
    break;
  case 'publish':
    cmd.push(`yarn publish`, 'git push --follow-tags');
    break;
}

cmd.forEach(shell => {
  console.log(chalk.green('-----> Executing Command: ') + chalk.green.bold(shell));
  sync(shell, { stdio: 'inherit' });
});
