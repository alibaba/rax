/* @jsx createElement */

import Component from '../vdom/component';
import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import createContext from '../createContext';
import createRef from '../createRef';

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

  it('provider bails out if children and value are unchanged (like sCU)', () => {
    const container = createNodeElement('div');
    const Context = createContext(0);
    let logs = [];

    function Child() {
      logs.push('Child');
      return <span>Child</span>;
    }

    const children = <Child />;

    function App(props) {
      logs.push('App');
      return (
        <Context.Provider value={props.value}>{children}</Context.Provider>
      );
    }

    // Initial mount
    render(<App value={1} />, container);
    expect(logs).toEqual(['App', 'Child']);
    expect(container.childNodes[0].childNodes[0].data).toEqual('Child');

    // Update
    logs = [];
    render(<App value={1} />, container);
    expect(logs).toEqual(['App'
    // Child does not re-render
    ]);
    expect(container.childNodes[0].childNodes[0].data).toEqual('Child');
  });

  it('provider does not bail out if legacy context changed above', () => {
    const container = createNodeElement('div');
    const Context = createContext(0);
    let logs = [];

    function Child() {
      logs.push('Child');
      return <span>Child</span>;
    }

    const children = <Child />;

    const legacyProviderRef = createRef();
    const appRef = createRef();

    class LegacyProvider extends Component {
      static childContextTypes = {
        legacyValue: () => {},
      };
      state = {legacyValue: 1};
      getChildContext() {
        return {legacyValue: this.state.legacyValue};
      }
      render() {
        legacyProviderRef.current = this;
        logs.push('LegacyProvider');
        return this.props.children;
      }
    }

    class App extends Component {
      state = {value: 1};
      render() {
        appRef.current = this;
        logs.push('App');
        return (
          <Context.Provider value={this.state.value}>
            {this.props.children}
          </Context.Provider>
        );
      }
    }

    // Initial mount
    render(
      <LegacyProvider>
        <App value={1}>
          {children}
        </App>
      </LegacyProvider>, container,
    );
    expect(logs).toEqual(['LegacyProvider', 'App', 'Child']);
    expect(container.childNodes[0].childNodes[0].data).toEqual('Child');

    // Update App with same value (should bail out)
    logs = [];
    appRef.current.setState({value: 1});
    jest.runAllTimers();
    expect(logs).toEqual(['App']);
    expect(container.childNodes[0].childNodes[0].data).toEqual('Child');

    // Update LegacyProvider (should not bail out)
    logs = [];
    legacyProviderRef.current.setState({value: 1});
    jest.runAllTimers();
    expect(logs).toEqual(['LegacyProvider', 'App', 'Child']);
    expect(container.childNodes[0].childNodes[0].data).toEqual('Child');

    // Update App with same value (should bail out)
    logs = [];
    appRef.current.setState({value: 1});
    jest.runAllTimers();
    expect(logs).toEqual(['App']);
    expect(container.childNodes[0].childNodes[0].data).toEqual('Child');
  });

  it('should only update consumer when context change', () => {
    const container = createNodeElement('div');
    const Context = createContext('theme-default');
    let logs = [];

    class ThemeProvider extends Component {
      state = {
        theme: 'theme1'
      }
      render() {
        logs.push('ThemeProvider');
        return <Context.Provider value={this.state.theme}>{this.props.children}</Context.Provider>;
      }
    }

    function ThemeDisplay(props) {
      logs.push('ThemeDisplay');
      return <span>{props.theme}</span>;
    }

    function ThemeConsumer() {
      return <Context.Consumer>
        {
          theme => <ThemeDisplay theme={theme} />
        }
      </Context.Consumer>;
    }

    function OtherChild() {
      logs.push('OtherChild');
      return <span>OtherChild</span>;
    }

    function App() {
      logs.push('App');
      return [<OtherChild />, <ThemeConsumer />];
    }

    const themeProvider = render(<ThemeProvider><App /></ThemeProvider>, container);
    expect(logs).toEqual(['ThemeProvider', 'App', 'OtherChild', 'ThemeDisplay']);
    expect(container.childNodes[0].childNodes[0].data).toEqual('OtherChild');
    expect(container.childNodes[1].childNodes[0].data).toEqual('theme1');

    logs = [];
    themeProvider.setState({
      theme: 'theme2'
    });
    jest.runAllTimers();
    expect(logs).toEqual(['ThemeProvider', 'ThemeDisplay']);
    expect(container.childNodes[0].childNodes[0].data).toEqual('OtherChild');
    expect(container.childNodes[1].childNodes[0].data).toEqual('theme2');
  });
});
