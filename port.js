const fs = require('fs');
const merge = require('deepmerge');
const { paths, cpy, error, log, info } = require('./utils');

module.exports = () => {
	const pkgPath = paths.app('package.json');
	if (fs.existsSync(pkgPath)) {
		const defaultPkg = require(paths.cli('template', '_package.json'));
		const pkg = merge(defaultPkg, require(pkgPath));
		// overrite build command...
		pkg.scripts.build = 'tslib build';
		const extensions = ['tsx', 'ts', 'jsx', 'js'];
		let foundSrc = false,
			foundExample = false;
		log('Trying to locate `source` and `example` files');
		for (let i = 0, len = extensions.length; i < len; i++) {
			const ext = extensions[i];
			if (!foundSrc && fs.existsSync(paths.app(`src/index.${ext}`))) {
				info(`\t${paths.app(`src/index.${ext}`)}`);
				pkg.source = paths.app(`src/index.${ext}`);
				foundSrc = true;
			}
			if (!foundExample && fs.existsSync(paths.app(`public/index.${ext}`))) {
				info(`\t${paths.app(`public/index.${ext}`)}`);
				pkg.example = paths.app(`public/index.${ext}`);
				foundExample = true;
			}
		}
		if (!foundSrc) error('Source file not found. Please review `source` property in `package.json`');
		if (!foundExample) error('Example file not found. Please review/remove `example` property in `package.json`');

		fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, '	'), 'utf-8');
	}

	const tsconfigTemplate = paths.cli('template', 'tsconfig.json');
	const tsconfig = paths.app('tsconfig.json');
	if (fs.existsSync(tsconfig)) {
		const config = merge(require(tsconfigTemplate), require(tsconfig));
		fs.writeFileSync(tsconfig, JSON.stringify(config, null, '	'), 'utf-8');
	} else {
		cpy(tsconfigTemplate, tsconfig);
	}
};
