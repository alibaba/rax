import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';
import TouchableHighlight from 'rax-touchable';
import Text from 'rax-text';

class DatePicker extends Component {
  constructor(props) {
    super(props);
  }

  handlePress = () => {
    if (isWeex) {
      const {
        onDateChange,
        selectedValue,
        minimumDate,
        maximumDate,
      } = this.props;
      const picker = __weex_require__('@weex-module/picker');

      picker.pickDate({
        value: selectedValue,
        max: maximumDate,
        min: minimumDate,
      }, event => {
        if (event.result === 'success') {
          onDateChange && onDateChange(event.data);
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
            {selectedValue}
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
