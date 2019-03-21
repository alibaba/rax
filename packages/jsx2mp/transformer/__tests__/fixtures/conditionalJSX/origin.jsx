import { createElement, Component } from 'rax';

export default class extends Component {
  state = {
    show: false,
  }

  render() {
    const { show } = this.state;
    return (
      <view onTap={this.handleClick}>
        { show ? <text>Show!</text> : <text>Not show!</text> }
      </view>
    );
  }
}
