import { minifyAst } from './utils'
import { compile } from 'vue-template-compiler'

export function buildComponent(code : string) {
  const compiledSvg = compile(code)
  if (compiledSvg.ast === undefined) {
    let errorMsg = 'Unknown Error'

    if(compiledSvg.errors.length > 0) {
      errorMsg = compiledSvg.errors.join(', ')
    }

    throw new Error(`There were one or more problems building the AST for the requested SVG: ${errorMsg}`)
  }

  const ast = minifyAst(compiledSvg.ast)

  return `
    var runtime = require('vue-svg-component-runtime')
    module.exports = {
      __esModule: true,
      default: runtime.svgComponent(${JSON.stringify(ast, null, 2)})
    }
  `
}