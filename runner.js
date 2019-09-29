const commandExists = require('command-exists').sync;

const hasYarn = commandExists('yarn');

const { run, error, question, info, paths } = require('./utils');

let pkg;

try {
	pkg = require(paths.app('package.json'));
} catch (e) {}

module.exports = {
	install: (deps, isDev = false) => {
		let command = hasYarn ? 'yarn' : 'npm install';
		if (deps) {
			let flags = '';
			if (isDev) {
				flags = hasYarn ? ' add --dev' : ' --save-dev';
			} else {
				flags = hasYarn ? ' add' : '';
			}
			command = command + flags + ' ' + deps;
		}
		return command;
	},
	publish: () => {
		if (hasYarn) {
			run('yarn publish');
		} else {
			info('Bumping version...');
			info(`Current version: ${pkg.version}`);
			const version = question('New version: ');
			run(`npm version ${version}`);
			try {
				run(`npm publish`);
			} catch (e) {
				error('Publish Failed !!', e);
				warn('Reverting tag v${version}');
				run(`git tag -d v${version}`);
				run('git reset HEAD~');
				process.exit(1);
			}
		}
	},
	script: script => {
		if (pkg && pkg.scripts && pkg.scripts[script]) return hasYarn ? `yarn ${script}` : `npm run ${script}`;
		else {
			error(`command ${script} NOT FOUND (skipping...)`);
			return false;
		}
	},
};
