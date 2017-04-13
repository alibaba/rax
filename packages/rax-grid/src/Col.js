import {Component, createElement} from 'rax';
import View from 'rax-view';

let defaultWidth = 750;

class Col extends Component {
  render() {
    let style = {
      flex: 1,
    };

    let children = this.props.children;

    if (Array.isArray(children)) {
      return (
        <View {...this.props} style={style} />
      );
    } else {
      // If only one child, return this child
      children.props.style = {
        ...style,
        ...this.props.style,
        ...children.props.style,

        // width: '1%' only for web (partial Android device column width is not the same problem)
        // why 1% works? (In Android, the flex element is easy to be opened without the width)
        // for example： MEIZU MX2 Android 4.4.4
        width: '1%',
      };
      return children;
    }
  }
}

export default Col;
