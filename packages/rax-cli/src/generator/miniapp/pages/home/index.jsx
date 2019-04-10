import { createElement, Component } from 'rax';
import Header from '../../components/header/index';
import './index.css';

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
          <image mode="widthFix" src="https://gw.alicdn.com/tfs/TB1omutPwHqK1RjSZFkXXX.WFXa-498-498.png" className="logo" />
          <text className="title" onTap={this.handleTap}>Welcome to {this.state.name}</text>
        </Header>
        <text class="intro">To get started, edit and rebuild.</text>
      </view>
    );
  }
}