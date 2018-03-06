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
    height: PropTypes.number,

    /**
     * （web端有效）根据图像是否在可视范围内延迟加载图像，Web 端需引入 framework.web.js 脚本
     */
    lazyload: PropTypes.bool,

    /**
     * （web端有效）在高分辨率下使用二倍图
     */
    autoPixelRatio: PropTypes.bool,

    /**
     * （web端有效）lazyload 时显示的背景图 URL
     */
    placeholder: PropTypes.string,

    /**
     * （web端有效）图像 URL 自动删除协议头
     */
    autoRemoveScheme: PropTypes.bool,

    /**
     * （web端有效） 图像 URL 域名替换成 gw.alicdn.com
     */
    autoReplaceDomain: PropTypes.bool,

    /**
     * （web端有效） 为图像 URL 添加缩放后缀，将会根据 style 内的 width 属性添加缩放后缀
     */
    autoScaling: PropTypes.bool,

    /**
     * （web端有效） 添加 webp 后缀
     */
    autoWebp: PropTypes.bool,

    /**
     * （web端有效） 添加质量压缩后缀
     */
    autoCompress: PropTypes.bool,

    /**
     * （web端有效） 使用高质量的压缩后缀
     */
    highQuality: PropTypes.bool,

    /**
     * （web端有效） 图像质量压缩后缀规则
     */
    compressSuffix: PropTypes.array,

    /**
     * （web端有效） 所有针对 URL 的优化是否忽略 gif 格式的图像，默认忽略
     */
    ignoreGif: PropTypes.bool

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
        forceUpdate,

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

    if (!this.uri || forceUpdate) {
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
