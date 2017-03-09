import {createElement, Component, PropTypes} from 'rax';
import View from 'rax-view';
import Image from 'rax-image';

class RxPicture extends Component {
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
    const {
      children,
      style = {},
      source = {},
      resizeMode,

      width,
      height,
      defaultHeight
    } = this.props;
    let _resizeMode = resizeMode;
    let sWidth = style.width, // style width of picture
      sHeight = style.height; // style width of picture

    // according to the original height and width of the picture
    if ( ! sHeight && sWidth && width && height) {
      const pScaling = width / parseInt(sWidth, 10);
      sHeight = parseInt(height / pScaling, 10);

      if (typeof sWidth === 'string' && sWidth.indexOf('rem') > -1 && sHeight) {
        sHeight = sHeight + 'rem';
      }
    }

    if (!sHeight) {
      sHeight = defaultHeight;

      if (!_resizeMode) {
        // ensure that the picture can be displayed
        _resizeMode = 'contain';
      }
    }

    let nstyle = Object.assign({
      height: sHeight
    }, style);

    if (_resizeMode) {
      nstyle.resizeMode = _resizeMode;
    }

    return <Image source={source} style={nstyle}>
      {children}
    </Image>;
  }
}

export default RxPicture;
