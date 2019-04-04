import { createElement, Component } from 'rax';
import Header from '../../components/Header';

export default class extends Component {
  state = {
    name: 'Rax'
  }

  handleTap() {
    this.setState({
      name: 'MiniApp'
    });
  }

  render() {
    return (
      <view className="app">
        <Header>
          <image mode="widthFix" src="https://gw.alicdn.com/tfs/TB1omutPwHqK1RjSZFkXXX.WFXa-498-498.png" className="app-logo"></image>
          <text className="app-title" onTap={this.handleTap}>Welcome to {this.state.name}</text>
        </Header>
        <view class="app-intro">To get started, edit and rebuild.</view>
      </view>
    );
  }
}