import { createElement, Component } from 'rax';

export default class extends Component {
  state = {
    show: false,
  }

  render() {
    const { arr } = this.state;
    return (
      <view onTap={this.handleClick}>
        {arr.map((n) => {
          return (<view>{n}</view>);
        })}
        {arr.map((n) => (<view>{n}</view>))}
      </view>
    );
  }
}
