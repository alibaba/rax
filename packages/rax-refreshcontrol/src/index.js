import {Component, createElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';

class RefreshControl extends Component {
  render() {
    if (isWeex) {
      let displayRefresh = this.props.refreshing ? 'show' : 'hide';
      return (
        <refresh id={this.props.id} style={this.props.style} display={displayRefresh} onRefresh={this.props.onRefresh}>
          {this.props.children}
        </refresh>
      );
    } else {
      return null;
    }
  }
}

export default RefreshControl;
