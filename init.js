const ncp = require('ncp');
const replaceStream = require('replacestream');
const pkg = require('./package.json');

const { paths, run, rename, log, info, question, yesNo } = require('./utils');

module.exports = () => {
  const dest = process.argv[3];

  const userName = question(
    'May I have your Github username ? [osdevisnot] : ',
    {
      defaultInput: 'osdevisnot',
    }
  );
  const userEmail = question(
    `And your email address please ? [${userName}@gmail.com] : `,
    {
      defaultInput: `${userName}@gmail.com`,
    }
  );
  const packageName = question(`What's the package name ? [${dest}] : `, {
    defaultInput: dest,
  });
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
        rename(
          paths.app(dest, f),
          paths.app(dest, f.replace('template', packageNameSane))
        );
      });
      rename(paths.app(dest, 'gitignore'), paths.app(dest, '.gitignore'));

      log('Success !! Now Installing Dependencies...');
      if (process.argv[4] === 'link') {
        run(
          `yarn add --dev --prefer-offline @types/jest ${paths.cli(
            'tslib-cli-' + pkg.version + '.tgz'
          )}`,
          {
            cwd: paths.app(dest),
          }
        );
      } else {
        run('yarn add --dev --prefer-offline tslib-cli @types/jest', {
          cwd: paths.app(dest),
        });
      }
      ['git init', 'git add .', 'git commit -am "Unleash the Kraken"'].map(
        cmd => run(cmd, { cwd: paths.app(dest) })
      );

      log('I can even setup github repo, travis job and automatic NPM release');
      const proceed = question('Would you like to try [Y|n]? ', {
        defaultInput: true,
      });
      if (proceed) {
        run(
          `curl -n -s -u ${userName} https://api.github.com/user/repos -d '{"name":"${dest}","description":"${description}"}'`,
          { cwd: paths.app(dest), stdio: ['pipe', 'ignore', 'pipe'] }
        );
        [
          `git remote add origin https://github.com/osdevisnot/${dest}.git`,
          'git push origin master',
          `semantic-release-cli setup`,
          'git add .',
          'git commit -am "Setup Symantic Release"',
          'git push --set-upstream origin master',
        ].map(cmd => run(cmd, { cwd: paths.app(dest) }));
      }
    }
  );
};
