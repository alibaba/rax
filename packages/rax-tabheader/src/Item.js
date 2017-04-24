import {createElement, Component, findDOMNode, PropTypes} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TouchableHighlight from 'rax-touchable';
import styles from './style';
import Icon from 'rax-icon';
import {isWeex} from 'universal-env';

const TABEHEADER_SCTOLLTO = 'tabheaderScrollTo';
const TABEHEADER_SELECT = 'tabheaderSelect';

class Item extends Component {

  static contextTypes = {
    tabheader: PropTypes.object
  };

  select = (index, useAnim) => {
    const tabheader = this.context.tabheader;

    if (this.animType != 'noanim' && useAnim) {
      tabheader.emit(TABEHEADER_SCTOLLTO, {
        x: parseInt(this.props.itemWidth) * index
      });
    }
    if (this.selected != index) {
      this.props.onPress && this.props.onPress(index);
      this.props.onSelect && this.props.onSelect(index);
    }
    if (tabheader) {
      tabheader.emit(TABEHEADER_SELECT, index);
    }
  }

  render() {
    let {
      index,
      selected,
      data,
      styleType,
      itemWidth,
      renderItem,
      renderSelect,
      itemStyle,
      itemSelectedStyle,
    } = this.props;

    if (typeof this.props.itemWidth == 'function') {
      itemWidth = this.props.itemWidth(data, index);
    }

    renderSelect = renderSelect ? renderSelect : renderItem;
    let isSelected = index === selected;
    let thisStyles = this.initStyle(styleType, itemStyle, itemSelectedStyle, itemWidth, isSelected);

    if (styleType == 'icon') {
      return (
        <TouchableHighlight
          onPress={() => {
            this.select(index, true);
          }}
          style={thisStyles.container}>
          <View style={styles.iconBox}>
            <Icon style={styles.icon} source={{uri: data.icon}} />
          </View>
          <View>
            <Text style={thisStyles.iconText}>{data.text}</Text>
          </View>
        </TouchableHighlight>
      );
    } else if (styleType == 'normal' || styleType == 'dropdown') {
      return (
        <TouchableHighlight
          onPress={() => {
            this.select(index, true);
          }}
          style={thisStyles.container}>
          <Text style={thisStyles.text}>{data}</Text>
        </TouchableHighlight>
      );
    } else {
      if (isSelected) {
        return (
          <TouchableHighlight
            onPress={() => {
              this.select(index);
            }}
            style={thisStyles.container}>
            {renderSelect(data, index)}
          </TouchableHighlight>
        );
      } else {
        return (
          <TouchableHighlight
            onPress={() => {
              this.select(index);
            }} style={thisStyles.container}>
            {renderItem(data, index)}
          </TouchableHighlight>
        );
      }
    }
  }


  initStyle = (styleType, itemStyle, itemSelectedStyle, itemWidth, selected) => {
    let thisItemStyle, textStyle, iconStyle, iconTextStyle;

    thisItemStyle = {
      ...styles.item,
      ...{width: itemWidth}
    };

    iconStyle = styles.icon;
    iconTextStyle = styles.iconText;

    if (selected) {
      thisItemStyle = {
        ...thisItemStyle,
        ...itemStyle,
        ...itemSelectedStyle,
      };
      textStyle = styles.selectItemText;
      if (itemSelectedStyle) {
        textStyle = {
          ...textStyle,
          ...itemSelectedStyle,
        };
        iconTextStyle = {
          ...iconTextStyle,
          ...itemSelectedStyle,
        };
      }
    } else {
      thisItemStyle = {
        ...thisItemStyle,
        ...itemStyle,
      };
      textStyle = styles.itemText;
    }

    if (styleType == 'icon') {
      thisItemStyle = {
        ...styles.iconItem,
        ...thisItemStyle,
      };
      if (!isWeex) {
        if (iconTextStyle.height) {
          iconTextStyle.height = 12;
        }
      }
    }

    return {
      container: thisItemStyle,
      text: textStyle,
      icon: iconStyle,
      iconText: iconTextStyle,
    };
  }

}

Item.defaultProps = {
  selected: 0,
  itemWidth: 166,
};

export default Item;
