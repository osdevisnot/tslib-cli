const commandExists = require('command-exists').sync;

const hasYarn = commandExists('yarn');

const { run, error, question, info, paths } = require('./utils');

let pkg = {};
try {
	pkg = require(paths.app('package.json'));
} catch (e) {}

module.exports = {
	install: arg => (hasYarn ? (arg ? `yarn add ${arg}` : `yarn`) : `npm install ${arg}`),
	publish: () => {
		if (hasYarn) {
			run('yarn publish');
		} else {
			info('Bumping version...');
			info('Current version: ', pkg.version);
			const version = question('New version: ');
			run(`npm version ${version}`);
			run(`npm publish`);
		}
	},
	script: script => {
		if (pkg && pkg.scripts && pkg.scripts[script])
			return hasYarn ? `yarn ${pkg.scripts[script]}` : `npm run ${pkg.scripts[script]}`;
		else {
			error(`command ${script} NOT FOUND (skipping...)`);
			return false;
		}
	},
};
