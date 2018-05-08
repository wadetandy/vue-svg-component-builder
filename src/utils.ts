import { ASTNode, ASTElement } from 'vue-template-compiler'
import { MinifedASTElement, MinifiedASTNode } from 'vue-svg-component-runtime'

const isVueTemplateASTElement = (node : ASTNode) : node is ASTElement => {
  return node.hasOwnProperty('children')
}
/*
 * We don't really use much of the final AST output in building our icons, so let's
 * avoid the need to ouput the whole thing to the final bundle.
 */
export function minifyAst(node: ASTElement) : MinifedASTElement {
  return recursiveMinify(node) as MinifedASTElement
}

export function recursiveMinify(node: ASTNode) : MinifiedASTNode | undefined {
  if (!isVueTemplateASTElement(node)) {
    if (node.text.trim() === '') {
      return undefined
    }

    return {
      text: node.text
    }
  }

  let children : Array<MinifiedASTNode> = []

  node.children.forEach(element => {
    let result = recursiveMinify(element)

    if (result) {
      children.push(result)
    }
  })

  let output : MinifiedASTNode = {
    tag: node.tag,
  }

  if (Object.keys(node.attrsMap).length > 0) {
    output.attrsMap = node.attrsMap
  }

  if (children.length > 0) {
    output.children = children
  }

  return output
}