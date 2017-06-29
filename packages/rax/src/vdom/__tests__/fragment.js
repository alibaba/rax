/* @jsx createElement */

'use strict';

import Component from '../../component';
import {createElement} from '../../element';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';
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
          <div>
            <span>hello</span>
            <span>{this.props.message}</span>
          </div>
        ];
      }
    }

    let beforeInst = render(<Hello message="world" />, el);
    let beforeContainer = findDOMNode(beforeInst)[0];
    let beforeDiv = beforeContainer.childNodes[0];
    let beforeSpan = beforeDiv.childNodes[0];

    let inst = render(<Hello message="rax" />, el);
    let container = findDOMNode(inst)[0];
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

  it('should update correct', function() {
    let el = createNodeElement('div');

    class Hello extends Component {
      render() {
        return [
          <span>1</span>,
          <span>2</span>
        ];
      }
    }

    class World extends Component {
      render() {
        return [
          <span>3</span>,
          <span>4</span>
        ];
      }
    }

    class MyComponent extends Component {
      state = {
        list: [<Hello />]
      }
      componentDidMount() {
        this.state.list.push(<World />);
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

    let container = findDOMNode(inst);
    let childNodes = container.childNodes;

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
        let {condition} = this.props;
        return condition ? <Hello key="a" /> :
          [<Hello key="a" />, <div key="b">World</div>];
      }
    }

    let inst = render(<MyComponent />, el);
    let childNodes = findDOMNode(inst);

    expect(childNodes.length).toBe(2);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
    expect(childNodes[1].childNodes[0].data).toBe('World');

    inst = render(<MyComponent condition={true} />, el);
    let container = findDOMNode(inst);
    expect(container.tagName).toBe('DIV');
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
        let {condition} = this.props;
        return condition ? <Hello key="a" /> :
          [[<Hello key="a" />, <div key="b">World</div>], <div />];
      }
    }

    let inst = render(<MyComponent />, el);
    let childNodes = findDOMNode(inst);

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
    expect(childNodes[1].childNodes[0].data).toBe('World');
    expect(childNodes[2].tagName).toBe('DIV');

    inst = render(<MyComponent condition={true} />, el);
    let container = findDOMNode(inst);
    expect(container.tagName).toBe('DIV');
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
        let {condition} = this.props;
        return condition ? [null, <Hello />] :
          [<div>Hello</div>, <Hello />];
      }
    }

    let inst = render(<MyComponent />, el);
    let childNodes = findDOMNode(inst);

    expect(childNodes.length).toBe(2);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
    expect(childNodes[1].childNodes[0].data).toBe('World');

    let instanceA = instance;
    expect(instanceA).not.toBe(null);

    inst = render(<MyComponent condition={true} />, el);
    childNodes = findDOMNode(inst);

    expect(childNodes.length).toBe(2);
    expect(childNodes[0].data).toBe(' empty ');
    expect(childNodes[1].childNodes[0].data).toBe('World');

    let instanceB = instance;
    // expect(instanceB).toBe(instanceA);

    inst = render(<MyComponent condition={false} />, el);
    childNodes = findDOMNode(inst);

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
        let {condition} = this.props;
        return condition ? [[<div key="b">World</div>, <Hello key="a" />]] :
          [[<Hello key="a" />, <div key="b">World</div>], <div />];
      }
    }

    let inst = render(<MyComponent />, el);
    let childNodes = findDOMNode(inst);

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].childNodes[0].data).toBe('Hello');
    expect(childNodes[1].childNodes[0].data).toBe('World');
    expect(childNodes[2].tagName).toBe('DIV');

    inst = render(<MyComponent condition={true} />, el);
    childNodes = findDOMNode(inst);

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
    let childNodes = findDOMNode(inst);

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].childNodes[0].data).toBe('1');
    expect(childNodes[1].childNodes[0].data).toBe('2');
    expect(childNodes[2].childNodes[0].data).toBe('3');

    inst.setState({
      list: [1, 2, 3, 7, 8, 9]
    });

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

    expect(childNodes.length).toBe(3);
    expect(childNodes[0].childNodes[0].data).toBe('4');
    expect(childNodes[1].childNodes[0].data).toBe('5');
    expect(childNodes[2].childNodes[0].data).toBe('6');
  });
});
