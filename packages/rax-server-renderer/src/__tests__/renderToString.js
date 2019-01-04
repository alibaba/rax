/* @jsx createElement */

import {createElement, useState, createContext, useContext, useEffect} from 'rax';
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
    function OtherComponent() {
      const [foo, setFoo] = useState('');
      const [bar, setBar] = useState('bar');
      useEffect(() => {
        setFoo('foo');
      });
      return <div foo={foo} bar={bar} />;
    }

    function MyComponent() {
      return <main>
        <OtherComponent />
        <div />
      </main>;
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
    const BazContext = createContext();

    function OtherComponent(props) {
      const [foo, setFoo] = useState('');
      const [bar, setBar] = useState('bar');
      const baz = useContext(BazContext);
      useEffect(function() {
        setFoo('foo');
      }, []);
      return <div className={props.className} foo={foo} bar={bar} baz={baz} />;
    }

    function MyComponent() {
      return (
        <BazContext.Provider value="baz">
          <OtherComponent className="hello" />
        </BazContext.Provider>
      );
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<div class="hello" foo="foo" bar="bar" baz="baz"></div>');
  });
});
