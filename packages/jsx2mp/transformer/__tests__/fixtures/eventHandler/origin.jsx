import Rax, { Component } from 'rax';

export default class extends Component {
  handleClick(evt) {
    // do sth.
  }

  render() {
    return (
      <view onTap={this.handleClick}>Click Me!</view>
    );
  }
}
