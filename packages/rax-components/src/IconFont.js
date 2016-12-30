import {createElement, Component, PropTypes} from 'rax';
import View from './View';
import Text from './Text';
import {isWeex, isWeb} from 'universal-env';

class IconFont extends Component {
  static defaultProps = {
    fontFamily: 'iconfont'
  }

  static propTypes = {
    fontFamily: PropTypes.string,
    source: PropTypes.object
  }

  insertWebStyleTag() {
    const {fontFamily, source} = this.props;
    const tagTemplate = `@font-face{
        font-family: ${fontFamily};
        src: url('${source.uri}')
      }`;

    const existTag = document.getElementById(fontFamily);
    if (existTag) {
      return;
    }

    let styleTag = document.createElement('style');
    styleTag.id = fontFamily;
    styleTag.innerHTML = tagTemplate;
    document.getElementsByTagName('head')[0].appendChild(styleTag);
  }

  render() {
    const {style, fontFamily, source, children} = this.props;
    const txtStyle = {
      fontFamily: fontFamily,
      ...style
    };
    if (isWeex) {
      var domModule = require('@weex-module/dom');
      domModule.addRule('fontFace', {
        'fontFamily': fontFamily,
        'src': "url('" + source.uri + "')"
      });
    }
    if (isWeb) {
      this.insertWebStyleTag();
    }
    return <Text style={txtStyle}>{source.codePoint}</Text>;
  }
}

export default IconFont;