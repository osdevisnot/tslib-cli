const path = require('path')

module.exports = {
	clearMocks: true,
	preset: 'ts-jest',
	rootDir: path.resolve(process.cwd()),
	testEnvironment: 'jsdom',
	coveragePathIgnorePatterns: ['/node_modules/', '/tests/', '/dist/'],
	globals: {
		'ts-jest': {
			diagnostics: {
				ignoreCodes: 'TS151001',
			},
		},
	},
}
