/* @jsx createElement */

'use strict';

import Component from '../component';
import createElement from '../../createElement';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';

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
    jest.useFakeTimers();
  });

  afterEach(function() {
    Host.driver = null;
    jest.useRealTimers();
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

  it('can be toggled in and out of the markup', function() {
    let el = createNodeElement('div');
    let inst = render(<div>{'foo'}<div />{'bar'}</div>, el);

    let container = el.childNodes[0];
    let childDiv = container.childNodes[1];
    let childNodes = container.childNodes;
    expect(childNodes.length).toBe(3);

    inst = render(<div>{null}<div />{null}</div>, el);
    container = el.childNodes[0];
    childNodes = container.childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[1]).toBe(childDiv);

    inst = render(<div>{'foo'}<div />{'bar'}</div>, el);
    container = el.childNodes[0];
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

    let container = el.childNodes[0];
    let childNodes = container.childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1].data).toBe(' empty ');
    expect(childNodes[2].data).toBe('bye');

    inst.setState({
      show: true
    });
    jest.runAllTimers();

    childNodes = container.childNodes;

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1].data).toBe('hello1');
    expect(childNodes[2].data).toBe('hello2');
  });

  it('should rendering correct even if child did not update when element is same', function() {
    let container = createNodeElement('div');
    const child1 = <div key="a">a</div>;
    const child2 = <div>b</div>;
    const child3 = <div key="c">c</div>;

    class App extends Component {
      state = {count: 0};
      render() {
        return (
          <div>
            {
              this.state.count === 0
                ? [<div>d</div>, child1, <div>e</div>, child2, child3]
                : [child3, <div>e</div>, child2, child1, <div>d</div>]
            }
          </div>
        );
      }
    }
    const instance = render(<App />, container);
    expect(container.childNodes[0].childNodes[0].childNodes[0].data).toBe('d');
    expect(container.childNodes[0].childNodes[1].childNodes[0].data).toBe('a');
    expect(container.childNodes[0].childNodes[2].childNodes[0].data).toBe('e');
    expect(container.childNodes[0].childNodes[3].childNodes[0].data).toBe('b');
    expect(container.childNodes[0].childNodes[4].childNodes[0].data).toBe('c');

    instance.setState({count: 1});
    jest.runAllTimers();

    expect(container.childNodes[0].childNodes[0].childNodes[0].data).toBe('c');
    expect(container.childNodes[0].childNodes[1].childNodes[0].data).toBe('e');
    expect(container.childNodes[0].childNodes[2].childNodes[0].data).toBe('b');
    expect(container.childNodes[0].childNodes[3].childNodes[0].data).toBe('a');
    expect(container.childNodes[0].childNodes[4].childNodes[0].data).toBe('d');
  });
});
