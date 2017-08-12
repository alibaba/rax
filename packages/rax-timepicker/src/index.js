import {Component, createElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';
import TouchableHighlight from 'rax-touchable';
import Text from 'rax-text';

class TimePicker extends Component {

  static propTypes = {
    
    /**
     * 选中值（示例：01:01）
     */
    selectedValue: PropTypes.string,
  
    /**
     * 时间选择
     */
    onTimeChange: PropTypes.func
  
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
        onTimeChange,
        selectedValue,
      } = this.props;
      const picker = require('@weex-module/picker');

      picker.pickTime({
        value: selectedValue,
      }, event => {
        if (event.result === 'success') {
          onTimeChange && onTimeChange(event.data);
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
            {this.state.selectedValue}
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
