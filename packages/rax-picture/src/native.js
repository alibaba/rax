/** @jsx createElement */
'use strict';
import {createElement, Component, PropTypes} from 'rax';
import View from 'rax-view';
import Image from 'rax-image';

class RxPicture extends Component {
  static defaultProps = {
    source: {
      uri: ''
    },
    defaultHeight: '750rem'
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

    if (!sHeight) {
      sHeight = defaultHeight;

      if (!_resizeMode) {

        //确保图片能够完整显示
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
