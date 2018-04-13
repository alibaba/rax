/* @jsx createElement */

import {createElement} from '../element';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import findDOMNode from '../findDOMNode';

describe('render', () => {
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

  beforeEach(() => {
    Host.driver = ServerDriver;
  });

  afterEach(() => {
    Host.driver = null;
  });

  it('render to default container', () => {
    let appendChildMock = jest.fn();

    Host.driver = {
      createElement() {
        return {tagName: 'DIV'};
      },
      createBody() {
        return {tagName: 'BODY'};
      },
      appendChild: appendChildMock
    };

    render(<div />);

    let call = appendChildMock.mock.calls[0];
    expect(call[0].tagName).toBe('DIV');
    expect(call[1].tagName).toBe('BODY');
  });

  it('should render different components in same root', function() {
    let container = createNodeElement('container');

    render(<div />, container);
    expect(container.childNodes[0].tagName).toBe('DIV');

    render(<span />, container);
    expect(container.childNodes[0].tagName).toBe('SPAN');
  });

  it('should reuse markup if rendering to the same target twice', function() {
    let container = createNodeElement('container');
    let instance1 = render(<div />, container);
    let instance2 = render(<div />, container);

    expect(instance1 === instance2).toBe(true);
  });

  it('should reuse markup if rendering to the same target twice', function() {
    let container = createNodeElement('container');
    let instance1 = render(<div />, container);
    let instance2 = render(<div />, container);

    expect(instance1 === instance2).toBe(true);
  });

  it('should not throw error when have callback and options is null', function(done) {
    let container = createNodeElement('container');
    render(<div />, container, function() {
      done();
    });
  });
});
