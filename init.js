const ncp = require('ncp');
const replaceStream = require('replacestream');
const pkg = require('./package.json');

const { paths, run, cpy, rename, clean, log } = require('./utils');

module.exports = () => {
  const dest = process.argv[3];
  ncp(
    paths.cli('template'),
    paths.app(dest),
    {
      transform: (read, write) =>
        read
          .pipe(replaceStream('template', dest))
          .pipe(replaceStream('<version>', `${pkg.version}`))
          .pipe(write),
    },
    () => {
      ['src/template.tsx', 'tests/template.test.tsx'].map(f => {
        rename(
          paths.app(dest, f),
          paths.app(dest, f.replace('template', dest))
        );
      });
      rename(paths.app(dest, 'gitignore'), paths.app(dest, '.gitignore'));

      log('Done !! Now Installing Dependencies...');
      if (process.argv[4] === 'link') {
        run(`yarn add ${paths.cli('tslib-cli-' + pkg.version + '.tgz')}`, {
          cwd: paths.app(dest),
        });
      } else {
        run('yarn add tslib-cli', { cwd: paths.app(dest) });
      }
      [
        'yarn add @types/jest',
        'git init',
        'git add .',
        'git commit -am "Unleash the Kraken"',
      ].map(cmd => {
        run(cmd, { cwd: paths.app(dest) });
      });
    }
  );
};
