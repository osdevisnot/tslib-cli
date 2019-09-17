const ncp = require('ncp');
const replace = require('replacestream');
const pkg = require('./package.json');

const { paths, run, rename, log, question } = require('./utils');

module.exports = () => {
  const dest = process.argv[3];

  const userName = question('may I have your username ?', 'osdevisnot');
  const email = question('And your email address please ?', `${userName}@gmail.com`);
  const packageName = question("What's the package name ?", `@${userName}/${dest}`);
  const description = question('And package descriptions ?', undefined);

  const packageNameSane = packageName.split('/').pop();

  ncp(
    paths.cli('template'),
    paths.app(dest),
    {
      transform: (read, write) =>
        read
          .pipe(replace('username', userName))
          .pipe(replace('useremail', email))
          .pipe(replace('template_full', packageName))
          .pipe(replace('template', packageNameSane))
          .pipe(replace('<description>', description))
          .pipe(write),
    },
    () => {
      rename(paths.app(dest, 'gitignore'), paths.app(dest, '.gitignore'));

      ['src/template.tsx', 'tests/template.test.tsx'].map(f => {
        rename(paths.app(dest, f), paths.app(dest, f.replace('template', packageNameSane)));
      });

      log('Done !! Now Installing Dependencies...');

      if (process.argv[4] === 'link') {
        pkg.name = paths.cli('tslib-cli-' + pkg.version + '.tgz');
      }
      run(`yarn add --prefer-offline --dev ${pkg.name} @types/jest`, { cwd: paths.app(dest) });

      [
        'git init',
        'git add .',
        `git config user.name ${userName}`,
        `git config user.email ${email}`,
        'git commit -am "Unleash the Kraken"',
      ].map(cmd => run(cmd, { cwd: paths.app(dest) }));
    },
  );
};
