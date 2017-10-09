import {createElement, Component} from 'rax';
import {renderToNodeStream} from '../index';

const Writable = require('stream').Writable;

const renderIntoStream = (element) => {
  class DrainWritable extends Writable {
    constructor(options) {
      super(options);
      this.buffer = '';
    }
    _write(chunk, encoding, next) {
      this.buffer += chunk;
      next();
    }
  }

  return new Promise((resolve) => {
    let writable = new DrainWritable();
    renderToNodeStream(element).pipe(writable);
    writable.on('finish', () => resolve(writable.buffer));
  });
};

describe('renderToNodeStream', () => {
  it('render plain component', async () => {
    class MyComponent {
      render() {
        return <div />;
      }
    }

    let str = await renderIntoStream(<MyComponent />);
    expect(str).toBe('<div></div>');
  });

  it('render return array element', async () => {
    class MyComponent {
      render() {
        return [
          <div />,
          <div />,
          'hi'
        ];
      }
    }

    let str = await renderIntoStream(<MyComponent />);
    expect(str).toBe('<div></div><div></div>hi');
  });

  it('render return string', async () => {
    class MyComponent {
      render() {
        return 'hi';
      }
    }

    let str = await renderIntoStream(<MyComponent />);
    expect(str).toBe('hi');
  });

  it('render composite component', async () => {
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

    let str = await renderIntoStream(<MyComponent />);
    expect(str).toBe('<main><div foo="foo" bar="bar"></div><div></div></main>');
  });

  it('render stateless component', async () => {
    function MyComponent(props, context) {
      return <div name={props.name} />;
    }

    let str = await renderIntoStream(<MyComponent name="foo" />);
    expect(str).toBe('<div name="foo"></div>');
  });

  it('render with style', async () => {
    const style = {
      flex: 1,
      fontSize: 16,
      width: '100%'
    };

    function MyComponent(props, context) {
      return <div style={style} />;
    }

    let str = await renderIntoStream(<MyComponent />);
    expect(str).toBe('<div style="flex:1;font-size:16rem;width:100%;"></div>');
  });

  it('render with dangerouslySetInnerHTML', async () => {
    function MyComponent(props, context) {
      return <div dangerouslySetInnerHTML={{__html: '<hr>'}} />;
    }

    let str = await renderIntoStream(<MyComponent />);
    expect(str).toBe('<div><hr></div>');
  });

  it('render with defaultValue', async () => {
    function MyComponent(props, context) {
      return <input defaultValue={'foo'} />;
    }

    let str = await renderIntoStream(<MyComponent />);
    expect(str).toBe('<input value="foo">');
  });

  it('render with defaultChecked', async () => {
    function MyComponent(props, context) {
      return <input type="radio" defaultChecked="checked" />;
    }

    let str = await renderIntoStream(<MyComponent />);
    expect(str).toBe('<input type="radio" checked="checked">');
  });

  it('render with context', async () => {
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

    let str = await renderIntoStream(<MyComponent />);
    expect(str).toBe('<div class="hello" foo="foo" bar="bar" baz="baz"></div>');
  });
});
