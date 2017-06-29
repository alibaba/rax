/* @jsx createElement */

'use strict';

import Component from '../../component';
import {createElement} from '../../element';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';
import findDOMNode from '../../findDOMNode';

describe('NativeComponent', function() {
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

    let foo = findDOMNode(inst).childNodes[1];
    let bar = findDOMNode(inst).childNodes[2];
    expect(foo.data).toBe('foo');
    expect(bar.data).toBe('bar');

    inst = render(<div><span />{'baz'}{'qux'}</div>, el);
    // After the update, the text nodes should have stayed in place (as opposed
    // to getting unmounted and remounted)
    expect(findDOMNode(inst).childNodes[1]).toBe(foo);
    expect(findDOMNode(inst).childNodes[2]).toBe(bar);
    expect(foo.data).toBe('baz');
    expect(bar.data).toBe('qux');
  });

  it('can be toggled in and out of the markup', function() {
    let el = createNodeElement('div');
    let inst = render(<div>{'foo'}<div />{'bar'}</div>, el);

    let container = findDOMNode(inst);
    let childDiv = container.childNodes[1];
    let childNodes = container.childNodes;
    expect(childNodes.length).toBe(3);

    inst = render(<div>{null}<div />{null}</div>, el);
    container = findDOMNode(inst);
    childNodes = container.childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[1]).toBe(childDiv);

    inst = render(<div>{'foo'}<div />{'bar'}</div>, el);
    container = findDOMNode(inst);
    childNodes = container.childNodes;

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1]).toBe(childDiv);
    expect(childNodes[2].data).toBe('bar');
  });

  it('should append to right position', function() {
    let el = createNodeElement('div');
    class Hello1 extends Component {
      render() {
        if (this.props.show) {
          return 'hello1';
        }
        return null;
      }
    }

    class Hello2 extends Component {
      render() {
        if (this.props.show) {
          return 'hello2';
        } else {
          return 'bye';
        }
      }
    }

    class MyComponent extends Component {
      state = {
        show: false
      }
      render() {
        return (
          <div>
            {'foo'}
            <Hello1 show={this.state.show} />
            <Hello2 show={this.state.show} />
          </div>
        );
      }
    }

    let inst = render(<MyComponent />, el);

    let container = findDOMNode(inst);
    let childNodes = container.childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1].data).toBe(' empty ');
    expect(childNodes[2].data).toBe('bye');

    inst.setState({
      show: true
    });

    childNodes = container.childNodes;

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1].data).toBe('hello1');
    expect(childNodes[2].data).toBe('hello2');
  });
});
