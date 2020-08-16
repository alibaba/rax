/* @jsx createElement */

'use strict';

import Component from '../component';
import createElement from '../../createElement';
import Host from '../host';
import render from '../../render';
import {INTERNAL, RENDERED_COMPONENT} from '../../constant';
import ServerDriver from 'driver-server';

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
    jest.useFakeTimers();
  });

  afterEach(function() {
    Host.driver = null;
    jest.useRealTimers();
  });

  it('should updates a mounted text component in place', function() {
    let el = createNodeElement('div');
    let inst = render(['foo', 'bar'], el);

    let foo = el.childNodes[0];
    let bar = el.childNodes[1];
    expect(foo.data).toBe('foo');
    expect(bar.data).toBe('bar');
  });

  it('should diff update correct', function() {
    let el = createNodeElement('div');
    class Hello extends Component {
      render() {
        return [
          <div key={'root'}>
            <span>hello</span>
            <span>{this.props.message}</span>
          </div>
        ];
      }
    }

    let beforeInst = render(<Hello message="world" />, el);
    let beforeContainer = el.childNodes[0];
    let beforeDiv = beforeContainer.childNodes[0];
    let beforeSpan = beforeDiv.childNodes[0];

    let inst = render(<Hello message="rax" />, el);
    let container = el.childNodes[0];
    let div = container.childNodes[0];
    let span = div.childNodes[0];

    expect(beforeContainer).toBe(container);
    expect(beforeDiv).toBe(div);
    expect(beforeSpan).toBe(span);
  });

  it('should append to correct position', function() {
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

    let container = el.childNodes[0];
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

    jest.runAllTimers();

    childNodes = container.childNodes;

    expect(childNodes.length).toBe(5);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1].data).toBe('hello1');
    expect(childNodes[2].data).toBe('hello1');
    expect(childNodes[3].data).toBe('hello2');
    expect(childNodes[4].data).toBe('hello2');
  });

  it('should update correct', function() {
    let el = createNodeElement('div');

    class Hello extends Component {
      render() {
        return [
          <span key={'1'}>1</span>,
          <span key={'2'}>2</span>
        ];
      }
    }

    class World extends Component {
      render() {
        return [
          <span key={'3'}>3</span>,
          <span key={'4'}>4</span>
        ];
      }
    }

    class MyComponent extends Component {
      state = {
        list: [<Hello key={'hello'} />]
      }
      componentDidMount() {
        this.state.list.push(<World key={'world'} />);
        /* eslint-disable */
        this.setState(this.state);
        /* eslint-enable */
      }
      render() {
        return (
          <div>
            {this.state.list}
          </div>
        );
      }
    }

    let inst = render(<MyComponent />, el);

    let container = el.childNodes[0];
    let childNodes = container.childNodes;
    jest.runAllTimers();

    expect(childNodes.length).toBe(4);
    expect(childNodes[0].childNodes[0].data).toBe('1');
    expect(childNodes[1].childNodes[0].data).toBe('2');
    expect(childNodes[2].childNodes[0].data).toBe('3');
    expect(childNodes[3].childNodes[0].data).toBe('4');
  });

  it('should render correct when switching from a single child', function() {
    let el = createNodeElement('div');

    class Hello extends Component {
      render() {
        return <div>Hello</div>;
      }
    }

    class MyComponent extends Component {
      render() {
        let { condition } = this.props;
        return condition ? <Hello key="a" /> :
          [<Hello key="a" />, <div key="b">World</div>];
      }
    }

    let inst = render(<MyComponent />, el);
    let childNodes = el.childNodes;

    expect(childNodes.length).toBe(2);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
    expect(childNodes[1].childNodes[0].data).toBe('World');

    inst = render(<MyComponent condition={true} />, el);
    expect(childNodes.length).toBe(1);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
  });

  it('should render correct when switching to a nested array', function() {
    let el = createNodeElement('div');

    class Hello extends Component {
      render() {
        return <div>Hello</div>;
      }
    }

    class MyComponent extends Component {
      render() {
        let { condition } = this.props;
        return condition ? <Hello key="a" /> :
          [[<Hello key="a" />, <div key="b">World</div>], <div key={'c'} />];
      }
    }

    let inst = render(<MyComponent />, el);
    let childNodes = el.childNodes;

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
    expect(childNodes[1].childNodes[0].data).toBe('World');
    expect(childNodes[2].tagName).toBe('DIV');

    inst = render(<MyComponent condition={true} />, el);
    expect(childNodes.length).toBe(1);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
  });

  it('should render correct if an implicit key slot switches from/to null', function() {
    let el = createNodeElement('div');
    let instance = null;

    class Hello extends Component {
      render() {
        instance = this;
        return <div>World</div>;
      }
    }

    class MyComponent extends Component {
      render() {
        let { condition } = this.props;
        return condition ? [null, <Hello key={'a'} />] :
          [<div key={'b'}>Hello</div>, <Hello key={'c'} />];
      }
    }

    let inst = render(<MyComponent />, el);
    let childNodes = el.childNodes;

    expect(childNodes.length).toBe(2);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
    expect(childNodes[1].childNodes[0].data).toBe('World');

    let instanceA = instance;
    expect(instanceA).not.toBe(null);

    inst = render(<MyComponent condition={true} />, el);

    expect(childNodes.length).toBe(2);
    expect(childNodes[0].data).toBe(' empty ');
    expect(childNodes[1].childNodes[0].data).toBe('World');

    let instanceB = instance;
    // expect(instanceB).toBe(instanceA);

    inst = render(<MyComponent condition={false} />, el);

    expect(childNodes.length).toBe(2);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
    expect(childNodes[1].childNodes[0].data).toBe('World');

    let instanceC = instance;
    // expect(instanceC === instanceA).toBe(true);
  });

  it('should render correct with nested array', function() {
    let el = createNodeElement('div');

    class Hello extends Component {
      render() {
        return <div>Hello</div>;
      }
    }

    class MyComponent extends Component {
      render() {
        let { condition } = this.props;
        return condition ? [[<div key="b">World</div>, <Hello key="a" />]] :
          [[<Hello key="a" />, <div key="b">World</div>], <div key={'c'} />];
      }
    }

    let inst = render(<MyComponent />, el);
    let childNodes = el.childNodes;

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
    expect(childNodes[1].childNodes[0].data).toBe('World');
    expect(childNodes[2].tagName).toBe('DIV');

    inst = render(<MyComponent condition={true} />, el);

    expect(childNodes.length).toBe(2);
    expect(childNodes[0].childNodes[0].data).toBe('World');
    expect(childNodes[1].childNodes[0].data).toBe('Hello');
  });

  it('should render correct when updated', function() {
    let el = createNodeElement('div');

    class MyComponent extends Component {
      state = {
        list: []
      };

      componentWillMount() {
        this.setState({
          list: [1, 2, 3]
        });
      }

      render() {
        return this.state.list.map((item, idx) => {
          return <span key={idx}>{item}</span>;
        });
      }
    }

    let inst = render(<MyComponent />, el);
    let childNodes = el.childNodes;

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].childNodes[0].data).toBe('1');
    expect(childNodes[1].childNodes[0].data).toBe('2');
    expect(childNodes[2].childNodes[0].data).toBe('3');

    inst.setState({
      list: [1, 2, 3, 7, 8, 9]
    });

    jest.runAllTimers();

    expect(childNodes.length).toBe(6);
    expect(childNodes[0].childNodes[0].data).toBe('1');
    expect(childNodes[1].childNodes[0].data).toBe('2');
    expect(childNodes[2].childNodes[0].data).toBe('3');
    expect(childNodes[3].childNodes[0].data).toBe('7');
    expect(childNodes[4].childNodes[0].data).toBe('8');
    expect(childNodes[5].childNodes[0].data).toBe('9');

    inst.setState({
      list: [4, 5, 6]
    });
    jest.runAllTimers();

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].childNodes[0].data).toBe('4');
    expect(childNodes[1].childNodes[0].data).toBe('5');
    expect(childNodes[2].childNodes[0].data).toBe('6');
  });

  it('should render correct when updated for null to fragment', function() {
    let el = createNodeElement('div');

    class Frag extends Component {
      render() {
        return [1, 2, 3];
      }
    }

    class App extends Component {
      state = { count: 0 };
      render() {
        return (
          <div>
            {
              this.state.count % 2 === 0 ? null :
                <Frag key="a" />
            }
          </div>
        );
      }
    }
    let instance = render(<App />, el);
    expect(el.childNodes[0].childNodes).toEqual([]);

    instance.setState({
      count: 1
    });
    jest.runAllTimers();

    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[0].childNodes[1].data).toBe('2');
    expect(el.childNodes[0].childNodes[2].data).toBe('3');
  });

  it('should render correct when updated with first old child existing', function() {
    let el = createNodeElement('div');

    class Frag extends Component {
      render() {
        return [1, 2, 3];
      }
    }

    class App extends Component {
      state = { count: 0 };
      render() {
        return (
          <div>
            {
              this.state.count % 2 === 0 ? <div>1</div> :
                <Frag key="a" />
            }
          </div>
        );
      }
    }
    let instance = render(<App />, el);
    expect(el.childNodes[0].childNodes[0].childNodes[0].data).toBe('1');
    instance.setState({
      count: 1
    });

    jest.runAllTimers();

    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[0].childNodes[1].data).toBe('2');
    expect(el.childNodes[0].childNodes[2].data).toBe('3');
  });

  it('Fragment and its child Fragment should have the same parent node', function() {
    let el = createNodeElement('div');

    class Frag extends Component {
      render() {
        return [1, 2, [4, 5, [7, 8]], 6];
      }
    }

    const instance = render(<Frag />, el);
    const frgmentInstance = instance._internal._renderedComponent;
    expect(frgmentInstance._parent).toBe(el);
    expect(frgmentInstance.__renderedChildren['.2']._parent).toBe(el);
    expect(frgmentInstance.__renderedChildren['.2'].__renderedChildren['.2']._parent).toBe(el);
  });

  it('should unmount correct after updated', function() {
    let el = createNodeElement('div');

    class Frag extends Component {
      render() {
        return [1, 2, [3, 4, 5, 6], 7];
      }
    }

    class App extends Component {
      state = { count: 0 };
      render() {
        return (
          <div>
            {
              this.state.count === 2 ? null :
                <Frag />
            }
          </div>
        );
      }
    }
    let instance = render(<App />, el);

    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[0].childNodes[1].data).toBe('2');
    expect(el.childNodes[0].childNodes[2].data).toBe('3');

    instance.setState({
      count: 1
    });

    jest.runAllTimers();
    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[0].childNodes[1].data).toBe('2');
    expect(el.childNodes[0].childNodes[2].data).toBe('3');

    instance.setState({
      count: 2
    });

    jest.runAllTimers();
    expect(el.childNodes[0].childNodes).toEqual([]);
  });

  it('should unmount all children', function() {
    let el = createNodeElement('div');

    class App extends Component {
      state = {
        list: [],
      };

      componentDidMount() {
        // eslint-disable-next-line
        this.setState({
          list: [1, 2, 3]
        });
      }

      render() {
        const { list } = this.state;
        return list.map(item => <div key={item}>{item}</div>);
      }
    }

    let instance = render(<App />, el);
    jest.runAllTimers();
    expect(el.childNodes.length).toBe(3);

    Host.driver.removeChildren = (node) => {
      node.childNodes = [];
    };
    instance.setState({ list: [] });
    jest.runAllTimers();

    delete Host.driver.removeChildren; // Reset driver
    expect(el.childNodes.length).toBe(0);
  });

  it('should not cache native node', function() {
    let el = createNodeElement('div');
    let instance = null;

    class Child extends Component {
      state = {
        count: 2
      }

      render() {
        instance = this;
        const count = this.state.count;
        if (count === 2) return <div>{count}</div>;
        return <span>{count}</span>;
      }
    }

    class App extends Component {
      render() {
        return (
          [
            <div key="1">1</div>,
            <Child key="2" />
          ]
        );
      }
    }

    const app = render(<App />, el);

    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[1].childNodes[0].data).toBe('2');

    instance.setState({
      count: 3
    });
    jest.runAllTimers();
    const nodes = app[INTERNAL][RENDERED_COMPONENT].__getNativeNode();
    expect(el.childNodes[1]).toBe(nodes[1]);
  });
});
