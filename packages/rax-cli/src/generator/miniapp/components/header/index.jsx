import { createElement, Component } from 'rax';
import './index.css';

export default class extends Component {
  render() {
    return (
      <view className="header">
        {this.props.children}
      </view>
    );
  }
}