import {createElement, findDOMNode, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import ScrollView from 'rax-scrollview';
import Animated from './animation';
import style from './style';

const isWeex = typeof callNative !== 'undefined';

class BackgroundRun extends Component {

  constructor(props) {
    super(props);
  }

  scrollTo = (options) => {
    const backgroundRun = findDOMNode(this.refs.backgroundRun);
    Animated.scrollTo(backgroundRun, options, () => {
      this.oldPlaceX = parseInt(options.x);
    });
  }

  componentDidMount() {
    const left = parseInt(this.props.itemWidth.split('rem')[0]) * this.props.selected;
    this.scrollTo({x: left});
  }

  render() {
    let itemWidth = this.props.itemWidth || '166rem';
    let backgroundColor = '#fc511f';
    if (this.props.style) {
      backgroundColor = this.props.style.backgroundColor;
    }

    return <View style={style.iconBackgroundRun}>
      <View
        ref="backgroundRun"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: 113,
          width: itemWidth,
          backgroundColor: backgroundColor,
        }}
      />
    </View>;
  }
}


export default BackgroundRun;
