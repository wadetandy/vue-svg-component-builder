import { expect } from '../test-helper'
import { recursiveMinify } from '../../src/utils'

describe('recursiveMinify', () => {
  context('when the node is a text node', () => {
    it('returns just the text field', () => {
      let node : any = {
        text: 'foobar',
        other: 'value'
      }

      expect(recursiveMinify(node)).to.deep.equal({text: 'foobar'})
    })

    context('when the node has empty text', () => {
      it('returns undefined', () => {
        let node : any = {
          text: '   ',
          other: 'value'
        }
        expect(recursiveMinify(node)).to.be.undefined
      })
    })
  })

  context('when the node is an element node', () => {
    it('returns only necessary nodes and recursively parses children', () => {
      let node : any = {
        tag: 'svg',
        attrsMap: {
          first: 'firstVal',
          second: 'secondVal',
        },
        children: [{
          text: 'foobar',
          other: 'value'
        },{
          text: ''
        }],
        other: 'value'
      }

      expect(recursiveMinify(node)).to.deep.equal({
        tag: 'svg',
        attrsMap: {
          first: 'firstVal',
          second: 'secondVal',
        },
        children: [{
          text: 'foobar',
        }],
      })
    })

    context('when the children are empty', () => {
      it('returns node without children', () => {
        let node : any = {
          tag: 'svg',
          attrsMap: {
            attr: 'attrval',
          },
          children: []
        }
        expect(recursiveMinify(node)).to.deep.equal({
          tag: 'svg',
          attrsMap: {
            attr: 'attrval',
          },
        })
      })
    })

    context('when the attrsMap hash is blank', () => {
      it('returns node without attrsMap', () => {
        let node : any = {
          tag: 'svg',
          attrsMap: {
          },
          children: [{
            text: 'foobar',
          }],
        }
        expect(recursiveMinify(node)).to.deep.equal({
          tag: 'svg',
          children: [{
            text: 'foobar',
          }],
        })
      })
    })
  })
})