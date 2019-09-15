const path = require('path');
const fs = require('fs');
const del = require('del').sync;
const sync = require('child_process').execSync;
const chalk = require('chalk');
const ask = require('readline-sync');

const pkg = require('./package.json');

const paths = {
  app: (...p) => path.join(process.cwd(), ...p),
  config: (...p) => path.join(process.cwd(), 'node_modules', 'tslib-cli', 'config', ...p),
  cli: (...p) => path.join(__dirname, ...p),
  bin: (...p) => path.join(process.cwd(), 'node_modules', '.bin', ...p),
};

const run = (cmd, options) => sync(cmd, { stdio: 'inherit', ...options });
const cpy = (s, d) => fs.writeFileSync(d, fs.readFileSync(s, 'utf8'), 'utf8');
const rename = (s, d) => fs.renameSync(s, d);
const clean = dir => del([paths.app(dir)]);

const prefix = chalk.gray(`${pkg.name}@${pkg.version}: `);
const log = msg => console.log(prefix + chalk.green.bold(msg));
const error = msg => console.error(prefix + chalk.red.bold(msg));

const question = message => ask.question(chalk.gray.bold(message));

module.exports = {
  paths,
  run,
  cpy,
  rename,
  clean,
  log,
  error,
  question,
};
