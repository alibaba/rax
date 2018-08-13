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
    style: PropTypes.object,
    source: PropTypes.object.isRequired,
    resizeMode: PropTypes.oneOf([
      'contain',
      'cover',
      'stretch'
    ]),

    width: PropTypes.string, // width of picture
    height: PropTypes.string, // height of picture
    defaultHeight: PropTypes.string, // default height when the height setting fails

    forceUpdate: PropTypes.bool
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
