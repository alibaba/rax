/* @jsx createElement */

import Component from '../component';
import {createElement} from '../element';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import createContext from '../createContext';
import {useState, useContext, useEffect, useLayoutEffect, useRef, useReducer, useImperativeMethods} from '../hooks';
import { flushPassiveEffects } from '../vdom/updater';
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

    expect(container.childNodes[0].childNodes[0].data).toEqual('1');

    updaters[0](count => count + 10);

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
    flushPassiveEffects();
    expect(logs).toEqual([
      'render', 'create2', 'create1'
    ]);

    render(<Counter count={1} />, container);
    flushPassiveEffects();
    expect(logs).toEqual([
      'render', 'create2', 'create1',
      'render', 'destory2', 'create2', 'destory1', 'create1']);

    render(<Counter count={2} />, container);
    flushPassiveEffects();
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
    flushPassiveEffects();
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(1);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={1} />, container);
    flushPassiveEffects();
    expect(renderCounter).toEqual(2);
    expect(effectCounter).toEqual(2);
    expect(cleanupCounter).toEqual(1);

    render(<Counter count={2} />, container);
    flushPassiveEffects();
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
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(2);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={0} />, container);
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(3);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={1} />, container);
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
    flushPassiveEffects();
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(2);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={0} />, container);
    flushPassiveEffects();
    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(3);
    expect(cleanupCounter).toEqual(0);

    render(<Counter count={1} />, container);
    flushPassiveEffects();
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
        'Too many re-renders. rax limits the number of renders to prevent ' +
          'an infinite loop.',
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
      expect(container.childNodes[0].childNodes[0].data).toEqual('1');

      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      expect(container.childNodes[0].childNodes[0].data).toEqual('-2');

      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(INCREMENT);
      counter.current.dispatch(INCREMENT);
      counter.current.dispatch(INCREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(INCREMENT);
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
      expect(container.childNodes[0].childNodes[0].data).toEqual('10');

      counter.current.dispatch(INCREMENT);
      expect(container.childNodes[0].childNodes[0].data).toEqual('11');

      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      counter.current.dispatch(DECREMENT);
      expect(container.childNodes[0].childNodes[0].data).toEqual('8');
    });
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
      flushPassiveEffects();
      // There were multiple updates, but there should only be a
      // single render
      expect(logs).toEqual(['Count: 0']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 0');
    },
  );

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
      flushPassiveEffects();
      // There were multiple updates, but there should only be a
      // single render
      expect(logs).toEqual(['Count: 7']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Count: 7');
    },
  );

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
      flushPassiveEffects();
      expect(logs).toEqual(['Did commit [0]']);

      logs = [];
      render(<Counter count={1} />, container);
      expect(container.childNodes[0].childNodes[0].data).toEqual('1');
      // Effects are deferred until after the commit
      flushPassiveEffects();
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
      expect(logs).toEqual(['Layout', 'Layout effect', 'Passive']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Layout');
      expect(container.childNodes[1].childNodes[0].data).toEqual('Passive');

      logs = [];
      // Destroying the first child shouldn't prevent the passive effect from
      // being executed
      render([passive], container);
      expect(logs).toEqual(['Passive effect']);
      expect(container.childNodes[0].childNodes[0].data).toEqual('Passive');

      // (No effects are left to flush.)
      logs = [];
      flushPassiveEffects();
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
      flushPassiveEffects();
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

    it(
      'flushes effects serially by flushing old effects before flushing ' +
        "new ones, if they haven't already fired",
      () => {
        const container = createNodeElement('div');
        let logs = [];
        function getCommittedText() {
          return container.childNodes[0].childNodes[0].data;
        }

        function Counter(props) {
          useEffect(() => {
            logs.push(
              `Committed state when effect was fired: ${getCommittedText()}`,
            );
          });
          logs.push(props.count);
          return <span>{props.count}</span>;
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
        flushPassiveEffects();
        expect(logs).toEqual([
          'Committed state when effect was fired: 1',
        ]);
      },
    );
  });
});
