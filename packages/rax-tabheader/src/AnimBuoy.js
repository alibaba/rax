import {createElement, findDOMNode, Component, PropTypes} from 'rax';
import View from 'rax-view';
import Animated from './animation';
import styles from './style';

const TABEHEADER_SCTOLLTO = 'tabheaderScrollTo';

class AnimBuoy extends Component {

  static contextTypes = {
    tabheader: PropTypes.object
  };

  componentWillMount() {
    let tabheader = this.context.tabheader;
    if (tabheader && tabheader.on) {
      tabheader.on(TABEHEADER_SCTOLLTO, (options) => {
        this.scrollTo(options);
      });
    }
  }

  scrollTo = (options) => {
    const animbuoy = findDOMNode(this.refs.animbuoy);
    Animated.scrollTo(animbuoy, options);
  }

  componentDidMount() {
    let left = this.props.itemWidth;
    if (typeof left == 'string') {
      left = parseInt(left.split('rem')[0]) * this.props.selected;
    } else {
      left = this.props.itemWidth * this.props.selected;
    }
    this.scrollTo({x: left});
  }

  render() {
    let {
      // style,
      itemWidth,
      animType,
    } = this.props;

    let backgroundColor = '#fc511f';
    if (this.props.style) {
      backgroundColor = this.props.style.backgroundColor || this.props.style.borderColor || this.props.style.borderBottomColor || backgroundColor;
    }
    let top = 76;
    if (this.props.styleType == 'icon') {
      top = 107;
    }

    let thisStyle = {
      ...this.props.style,
      position: 'absolute',
      left: 0,
      top: top,
      height: 4,
      width: itemWidth,
      backgroundColor: backgroundColor,
    };

    if (animType == 'bg') {
      thisStyle = {
        ...thisStyle,
        top: 0,
        height: 110,
      };
    }

    return <View style={styles.borderBottom}>
      <View ref="animbuoy" style={thisStyle} />
    </View>;
  }
}

AnimBuoy.defaultProps = {
  itemWidth: 166,
};

export default AnimBuoy;
