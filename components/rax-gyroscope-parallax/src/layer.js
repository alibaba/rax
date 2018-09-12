'use strict';

import {createElement, Component} from 'rax';
import View from 'rax-view';

export default class Layer extends Component {
  componentDidMount() {
  }

  render() {
    let style = {...this.props.style, position: 'absolute'};
    let uuId = 'l' + parseInt(Math.random() * 10000);
    return <View {...this.props} style={style} ref={uuId}>{this.props.children}</View>;
  }
}