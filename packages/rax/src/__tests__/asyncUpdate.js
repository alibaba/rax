/* @jsx createElement */

import createElement from '../createElement';
import Component from '../vdom/component';
import render from '../render';
import Host from '../vdom/host';
import ServerDriver from 'driver-server';
import { useState, useEffect } from '../hooks';

describe('update unmounted component', () => {
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

  it('should warn about class component', () => {
    const container = createNodeElement('div');
    let destroyChild;

    class Child extends Component {
      state = {
        name: 'hello'
      }
      componentDidMount() {
        setTimeout(() => {
          this.setState({
            name: 'work'
          });
        }, 1000);
      }
      render() {
        return <div>{this.state.name}</div>;
      }
    }

    class App extends Component {
      state = {
        showChild: true
      }
      componentDidMount() {
        destroyChild = () => {
          this.setState({
            showChild: false
          });
        };
      }
      render() {
        return (<div>
          { this.state.showChild ? <Child /> : null }
        </div>);
      }
    }

    expect(() => {
      render(<App />, container);
      destroyChild();
      jest.runAllTimers();
    }).toWarnDev("Warning: Can't perform a Rax state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.", { withoutStack: true });
  });

  it('should warn about function component', () => {
    const container = createNodeElement('div');
    let destroyChild;

    function Child() {
      const [name, setName] = useState('hello');
      useEffect(() => {
        setTimeout(() => {
          setName('world');
        }, 1000);
      }, []);
      return <div>{name}</div>;
    }

    class App extends Component {
      state = {
        showChild: true
      }
      componentDidMount() {
        destroyChild = () => {
          this.setState({
            showChild: false
          });
        };
      }
      render() {
        return (<div>
          { this.state.showChild ? <Child /> : null }
        </div>);
      }
    }

    expect(() => {
      render(<App />, container);
      destroyChild();
      jest.runAllTimers();
    }).toWarnDev("Warning: Can't perform a Rax state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.", { withoutStack: true });
  });
});
