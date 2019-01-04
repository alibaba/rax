/* @jsx createElement */

import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import createContext from '../createContext';
import {useState, useContext, useEffect, useLayoutEffect, useRef} from '../hooks';

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
});
