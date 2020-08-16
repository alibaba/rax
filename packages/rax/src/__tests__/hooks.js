/* @jsx createElement */

import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import createContext from '../createContext';
import {useState, useContext, useEffect, useLayoutEffect, useRef, useReducer, useImperativeHandle, useMemo} from '../hooks';
import forwardRef from '../forwardRef';
import createRef from '../createRef';
import memo from '../memo';
import Component from '../vdom/component';

describe('hooks', () => {
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

  it('works inside a function component with useState', () => {
    const container = createNodeElement('div');

    function App(props) {
      const [value, setValue] = useState(props.value);

      return (
        <span key={value}>{value}</span>
      );
    }

    render(<App value={2} />, container);
    expect(container.childNodes[0].childNodes[0].data).toEqual('2');
  });

  it('lazy state initializer', () => {
    const container = createNodeElement('div');
    let stateUpdater = null;
    function Counter(props) {
      const [count, updateCount] = useState(() => {
        return props.initialState + 1;
      });
      stateUpdater = updateCount;
      return <span>{count}</span>;
    }

    render(<Counter initialState={1} />, container);
    expect(container.childNodes[0].childNodes[0].data).toEqual('2');

    stateUpdater(10);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toEqual('10');
  });

  it('returns the same updater function every time', () => {
    const container = createNodeElement('div');
    let updaters = [];
    function Counter() {
      const [count, updateCount] = useState(0);
      updaters.push(updateCount);
      return <span>{count}</span>;
    }
    render(<Counter />, container);

    expect(container.childNodes[0].childNodes[0].data).toEqual('0');

    updaters[0](1);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toEqual('1');

    updaters[0](count => count + 10);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toEqual('11');

    expect(updaters).toEqual([updaters[0], updaters[0], updaters[0]]);
  });


  it('mount and update a function component with useLayoutEffect', () => {
    const container = createNodeElement('div');

    let renderCounter = 0;
    let effectCounter = 0;
    let cleanupCounter = 0;

    function Counter(props) {
      useLayoutEffect(
        () => {
          ++effectCounter;
          return () => {
            ++cleanupCounter;
          };
        }
      );
      ++renderCounter;
      return <span>{props.count}</span>;
    }

    render(<Counter count={0} />, container);
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(1);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={1} />, container);
    expect(renderCounter).toEqual(2);
    expect(effectCounter).toEqual(2);
    expect(cleanupCounter).toEqual(1);

    render(<Counter count={2} />, container);
    expect(renderCounter).toEqual(3);
    expect(effectCounter).toEqual(3);
    expect(cleanupCounter).toEqual(2);
  });

  it('mount and update a function component with useLayout and useLayoutEffect', () => {
    const container = createNodeElement('div');

    let logs = [];

    function Counter(props) {
      useEffect(
        () => {
          logs.push('create1');
          return () => {
            logs.push('destory1');
          };
        }
      );

      useLayoutEffect(
        () => {
          logs.push('create2');
          return () => {
            logs.push('destory2');
          };
        }
      );
      logs.push('render');
      return <span>{props.count}</span>;
    }

    render(<Counter count={0} />, container);
    jest.runAllTimers();
    expect(logs).toEqual([
      'render', 'create2', 'create1'
    ]);

    render(<Counter count={1} />, container);
    jest.runAllTimers();
    expect(logs).toEqual([
      'render', 'create2', 'create1',
      'render', 'destory2', 'create2', 'destory1', 'create1']);

    render(<Counter count={2} />, container);
    jest.runAllTimers();
    expect(logs).toEqual([
      'render', 'create2', 'create1',
      'render', 'destory2', 'create2', 'destory1', 'create1',
      'render', 'destory2', 'create2', 'destory1', 'create1']);
  });

  it('mount and update a function component with useEffect', () => {
    const container = createNodeElement('div');

    let renderCounter = 0;
    let effectCounter = 0;
    let cleanupCounter = 0;

    function Counter(props) {
      useEffect(
        () => {
          ++effectCounter;
          return () => {
            ++cleanupCounter;
          };
        }
      );
      ++renderCounter;
      return <span>{props.count}</span>;
    }

    render(<Counter count={0} />, container);
    jest.runAllTimers();
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(1);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={1} />, container);
    jest.runAllTimers();
    expect(renderCounter).toEqual(2);
    expect(effectCounter).toEqual(2);
    expect(cleanupCounter).toEqual(1);

    render(<Counter count={2} />, container);
    jest.runAllTimers();
    expect(renderCounter).toEqual(3);
    expect(effectCounter).toEqual(3);
    expect(cleanupCounter).toEqual(2);
  });

  it('only update if the inputs has changed with useLayoutEffect', () => {
    const container = createNodeElement('div');

    let renderCounter = 0;
    let effectCounter = 0;
    let cleanupCounter = 0;

    function Counter(props) {
      const [text, udpateText] = useState('foo');
      useLayoutEffect(
        () => {
          ++effectCounter;
          udpateText('bar');
          return () => {
            ++cleanupCounter;
          };
        },
        [props.count]
      );
      ++renderCounter;
      return <span>{text}</span>;
    }

    render(<Counter count={0} />, container);
    jest.runAllTimers();
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(2);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={0} />, container);
    jest.runAllTimers();
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(3);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={1} />, container);
    jest.runAllTimers();
    expect(effectCounter).toEqual(2);
    expect(renderCounter).toEqual(4);
    expect(cleanupCounter).toEqual(1);
  });

  it('only update if the inputs has changed with useEffect', () => {
    const container = createNodeElement('div');

    let renderCounter = 0;
    let effectCounter = 0;
    let cleanupCounter = 0;

    function Counter(props) {
      const [text, udpateText] = useState('foo');
      useEffect(
        () => {
          ++effectCounter;
          udpateText('bar');
          return () => {
            ++cleanupCounter;
          };
        },
        [props.count]
      );
      ++renderCounter;
      return <span>{text}</span>;
    }

    render(<Counter count={0} />, container);
    jest.runAllTimers();
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(2);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={0} />, container);
    jest.runAllTimers();
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(3);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={1} />, container);
    jest.runAllTimers();
    expect(effectCounter).toEqual(2);
    expect(renderCounter).toEqual(4);
    expect(cleanupCounter).toEqual(1);
  });

  it('update when the inputs has changed with useLayoutEffect', () => {
    const container = createNodeElement('div');

    let renderCounter = 0;
    let effectCounter = 0;
    let cleanupCounter = 0;

    function Counter(props) {
      const [count, updateCount] = useState(0);
      useLayoutEffect(
        () => {
          ++effectCounter;
          updateCount(1);
          return () => {
            ++cleanupCounter;
          };
        },
        [count]
      );
      ++renderCounter;
      return <span>{count}</span>;
    }

    render(<Counter />, container);
    jest.runAllTimers();
    expect(effectCounter).toEqual(2);
    expect(renderCounter).toEqual(2);
    expect(cleanupCounter).toEqual(1);
  });

  it('would run only on mount and clean up on unmount with useLayoutEffect', () => {
    const container = createNodeElement('div');

    let renderCounter = 0;
    let effectCounter = 0;
    let cleanupCounter = 0;

    function Counter() {
      const [count, updateCount] = useState(0);
      useLayoutEffect(
        () => {
          ++effectCounter;
          updateCount(count + 1);
          return () => {
            ++cleanupCounter;
          };
        },
        []
      );
      ++renderCounter;
      return <span>{count}</span>;
    }

    render(<Counter />, container);
    jest.runAllTimers();
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(2);
    expect(cleanupCounter).toEqual(0);
  });

  it('works inside a function component with useContext', () => {
    const container = createNodeElement('div');
    const Context = createContext(1);

    function Consumer(props) {
      const value = useContext(Context);

      return (
        <span>{value}</span>
      );
    }

    function App(props) {
      return (
        <Context.Provider value={props.value}>
          <Consumer />
        </Context.Provider>
      );
    }

    render(<App value={2} />, container);
    expect(container.childNodes[0].childNodes[0].data).toEqual('2');

    // Update
    render(<App value={3} />, container);
    expect(container.childNodes[0].childNodes[0].data).toEqual('3');
  });

  it('should return the same ref during re-renders', () => {
    const container = createNodeElement('div');
    let renderCounter = 0;
    function Counter() {
      const ref = useRef('val');
      const [firstRef] = useState(ref);

      if (firstRef !== ref) {
        throw new Error('should never change');
      }
      renderCounter++;
      return <span>{ref.current}</span>;
    }

    render(<Counter />, container);
    expect(container.childNodes[0].childNodes[0].data).toEqual('val');
    expect(renderCounter).toEqual(1);

    render(<Counter foo="bar" />, container);
    expect(renderCounter).toEqual(2);
    expect(container.childNodes[0].childNodes[0].data).toEqual('val');
  });

  it('bails out in the render phase if all of the state is the same', () => {
    const container = createNodeElement('div');
    const logs = [];

    logs.flush = function() {
      const result = [...logs];
      logs.length = 0;
      return result;
    };

    function Child({text}) {
      logs.push('Child: ' + text);
      return text;
    }

    let setCounter1;
    let setCounter2;
    function Parent() {
      const [counter1, _setCounter1] = useState(0);
      setCounter1 = _setCounter1;
      const [counter2, _setCounter2] = useState(0);
      setCounter2 = _setCounter2;

      const text = `${counter1}, ${counter2}`;
      logs.push(`Parent: ${text}`);
      useLayoutEffect(() => {
        logs.push(`Effect: ${text}`);
      });

      return <Child text={text} />;
    }

    const root = render(<Parent />, container);
    expect(logs.flush()).toEqual([
      'Parent: 0, 0',
      'Child: 0, 0',
      'Effect: 0, 0',
    ]);
    expect(container.childNodes[0].data).toEqual('0, 0');

    // Normal update
    setCounter1(1);
    setCounter2(1);
    jest.runAllTimers();

    expect(logs.flush()).toEqual([
      'Parent: 1, 1',
      'Child: 1, 1',
      'Effect: 1, 1',
    ]);

    // This time, one of the state updates but the other one doesn't. So we
    // can't bail out.

    setCounter1(1);
    setCounter2(2);
    jest.runAllTimers();

    expect(logs.flush()).toEqual([
      'Parent: 1, 2',
      'Child: 1, 2',
      'Effect: 1, 2',
    ]);

    // Lots of updates that eventually resolve to the current values.

    setCounter1(9);
    setCounter2(3);
    setCounter1(4);
    setCounter2(7);
    setCounter1(1);
    setCounter2(2);
    jest.runAllTimers();

    // Because the final values are the same as the current values, the
    // component bails out.
    expect(logs.flush()).toEqual(['Parent: 1, 2', 'Effect: 1, 2']);

    // prepare to check SameValue

    setCounter1(0 / -1);
    setCounter2(NaN);
    jest.runAllTimers();

    expect(logs.flush()).toEqual([
      'Parent: 0, NaN',
      'Child: 0, NaN',
      'Effect: 0, NaN',
    ]);

    // check if re-setting to negative 0 / NaN still bails out

    setCounter1(0 / -1);
    setCounter2(NaN);
    setCounter2(Infinity);
    setCounter2(NaN);
    jest.runAllTimers();

    expect(logs.flush()).toEqual(['Parent: 0, NaN', 'Effect: 0, NaN']);

    // check if changing negative 0 to positive 0 does not bail out

    setCounter1(0);
    jest.runAllTimers();

    expect(logs.flush()).toEqual([
      'Parent: 0, NaN',
      'Child: 0, NaN',
      'Effect: 0, NaN',
    ]);
  });

  it('bails out in render phase if all the state is the same and props bail out with memo', () => {
    const container = createNodeElement('div');
    const logs = [];
    logs.flush = function() {
      const result = [...logs];
      logs.length = 0;
      return result;
    };

    function Child({text}) {
      logs.push('Child: ' + text);
      return text;
    }

    let setCounter1;
    let setCounter2;

    function Parent({theme}) {
      const [counter1, _setCounter1] = useState(0);
      setCounter1 = _setCounter1;
      const [counter2, _setCounter2] = useState(0);
      setCounter2 = _setCounter2;

      const text = `${counter1}, ${counter2} (${theme})`;
      logs.push(`Parent: ${text}`);

      return <Child text={text} />;
    }

    Parent = memo(Parent);

    render(<Parent theme="light" />, container);
    expect(logs.flush()).toEqual([
      'Parent: 0, 0 (light)',
      'Child: 0, 0 (light)',
    ]);
    expect(container.childNodes[0].data).toEqual('0, 0 (light)');


    setCounter1(1);
    setCounter2(1);
    jest.runAllTimers();
    expect(logs.flush()).toEqual([
      'Parent: 1, 1 (light)',
      'Child: 1, 1 (light)',
    ]);

    // This time, one of the state updates but the other one doesn't. So we
    // can't bail out.

    setCounter1(1);
    setCounter2(2);
    jest.runAllTimers();
    expect(logs.flush()).toEqual([
      'Parent: 1, 2 (light)',
      'Child: 1, 2 (light)',
    ]);

    // Updates bail out, but component still renders because props
    // have changed
    setCounter1(1);
    setCounter2(2);
    render(<Parent theme="dark" />, container);
    jest.runAllTimers();
    expect(logs.flush()).toEqual(['Parent: 1, 2 (dark)', 'Child: 1, 2 (dark)']);

    // Both props and state bail out
    setCounter1(1);
    setCounter2(2);
    render(<Parent theme="dark" />, container);
    jest.runAllTimers();
    expect(logs.flush()).toEqual([]);
  });

  it('never bails out if context has changed', () => {
    const container = createNodeElement('div');
    const logs = [];

    logs.flush = function() {
      const result = [...logs];
      logs.length = 0;
      return result;
    };

    const ThemeContext = createContext('light');

    let setTheme;
    function ThemeProvider({children}) {
      const [theme, _setTheme] = useState('light');
      logs.push('Theme: ' + theme);
      setTheme = _setTheme;
      return (
        <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
      );
    }

    function Child({text}) {
      logs.push('Child: ' + text);
      return text;
    }

    let setCounter;
    function Parent() {
      const [counter, _setCounter] = useState(0);
      setCounter = _setCounter;

      const theme = useContext(ThemeContext);

      const text = `${counter} (${theme})`;
      logs.push(`Parent: ${text}`);
      useLayoutEffect(() => {
        logs.push(`Effect: ${text}`);
      });
      return <Child text={text} />;
    }

    const root = render(
      <ThemeProvider>
        <Parent />
      </ThemeProvider>
      , container);

    expect(logs.flush()).toEqual([
      'Theme: light',
      'Parent: 0 (light)',
      'Child: 0 (light)',
      'Effect: 0 (light)',
    ]);
    expect(container.childNodes[0].data).toEqual('0 (light)');

    // Updating the theme to the same value doesn't cause the consumers
    // to re-render.
    setTheme('light');
    expect(logs.flush()).toEqual([]);
    expect(container.childNodes[0].data).toEqual('0 (light)');

    // Normal update
    setCounter(1);
    jest.runAllTimers();
    expect(logs.flush()).toEqual([
      'Parent: 1 (light)',
      'Child: 1 (light)',
      'Effect: 1 (light)',
    ]);
    expect(container.childNodes[0].data).toEqual('1 (light)');

    // Update that doesn't change state, but the context changes, too, so it
    // can't bail out

    setCounter(1);
    setTheme('dark');
    jest.runAllTimers();

    expect(logs.flush()).toEqual([
      'Theme: dark',
      'Parent: 1 (dark)',
      'Child: 1 (dark)',
      'Effect: 1 (dark)',
    ]);
    expect(container.childNodes[0].data).toEqual('1 (dark)');
  });

  it('rerender only once when context changes', () => {
    const container = createNodeElement('div');
    const context = createContext(4);
    let logs = [];

    function Parent() {
      return <context.Provider value={this.props.value}>{this.props.children}</context.Provider>;
    }

    function Child() {
      logs.push('Child');
      const val = useContext(context);
      return val;
    }

    let setValue;
    function App() {
      const [val, setVal] = useState(1);
      setValue = setVal;
      return <Parent value={val}><Child /></Parent>;
    }

    render(<App />, container);
    expect(logs).toEqual([
      'Child'
    ]);
    expect(container.childNodes[0].data).toEqual('1');

    logs = [];
    setValue(2);
    jest.runAllTimers();
    expect(logs).toEqual([
      'Child'
    ]);
    expect(container.childNodes[0].data).toEqual('2');
  });

  it('destory function of a passive effect should call synchronously', () => {
    const container = createNodeElement('div');
    const event = {
      listeners: [],
      emit: () => event.listeners.forEach(f => f()),
      off: (f) => event.listeners = event.listeners.filter(_f => _f !== f),
      on: (f) => event.listeners.push(f)
    };

    function useForceUpdate() {
      const [, setCount] = useState(0);
      return () => setCount(count => count + 1);
    }

    function Child() {
      const forceUpdate = useForceUpdate();
      useEffect(() => {
        event.on(forceUpdate);
        return () => {
          event.off(forceUpdate);
        };
      });
      return <div>child</div>;
    }

    function App(props) {
      useLayoutEffect(() => {
        event.emit();
      }, [props.type]);
      return props.type === 1 ? <Child /> : null;
    }

    render(<App type={1} />, container);
    expect(container.childNodes[0].childNodes[0].data).toEqual('child');
    render(<App type={2} />, container);
    expect(container.childNodes[0].nodeType).toBe(8);
  });

  describe('updates during the render phase', () => {
    it('restarts the render function and applies the new updates on top', () => {
      const container = createNodeElement('div');
      function ScrollView({row: newRow}) {
        let [isScrollingDown, setIsScrollingDown] = useState(false);
        let [row, setRow] = useState(null);

        if (row !== newRow) {
          // Row changed since last render. Update isScrollingDown.
          setIsScrollingDown(row !== null && newRow > row);
          setRow(newRow);
        }

        return <div>{`Scrolling down: ${isScrollingDown}`}</div>;
      }

      render(<ScrollView row={1} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Scrolling down: false');
      render(<ScrollView row={5} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Scrolling down: true');
      render(<ScrollView row={5} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Scrolling down: true');
      render(<ScrollView row={10} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Scrolling down: true');
      render(<ScrollView row={2} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Scrolling down: false');
      render(<ScrollView row={2} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Scrolling down: false');
    });

    it('updates multiple times within same render function', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Counter({row: newRow}) {
        let [count, setCount] = useState(0);
        if (count < 12) {
          setCount(c => c + 1);
          setCount(c => c + 1);
          setCount(c => c + 1);
        }
        logs.push('Render: ' + count);
        return <span>{count}</span>;
      }

      render(<Counter />, container);
      expect(logs).toEqual([
        // Should increase by three each time
        'Render: 0',
        'Render: 3',
        'Render: 6',
        'Render: 9',
        'Render: 12',
      ]);
      expect(container.childNodes[0].childNodes[0].data).toEqual('12');
    });

    it('throws after too many iterations', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Counter({row: newRow}) {
        let [count, setCount] = useState(0);
        setCount(count + 1);
        logs.push('Render: ' + count);
        return <span>{count}</span>;
      }
      // render(<Counter />, container);
      expect(() => {
        render(<Counter />, container);
        jest.runAllTimers();
      }).toThrowError(
        'Too many re-renders, the number of renders is limited to prevent an infinite loop.'
      );
    });

    it('works with useReducer', () => {
      const container = createNodeElement('div');
      let logs = [];
      function reducer(state, action) {
        return action === 'increment' ? state + 1 : state;
      }
      function Counter({row: newRow}) {
        let [count, dispatch] = useReducer(reducer, 0);
        if (count < 3) {
          dispatch('increment');
        }
        logs.push('Render: ' + count);
        return <span>{count}</span>;
      }

      render(<Counter />, container);
      expect(logs).toEqual([
        'Render: 0',
        'Render: 1',
        'Render: 2',
        'Render: 3',
      ]);
      expect(container.childNodes[0].childNodes[0].data).toEqual('3');
    });

    it('uses reducer passed at time of render, not time of dispatch', () => {
      const container = createNodeElement('div');
      let logs = [];
      // This test is a bit contrived but it demonstrates a subtle edge case.

      // Reducer A increments by 1. Reducer B increments by 10.
      function reducerA(state, action) {
        switch (action) {
          case 'increment':
            return state + 1;
          case 'reset':
            return 0;
        }
      }
      function reducerB(state, action) {
        switch (action) {
          case 'increment':
            return state + 10;
          case 'reset':
            return 0;
        }
      }
      function Counter({row: newRow}, ref) {
        let [reducer, setReducer] = useState(() => reducerA);
        let [count, dispatch] = useReducer(reducer, 0);
        useImperativeHandle(ref, () => ({dispatch}));
        if (count < 20) {
          dispatch('increment');
          // Swap reducers each time we increment
          if (reducer === reducerA) {
            setReducer(() => reducerB);
          } else {
            setReducer(() => reducerA);
          }
        }
        logs.push('Render: ' + count);
        return <span>{count}</span>;
      }
      Counter = forwardRef(Counter);
      const counter = createRef(null);
      render(<Counter ref={counter} />, container);
      expect(logs).toEqual([
        // The count should increase by alternating amounts of 10 and 1
        // until we reach 21.
        'Render: 0',
        'Render: 10',
        'Render: 11',
        'Render: 21',
      ]);
      expect(container.childNodes[0].childNodes[0].data).toEqual('21');
      logs = [];

      // Test that it works on update, too. This time the log is a bit different
      // because we started with reducerB instead of reducerA.
      counter.current.dispatch('reset');
      jest.runAllTimers();
      expect(logs).toEqual([
        'Render: 0',
        'Render: 1',
        'Render: 11',
        'Render: 12',
        'Render: 22',
      ]);
      expect(container.childNodes[0].childNodes[0].data).toEqual('22');
    });
  });

  describe('useReducer', () => {
    it('simple mount and update', () => {
      const container = createNodeElement('div');
      const INCREMENT = 'INCREMENT';
      const DECREMENT = 'DECREMENT';

      function reducer(state, action) {
        switch (action) {
          case 'INCREMENT':
            return state + 1;
          case 'DECREMENT':
            return state - 1;
          default:
            return state;
        }
      }

      function Counter(props, ref) {
        const [count, dispatch] = useReducer(reducer, 0);
        useImperativeHandle(ref, () => ({dispatch}));
        return <span>{count}</span>;
      }
      Counter = forwardRef(Counter);
      const counter = createRef(null);
      render(<Counter ref={counter} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('0');

      counter.current.dispatch(INCREMENT);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('1');

      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('-2');

      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(INCREMENT);
      counter.current.dispatch(INCREMENT);
      counter.current.dispatch(INCREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(INCREMENT);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('-2');
    });

    it('lazy init', () => {
      const container = createNodeElement('div');
      const logs = [];

      logs.flush = function() {
        const result = [...logs];
        logs.length = 0;
        return result;
      };

      const INCREMENT = 'INCREMENT';
      const DECREMENT = 'DECREMENT';

      function reducer(state, action) {
        switch (action) {
          case INCREMENT:
            return state + 1;
          case DECREMENT:
            return state - 1;
          default:
            return state;
        }
      }

      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }

      function Counter(props, ref) {
        const [count, dispatch] = useReducer(reducer, props, p => {
          logs.push('Init');
          return p.initialCount;
        });
        useImperativeHandle(ref, () => ({dispatch}));
        return <Text text={'Count: ' + count} />;
      }
      Counter = forwardRef(Counter);
      const counter = createRef(null);
      render(<Counter initialCount={10} ref={counter} />, container);
      expect(logs.flush()).toEqual(['Init', 'Count: 10']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 10');

      counter.current.dispatch(INCREMENT);
      jest.runAllTimers();
      expect(logs.flush()).toEqual(['Count: 11']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 11');

      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      jest.runAllTimers();
      expect(logs.flush()).toEqual(['Count: 8']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 8');
    });

    it('works with effect', () => {
      const container = createNodeElement('div');
      const logs = [];

      logs.flush = function() {
        const result = [...logs];
        logs.length = 0;
        return result;
      };

      function Child({text}) {
        logs.push('Child: ' + text);
        return text;
      }

      function reducer(state, action) {
        return action;
      }

      let setCounter1;
      let setCounter2;
      function Parent() {
        const [counter1, _setCounter1] = useReducer(reducer, 0);
        setCounter1 = _setCounter1;
        const [counter2, _setCounter2] = useReducer(reducer, 0);
        setCounter2 = _setCounter2;

        const text = `${counter1}, ${counter2}`;
        logs.push(`Parent: ${text}`);
        useLayoutEffect(() => {
          logs.push(`Effect: ${text}`);
        });
        return <Child text={text} />;
      }

      const root = render(<Parent />, container);
      expect(logs.flush()).toEqual([
        'Parent: 0, 0',
        'Child: 0, 0',
        'Effect: 0, 0',
      ]);
      expect(container.childNodes[0].data).toEqual('0, 0');

      // Normal update
      setCounter1(1);
      setCounter1(2);
      setCounter1(2);
      setCounter1(3);
      setCounter2(2);
      setCounter1(3);
      setCounter1(3);
      setCounter2(4);
      jest.runAllTimers();

      expect(logs.flush()).toEqual([
        'Parent: 3, 4',
        'Child: 3, 4',
        'Effect: 3, 4',
      ]);


      setCounter1(2);
      setCounter2(2);
      jest.runAllTimers();

      expect(logs.flush()).toEqual([
        'Parent: 2, 2',
        'Child: 2, 2',
        'Effect: 2, 2',
      ]);

      setCounter1(2);
      setCounter2(2);
      jest.runAllTimers();

      expect(logs.flush()).toEqual([]);
    });
  });

  describe('useEffect', () => {
    it('simple mount and update', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Counter(props) {
        useEffect(() => {
          logs.push(`Did commit [${props.count}]`);
        });
        return <span>{props.count}</span>;
      }
      render(<Counter count={0} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('0');
      jest.runAllTimers();
      expect(logs).toEqual(['Did commit [0]']);

      logs = [];
      render(<Counter count={1} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('1');
      // Effects are deferred until after the commit
      jest.runAllTimers();
      expect(logs).toEqual(['Did commit [1]']);
    });


    it('flushes passive effects even with sibling deletions', () => {
      const container = createNodeElement('div');
      let logs = [];
      function LayoutEffect(props) {
        useLayoutEffect(() => {
          logs.push('Layout effect');
        });
        logs.push('Layout');
        return <span>Layout</span>;
      }
      function PassiveEffect(props) {
        useEffect(() => {
          logs.push('Passive effect');
        }, []);
        logs.push('Passive');
        return <span>Passive</span>;
      }
      let passive = <PassiveEffect key="p" />;
      render([<LayoutEffect key="l" />, passive], container);
      expect(logs).toEqual(['Layout', 'Passive', 'Layout effect']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Layout');
      expect(container.childNodes[1].childNodes[0].data).toEqual('Passive');

      logs = [];
      // Destroying the first child shouldn't prevent the passive effect from
      // being executed
      render([passive], container);
      jest.runAllTimers();
      expect(logs).toEqual(['Passive effect']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Passive');

      // (No effects are left to flush.)
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual([]);
    });

    it('flushes passive effects even if siblings schedule an update', () => {
      const container = createNodeElement('div');
      let logs = [];
      function PassiveEffect(props) {
        useEffect(() => {
          logs.push('Passive effect');
        });
        logs.push('Passive');
        return <span>Passive</span>;
      }
      function LayoutEffect(props) {
        let [count, setCount] = useState(0);
        useLayoutEffect(() => {
          // Scheduling work shouldn't interfere with the queued passive effect
          if (count === 0) {
            setCount(1);
          }
          logs.push('Layout effect ' + count);
        });
        logs.push('Layout');
        return <span>Layout</span>;
      }
      render([<PassiveEffect key="p" />, <LayoutEffect key="l" />], container);
      jest.runAllTimers();
      expect(logs).toEqual([
        'Passive',
        'Layout',
        'Layout effect 0',
        'Passive effect',
        'Layout',
        'Layout effect 1',
      ]);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Passive');
      expect(container.childNodes[1].childNodes[0].data).toEqual('Layout');
    });

    it('flushes passive effects even if siblings schedule a new root', () => {
      const container = createNodeElement('div');
      const container2 = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function PassiveEffect(props) {
        useEffect(() => {
          logs.push('Passive effect');
        }, []);
        return <Text text="Passive" />;
      }
      function LayoutEffect(props) {
        useLayoutEffect(() => {
          logs.push('Layout effect');
          // Scheduling work shouldn't interfere with the queued passive effect
          render(<Text text="New Root" />, container2);
        });
        return <Text text="Layout" />;
      }
      render([<PassiveEffect key="p" />, <LayoutEffect key="l" />], container);
      jest.runAllTimers();
      expect(logs).toEqual([
        'Passive',
        'Layout',
        'Layout effect',
        'Passive effect',
        'New Root',
      ]);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Passive');
      expect(container.childNodes[1].childNodes[0].data).toEqual('Layout');
    });

    it(
      'flushes effects serially by flushing old effects before flushing ' +
        "new ones, if they haven't already fired",
      () => {
        const container = createNodeElement('div');
        let logs = [];
        function Text(props) {
          logs.push(props.text);
          return <span>{props.text}</span>;
        }
        function getCommittedText() {
          return container.childNodes[0].childNodes[0].data;
        }

        function Counter(props) {
          useEffect(() => {
            logs.push(
              `Committed state when effect was fired: ${getCommittedText()}`,
            );
          });
          return <Text text={props.count} />;
        }
        render(<Counter count={0} />, container);
        expect(logs).toEqual([0]);
        expect(container.childNodes[0].childNodes[0].data).toEqual('0');

        // Before the effects have a chance to flush, schedule another update
        logs = [];
        render(<Counter count={1} />, container);
        expect(logs).toEqual([
          // The previous effect flushes before the reconciliation
          'Committed state when effect was fired: 0',
          1,
        ]);
        expect(container.childNodes[0].childNodes[0].data).toEqual('1');

        logs = [];
        jest.runAllTimers();
        expect(logs).toEqual([
          'Committed state when effect was fired: 1',
        ]);
      },
    );

    it('updates have async priority', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function Counter(props) {
        const [count, updateCount] = useState('(empty)');
        useEffect(
          () => {
            logs.push(`Schedule update [${props.count}]`);
            updateCount(props.count);
          },
          [props.count],
        );
        return <Text text={'Count: ' + count} />;
      }
      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: (empty)']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: (empty)');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual(['Schedule update [0]', 'Count: 0']);

      logs = [];
      render(<Counter count={1} />, container);
      expect(logs).toEqual(['Count: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual(['Schedule update [1]', 'Count: 1']);
    });

    it('updates have async priority even if effects are flushed early', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function Counter(props) {
        const [count, updateCount] = useState('(empty)');
        useEffect(
          () => {
            logs.push(`Schedule update [${props.count}]`);
            updateCount(props.count);
          },
          [props.count],
        );
        return <Text text={'Count: ' + count} />;
      }
      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: (empty)']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: (empty)');

      logs = [];
      // Rendering again should flush the previous commit's effects
      jest.runAllTimers();
      render(<Counter count={1} />, container);
      expect(logs).toEqual(['Schedule update [0]', 'Count: 0', 'Count: 0']);

      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual(['Schedule update [1]', 'Count: 1']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
    });

    it('flushes serial effects before enqueueing work', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      let _updateCount;
      function Counter(props) {
        const [count, updateCount] = useState(0);
        _updateCount = updateCount;
        useEffect(() => {
          logs.push('Will set count to 1');
          updateCount(1);
        }, []);
        return <Text text={'Count: ' + count} />;
      }

      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      logs = [];
      // Enqueuing this update forces the passive effect to be flushed --
      // updateCount(1) happens first, so 2 wins.
      _updateCount(2);
      jest.runAllTimers();
      expect(logs).toEqual(['Will set count to 1', 'Count: 2']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 2');
    });

    it(
      'in sync mode, useEffect is deferred and updates finish synchronously ' +
        '(in a single batch)',
      () => {
        const container = createNodeElement('div');
        let logs = [];
        function Counter(props) {
          const [count, updateCount] = useState('(empty)');
          useEffect(
            () => {
              // Update multiple times. These should all be batched together in
              // a single render.
              updateCount(props.count);
              updateCount(props.count);
              updateCount(props.count);
              updateCount(props.count);
              updateCount(props.count);
              updateCount(props.count);
            },
            [props.count],
          );
          logs.push('Count: ' + count);
          return <span>{'Count: ' + count}</span>;
        }
        render(<Counter count={0} />, container);
        // Even in sync mode, effects are deferred until after paint
        expect(logs).toEqual(['Count: (empty)']);
        expect(container.childNodes[0].childNodes[0].data).toEqual('Count: (empty)');
        // Now fire the effects
        logs = [];
        jest.runAllTimers();
        // There were multiple updates, but there should only be a
        // single render
        expect(logs).toEqual(['Count: 0']);
        expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      },
    );

    it(
      'in sync mode, useEffect is deferred and updates finish synchronously ' +
        '(in a single batch with different state)',
      () => {
        const container = createNodeElement('div');
        let logs = [];
        function Counter(props) {
          const [count, updateCount] = useState('(empty)');
          useEffect(
            () => {
              // Update multiple times. These should all be batched together in
              // a single render.
              updateCount(2);
              updateCount(3);
              updateCount(4);
              updateCount(5);
              updateCount(6);
              updateCount(7);
            },
            [props.count],
          );
          logs.push('Count: ' + count);
          return <span>{'Count: ' + count}</span>;
        }
        render(<Counter count={0} />, container);
        // Even in sync mode, effects are deferred until after paint
        expect(logs).toEqual(['Count: (empty)']);
        expect(container.childNodes[0].childNodes[0].data).toEqual('Count: (empty)');
        // Now fire the effects
        logs = [];
        jest.runAllTimers();
        // There were multiple updates, but there should only be a
        // single render
        expect(logs).toEqual(['Count: 7']);
        expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 7');
      },
    );

    it('unmounts previous effect', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function Counter(props) {
        useEffect(() => {
          logs.push(`Did create [${props.count}]`);
          return () => {
            logs.push(`Did destroy [${props.count}]`);
          };
        });
        return <Text text={'Count: ' + props.count} />;
      }
      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual(['Did create [0]']);

      logs = [];
      render(<Counter count={1} />, container);
      expect(logs).toEqual(['Count: 1']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual([
        'Did destroy [0]',
        'Did create [1]',
      ]);
    });

    it('unmounts on deletion', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function Counter(props) {
        useEffect(() => {
          logs.push(`Did create [${props.count}]`);
          return () => {
            logs.push(`Did destroy [${props.count}]`);
          };
        });
        return <Text text={'Count: ' + props.count} />;
      }
      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual(['Did create [0]']);

      logs = [];
      render(<div />, container);
      expect(logs).toEqual(['Did destroy [0]']);
      expect(container.childNodes[0].tagName).toEqual('DIV');
    });

    it('unmounts on deletion after skipped effect', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function Counter(props) {
        useEffect(() => {
          logs.push(`Did create [${props.count}]`);
          return () => {
            logs.push(`Did destroy [${props.count}]`);
          };
        }, []);
        return <Text text={'Count: ' + props.count} />;
      }
      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual(['Did create [0]']);

      logs = [];
      render(<Counter count={1} />, container);
      expect(logs).toEqual(['Count: 1']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual([]);

      logs = [];
      render([], container);
      expect(logs).toEqual(['Did destroy [0]']);
      expect(container.childNodes).toEqual([]);
    });

    it('always fires effects if no dependencies are provided', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function effect() {
        logs.push('Did create');
        return () => {
          logs.push('Did destroy');
        };
      }
      function Counter(props) {
        useEffect(effect);
        return <Text text={'Count: ' + props.count} />;
      }
      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual(['Did create']);

      logs = [];
      render(<Counter count={1} />, container);
      expect(logs).toEqual(['Count: 1']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual(['Did destroy', 'Did create']);

      logs = [];
      render([], container);
      expect(logs).toEqual(['Did destroy']);
      expect(container.childNodes).toEqual([]);
    });

    it('multiple effects', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function Counter(props) {
        useEffect(() => {
          logs.push(`Did commit 1 [${props.count}]`);
        });
        useEffect(() => {
          logs.push(`Did commit 2 [${props.count}]`);
        });
        return <Text text={'Count: ' + props.count} />;
      }
      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual([
        'Did commit 1 [0]',
        'Did commit 2 [0]',
      ]);
      logs = [];
      render(<Counter count={1} />, container);
      expect(logs).toEqual(['Count: 1']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual([
        'Did commit 1 [1]',
        'Did commit 2 [1]',
      ]);
    });

    it('unmounts all previous effects before creating any new ones', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function Counter(props) {
        useEffect(() => {
          logs.push(`Mount A [${props.count}]`);
          return () => {
            logs.push(`Unmount A [${props.count}]`);
          };
        });
        useEffect(() => {
          logs.push(`Mount B [${props.count}]`);
          return () => {
            logs.push(`Unmount B [${props.count}]`);
          };
        });
        return <Text text={'Count: ' + props.count} />;
      }
      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual(['Mount A [0]', 'Mount B [0]']);
      logs = [];
      render(<Counter count={1} />, container);
      expect(logs).toEqual(['Count: 1']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual([
        'Unmount A [0]',
        'Mount A [1]',
        'Unmount B [0]',
        'Mount B [1]',
      ]);
    });

    it('works with memo', () => {
      const container = createNodeElement('div');
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function Counter({count}) {
        useLayoutEffect(() => {
          logs.push('Mount: ' + count);
          return () => logs.push('Unmount: ' + count);
        });
        return <Text text={'Count: ' + count} />;
      }
      Counter = memo(Counter);

      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Count: 0', 'Mount: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');

      logs = [];
      render(<Counter count={1} />, container);
      expect(logs).toEqual(['Count: 1', 'Unmount: 0', 'Mount: 1']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');

      logs = [];
      render([], container);
      expect(logs).toEqual(['Unmount: 1']);
      expect(container.childNodes).toEqual([]);
    });

    it('does not update one component twice (update' +
    'by props or setState should be merge)', () => {
      let container = createNodeElement('div');
      let logs = [];
      let updateChildA, updateChildB, updateParent;
      let childAUpdateNum, childBUpdateNum, parentUpdateNum;
      childAUpdateNum = childBUpdateNum = parentUpdateNum = 0;

      const ChildA = function(props) {
        childAUpdateNum++;
        const [count, updateCount] = useState(0);
        updateChildA = updateCount;
        return <span>{count}</span>;
      };

      const ChildB = function(props) {
        childBUpdateNum++;
        const [count, updateCount] = useState(0);
        updateChildB = updateCount;
        return <span>{count}</span>;
      };

      const Parent = function(props) {
        parentUpdateNum++;
        const [count, updateCount] = useState(0);
        updateParent = updateCount;
        return [<span key={'child1'}>{count}</span>, <ChildA key={'child2'} />, <ChildB key={'child3'} />];
      };

      function App() {
        useEffect(() => {
          updateChildA(1);
          updateChildA(2);
          updateParent(3);
          updateChildB(4);
        });
        return <Parent />;
      }
      render(<App />, container);
      expect(childAUpdateNum).toEqual(1);
      expect(parentUpdateNum).toEqual(1);
      expect(childBUpdateNum).toEqual(1);
      expect(container.childNodes[0].childNodes[0].data).toEqual('0');
      expect(container.childNodes[1].childNodes[0].data).toEqual('0');
      expect(container.childNodes[2].childNodes[0].data).toEqual('0');
      jest.runAllTimers();
      expect(childAUpdateNum).toEqual(2);
      expect(parentUpdateNum).toEqual(2);
      expect(childBUpdateNum).toEqual(2);
      expect(container.childNodes[0].childNodes[0].data).toEqual('3');
      expect(container.childNodes[1].childNodes[0].data).toEqual('2');
      expect(container.childNodes[2].childNodes[0].data).toEqual('4');
    });
  });

  describe('useLayoutEffect', () => {
    it('force flushes passive effects before firing new layout effects', () => {
      const container = createNodeElement('div');
      let logs = [];
      let committedText = '(empty)';
      function Counter(props) {
        useLayoutEffect(() => {
          // Normally this would go in a mutation effect, but this test
          // intentionally omits a mutation effect.
          committedText = props.count + '';

          logs.push(`Mount layout [current: ${committedText}]`);
          return () => {
            logs.push(`Unmount layout [current: ${committedText}]`);
          };
        });
        useEffect(() => {
          logs.push(`Mount normal [current: ${committedText}]`);
          return () => {
            logs.push(`Unmount normal [current: ${committedText}]`);
          };
        });
        return null;
      }

      render(<Counter count={0} />, container);
      expect(logs).toEqual(['Mount layout [current: 0]']);
      expect(committedText).toEqual('0');

      logs = [];
      render(<Counter count={1} />, container);
      expect(logs).toEqual([
        'Mount normal [current: 0]',
        'Unmount layout [current: 0]',
        'Mount layout [current: 1]',
      ]);
      expect(committedText).toEqual('1');

      logs = [];
      jest.runAllTimers();
      expect(logs).toEqual([
        'Unmount normal [current: 1]',
        'Mount normal [current: 1]',
      ]);
    });
  });

  describe('useMemo', () => {
    it('memoizes value by comparing to previous inputs', () => {
      const container = createNodeElement('div');
      let logs = [];

      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }

      function CapitalizedText(props) {
        const text = props.text;
        const capitalizedText = useMemo(
          () => {
            logs.push(`Capitalize '${text}'`);
            return text.toUpperCase();
          },
          [text],
        );
        return <Text text={capitalizedText} />;
      }

      render(<CapitalizedText text="hello" />, container);
      expect(logs).toEqual(["Capitalize 'hello'", 'HELLO']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('HELLO');

      logs = [];
      render(<CapitalizedText text="hi" />, container);
      expect(logs).toEqual(["Capitalize 'hi'", 'HI']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('HI');

      logs = [];
      render(<CapitalizedText text="hi" />, container);
      expect(logs).toEqual(['HI']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('HI');

      logs = [];
      render(<CapitalizedText text="goodbye" />, container);
      expect(logs).toEqual(["Capitalize 'goodbye'", 'GOODBYE']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('GOODBYE');
    });

    it('always re-computes if no inputs are provided', () => {
      const container = createNodeElement('div');
      let logs = [];

      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function LazyCompute(props) {
        const computed = useMemo(props.compute);
        return <Text text={computed} />;
      }

      function computeA() {
        logs.push('compute A');
        return 'A';
      }

      function computeB() {
        logs.push('compute B');
        return 'B';
      }

      render(<LazyCompute compute={computeA} />, container);
      expect(logs).toEqual(['compute A', 'A']);

      logs = [];
      render(<LazyCompute compute={computeA} />, container);
      expect(logs).toEqual(['compute A', 'A']);

      logs = [];
      render(<LazyCompute compute={computeA} />, container);
      expect(logs).toEqual(['compute A', 'A']);

      logs = [];
      render(<LazyCompute compute={computeB} />, container);
      expect(logs).toEqual(['compute B', 'B']);
    });

    it('should not invoke memoized function during re-renders unless inputs change', () => {
      const container = createNodeElement('div');
      let logs = [];

      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }
      function LazyCompute(props) {
        const computed = useMemo(() => props.compute(props.input), [
          props.input,
        ]);
        const [count, setCount] = useState(0);
        if (count < 3) {
          setCount(count + 1);
        }
        return <Text text={computed} />;
      }

      function compute(val) {
        logs.push('compute ' + val);
        return val;
      }

      render(<LazyCompute compute={compute} input="A" />, container);
      expect(logs).toEqual(['compute A', 'A']);

      logs = [];
      render(<LazyCompute compute={compute} input="A" />, container);
      expect(logs).toEqual(['A']);

      logs = [];
      render(<LazyCompute compute={compute} input="B" />, container);
      expect(logs).toEqual(['compute B', 'B']);
    });
  });

  describe('useImperativeHandle', () => {
    it('does not update when deps are the same', () => {
      const container = createNodeElement('div');
      const INCREMENT = 'INCREMENT';
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }

      function reducer(state, action) {
        return action === INCREMENT ? state + 1 : state;
      }

      function Counter(props, ref) {
        const [count, dispatch] = useReducer(reducer, 0);
        useImperativeHandle(ref, () => ({count, dispatch}), []);
        return <Text text={'Count: ' + count} />;
      }

      Counter = forwardRef(Counter);
      const counter = createRef(null);
      render(<Counter ref={counter} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      expect(counter.current.count).toBe(0);

      counter.current.dispatch(INCREMENT);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
      // Intentionally not updated because of [] deps:
      expect(counter.current.count).toBe(0);
    });

    it('automatically updates when deps are not specified', () => {
      const container = createNodeElement('div');
      const INCREMENT = 'INCREMENT';
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }

      function reducer(state, action) {
        return action === INCREMENT ? state + 1 : state;
      }

      function Counter(props, ref) {
        const [count, dispatch] = useReducer(reducer, 0);
        useImperativeHandle(ref, () => ({count, dispatch}));
        return <Text text={'Count: ' + count} />;
      }

      Counter = forwardRef(Counter);
      const counter = createRef(null);
      render(<Counter ref={counter} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      expect(counter.current.count).toBe(0);

      counter.current.dispatch(INCREMENT);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
      expect(counter.current.count).toBe(1);
    });

    it('updates when deps are different', () => {
      const container = createNodeElement('div');
      const INCREMENT = 'INCREMENT';
      let logs = [];
      function Text(props) {
        logs.push(props.text);
        return <span>{props.text}</span>;
      }

      function reducer(state, action) {
        return action === INCREMENT ? state + 1 : state;
      }

      let totalRefUpdates = 0;
      function Counter(props, ref) {
        const [count, dispatch] = useReducer(reducer, 0);
        useImperativeHandle(
          ref,
          () => {
            totalRefUpdates++;
            return {count, dispatch};
          },
          [count],
        );
        return <Text text={'Count: ' + count} />;
      }

      Counter = forwardRef(Counter);
      const counter = createRef(null);
      render(<Counter ref={counter} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
      expect(counter.current.count).toBe(0);
      expect(totalRefUpdates).toBe(1);

      counter.current.dispatch(INCREMENT);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
      expect(counter.current.count).toBe(1);
      expect(totalRefUpdates).toBe(2);

      // Update that doesn't change the ref dependencies
      render(<Counter ref={counter} />, container);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 1');
      expect(counter.current.count).toBe(1);
      expect(totalRefUpdates).toBe(2); // Should not increase since last time
    });
  });
});
