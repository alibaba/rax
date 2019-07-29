/* @jsx createElement */

import {createElement, useState, useEffect, createContext, useContext, useReducer} from 'rax';
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
    expect(str).toBe('<div style="flex:1;font-size:16px;width:100%;"></div>');
  });

  it('style with list', () => {
    const styles = {
      title: {
        fontSize: 16,
      },
      container: {
        flex: 1,
        width: '100%'
      }
    };

    function MyComponent(props, context) {
      return <div style={[styles.container, styles.title]} />;
    }

    const str = renderToString(<MyComponent />);
    expect(str).toBe('<div style="flex:1;width:100%;font-size:16px;"></div>');
  });

  it('style with rpx', () => {
    const style = {
      flex: 1,
      fontSize: '16rpx',
      width: '100%'
    };

    function MyComponent(props, context) {
      return <div style={style} />;
    }

    const str = renderToString(<MyComponent />);
    expect(str).toBe('<div style="flex:1;font-size:2.13333vw;width:100%;"></div>');
  });

  it('style with lineHeight', () => {
    const styles = {
      container: {
        lineHeight: 1
      },
      text: {
        lineHeight: '75rpx'
      }
    };

    function MyComponent(props, context) {
      return (
        <div style={styles.container}>
          <p style={styles.text}>Hello</p>
        </div>
      );
    }

    const str = renderToString(<MyComponent />);
    expect(str).toBe('<div style="line-height:1;"><p style="line-height:10vw;">Hello</p></div>');
  });

  it('render with options which set default unit to rpx', () => {
    const styles = {
      container: {
        lineHeight: 1
      },
      text: {
        fontSize: 75
      }
    };

    function MyComponent(props, context) {
      return (
        <div style={styles.container}>
          <p style={styles.text}>Hello</p>
        </div>
      );
    }

    const str = renderToString(<MyComponent />, {
      defaultUnit: 'rpx'
    });
    expect(str).toBe('<div style="line-height:1;"><p style="font-size:10vw;">Hello</p></div>');
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

  it('render with state hook', () => {
    function MyComponent(props) {
      const [name, setName] = useState(props.name);

      return (
        <h1> Hello {name}</h1>
      );
    };

    let str = renderToString(<MyComponent name="rax" />);
    expect(str).toBe('<h1> Hello rax</h1>');
  });

  it('render with effect hook', () => {
    function MyComponent(props) {
      const [name, setName] = useState(props.name);

      useEffect(() => {
        // ...
      });

      return (
        <h1> Hello {name}</h1>
      );
    };

    let str = renderToString(<MyComponent name="rax" />);
    expect(str).toBe('<h1> Hello rax</h1>');
  });

  it('render with Context.Provider', () => {
    const ThemeContext = createContext('light');

    function MyContext() {
      return (
        <ThemeContext.Provider value={'dark'}>
          <MyComponent />
        </ThemeContext.Provider>
      );
    };

    function MyComponent() {
      const value = useContext(ThemeContext);
      return (
        <div>Current theme is {value}.</div>
      );
    };

    let str = renderToString(<MyContext />);
    expect(str).toBe('<div>Current theme is dark.</div>');
  });


  it('render with Context.Consumer', () => {
    const ThemeContext = createContext('light');

    function MyContext() {
      return (
        <ThemeContext.Provider value={'dark'}>
          <MyComponent />
        </ThemeContext.Provider>
      );
    };

    function MyComponent() {
      const value = useContext(ThemeContext);
      return (
        <ThemeContext.Consumer>
          {value => <div>Current theme is {value}.</div>}
        </ThemeContext.Consumer>
      );
    };

    let str = renderToString(<MyContext />);
    expect(str).toBe('<div>Current theme is dark.</div>');
  });

  it('render with context hook', () => {
    const NumberContext = createContext(5);

    function MyComponent() {
      const value = useContext(NumberContext);

      return (
        <div>The answer is {value}.</div>
      );
    };

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<div>The answer is 5.</div>');
  });

  it('render with reducer hook', () => {
    const initialState = {count: 0};

    function reducer(state, action) {
      switch (action.type) {
        case 'reset':
          return initialState;
        case 'increment':
          return {count: state.count + 1};
        case 'decrement':
          return {count: state.count - 1};
        default:
        // A reducer must always return a valid state.
        // Alternatively you can throw an error if an invalid action is dispatched.
          return state;
      }
    }

    function MyComponent({initialCount}) {
      const [state] = useReducer(reducer, {count: initialCount});
      return (
        <div>Count: {state.count}</div>
      );
    }

    let str = renderToString(<MyComponent initialCount={0} />);
    expect(str).toBe('<div>Count: 0</div>');
  });
});
