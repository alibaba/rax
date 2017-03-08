import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TouchableHighlight from 'rax-touchable';
import styles from './styles';
import {isWeex} from 'universal-env';

class Item extends Component {

  render() {
    if (!this.props.itemSelectedStyle) {
      this.props.itemSelectedStyle = {
        color: styles.selectItemText.color
      };
    }

    let itemSelectedStyle = {
      ...styles.selectItemText,
      ...this.props.itemSelectedStyle
    };
    let itemTextStyle = {
      ...styles.selectItemText,
      ...this.props.style,
      ...{
        color: this.props.style.color || '#000000',
      }
    };
    delete itemTextStyle.width; // fix for grid 1% style
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
