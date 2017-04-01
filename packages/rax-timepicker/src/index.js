
import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';
import Picker from 'rax-picker';

class TimePicker extends Component {

  render() {
    const {
      selectedValue,
      onTimeChange,
      style,
    } = this.props;

    if (isWeex) {
      return (
        <Picker
          mode={'time'}
          selectedValue={selectedValue}
          onTimeChange={onTimeChange}
          style={style} />
      );
    } else {
      return (
        <input
          type="time"
          value={selectedValue}
          onChange={function() {
            onTimeChange && onTimeChange(this.value);
          }}
          style={this.props.style} />
      );
    }
  }
}

export default TimePicker;