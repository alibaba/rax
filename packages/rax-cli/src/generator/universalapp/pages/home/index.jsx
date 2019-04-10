import { createElement, Component } from 'rax';
import Header from '../../components/header/index';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
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
      <View className="app">
        <Header>
          <Image mode="widthFix" src="https://gw.alicdn.com/tfs/TB1omutPwHqK1RjSZFkXXX.WFXa-498-498.png" className="logo" />
          <Text className="title" onTap={this.handleTap}>Welcome to {this.state.name}</Text>
        </Header>
        <Text class="intro">To get started, edit and rebuild.</Text>
      </View>
    );
  }
}