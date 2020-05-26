/* @jsx createElement */

import {createElement, Component} from 'rax';
import {renderToString} from '../index';

describe('lifecycle', () => {
  it('should only execute certain lifecycle methods', () => {
    const lifecycle = [];

    class TestComponent extends Component {
      constructor(props) {
        super(props);
        lifecycle.push('getInitialState');
        this.state = {name: 'TestComponent'};
      }

      componentWillMount() {
        lifecycle.push('componentWillMount');
      }

      componentDidMount() {
        lifecycle.push('componentDidMount');
      }

      render() {
        lifecycle.push('render');
        return <span>Component name: {this.state.name}</span>;
      }

      componentDidUpdate() {
        lifecycle.push('componentDidUpdate');
      }

      shouldComponentUpdate() {
        lifecycle.push('shouldComponentUpdate');
      }

      UNSAFE_componentWillReceiveProps() {
        lifecycle.push('componentWillReceiveProps');
      }

      componentWillUnmount() {
        lifecycle.push('componentWillUnmount');
      }
    }

    const response = renderToString(<TestComponent />);

    expect(response).toBe('<span>Component name: <!--|-->TestComponent</span>');

    expect(lifecycle).toEqual([
      'getInitialState',
      'componentWillMount',
      'render',
    ]);
  });
});
