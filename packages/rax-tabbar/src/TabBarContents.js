import {createElement, Component} from 'rax';
import View from 'rax-view';
import {isWeex} from 'universal-env';

const WIDTH = 750;

class TabBarContents extends Component {
  state = {};

  componentWillMount() {
    this.hasBeenSelected = false;
    if (this.props.selected) {
      this.hasBeenSelected = true;
    }
  }

  render() {
    if (this.props.selected) {
      this.hasBeenSelected = true;
    }

    let style = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: WIDTH
    };
    if (!this.props.selected) {
      style.left = 0 - WIDTH;
      style.overflow = 'hidden';
    } else {
      style.left = 0;
    }

    if (!isWeex || this.props.children.length > 0) {
      return (
        this.hasBeenSelected ?
          <View style={[this.props.style, style]}>
            {this.props.children}
          </View> : <View style={[this.props.style, style]} />
      );
    } else {
      // in native: save one layer <View />
      if (this.props.children.length > 0) {
        Object.assign(this.props.children.props.style || {}, this.props.style || {}, style);
      }

      return (
        this.hasBeenSelected ?
          this.props.children : <View style={[this.props.style, style]} />
      );
    }
  }
}

export default TabBarContents;