#!/usr/bin/env node

const [executor, bin, command, ...args] = process.argv;

const { paths, run, cpy, clean, error, log, info, exists } = require('./utils');

process.env.COMMAND = command;

info(`Woking on '${command}'`);

const tools = {
  jest: `${paths.bin('jest')} --config ${paths.config('jest.config.js')}`,
  rollup: `${paths.bin('rollup')} -c ${paths.config('rollup.config.js')}`,
  coveralls: `${paths.bin('coveralls')} < ${paths.app('coverage', 'lcov.info')}`,
  prettier: `${paths.bin('prettier')} --write {src,tests,public}/*.*`,
  tslint: `${paths.bin('tslint')} --fix -t codeFrame -p tsconfig.json -c ${paths.config('tslint.json')}`,
};

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
    run(tools.rollup);
    break;
  case 'watch':
  case 'start':
    process.env.NODE_ENV = 'development';
    clean('dist');
    run(`${tools.rollup} -w`);
    break;
  case 'test':
    process.env.NODE_ENV = 'test';
    const watch = process.env.CI === 'true' ? ' --watch' : '';
    run(`${tools.jest}${watch}`);
    break;
  case 'coverage':
    process.env.NODE_ENV = 'test';
    run(`${tools.jest} --coverage`);
    break;
  case 'coveralls':
    process.env.NODE_ENV = 'test';
    run(`${tools.jest} --coverage`);
    run(tools.coveralls);
  case 'format':
    run(tools.prettier);
    break;
  case 'lint':
    run(tools.tslint);
    break;
  case 'setup':
    ['git clean -fdX', 'yarn'].map(cmd => run(cmd));
    break;
  case 'pub':
    ['yarn setup', 'git diff --quiet', 'yarn publish', 'git push --follow-tags'].map(cmd => run(cmd));
    break;
  case 'postinstall':
    if (!exists('semantic-release-cli') || !exists('commitizen')) {
      error('tslib-cli needs semantic-release-cli & commitizen');
      log('npm install -g semantic-release-cli commitizen');
    }
    break;
  default:
    error('No Such Command !!');
    break;
}
