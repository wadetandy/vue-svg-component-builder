import Vue, { VueConstructor, CreateElement, VNode, ComponentOptions, PropOptions } from 'vue'
import { ASTElement, ASTNode } from 'vue-template-compiler'

export interface IDimensions {
  height: number,
  width: number,
}

export interface IComponent extends Vue {
  scale: number | undefined
  fill: string
  dimension: IDimensions
}

const isElementNode = (node : ASTNode) : node is ASTElement => {
  return node.hasOwnProperty('children')
}

function renderASTNode(h: CreateElement, ast: ASTNode) : VNode | string {
  if (isElementNode(ast)) {
    let children = ast.children.map(child => renderASTNode(h, child))

    return h(
      ast.tag,
      {
        attrs: ast.attrsMap
      },
      children
    )
  } else {
    return ast.text
  }
}

export const build = (svg : ASTElement) => {
  let component : ComponentOptions<Vue> = {
    props: {
      scale: {
        type: [Number, Boolean],
        default: 1,
        required: false,
      },
      fill: {
        type: String,
        default: 'currentColor',
        required: false,
      }
    },
    inheritAttrs: false,
    computed: {
      dimension(this: IComponent) : IDimensions | {} {
        if (!this.scale) {
          return {}
        }

        let splits = svg.attrsMap.viewBox.split(" ")

        return {
          width: Math.floor(parseInt(splits[2]) * this.scale),
          height: Math.floor(parseInt(splits[3]) * this.scale),
        }
      }
    },
    render(this: IComponent, h: CreateElement) {
      let scale = (this.scale ? this.dimension : {})
      let svgAttrs : Record<string, number | string> = {
        ...svg.attrsMap,
        'aria-hidden': 'true',
        fill: this.fill,
        ...scale,
        ...this.$attrs,
      }

      return h(
        svg.tag,
        {
          attrs: svgAttrs,
          on: this.$listeners
        },
        [
          this.$slots.default,
          ...svg.children.map(c => renderASTNode(h, c))
        ]
      )
    },
  }

  return component
}