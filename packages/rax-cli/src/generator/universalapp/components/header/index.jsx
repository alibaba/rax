import { createElement, Component } from 'rax';
import View from 'rax-view';
import './index.css';

export default class extends Component {
  render() {
    return (
      <View className="header">
        {this.props.children}
      </View>
    );
  }
}