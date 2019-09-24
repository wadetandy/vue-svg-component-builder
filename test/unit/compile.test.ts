import { expect } from '../test-helper'
import { compileAndMinify } from '../../src/index'

describe('compilation', () => {
  context('when the svg includes style tags', () => {
    it('preserves all tags in output', () => {
      let code = `
        <?xml version="1.0" encoding="utf-8"?>
        <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 44 44" style="enable-background:new 0 0 44 44;" xml:space="preserve">
          <style type="text/css">.st0{fill:#FF007D;}</style>
          <line class="st0" x1="11.6" y1="21.9" x2="32.4" y2="21.9">foo</line>
        </svg>
      `

      let result = compileAndMinify(code)

      expect(result.children).to.deep.equal([
        {
          attrsMap: {
            type: "text/css"
          },
          children: [{ text: ".st0{fill:#FF007D;}" }],
          tag: "style"
        },
        {
          attrsMap: {
            class: "st0",
            x1: "11.6",
            x2: "32.4",
            y1: "21.9",
            y2: "21.9",
          },
          tag: "line",
        }
      ])
    })
  })
})