/* @jsx createElement */

'use strict';

import Component from '../../component';
import {createElement} from '../../element';
import Host from '../host';
import render from '../../render';
import ServerDriver from '../../drivers/server';
import findDOMNode from '../../findDOMNode';

describe('FragmentComponent', function() {
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
    let inst = render(['foo', 'bar'], el);

    let foo = el.childNodes[0];
    let bar = el.childNodes[1];
    expect(foo.data).toBe('foo');
    expect(bar.data).toBe('bar');
  });

  it('should diff update right', function() {
    let el = createNodeElement('div');
    class Hello extends Component {
      render() {
        return [
          <div>
            <span>hello</span>
            <span>{this.props.message}</span>
          </div>
        ];
      }
    }

    let beforeInst = render(<Hello message="world" />, el);
    let beforeContainer = findDOMNode(beforeInst);
    let beforeDiv = beforeContainer.childNodes[0];
    let beforeSpan = beforeDiv.childNodes[0];

    let inst = render(<Hello message="rax" />, el);
    let container = findDOMNode(inst);
    let div = container.childNodes[0];
    let span = div.childNodes[0];

    expect(beforeContainer).toBe(container);
    expect(beforeDiv).toBe(div);
    expect(beforeSpan).toBe(span);
  });

  it('should append to right position', function() {
    let el = createNodeElement('div');
    class Hello1 extends Component {
      render() {
        return [
          this.props.show ? 'hello1' : null,
          this.props.show ? 'hello1' : null
        ];
      }
    }

    class Hello2 extends Component {
      render() {
        return [
          this.props.show ? 'hello2' : null,
          this.props.show ? 'hello2' : null
        ];
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

    expect(childNodes.length).toBe(5);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1].data).toBe(' empty ');
    expect(childNodes[2].data).toBe(' empty ');
    expect(childNodes[3].data).toBe(' empty ');
    expect(childNodes[4].data).toBe(' empty ');

    inst.setState({
      show: true
    });

    childNodes = container.childNodes;

    expect(childNodes.length).toBe(5);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1].data).toBe('hello1');
    expect(childNodes[2].data).toBe('hello1');
    expect(childNodes[3].data).toBe('hello2');
    expect(childNodes[4].data).toBe('hello2');
  });
});
