import {createElement, Component, render} from 'universal-rx';
import {isWeex, isWeb} from 'universal-env';

class Hello extends Component {
  render() {
    if (isWeex) {
      return (
        <text>Hello world</text>
      );
    } else {
      return (
        <span>Hello world</span>
      );
    }
  }
}

render(<Hello />, document.body);
