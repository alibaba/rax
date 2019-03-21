import { createElement, Component } from 'rax';

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
    return <text class="title" onTap={this.handleTap}>Hello {this.state.name}</text>;
  }
}
