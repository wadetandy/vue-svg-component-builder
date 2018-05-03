import { expect } from '../test-helper'
import { spy, assert as sinonAssert } from 'sinon'
import { build } from '../../src/component-builder'
import { mount } from 'vue-test-utils'

import { compile, CompiledResult, ASTElement } from 'vue-template-compiler'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const rawIconSVG = readFileSync(resolve(__dirname, '../fixtures/clipboard.svg')).toString()

describe('ComponentBuilder', () => {
  context('when the SVG is passed as a Vue Template Compiler AST', () => {
    let parseSvg = () : CompiledResult => {
      return compile(rawIconSVG)
    }

    let buildIcon = () => {
      let parsed = parseSvg()
      let ast = parsed.ast as ASTElement

      return build(ast)
    }

    context('default properties', () => {
      it('returns a usable vue component for the associated SVG', () => {
        let iconComponent = buildIcon()
        let wrapper = mount(iconComponent)

        expect(wrapper.element.tagName).to.eq('svg')
      })

      it('defaults the height and width to the viewbox height and width', () => {
        let iconComponent = buildIcon()
        let wrapper = mount(iconComponent)

        let attrs = wrapper.attributes() as Record<string, string>
        expect(attrs.width).to.eq('512')
        expect(attrs.height).to.eq('512')
      })

      it('defaults fill to "currentColor"', () => {
        let iconComponent = buildIcon()
        let wrapper = mount(iconComponent)

        let attrs = wrapper.attributes() as Record<string, string>
        expect(attrs.fill).to.eq('currentColor')
      })
    })

    describe('dimensions/scaling', () => {
      context('different scaling factor passed in', () => {
        let propsData = {
          scale: 2.501
        }

        it('scales the height and width to an integer with the passed in scaling factor', () => {
          let iconComponent = buildIcon()
          let wrapper = mount(iconComponent, { propsData })

          let attrs = wrapper.attributes() as Record<string, string>
          expect(attrs.height).to.eq('1280')
          expect(attrs.width).to.eq('1280')
        })

        context('height and width are explitly set', () => {
          it('ignores the scale and sets them directly', () => {
            let iconComponent = buildIcon()
            let wrapper = mount(iconComponent, { propsData, attrs: {height: 40, width: 80} })

            let attrs = wrapper.attributes() as Record<string, string>
            expect(attrs.height).to.eq('40')
            expect(attrs.width).to.eq('80')
          })
        })
      })

      context('scaling factor is false', () => {
        let propsData = {
          scale: false
        }

        it('does not explicitly set height or width', () => {
          let iconComponent = buildIcon()
          let wrapper = mount(iconComponent, { propsData })

          let attrs = wrapper.attributes() as Record<string, string>
          expect(attrs.height).to.eq(undefined)
          expect(attrs.width).to.eq(undefined)
        })
      })
    })

    context('fill is provided', () => {
      let propsData = {
        fill: '#aabbcc'
      }

      it('sets the fill color', () => {
        let iconComponent = buildIcon()
        let wrapper = mount(iconComponent, { propsData })

        let attrs = wrapper.attributes() as Record<string, string>
        expect(attrs.fill).to.eq('#aabbcc')
      })
    })

    describe('slots', () => {
      describe('$default', () => {
        it('puts the content just inside the primary SVG element', () => {
          let iconComponent = buildIcon()
          let wrapper = mount(iconComponent, {
            slots: {
              default: '<div class="slot-content">I am extra content</div>'
            }
          })

          expect(wrapper.html()).to.contain('<div class="slot-content">I am extra content</div>')
        })

        it('does not affect the rest of the SVG content', () => {
          let iconComponent = buildIcon()
          let wrapper = mount(iconComponent, {
            slots: {
              default: '<div class="slot-content">I am extra content</div>'
            }
          })

          expect(wrapper.html()).to.contain('<path d=')
        })
      })
    })

    describe('event handling', () => {
      it('delegates events to the top-level svg component', () => {
        let iconComponent = buildIcon()
        let clickHandler = spy()
        let wrapper = mount(iconComponent, {
          listeners: {
            click: clickHandler
          }
        })
        let svg = wrapper.find('svg')
        svg.trigger('click')

        sinonAssert.called(clickHandler)
      })
    })
  })
})