/* @jsx createElement */

import Component from '../component';
import {createElement} from '../element';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import createContext from '../createContext';
import {useState, useContext, useEffect} from '../hooks';

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
  });

  afterEach(function() {
    Host.driver = null;
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

  it('mount and update a function component with useEffect', () => {
    const container = createNodeElement('div');

    let counter = null;

    function Counter(props) {
      useEffect(() => {
        counter = props.count;
      });
      return <span>{props.count}</span>;
    }

    render(<Counter count={0} />, container);
    expect(counter).toEqual(0);

    render(<Counter count={1} />, container);
    expect(counter).toEqual(1);
  });

  it('only update if the inputs has changed with useEffect', () => {
    const container = createNodeElement('div');

    let renderCounter = 0;
    let effectCounter = 0;
    function Counter() {
      const [count, updateCount] = useState(0);
      const [text, udpateText] = useState('foo');
      useEffect(
        () => {
          ++effectCounter;
          udpateText('bar');
        },
        [count]
      );
      ++renderCounter;
      return <span>{text + count}</span>;
    }

    render(<Counter />, container);

    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(2);
  });

  it('would run only on mount and clean up on unmount with useEffect', () => {
    const container = createNodeElement('div');

    let renderCounter = 0;
    let effectCounter = 0;
    function Counter() {
      const [count, updateCount] = useState(0);
      useEffect(
        () => {
          ++effectCounter;
          updateCount(count + 1);
        },
        []
      );
      ++renderCounter;
      return <span>{count}</span>;
    }

    render(<Counter />, container);

    expect(effectCounter).toEqual(1);
    expect(renderCounter).toEqual(2);
  });

  it('works inside a function component with useContext', () => {
    const container = createNodeElement('div');
    const Context = createContext(1);

    function Consumer(props) {
      const value = useContext(Context);

      return (
        <span key={value}>{value}</span>
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
});
