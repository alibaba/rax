/* @jsx createElement */

import {createElement, Component, useState, useReducer, useMemo, forwardRef, createRef, useRef, useEffect, useCallback, useImperativeHandle, useLayoutEffect, createContext, useContext} from 'rax';
import {renderToString} from '../index';

function Text(props) {
  return <span>{props.text}</span>;
}

describe('hooks', () => {
  describe('useState', () => {
    it('basic render', () => {
      function Counter(props) {
        const [count] = useState(0);
        return <span>Count: {count}</span>;
      }

      let str = renderToString(<Counter />);
      expect(str).toBe('<span>Count: <!--|-->0</span>');
    });

    it('lazy state initialization', () => {
      function Counter(props) {
        const [count] = useState(() => {
          return 0;
        });
        return <span>Count: {count}</span>;
      }

      let str = renderToString(<Counter />);
      expect(str).toBe('<span>Count: <!--|-->0</span>');
    });

    it('should ignore setCount on the server', () => {
      function Counter() {
        let [count, setCount] = useState(0);
        if (count < 3) {
          setCount(count + 1);
        }
        return <span>Count: {count}</span>;
      }

      let str = renderToString(<Counter />);
      expect(str).toBe('<span>Count: <!--|-->0</span>');
    });
  });

  describe('useReducer', () => {
    it('render with initial state', () => {
      function reducer(state, action) {
        return action === 'increment' ? state + 1 : state;
      }

      function Counter() {
        let [count] = useReducer(reducer, 0);
        return <Text text={count} />;
      }

      let str = renderToString(<Counter />);
      expect(str).toBe('<span>0</span>');
    });

    it('lazy initialization', () => {
      function reducer(state, action) {
        return action === 'increment' ? state + 1 : state;
      }
      function Counter() {
        let [count] = useReducer(reducer, 0, c => c + 1);
        return <Text text={count} />;
      }

      let str = renderToString(<Counter />);
      expect(str).toBe('<span>1</span>');
    });

    it('should ignore dispatch on the server', () => {
      function reducer(state, action) {
        return action === 'increment' ? state + 1 : state;
      }
      function Counter() {
        let [count, dispatch] = useReducer(reducer, 0);
        if (count < 3) {
          dispatch('increment');
        }

        return <Text text={count} />;
      }

      let str = renderToString(<Counter />);
      expect(str).toBe('<span>0</span>');
    });
  });

  describe('useMemo', () => {
    it('basic render', () => {
      function CapitalizedText(props) {
        const text = props.text;
        const capitalizedText = useMemo(
          () => {
            return text.toUpperCase();
          },
          [text],
        );
        return <Text text={capitalizedText} />;
      }

      let str = renderToString(<CapitalizedText text="hello" />);
      expect(str).toBe('<span>HELLO</span>');
    });

    it('if no inputs are provided', () => {
      function CapitalizedText(props) {
        const computed = useMemo(props.compute);
        return <Text text={computed} />;
      }

      function computeA() {
        return 'A';
      }

      let str = renderToString(<CapitalizedText compute={computeA} />);
      expect(str).toBe('<span>A</span>');
    });
  });

  describe('useRef', () => {
    it('basic render', () => {
      function Counter() {
        const count = useRef(0);
        return <span>Count: {count.current}</span>;
      }

      let str = renderToString(<Counter />);
      expect(str).toBe('<span>Count: <!--|-->0</span>');
    });
  });

  describe('useEffect', () => {
    it('should ignore effects on the server', () => {
      function Counter(props) {
        useEffect(() => {
          throw new Error('should not be invoked');
        });
        return <span>Count: {props.count}</span>;
      }

      let str = renderToString(<Counter count={0} />);
      expect(str).toBe('<span>Count: <!--|-->0</span>');
    });
  });

  describe('useCallback', () => {
    it('should ignore callbacks on the server', () => {
      function Counter(props) {
        useCallback(() => {
          throw new Error('should not be invoked');
        });
        return <span>Count: {props.count}</span>;
      }

      let str = renderToString(<Counter count={0} />);
      expect(str).toBe('<span>Count: <!--|-->0</span>');
    });

    it('should support render time callbacks', () => {
      function Counter(props) {
        const renderCount = useCallback(increment => {
          return 'Count: ' + (props.count + increment);
        });
        return <span>{renderCount(3)}</span>;
      }

      let str = renderToString(<Counter count={2} />);
      expect(str).toBe('<span>Count: 5</span>');
    });
  });

  describe('useImperativeHandle', () => {
    it('should not be invoked on the server', () => {
      function Counter(props, ref) {
        useImperativeHandle(ref, () => {
          throw new Error('should not be invoked');
        });
        return <span>{props.label + ': ' + ref.current}</span>;
      }

      Counter = forwardRef(Counter);
      const counter = createRef();
      counter.current = 0;

      let str = renderToString(<Counter label="Count" ref={counter} />);
      expect(str).toBe('<span>Count: 0</span>');
    });
  });

  describe('useLayoutEffect', () => {
    it('should not be invoked on the server', () => {
      function Counter() {
        useLayoutEffect(() => {
          throw new Error('should not be invoked');
        });

        return <span>Count: 0</span>;
      }

      let str = renderToString(<Counter />);
      expect(str).toBe('<span>Count: 0</span>');
    });
  });

  describe('useContext', () => {
    it('can use the same context multiple times in the same function', () => {
      const Context = createContext({foo: 0, bar: 0, baz: 0});

      function Provider(props) {
        return (
          <Context.Provider
            value={{foo: props.foo, bar: props.bar, baz: props.baz}}>
            {props.children}
          </Context.Provider>
        );
      }

      function FooAndBar() {
        const {foo} = useContext(Context);
        const {bar} = useContext(Context);
        return <Text text={`Foo: ${foo}, Bar: ${bar}`} />;
      }

      function Baz() {
        const {baz} = useContext(Context);
        return <Text text={'Baz: ' + baz} />;
      }

      class Indirection extends Component {
        render() {
          return this.props.children;
        }
      }

      function App(props) {
        return (
          <div>
            <Provider foo={props.foo} bar={props.bar} baz={props.baz}>
              <Indirection>
                <Indirection>
                  <FooAndBar />
                </Indirection>
                <Indirection>
                  <Baz />
                </Indirection>
              </Indirection>
            </Provider>
          </div>
        );
      }

      let str = renderToString(<App foo={1} bar={3} baz={5} />);
      expect(str).toBe('<div><span>Foo: 1, Bar: 3</span><span>Baz: 5</span></div>');
    });
  });
});
