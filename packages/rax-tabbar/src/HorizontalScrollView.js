import {createElement, Component} from 'rax';
import inIOS8H5 from './inIOS8H5';
import View from 'rax-view';
import ScrollView from 'rax-scrollview';

const inIOS8ScrollViewStyle = {
  overflow: 'scroll',
  display: 'inline-block',
  width: 750,
  whiteSpace: 'nowrap'
};

let HorizontalScrollview = ScrollView;

if (inIOS8H5()) {
  HorizontalScrollview = class IOS8HorizontalScrollView extends Component {
    render() {
      return (
        <View {...this.props} style={[this.props.style, inIOS8ScrollViewStyle]}>
          {this.props.children}
        </View>
      );
    }
  };
}

export default HorizontalScrollview;