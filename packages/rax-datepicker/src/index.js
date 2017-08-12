import { Component, createElement, PropTypes } from 'rax';
import {isWeex} from 'universal-env';
import TouchableHighlight from 'rax-touchable';
import Text from 'rax-text';

class DatePicker extends Component {

  static propTypes = {

    /**
     * 选中值（示例：2017-01-01）
     */
    selectedValue: PropTypes.string,

    /**
     * 日期切换
     */
    onDateChange: PropTypes.func,

    /**
     * 日期选择最小范围（示例：2017-01-01）
     */
    minimumDate: PropTypes.string,

    /**
     * 日期选择最大范围（示例：2017-01-01）
     */
    maximumDate: PropTypes.string

  };

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: props.selectedValue
    };
  }

  handlePress = () => {
    if (isWeex) {
      const {
        onDateChange,
        selectedValue,
        minimumDate,
        maximumDate,
      } = this.props;
      const picker = require('@weex-module/picker');

      picker.pickDate({
        value: selectedValue,
        max: maximumDate,
        min: minimumDate,
      }, event => {
        if (event.result === 'success') {
          onDateChange && onDateChange(event.data);
          this.setState({
            selectedValue: event.data,
          });
        }
      });
    }
  }

  render() {
    const {
      selectedValue,
      minimumDate,
      maximumDate,
      onDateChange,
      style,
    } = this.props;

    let touchableStyle = {
      ...styles.initial,
      ...style,
    };
    let textStyle = {
      color: touchableStyle.color,
      fontSize: touchableStyle.fontSize,
      fontStyle: touchableStyle.fontStyle,
      fontWeight: touchableStyle.fontWeight,
      textAlign: touchableStyle.textAlign,
      textDecoration: touchableStyle.textDecoration,
      textOverflow: touchableStyle.textOverflow,
      lineHeight: touchableStyle.lineHeight
    };

    if (isWeex) {
      return (
        <TouchableHighlight {...this.props} onPress={this.handlePress} style={touchableStyle}>
          <Text style={textStyle}>
            {this.state.selectedValue}
          </Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <input
          type={'date'}
          value={selectedValue}
          defaultValue={selectedValue}
          min={minimumDate}
          max={maximumDate}
          onChange={(e) => {
            onDateChange && onDateChange(e.target.value);
          }}
          style={style} />
      );
    }
  }
}

const styles = {
  initial: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  }
};

export default DatePicker;
