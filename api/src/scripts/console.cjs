const repl = require('repl')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const r = repl.start()
r.on('exit', () => {
  process.exit(0)
})

const pascalCase = (str) => _.startCase(_.camelCase(str)).replace(/\s/g, '')

fs.readdirSync(path.join(__dirname, '../models')).forEach(async (subpath) => {
  const filePath = path.join(__dirname, '../models', subpath)
  const importName = pascalCase(subpath.slice(0, -3))

  Object.defineProperty(r.context, importName, {
    configurable: false,
    enumerable: true,
    value: (await import(filePath)).default,
  })
})
