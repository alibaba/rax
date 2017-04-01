import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';
import Picker from 'rax-picker';

class DatePicker extends Component {

  render() {
    const {
      mode,
      selectedValue,
      minimumDate,
      maximumDate,
      onDateChange,
      style,
    } = this.props;

    if (isWeex) {
      return (
        <Picker
          mode={'date'}
          selectedValue={selectedValue}
          date={selectedValue}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onDateChange={onDateChange}
          style={style} />
      );
    } else {
      return (
        <input
          type={'date'}
          value={selectedValue}
          defaultValue={selectedValue}
          min={minimumDate}
          max={maximumDate}
          onChange={function() {
            onDateChange && onDateChange(this.value);
          }}
          style={style} />
      );
    }
  }
}

export default DatePicker;