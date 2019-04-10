import { createElement, Component } from 'rax';
import './Header.css';

export default class extends Component {
  state = {
    name: 'world'
  }

  handleTap() {
    this.setState({
      name: 'miniapp'
    });
  }

  render() {
    return (
      <view className="app-header">
        {this.props.children}
      </view>
    );
  }
}