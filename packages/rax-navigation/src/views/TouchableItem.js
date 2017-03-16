/* @flow */

/**
 * TouchableItem renders a touchable that looks native on both iOS and Android.
 *
 * It provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity.
 *
 * On iOS you can pass the props of TouchableOpacity, on Android pass the props
 * of TouchableNativeFeedback.
 */
import { createElement, Component, PropTypes } from 'rax';

import Platform from 'universal-platform';
import View from 'rax-view';
import TouchableNativeFeedback from 'rax-touchable';
const TouchableOpacity = TouchableNativeFeedback;

export default class TouchableItem extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    delayPressIn: PropTypes.number,
    borderless: PropTypes.bool,
    pressColor: PropTypes.string,
    activeOpacity: PropTypes.number,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    pressColor: 'rgba(0, 0, 0, .32)',
  };

  render() {
    return (
      <TouchableOpacity {...this.props}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
