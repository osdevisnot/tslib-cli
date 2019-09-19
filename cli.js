#!/usr/bin/env node

const [executor, bin, command, ...args] = process.argv;

const isCI = require('is-ci');
const { paths, run, cpy, clean, error, log } = require('./utils');

const configMap = {
	jest: 'jest.config.js',
	prettier: 'prettier.config.json',
	rollup: 'rollup.config.js',
	tslint: 'tslint.config.json',
};

process.env.COMMAND = command;

log(`woking on '${command}'`);

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
		run(`${paths.bin('rollup')} -c ${paths.config('rollup.config.js')}`);
		break;
	case 'watch':
		process.env.NODE_ENV = 'development';
		clean('dist');
		const rollupFlags = isCI ? '-c' : '-wc';
		run(`${paths.bin('rollup')} ${rollupFlags} ${paths.config('rollup.config.js')}`);
		break;
	case 'start':
		process.env.NODE_ENV = 'development';
		clean('dist');
		run(`${paths.bin('rollup')} -wc ${paths.config('rollup.config.js')}`);
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
		run(`${paths.bin('prettier')} --write "**/**/*.{tsx,ts,json,yml,html,css,md,mdx,gql,less,scss,jsx,js}"`);
		break;
	case 'lint':
		run(`${paths.bin('tslint')} --fix -t codeFrame -p tsconfig.json -c ${paths.config('tslint.config.json')}`);
		break;
	case 'setup':
		['git clean -fdX', 'yarn'].map(cmd => run(cmd));
		break;
	case 'pub':
		[
			'yarn setup',
			'yarn format',
			'yarn lint',
			'yarn coverage',
			'git diff --quiet',
			'yarn publish',
			'git push --follow-tags',
		].map(cmd => run(cmd));
		break;
	default:
		error('No Such Command !!');
		break;
}
