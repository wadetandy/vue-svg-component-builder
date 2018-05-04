import { ASTNode, ASTElement } from 'vue-template-compiler'

export const isElementNode = (node : MinifiedASTNode) : node is MinifedASTElement => {
  return node.hasOwnProperty('children')
}

export type MinifiedASTNode =  MinifiedASTText | MinifedASTElement

export interface MinifiedASTText {
  text: string
}

export interface MinifedASTElement {
  tag: string,
  attrsMap: Record<string, string>
  children: MinifiedASTNode[]
}

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

function recursiveMinify(node: ASTNode) : MinifiedASTNode {
  if (!isVueTemplateASTElement(node)) {
    return {
      text: node.text
    }
  }

  delete node.parent

  let children = node.children.map(element => {
    return recursiveMinify(element)
  })

  let output = {
    tag: node.tag,
    attrsMap: node.attrsMap,
    children
  }

  return output
}