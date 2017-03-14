
import {createElement, Component, PropTypes} from 'rax';
import View from 'rax-view';
import emitter from './Emitter';

class FlowView extends Component {
  static contextTypes = {
    page: PropTypes.object
  };
  componentWillMount() {
    let page = this.context.page;
    emitter.on('pageDidReachEnd', () => {
      this.props.onEndReached && this.props.onEndReached();
    });
    if (page) {
      page.on('pageEndReached', () => {
        this.props.onEndReached && this.props.onEndReached();
      });
    }
  }
  render() {
    let style = this.props.style || {};
    if (style.height !== undefined) {
      delete style.height;
    }

    return <View {...this.props} style={style} />;
  }
}

export default FlowView;