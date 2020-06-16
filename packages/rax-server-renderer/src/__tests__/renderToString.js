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
    expect(str).toBe('<input type="radio" checked>');
  });

  it('render with state hook', () => {
    function MyComponent(props) {
      const [name, setName] = useState(props.name);

      return (
        <h1> Hello {name}</h1>
      );
    };

    let str = renderToString(<MyComponent name="rax" />);
    expect(str).toBe('<h1> Hello <!--|-->rax</h1>');
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
    expect(str).toBe('<h1> Hello <!--|-->rax</h1>');
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
    expect(str).toBe('<div>Current theme is <!--|-->dark<!--|-->.</div>');
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
      return (
        <ThemeContext.Consumer>
          {value => <div>Current theme is {value}.</div>}
        </ThemeContext.Consumer>
      );
    };

    let str = renderToString(<MyContext />);
    expect(str).toBe('<div>Current theme is <!--|-->dark<!--|-->.</div>');
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
    expect(str).toBe('<div>The answer is <!--|-->5<!--|-->.</div>');
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
    expect(str).toBe('<div>Count: <!--|-->0</div>');
  });

  it('render with pre compiled html and attrs', () => {
    function View(props) {
      return (
        <div>{props.name}</div>
      );
    }

    function MyComponent(props) {
      // <div className="container" title={props.title}>
      //   <div>hello</div>
      //   <View name={props.name} />
      //   {props.version}
      // </div>

      return (
        [{
          __html: '<div class="container"'
        }, {
          __attrs: {
            title: props.title
          }
        }, {
          __html: '>'
        }, [{
          __html: '<div>'
        }, 'hello', {
          __html: '</div>'
        }], createElement(View, {
          name: props.name
        }), props.version, {
          __html: '</div>'
        }]
      );
    }

    let str = renderToString(<MyComponent title="welcome" name="rax" version="1.0" />);
    expect(str).toBe('<div class="container" title="welcome"><div>hello</div><div>rax</div>1.0</div>');
  });

  it('render pre compiled html with state hook', () => {
    function MyComponent(props) {
      const [name, setName] = useState(props.name);

      return [
        {
          __html: '<h1>Hello ',
        },
        name,
        {
          __html: '</h1>'
        }
      ];
    };

    let str = renderToString(<MyComponent name="rax" />);
    expect(str).toBe('<h1>Hello rax</h1>');
  });

  it('render pre compiled html with context', () => {
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
      return [
        {
          __html: '<div>Current theme is ',
        },
        value,
        {
          __html: '</div>'
        }
      ];
    };

    let str = renderToString(<MyContext />);
    expect(str).toBe('<div>Current theme is dark</div>');
  });


  it('render two Consumer and one use default context value', function() {
    const ThemeContext = createContext('light');

    function MyContext() {
      return (
        <ThemeContext.Provider value={'dark'}>
          <MyComponent />
        </ThemeContext.Provider>
      );
    };

    function MyComponent() {
      return (
        <ThemeContext.Consumer>
          {value => <div>{value}</div>}
        </ThemeContext.Consumer>
      );
    };

    function MyContext2() {
      return (
        <ThemeContext.Consumer>
          {value => <div>{value}</div>}
        </ThemeContext.Consumer>
      );
    }

    function App() {
      return (
        [
          <MyContext />,
          <MyContext2 />
        ]
      );
    };

    const str = renderToString(<App />);
    expect(str).toBe('<div>dark</div><div>light</div>');
  });

  it('render one Consumer use default context value', function() {
    const ThemeContext = createContext('light');

    function MyContext() {
      return (
        <ThemeContext.Provider value={'dark'} />
      );
    };

    function MyContext2() {
      return (
        <ThemeContext.Consumer>
          {value => <div>{value}</div>}
        </ThemeContext.Consumer>
      );
    }

    function App() {
      return (
        [
          <MyContext />,
          <MyContext2 />
        ]
      );
    };

    const str = renderToString(<App />);
    expect(str).toBe('<!-- _ --><div>light</div>');
  });
});
