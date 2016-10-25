import {createElement, Component, render} from 'universal-rx';

class Hello extends Component {
  render() {
    return (
      <span>Hello</span>
    );
  }
}

render(document.body);
