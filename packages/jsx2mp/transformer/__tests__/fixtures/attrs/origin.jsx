import { createElement, Component } from 'rax';

export default class extends Component {
  state = {
    show: false,
  }

  render() {
    const { show, bar } = this.state;
    return (
      <view onTap={this.handleClick}>
        <view foo="bar">string literial</view>
        <view foo={false}>boolean literial</view>
        <view foo={null}>null literial</view>
        <view foo={undefined}>undefined literial</view>
        <view foo={{ a: 1 }}>object literial</view>
        <view foo={bar}>id bind</view>
        <view foo={this.state.bar}>id bind</view>
        <view foo={bar > 10}>binary expression</view>
        <view foo={bar > 10 ? true : false}>binary expression</view>
        <view foo={bar()}>call expression</view>
      </view>
    );
  }
}
