#!/usr/bin/env node

const [executor, bin, command, ...args] = process.argv;

const isCI = require('is-ci');
const { paths, run, cpy, clean, error, log } = require('./utils');
const runner = require('./runner');
const { klap } = require('klap');

const configMap = {
	jest: 'jest.config.js',
	prettier: 'prettier.config.json',
	tslint: 'tslint.config.json',
};

process.env.COMMAND = command;

log(`woking on '${command}'`);

const execKlap = async command => {
	const pkg = require(paths.app('package.json'));
	await klap(command, pkg);
};

(async () => {
	switch (command) {
		case 'init':
			require('./init')();
			break;
		case 'eject':
			const type = configMap[process.argv[3]];
			if (paths.config(type) !== paths.app(type)) {
				cpy(paths.config(type), paths.app(type));
				log(`Done !! ${type} is now available in project root.`);
			} else {
				error(`${type} is already ejected.`);
			}
			break;
		case 'build':
			process.env.NODE_ENV = 'production';
			clean('dist');
			execKlap(command);
			break;
		case 'watch':
			process.env.NODE_ENV = 'development';
			clean('dist');
			execKlap(command);
			break;
		case 'start':
			process.env.NODE_ENV = 'development';
			clean('dist');
			execKlap(command);
			break;
		case 'test':
			process.env.NODE_ENV = 'test';
			const jestFlags = isCI ? '--coverage' : '--watch';
			run(`${paths.bin('jest')} --config ${paths.config('jest.config.js')} ${jestFlags}`);
			break;
		case 'coverage':
			process.env.NODE_ENV = 'test';
			run(`${paths.bin('jest')} --config ${paths.config('jest.config.js')} --coverage`);
			break;
		case 'coveralls':
			process.env.NODE_ENV = 'test';
			run(`${paths.bin('jest')} --config ${paths.config('jest.config.js')} --coverage`);
			run(`${paths.bin('coveralls')} < ${paths.app('coverage', 'lcov.info')}`);
			break;
		case 'format':
			run(
				`${paths.bin(
					'prettier',
				)} --write "{public,src,tests}/**/*.{tsx,ts,json,yml,html,css,md,mdx,gql,less,scss,jsx,js}"`,
			);
			break;
		case 'lint':
			run(`${paths.bin('tslint')} --fix -t codeFrame -p tsconfig.json -c ${paths.config('tslint.config.json')}`);
			break;
		case 'setup':
			['git clean -fdX', runner.install()].map(cmd => run(cmd));
			break;
		case 'pub':
			[runner.script('setup'), runner.script('format'), runner.script('lint'), runner.script('coverage')]
				.filter(Boolean)
				.map(cmd => run(cmd));
			try {
				run('git diff --quiet');
			} catch (e) {
				error('Working directory not clean. Aborting release !!');
				process.exit(1);
			}
			runner.publish();
			run('git push --follow-tags');
			break;
		default:
			error('No Such Command !!');
			break;
	}
})();
