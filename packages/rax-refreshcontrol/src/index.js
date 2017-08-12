import {Component, createElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';

class RefreshControl extends Component {

  static propTypes = {

    /**
     * 是否显示
     */
    refreshing: PropTypes.string,

    /**
     * 监听下拉刷新的行为
     */
    onRefresh: PropTypes.func

  };

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
