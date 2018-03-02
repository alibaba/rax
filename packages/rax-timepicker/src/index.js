import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';
import TouchableHighlight from 'rax-touchable';
import Text from 'rax-text';

class TimePicker extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
  }

  handlePress = () => {
    if (isWeex) {
      const {
        onTimeChange,
        selectedValue,
      } = this.props;
      const picker = __weex_require__('@weex-module/picker');

      picker.pickTime({
        value: selectedValue,
      }, event => {
        if (event.result === 'success') {
          onTimeChange && onTimeChange(event.data);
        }
      });
    }
  }

  render() {
    const {
      selectedValue,
      onTimeChange,
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
          type="time"
          value={selectedValue}
          onChange={(e) => {
            onTimeChange && onTimeChange(e.target.value);
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

export default TimePicker;
