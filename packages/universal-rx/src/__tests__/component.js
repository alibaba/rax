/* @jsx createElement */

import Component from '../component';
import {createElement} from '../element';

describe('Component', () => {
  it('preserves the name of the class', () => {
    class Foo extends Component { }
    expect(Foo.name).toBe('Foo');
  });

  it('check a component is class type', () => {
    class Foo extends Component { }
    let foo = new Foo();
    expect(foo.isComponentClass).toBeDefined();
  });

  it('create a component with prop', () => {
    class Foo extends Component {
      render() {
        return null;
      }
    }

    let bar = () => {};
    let foo = <Foo foo="Foo" bar={bar} />;
    expect(foo.props.foo).toBe('Foo');
    expect(foo.props.bar).toBe(bar);
  });

  it('create a component with ignored prop', () => {
    class Foo extends Component {
      render() {
        return null;
      }
    }

    let foo = <Foo key="key" ref="ref" />;
    expect(foo.props.key).toBe(undefined);
    expect(foo.props.ref).toBe(undefined);
  });

  it('create a component based on state using initial values in this.props', function() {
    class Foo extends Component {
      constructor(props) {
        super(props);
        this.state = {bar: this.props.initialValue};
      }
      render() {
        return null;
      }
    }

    let foo = <Foo initialValue="Foo" />;
    let ElementType = foo.type;
    let instance = new ElementType(foo.props);
    expect(instance.state.bar).toBe('Foo');
  });
});
