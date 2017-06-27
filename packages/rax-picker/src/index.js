import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';
import TouchableHighlight from 'rax-touchable';
import Text from 'rax-text';

class Picker extends Component {

  static propTypes = {};

  constructor(props) {
    super(props);
    let pickerData = this.getPickerData();
    this.state = {
      selectedLabel: pickerData.selectedLabel,
    };
  }

  getPickerData = () => {
    let {
      children,
      selectedValue
    } = this.props;
    let pickerItems = [],
      pickerLabelList = [],
      items = [],
      selectIndex = 0,
      selectedLabel;

    if (children.length) {
      pickerItems = children;
    } else {
      pickerItems = [children];
    }

    pickerLabelList = pickerItems.map((item, index) => {
      let {value, label, color} = item.props;
      items.push({
        value: value,
        label: label || value,
      });
      if (value == selectedValue) {
        selectIndex = index;
        selectedLabel = label;
      }
      return label;
    });

    return {
      selectIndex: selectIndex,
      selectedLabel: selectedLabel,
      pickerLabelList: pickerLabelList,
      items: items,
    };
  }

  getPickerDataByIndex = (index, pickerData) => {
    return {
      value: pickerData.items[index].value,
      label: pickerData.items[index].label,
    };
  }

  handlePress = (webIndex) => {
    const {
      onValueChange,
      selectedValue,
    } = this.props;

    if (isWeex) {
      const picker = require('@weex-module/picker');
      const pickerData = this.getPickerData();
      picker.pick({
        index: pickerData.selectIndex,
        items: pickerData.pickerLabelList,
      }, event => {
        if (event.result === 'success') {
          let {value, label} = this.getPickerDataByIndex(event.data, pickerData);
          onValueChange && onValueChange(value, pickerData.items);
          this.setState({
            selectedLabel: label,
          });
        }
      });
    } else {
      const pickerData = this.getPickerData();
      let {value} = this.getPickerDataByIndex(webIndex, pickerData);
      onValueChange && onValueChange(value, pickerData.items);
    }
  }

  render() {
    let style = {
      ...styles.initial,
      ...this.props.style,
    };
    let textStyle = {
      color: style.color,
      fontSize: style.fontSize,
      fontStyle: style.fontStyle,
      fontWeight: style.fontWeight,
      textAlign: style.textAlign,
      textDecoration: style.textDecoration,
      textOverflow: style.textOverflow,
      lineHeight: style.lineHeight
    };

    if (isWeex) {
      return (
        <TouchableHighlight {...this.props} onPress={this.handlePress} style={style}>
          <Text style={textStyle}>
            {this.state.selectedLabel}
          </Text>
        </TouchableHighlight>
      );
    } else {
      const pickerData = this.getPickerData();
      return (
        <select style={style} onChange={(e) => {
          this.handlePress(e.target.options.selectedIndex);
        }}>
          {
            pickerData.items.map((item, index) => {
              if (index == pickerData.selectIndex) {
                return <option selected="selected" value={item.value}>{item.label}</option>;
              } else {
                return <option value={item.value}>{item.label}</option>;
              }
            })
          }
        </select>
      );
    }
  }
}

class Item extends Component {
  render() {
    return null;
  }
};

Picker.Item = Item;

const styles = {
  initial: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  }
};

export default Picker;
