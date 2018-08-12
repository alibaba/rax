import {Component, createElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';

class RefreshControl extends Component {
  render() {
    if (isWeex) {
      let displayRefresh = this.props.refreshing ? 'show' : 'hide';
      return (
        <refresh {...this.props} display={displayRefresh} >
          {this.props.children}
        </refresh>
      );
    } else {
      return null;
    }
  }
}

export default RefreshControl;
