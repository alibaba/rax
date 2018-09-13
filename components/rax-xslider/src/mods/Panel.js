/** @jsx createElement */

'use strict';

import {createElement, Component} from 'rax';
import View from 'rax-view';

class Panel extends Component {
  isAppear = false;

  state = {
    isRender: true
  }

  getChildContext() {
    return {
      index: this.props.index,
      loopIndex: this.props.loopIndex
    };
  }

  triggerAppear = () => {
    if (this.isAppear) return;
    let {onAppear, index, loopIndex} = this.props;
    if (typeof onAppear === 'function') {
      onAppear({index, loopIndex, type: 'appear'});
    }
    this.isAppear = true;
  }

  triggerDisappear = () => {
    if (!this.isAppear) return;
    let {onDisappear, index, loopIndex} = this.props;
    if (typeof onDisappear === 'function') {
      onDisappear({index, loopIndex, type: 'disappear'});
    }
    this.isAppear = false;
  }

  show = () => {
    this.setState({isRender: true});
  }

  hide = () => {
    this.setState({isRender: false});
  }

  render() {
    return (
      <View {...this.props} ref={'card'} onAppear={null} onDisappear={null}>
        {this.state.isRender ? this.props.children : null}
      </View>
    );
  }
}


export default Panel;