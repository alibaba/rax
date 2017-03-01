import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TouchableHighlight from 'rax-touchable';
import style from './style';

const isWeex = typeof callNative !== 'undefined';

class Item extends Component {

  render() {

    if (!this.props.itemSelectedStyle) {
      this.props.itemSelectedStyle = {
        color: style.selectItemText.color
      };
    }

    let itemSelectedStyle = {
      ...style.selectItemText,
      ...this.props.itemSelectedStyle
    };
    let itemTextStyle = {
      ...style.selectItemText,
      ...this.props.style,
      ...{
        color: this.props.style.color || '#000000',
      }
    };
    delete itemTextStyle.width; // 删除是为了防止默认 grid 的 1% 样式的影响
    if (this.props.select) {
      return <TouchableHighlight {...this.props} style={this.props.style}>
        <Text style={itemSelectedStyle}>{this.props.item}</Text>
      </TouchableHighlight>;
    } else {
      return <TouchableHighlight {...this.props} style={this.props.style}>
        <Text style={itemTextStyle}>{this.props.item}</Text>
      </TouchableHighlight>;
    }


  }

}


export default Item;
