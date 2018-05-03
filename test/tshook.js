let tsConfig = require('../tsconfig.json')
require('jsdom-global')()

tsConfig.compilerOptions = Object.assign({}, tsConfig.compilerOptions, {
  module: "commonjs"
})

require("ts-node").register(tsConfig)

process.on("unhandledRejection", (reason, p) => {
  console.log(`UNHANDLED PROMISE REJECTION: ${reason.stack}`)
})
