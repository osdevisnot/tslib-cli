const ncp = require('ncp');
const replaceStream = require('replacestream');
const pkg = require('./package.json');
const fs = require('fs');

const { paths, run, rename, log, info, question, yesNo } = require('./utils');

module.exports = () => {
  const dest = process.argv[3];

  const userName = question('May I have your Github username ? [osdevisnot] : ', { defaultInput: 'osdevisnot' });
  const userEmail = question(`And your email address please ? [${userName}@gmail.com] : `, {
    defaultInput: `${userName}@gmail.com`,
  });
  const packageName = question(`What's the package name ? [${dest}] : `, { defaultInput: dest });
  const description = question('And package descriptions ? : ');

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

      log('Success !! Now Installing Dependencies...');
      const installCommand = 'yarn add --dev --prefer-offline @types/jest ';
      if (process.argv[4] === 'link') {
        run(`${installCommand}${paths.cli('tslib-cli-' + pkg.version + '.tgz')}`, { cwd: paths.app(dest) });
      } else {
        run(`${installCommand} tslib-cli`, { cwd: paths.app(dest) });
      }

      ['git init', 'git add .', 'git commit -am "Unleash the Kraken"'].map(cmd => run(cmd, { cwd: paths.app(dest) }));

      log('I can even setup github repo, travis job and automatic NPM release');
      console.log();
      const proceed = question('Would you like to try [Y|n]? ', {
        defaultInput: 'n',
      });
      if (proceed && (proceed === 'y' || proceed === 'Y')) {
        // create github repo
        run(`curl -n https://api.github.com/user/repos -d '{"name":"${dest}","description":"${description}"}'`, {
          cwd: paths.app(dest),
        });
        [
          `git remote add origin https://github.com/osdevisnot/${dest}.git`,
          'git push origin master',
          `semantic-release-cli setup`,
          'yarn add --dev cz-conventional-changelog',
        ].map(cmd => run(cmd, { cwd: paths.app(dest) }));

        // add conventional changelog to package.json
        const pkgPath = paths.app(dest, 'package.json');
        const pk = require(pkgPath);
        pk.config = { commitizen: { path: 'cz-conventional-changelog' } };
        fs.writeFileSync(pkgPath, JSON.stringify(pk, null, '  '));

        ['git add .', 'git commit -am "Setup Symantic Release"', 'git push --set-upstream origin master'].map(cmd =>
          run(cmd, { cwd: paths.app(dest) })
        );
      }
    }
  );
};
