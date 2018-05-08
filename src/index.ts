import { minifyAst } from './utils'
import { compile } from 'vue-template-compiler'

export function buildComponent(code : string) {
  return `
    var runtime = require('vue-svg-component-runtime')
    module.exports = {
      __esModule: true,
      default: runtime.svgComponent(${JSON.stringify(compileAndMinify(code), null, 2)})
    }
  `
}

export function buildEsmComponent(code : string) {
  return `
    import { svgComponent } from 'vue-svg-component-runtime'
    export default svgComponent(${JSON.stringify(compileAndMinify(code), null, 2)})
  `
}

function compileAndMinify(code: string) {
  const compiledSvg = compile(code)
  if (compiledSvg.ast === undefined) {
    let errorMsg = 'Unknown Error'

    if(compiledSvg.errors.length > 0) {
      errorMsg = compiledSvg.errors.join(', ')
    }

    throw new Error(`There were one or more problems building the AST for the requested SVG: ${errorMsg}`)
  }

  return minifyAst(compiledSvg.ast)
}