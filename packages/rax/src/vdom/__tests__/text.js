/* @jsx createElement */

'use strict';

import createElement from '../../createElement';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';

describe('TextComponent', function() {
  function createNodeElement(tagName) {
    return {
      nodeType: 1,
      tagName: tagName.toUpperCase(),
      attributes: {},
      style: {},
      childNodes: [],
      parentNode: null
    };
  }

  beforeEach(function() {
    Host.driver = ServerDriver;
  });

  afterEach(function() {
    Host.driver = null;
  });

  it('updates a mounted text component in place', function() {
    let el = createNodeElement('div');
    let inst = render(<div><span />{'foo'}{'bar'}</div>, el);

    let foo = el.childNodes[0].childNodes[1];
    let bar = el.childNodes[0].childNodes[2];
    expect(foo.data).toBe('foo');
    expect(bar.data).toBe('bar');

    inst = render(<div><span />{'baz'}{'qux'}</div>, el);
    // After the update, the text nodes should have stayed in place (as opposed
    // to getting unmounted and remounted)
    expect(el.childNodes[0].childNodes[1]).toBe(foo);
    expect(el.childNodes[0].childNodes[2]).toBe(bar);
    expect(foo.data).toBe('baz');
    expect(bar.data).toBe('qux');
  });
});
