import {createElement, Component, PropTypes} from 'rax';
import {Image, View} from 'rax-components';
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
 * 转换质量后缀
 * @param  {String|Array} suffix [图片质量后缀]
 * @return {[type]}        [description]
 */
function parseSuffix(suffix) {
  const result = [];
  let ret = [];

  // 如果suffix为string类型
  if (typeof(suffix) === 'string') {
    ret = suffix.split(',');
  }

  // 如果suffix为array类型
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
 * 获取图片质量后缀
 * @param  {String|Array} suffix [图片质量后缀]
 * @return {[type]}        [description]
 */
function getQualitySuffix(highQuality, suffix) {
  const _suffix = parseSuffix(suffix);
  return highQuality ? _suffix[0] : _suffix[1];
}

class RxPicture extends Component {
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

    width: PropTypes.string,  //图片真实宽度
    height: PropTypes.string,  //图片真实高度
    defaultHeight: PropTypes.string, //当高度设置失败时的默认高度

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

  nstyle = {};

  componentWillUpdate(nextProps) {
    if (this.props.source.uri !== nextProps.source.uri) {
      this.uri = '';
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.forceUpdate || this.props.children) {
      return true;
    }

    return (this.props.source.uri !== nextProps.source.uri) ||
      (this.state.visible !== nextState.visible);
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
    let _resizeMode = resizeMode;
    if (!this.uri) {
      let sWidth = style.width, //图片需要显示的宽度
        sHeight = style.height; //图片需要显示的高度

      //如果没有设置高度，但是设置了宽度，则根据图片原始高度、宽度设置高度
      if ( ! sHeight && sWidth && width && height) {
        const pScaling = width / parseInt(sWidth, 10);
        sHeight = parseInt(height / pScaling, 10);

        if (typeof(sWidth) === 'string' && sWidth.indexOf('rem') > -1 && sHeight) {
          sHeight = sHeight + 'rem';
        }
      }

      this.nstyle = Object.assign({
        height: sHeight
      }, style);

      this.uri = uri;

      if (_resizeMode) {
        this.nstyle.resizeMode = _resizeMode;
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
          //@HACK for appear
          isonce="1"
          onAppear={() => this.lazyLoad()}
          style={[
            this.nstyle, {
              backgroundImage: 'url(' + url + ')',
              backgroundSize: resizeMode || 'cover',
              backgroundRepeat: 'no-repeat'
            }, (resizeMode === 'cover' || resizeMode === 'contain') ? {
              backgroundPosition: 'center'
            } : null,
            !this.nstyle.height ? {height: defaultHeight} : null
          ]}
        >
          {children}
        </View>
      );
    } else {
      return <Image
        //@HACK for appear
        isonce="1"
        onAppear={() => this.lazyLoad()}
        source={{
          uri: url
        }}
        style={this.nstyle}
      />;
    }
  }

  lazyLoad() {
    this.setState({ visible: true });
  }
}

export default RxPicture;
