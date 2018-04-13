/* @jsx createElement */

import findDOMNode from '../findDOMNode';
import Component from '../component';
import PropTypes from '../proptypes';
import {createElement} from '../element';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import createContext from '../createContext';
import unmountComponentAtNode from '../unmountComponentAtNode';

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
  });

  afterEach(function() {
    Host.driver = null;
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
    expect(container.childNodes[0].childNodes[0].data).toEqual('3');
    expect(container.childNodes[1].childNodes[0].data).toEqual('6');

    // Another update
    render(<App value={4} />, container);
    expect(container.childNodes[0].childNodes[0].data).toEqual('4');
    expect(container.childNodes[1].childNodes[0].data).toEqual('8');
  });
});
