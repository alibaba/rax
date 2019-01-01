/* @jsx createElement */

import Component from '../component';
import {createElement} from '../element';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import createContext from '../createContext';
import {useState, useContext, useEffect, useLayoutEffect, useRef, useReducer, useImperativeMethods} from '../hooks';
import forwardRef from '../forwardRef';
import createRef from '../createRef';

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
    jest.runAllTimers();
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
    jest.runAllTimers();
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
    jest.runAllTimers();

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
      'render', 'destory1', 'destory2', 'create2', 'create1']);

    render(<Counter count={2} />, container);
    jest.runAllTimers();
    expect(logs).toEqual([
      'render', 'create2', 'create1',
      'render', 'destory1', 'destory2', 'create2', 'create1',
      'render', 'destory1', 'destory2', 'create2', 'create1']);
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
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toEqual('2');

    // Update
    render(<App value={3} />, container);
    jest.runAllTimers();
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
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toEqual('val');
    expect(renderCounter).toEqual(1);

    render(<Counter foo="bar" />, container);
    jest.runAllTimers();
    expect(renderCounter).toEqual(2);
    expect(container.childNodes[0].childNodes[0].data).toEqual('val');
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
        useImperativeMethods(ref, () => ({dispatch}));
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
      // jest.runAllTimers();
      logs = [];
      render(<Counter ref={counter} />, container);
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
        useImperativeMethods(ref, () => ({dispatch}));
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

    it('accepts an initial action', () => {
      const container = createNodeElement('div');
      const INCREMENT = 'INCREMENT';
      const DECREMENT = 'DECREMENT';

      function reducer(state, action) {
        switch (action) {
          case 'INITIALIZE':
            return 10;
          case 'INCREMENT':
            return state + 1;
          case 'DECREMENT':
            return state - 1;
          default:
            return state;
        }
      }

      const initialAction = 'INITIALIZE';

      function Counter(props, ref) {
        const [count, dispatch] = useReducer(reducer, 0, initialAction);
        useImperativeMethods(ref, () => ({dispatch}));
        return <span>{count}</span>;
      }
      Counter = forwardRef(Counter);
      const counter = createRef(null);
      render(<Counter ref={counter} />, container);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('10');

      counter.current.dispatch(INCREMENT);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('11');

      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      jest.runAllTimers();
      expect(container.childNodes[0].childNodes[0].data).toEqual('8');
    });
  });
});
