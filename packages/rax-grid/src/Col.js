/** @jsx createElement */

import {Component, createElement} from 'rax';

let defaultWidth = window.screen.width;

class Col extends Component {
  render() {

    if (this.props.sm) {
      styles.initial.flex = '';
      styles.initial.float = 'left';
      styles.initial.width = (defaultWidth / 12) * this.props.sm;
    }

    let style = {
      ...styles.initial,
      ...this.props.style
    };

    let children = this.props.children;
    let length = children.length;

    if (length) {
      return (
        <div {...this.props} style={style} />
      );
    } else {
      // 如果仅有一个 child 则返回 child 标签
      children.props.style = {
        ...this.props.style,
        ...children.props.style,
        ...styles.initial,
      };
      return children;
    }

  }
}

const styles = {
  initial: {
    'flex': 1,
    'width': '1%',
  }
};

export default Col;
