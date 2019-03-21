import Rax, { Component } from 'rax';

export default class extends Component {
  state = {
    value: 'world'
  };

  render() {
    return (
      <view>Hello {this.state.value}</view>
    );
  }
}
