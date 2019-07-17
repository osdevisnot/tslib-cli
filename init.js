const { paths, run, transform, rename } = require('./utils')

module.exports = (name) => {
  const ncp = require('ncp')
  const fs = require('fs')
  if (name) {
    let pkg = paths.app('package.json')
    let src = paths.cli('template')
    let dest = paths.app(name)

    if (fs.existsSync(pkg)) {
      src = paths.cli('template/packages/template')
      dest = paths.app('packages', name)
      ncp(src, dest, { ...transform(name) }, () => {
        rename(`packages/${name}/src/template.tsx`, `packages/${name}/src/${name}.tsx`)
        rename(`packages/${name}/test/index.test.tsx`, `packages/${name}/test/${name}.test.tsx`)
        run(['yarn'])
        console.log('Done !!')
      })
    } else {
      ncp(src, dest, { ...transform(name) }, () => {
        rename(`${name}/packages/template`, `${name}/packages/${name}`)
        rename(`${name}/packages/${name}/src/template.tsx`, `${name}/packages/${name}/src/${name}.tsx`)
        rename(`${name}/packages/${name}/test/index.test.tsx`, `${name}/packages/${name}/test/${name}.test.tsx`)
        run(['yarn', 'git init', 'git add .', 'git commit -am "fist commit"'], { cwd: dest })
      })
    }
  }
}
