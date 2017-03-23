import {createElement, Component, PropTypes} from 'rax';
import View from 'rax-view';
import Image from 'rax-image';
import webp from './webp';

let isSupportJPG = false;
let isSupportPNG = false;

webp.isSupport((_isSupportJPG) => {
  isSupportJPG = _isSupportJPG;
});

webp.isSupport((_isSupportPNG) => {
  isSupportPNG = _isSupportPNG;
}, 'alpha');

class Picture extends Component {
  static defaultProps = {
    placeholder: 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==',
    source: {
      uri: ''
    },
    autoRemoveScheme: true,
    autoReplaceDomain: true,
    autoScaling: true,
    autoWebp: true,
    ignoreGif: true,
    autoCompress: true,
    highQuality: true,
    compressSuffix: ['Q75', 'Q50'],
    defaultHeight: '750rem',

    lazyload: false,
    autoPixelRatio: true
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

    autoRemoveScheme: PropTypes.bool,
    autoReplaceDomain: PropTypes.bool,
    autoScaling: PropTypes.bool,
    autoWebp: PropTypes.bool,
    autoCompress: PropTypes.bool,
    highQuality: PropTypes.bool,
    compressSuffix: PropTypes.array,

    lazyload: PropTypes.bool,
    placeholder: PropTypes.string,
    autoPixelRatio: PropTypes.bool,
    forceUpdate: PropTypes.bool,
    ignoreGif: PropTypes.bool
  };

  state = {
    visible: false
  };

  uri = '';

  newStyle = {};

  componentWillUpdate(nextProps) {
    if (this.props.source.uri !== nextProps.source.uri) {
      this.uri = '';
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.forceUpdate || this.props.children) {
      return true;
    }

    return this.props.source.uri !== nextProps.source.uri ||
      this.state.visible !== nextState.visible;
  }

  render() {
    const {
        children,
        style = {},
        source = {},
        resizeMode,

        width,
        height,
        defaultHeight,

        autoRemoveScheme,
        autoReplaceDomain,
        autoScaling,
        autoWebp,
        autoCompress,
        highQuality,
        compressSuffix,
        autoPixelRatio,

        lazyload,
        placeholder,
        ignoreGif
        } = this.props,
      { uri } = source;

    if (!this.uri) {
      let sWidth = style.width, // style width of picture
        sHeight = style.height; // style width of picture

      // according to the original height and width of the picture
      if (!sHeight && sWidth && width && height) {
        const pScaling = width / parseInt(sWidth, 10);
        sHeight = parseInt(height / pScaling, 10);
      }

      this.newStyle = Object.assign({
        height: sHeight
      }, style);

      this.uri = uri;

      if (resizeMode) {
        this.newStyle.resizeMode = resizeMode;
      }
    }

    let url = placeholder;
    if (lazyload) {
      const { visible } = this.state;

      if (visible) {
        url = this.uri;
      }
    } else {
      url = this.uri;
    }

    if (children || resizeMode) {
      return (
        <View
          data-once={true}
          onAppear={() => this.lazyLoad()}
          style={[
            this.newStyle, {
              backgroundImage: 'url(' + url + ')',
              backgroundSize: resizeMode || 'cover',
              backgroundRepeat: 'no-repeat'
            }, resizeMode === 'cover' || resizeMode === 'contain' ? {
              backgroundPosition: 'center'
            } : null,
            !this.newStyle.height ? {height: defaultHeight} : null
          ]}
        >
          {children}
        </View>
      );
    } else {
      return <Image
        data-once={true}
        onAppear={() => this.lazyLoad()}
        source={{
          uri: url
        }}
        style={this.newStyle}
      />;
    }
  }

  lazyLoad() {
    this.setState({ visible: true });
  }
}

export default Picture;
