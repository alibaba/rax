/* @jsx createElement */

import Component from '../vdom/component';
import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import createContext from '../createContext';

describe('createContext', () => {
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

  it('simple mount and update', () => {
    const container = createNodeElement('div');
    const Context = createContext(1);

    function Consumer(props) {
      return (
        <Context.Consumer>
          {value => <span key={value}>{value}</span>}
        </Context.Consumer>
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

  it('multiple consumers in different branches', () => {
    const container = createNodeElement('div');
    const Context = createContext(1);

    function Provider(props) {
      return (
        <Context.Consumer>
          {contextValue => (
            // Multiply previous context value by 2, unless prop overrides
            <Context.Provider value={props.value || contextValue * 2}>
              {props.children}
            </Context.Provider>
          )}
        </Context.Consumer>
      );
    }

    function Consumer(props) {
      return (
        <Context.Consumer>
          {value => <span>{value}</span>}
        </Context.Consumer>
      );
    }

    class Indirection extends Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return this.props.children;
      }
    }

    function App(props) {
      return (
        <Provider value={props.value}>
          <Indirection>
            <Indirection>
              <Consumer />
            </Indirection>
            <Indirection>
              <Provider>
                <Consumer />
              </Provider>
            </Indirection>
          </Indirection>
        </Provider>
      );
    }

    render(<App value={2} />, container);
    expect(container.childNodes[0].childNodes[0].data).toEqual('2');
    expect(container.childNodes[1].childNodes[0].data).toEqual('4');

    // Update
    render(<App value={3} />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toEqual('3');
    expect(container.childNodes[1].childNodes[0].data).toEqual('6');

    // Another update
    render(<App value={4} />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toEqual('4');
    expect(container.childNodes[1].childNodes[0].data).toEqual('8');
  });

  it('Consumer should render correct when its owner props update', () => {
    const container = createNodeElement('div');
    const Context = createContext(1);
    class Indirection extends Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return this.props.children;
      }
    }
    class Owner extends Component {
      render() {
        return (
          <Indirection>
            <Context.Consumer>
              {
                (value) => {
                  return (
                    <div>
                      <span>{value}</span>
                      <span>{this.props.value}</span>
                    </div>
                  );
                }
              }
            </Context.Consumer>
          </Indirection>
        );
      }
    }

    function App(props) {
      return (
        <Context.Provider value={props.value}>
          <Owner value={props.value} />
        </Context.Provider>
      );
    }

    render(<App value={2} />, container);
    expect(container.childNodes[0].childNodes[0].childNodes[0].data).toEqual('2');
    expect(container.childNodes[0].childNodes[1].childNodes[0].data).toEqual('2');

    // Update
    render(<App value={3} />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].childNodes[0].data).toEqual('3');
    expect(container.childNodes[0].childNodes[1].childNodes[0].data).toEqual('3');
  });

  it('Consumer should render only once when Context value change', () => {
    const container = createNodeElement('div');
    const Context = createContext(1);
    class Indirection extends Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return this.props.children;
      }
    }
    class App extends Component {
      render() {
        return (
          <Context.Provider value={this.props.value}>
            <Context.Consumer ref="consumer">
              {() => <div />}
            </Context.Consumer>
            <Indirection>
              <Context.Consumer ref="consumerWithIndirection">
                {() => <div />}
              </Context.Consumer>
            </Indirection>
          </Context.Provider>
        );
      }
    }
    const instance = render(<App value={2} />, container);
    const spyConsumerRender = jest.spyOn(instance.refs.consumer, 'render');
    const spyConsumerWithIndirection = jest.spyOn(instance.refs.consumerWithIndirection, 'render');
    render(<App value={3} />, container);
    jest.runAllTimers();
    expect(spyConsumerRender).toHaveBeenCalledTimes(1);
    expect(spyConsumerWithIndirection).toHaveBeenCalledTimes(1);
  });

  it('Consumer child should be rendered in the right order', () => {
    const container = createNodeElement('div');
    const Context = createContext(1);
    let Yield = [];
    class Parent extends Component {
      render() {
        Yield.push('Parent');
        return this.props.children;
      }
    }
    class App extends Component {
      render() {
        Yield.push('App');
        return (
          <Context.Provider value={this.props.value}>
            <Parent>
              <Context.Consumer>
                {
                  (value) => {
                    Yield.push('Consumer render');
                    return <span>{value}</span>;
                  }
                }
              </Context.Consumer>
            </Parent>
          </Context.Provider>
        );
      }
    }
    render(<App />, container);
    Yield = [];
    render(<App value={2} />, container);
    expect(Yield).toEqual([
      'App',
      'Parent',
      'Consumer render',
    ]);
    expect(container.childNodes[0].childNodes[0].data).toEqual('2');
  });
});
