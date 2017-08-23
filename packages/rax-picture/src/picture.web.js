import {createElement, Component, PropTypes} from 'rax';
import View from 'rax-view';
import Image from 'rax-image';
import optimizer from './optimizer/index';
import webp from './webp';

const toString = {}.toString;
const isArray = Array.isArray || function(arr) {
  return toString.call(arr) == '[object Array]';
};

let isSupportJPG = false;
let isSupportPNG = false;

webp.isSupport((_isSupportJPG) => {
  isSupportJPG = _isSupportJPG;
});

webp.isSupport((_isSupportPNG) => {
  isSupportPNG = _isSupportPNG;
}, 'alpha');

/**
 * @param  {String|Array} suffix
 * @return {[type]}        [description]
 */
function parseSuffix(suffix) {
  const result = [];
  let ret = [];

  if (typeof suffix === 'string') {
    ret = suffix.split(',');
  }

  if (isArray(suffix)) {
    ret = suffix;
  }

  if (ret && ret[0]) {
    result[0] = ret[0];
  }
  if (ret && ret[1]) {
    result[1] = ret[1];
  }

  return result;
}

/**
 * @param  {String|Array} suffix
 * @return {[type]}
 */
function getQualitySuffix(highQuality, suffix) {
  const _suffix = parseSuffix(suffix);
  return highQuality ? _suffix[0] : _suffix[1];
}

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
    let nativeProps = this.props;

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

      if (uri) {
        if (autoPixelRatio && window.devicePixelRatio > 1) { // devicePixelRatio >= 2 for web
          if (typeof sWidth === 'string' && sWidth.indexOf('rem') > -1) {
            sWidth = parseInt(sWidth.split('rem')[0]) * 2 + 'rem';
          }
        }

        this.uri = optimizer(uri, {
          ignoreGif: ignoreGif,
          ignorePng: true,
          removeScheme: autoRemoveScheme,
          replaceDomain: autoReplaceDomain,
          scalingWidth: autoScaling ? sWidth : 0,
          webp: autoWebp && (isSupportJPG && isSupportPNG),
          compressSuffix: autoCompress ? getQualitySuffix(highQuality, compressSuffix) : ''
        });
      }

      if (resizeMode) {
        this.newStyle.resizeMode = resizeMode;
      }
    }

    let url = placeholder;
    if (lazyload) {
      const { visible } = this.state;
      nativeProps.onAppear = () => this.lazyLoad();
      if (visible) {
        url = this.uri;
      }
    } else {
      url = this.uri;
    }

    if (children || resizeMode) {
      return (
        <View
          {...nativeProps}
          data-once={true}
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
        {...nativeProps}
        data-once={true}
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
