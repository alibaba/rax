import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TouchableHighlight from 'rax-touchable';
import Icon from 'rax-icon';
import style from './style';

const isWeex = typeof callNative !== 'undefined';

class Item extends Component {

  render() {
    if (!this.props.itemSelectedStyle) {
      this.props.itemSelectedStyle = {};
    }

    let selectedIconText = {
      ...style.selectedIconText,
      ...{
        color: this.props.itemSelectedStyle.color
      }
    };
    let iconText = {
      ...style.iconText,
      ...{
        color: this.props.style.color || '#000000'
      }
    };
    let itemStyle = {
      ...this.props.style,
      ...{
        height: '112rem'
      },
    };

    if (!isWeex) {
      if (selectedIconText.height) {
        selectedIconText.height = '12rem';
      }
      if (iconText.height) {
        iconText.height = '12rem';
      }
    }

    if (this.props.select) {
      let selectedIcon = this.props.item.selectedIcon;
      if (!selectedIcon) {
        selectedIcon = this.props.item.icon;
      }
      return <TouchableHighlight {...this.props} style={itemStyle}>
        <View style={style.iconBox}>
          <Icon style={style.icon} source={{uri: selectedIcon}} />
        </View>
        <View>
          <Text style={selectedIconText}>{this.props.item.text}</Text>
        </View>
      </TouchableHighlight>;
    } else {
      return <TouchableHighlight {...this.props} style={itemStyle}>
        <View style={style.iconBox}>
          <Icon style={style.icon} source={{uri: this.props.item.icon}} />
        </View>
        <View>
          <Text style={iconText}>{this.props.item.text}</Text>
        </View>
      </TouchableHighlight>;
    }
  }

}


export default Item;
