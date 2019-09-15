const ncp = require('ncp');
const replaceStream = require('replacestream');
const pkg = require('./package.json');

const { paths, run, cpy, rename, clean, log, question } = require('./utils');

module.exports = () => {
  const dest = process.argv[3];

  const userName = question('May I have your username ?      : ');
  const userEmail = question('And your email address please ? : ');
  const packageName = question("What's the package name ?       : ");
  const description = question('And package descriptions ?      : ');

  const packageNameSane = packageName.split('/').pop();

  ncp(
    paths.cli('template'),
    paths.app(dest),
    {
      transform: (read, write) =>
        read
          .pipe(replaceStream('username', userName))
          .pipe(replaceStream('useremail', userEmail))
          .pipe(replaceStream('template_full', packageName))
          .pipe(replaceStream('template', packageNameSane))
          .pipe(replaceStream('<description>', description))
          .pipe(write),
    },
    () => {
      ['src/template.tsx', 'tests/template.test.tsx'].map(f => {
        rename(paths.app(dest, f), paths.app(dest, f.replace('template', packageNameSane)));
      });
      rename(paths.app(dest, 'gitignore'), paths.app(dest, '.gitignore'));

      log('Done !! Now Installing Dependencies...');
      if (process.argv[4] === 'link') {
        run(`yarn add --prefer-offline --dev @types/jest ${paths.cli('tslib-cli-' + pkg.version + '.tgz')}`, {
          cwd: paths.app(dest),
        });
      } else {
        run('yarn add --prefer-offline --dev tslib-cli @types/jest', { cwd: paths.app(dest) });
      }
      ['git init', 'git add .', 'git commit -am "Unleash the Kraken"'].map(cmd => run(cmd, { cwd: paths.app(dest) }));
    }
  );
};
