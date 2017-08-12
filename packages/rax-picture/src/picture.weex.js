import {createElement, Component, PropTypes} from 'rax';
import Image from 'rax-image';

class Picture extends Component {
  static defaultProps = {
    source: {
      uri: ''
    },
    defaultHeight: 750
  };

  static propTypes = {

    /**
     * 图片来源（必需）
     */
    source: PropTypes.object.isRequired,

    /**
     * 决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小。
     * cover: 在保持图片宽高比的前提下缩放图片，直到宽度和高度都大于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去）。译注：这样图片完全覆盖甚至超出容器，容器中不留任何空白。
     * contain: 在保持图片宽高比的前提下缩放图片，直到宽度和高度都小于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去）。译注：这样图片完全被包裹在容器中，容器中可能留有空白
     * stretch: 拉伸图片且不维持宽高比，直到宽高都刚好填满容器。
     * 设置 resizeMode 的前提是你设置了 style.width && style.height
     */
    resizeMode: PropTypes.oneOf([
      'contain',
      'cover',
      'stretch'
    ]),

    /**
     * Picture 是一个 PureComponent ，它的 shouldComponentUpdate 决定了当且仅当 porps.source.uri 有变化时才会重新 render。如果你想忽略它的 shouldComponentUpdate，则传入 forceUpdate={true}
     */
    forceUpdate: PropTypes.bool,

    /**
     * 图片真实宽度，单位 px
     */
    width: PropTypes.number,

    /**
     * 图片真实高度，单位 px
     */
    height: PropTypes.number

  };

  shouldComponentUpdate(nextProps) {
    if (this.props.forceUpdate || this.props.children) {
      return true;
    }

    return this.props.source.uri !== nextProps.source.uri;
  }

  render() {
    let {
      children,
      style = {},
      source = {},
      resizeMode,
      width,
      height,
      defaultHeight
    } = this.props;
    let styleWidth = style.width; // style width of picture
    let styleHeight = style.height; // style width of picture

    // according to the original height and width of the picture
    if (!styleHeight && styleWidth && width && height) {
      const pScaling = width / parseInt(styleWidth, 10);
      styleHeight = parseInt(height / pScaling, 10);
    }

    if (!styleHeight) {
      styleHeight = defaultHeight;

      if (!resizeMode) {
        // ensure that the picture can be displayed
        resizeMode = 'contain';
      }
    }

    let newStyle = Object.assign({
      height: styleHeight
    }, style);

    if (resizeMode) {
      newStyle.resizeMode = resizeMode;
    }

    return <Image {...this.props} source={source} style={newStyle}>
      {children}
    </Image>;
  }
}

export default Picture;
