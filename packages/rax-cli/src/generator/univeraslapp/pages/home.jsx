import { createElement, Component } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Header from '../components/Header';
import './home.css';

const logo = 'http://gw.alicdn.com/tfs/TB11oXVXRGE3KVjSZFhXXckaFXa-149-148.png';

export default class extends Component {
  /**
   * Config for page.
   */
  static config = {
    window: {},
  };

  state = {
    name: 'Rax'
  };

  handleClick(evt) {
    this.setState({
      name: 'MiniApp'
    });
  }

  render() {
    const { name } = this.state;
    const source = { uri: logo };
    return (
      <View className="page-home">
        <Header>
          <Image source={source} className="home-logo" />
          <Text className="home-title" onClick={this.handleClick}>Welcome to {name}</Text>
        </Header>
        <View class="home-intro">To get started, edit and rebuild.</View>
      </View>
    );
  }
}
