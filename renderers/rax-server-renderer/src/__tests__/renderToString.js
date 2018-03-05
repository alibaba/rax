/* @jsx createElement */

import {createElement, Component} from 'rax';
import {renderToString} from '../index';

describe('renderToString', () => {
  it('render plain component', () => {
    class MyComponent {
      render() {
        return <div />;
      }
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<div></div>');
  });

  it('render return array element', () => {
    class MyComponent {
      render() {
        return [
          <div />,
          <div />,
          'hi'
        ];
      }
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<div></div><div></div>hi');
  });

  it('render return string', () => {
    class MyComponent {
      render() {
        return 'hi';
      }
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('hi');
  });

  it('render composite component', () => {
    class OtherComponent extends Component {
      state = {
        bar: 'bar'
      };
      componentWillMount() {
        this.setState({
          foo: 'foo'
        });
      }
      render() {
        return <div foo={this.state.foo} bar={this.state.bar} />;
      }
    }

    class MyComponent {
      render() {
        return <main>
          <OtherComponent />
          <div />
        </main>;
      }
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<main><div foo="foo" bar="bar"></div><div></div></main>');
  });

  it('render stateless component', () => {
    function MyComponent(props, context) {
      return <div name={props.name} />;
    }

    let str = renderToString(<MyComponent name="foo" />);
    expect(str).toBe('<div name="foo"></div>');
  });

  it('render with style', () => {
    const style = {
      flex: 1,
      fontSize: 16,
      width: '100%'
    };

    function MyComponent(props, context) {
      return <div style={style} />;
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<div style="flex:1;font-size:16rem;width:100%;"></div>');
  });

  it('render with dangerouslySetInnerHTML', () => {
    function MyComponent(props, context) {
      return <div dangerouslySetInnerHTML={{__html: '<hr>'}} />;
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<div><hr></div>');
  });

  it('render with defaultValue', () => {
    function MyComponent(props, context) {
      return <input defaultValue={'foo'} />;
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<input value="foo">');
  });

  it('render with defaultChecked', () => {
    function MyComponent(props, context) {
      return <input type="radio" defaultChecked="checked" />;
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<input type="radio" checked="checked">');
  });

  it('render with context', () => {
    class OtherComponent extends Component {
      state = {
        bar: 'bar'
      };
      componentWillMount() {
        this.setState({
          foo: 'foo'
        });
      }
      render() {
        return <div className={this.props.className} foo={this.state.foo} bar={this.state.bar} baz={this.context.baz} />;
      }
    }

    class MyComponent {
      getChildContext() {
        return {
          baz: 'baz'
        };
      }
      render() {
        return <OtherComponent className="hello" />;
      }
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<div class="hello" foo="foo" bar="bar" baz="baz"></div>');
  });
});
