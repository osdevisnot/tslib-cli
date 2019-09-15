#!/usr/bin/env node

const [executor, bin, command, ...args] = process.argv;

const { paths, run, cpy, clean, error, log } = require('./utils');

process.env.COMMAND = command;

log(`woking on '${command}'`);

switch (command) {
  case 'init':
    require('./init')();
    break;
  case 'eject':
    const type = process.argv[3];
    cpy(paths.config(type), paths.app(type));
    break;
  case 'build':
    process.env.NODE_ENV = 'production';
    clean('dist');
    run(`${paths.bin('rollup')} -c ${paths.config('rollup.config.js')}`);
    break;
  case 'watch':
    process.env.NODE_ENV = 'development';
    clean('dist');
    run(`${paths.bin('rollup')} -wc ${paths.config('rollup.config.js')}`);
    break;
  case 'start':
    process.env.NODE_ENV = 'development';
    clean('dist');
    run(`${paths.bin('rollup')} -wc ${paths.config('rollup.config.js')}`);
    break;
  case 'test':
    process.env.NODE_ENV = 'test';
    run(`${paths.bin('jest')} --config ${paths.config('jest.config.js')} --watch`);
    break;
  case 'coverage':
    process.env.NODE_ENV = 'test';
    run(`${paths.bin('jest')} --config ${paths.config('jest.config.js')} --coverage`);
    break;
  case 'coveralls':
    process.env.NODE_ENV = 'test';
    run(`${paths.bin('jest')} --config ${paths.config('jest.config.js')} --coverage`);
    run(`${paths.bin('coveralls')} < ${paths.app('coverage', 'lcov.info')}`);
  case 'format':
    run(`${paths.bin('prettier')} --write {src,tests,public}/*.*`);
    break;
  case 'lint':
    run(`${paths.bin('tslint')} --fix -t codeFrame -p tsconfig.json -c ${paths.config('tslint.json')}`);
    break;
  case 'setup':
    ['git clean -fdX', 'yarn'].map(cmd => run(cmd));
    break;
  case 'pub':
    ['yarn setup', 'git diff --quiet', 'yarn publish', 'git push --follow-tags'].map(cmd => run(cmd));
    break;
  default:
    error('No Such Command !!');
    break;
}
