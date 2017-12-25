import {Component, createElement, PropTypes} from 'rax';
import {isWeex, isWeb} from 'universal-env';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';

class Icon extends Component {
  static propTypes = {
    fontFamily: PropTypes.string,
    source: PropTypes.object
  }

  render() {
    const style = this.props.style || {};

    // for images
    if (this.props.source.uri && !this.props.source.codePoint) {
      return <Image
        source={{uri: this.props.source.uri}}
        style={style}
      />;
    }

    // for iconfont
    const uri = this.props.source.uri;
    const fontFamily = this.props.fontFamily;
    const iconStyle = {
      ...style,
      fontFamily: fontFamily
    };

    if (isWeb) {
      const FontFace = window.FontFace;
      const iconfont = new FontFace(fontFamily, 'url(' + uri + ')');
      document.fonts.add(iconfont);
    }

    if (isWeex) {
      var domModule = __weex_require__('@weex-module/dom');
      domModule.addRule('fontFace', {
        'fontFamily': fontFamily,
        'src': "url('" + uri + "')" // single quotes are required around uri, and double quotes can not work
      });
    }
    return <Text style={iconStyle}>{this.props.source.codePoint}</Text>;
  }
}

export default Icon;

export function createIconSet(glyphMap, fontFamily, uri) {
  class IconFont extends Component {
    render() {
      let codePoint = '';
      if (this.props.codePoint) {
        codePoint = this.props.codePoint;
      } else if (this.props.name) {
        codePoint = glyphMap[this.props.name];
      }
      return (
        <Icon
          style={this.props.style}
          fontFamily={fontFamily}
          source={{
            uri: uri,
            codePoint: codePoint
          }} />
      );
    }
  }

  return IconFont;
}
