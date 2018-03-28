import {createElement, Component, PropTypes} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Touchable from 'rax-touchable';

import styles from './styles';

export default class Day extends Component {
  static defaultProps = {
    customStyle: {},
  }

  static propTypes = {
    caption: PropTypes.any,
    customStyle: PropTypes.object,
    filler: PropTypes.bool,
    hasEvent: PropTypes.bool,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onPress: PropTypes.func,
    usingEvents: PropTypes.bool,
  }

  dayCircleStyle = (isWeekend, isSelected, isToday) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircleFiller, customStyle.dayCircleFiller && customStyle.dayCircleFiller];

    if (isSelected && !isToday) {
      dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle && customStyle.selectedDayCircle);
    } else if (isSelected && isToday) {
      dayCircleStyle.push(styles.currentDayCircle, customStyle.currentDayCircle && customStyle.currentDayCircle);
    }
    return dayCircleStyle;
  }

  dayTextStyle = (isWeekend, isSelected, isToday, isDisabled) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];
    if (isDisabled) {
      dayTextStyle.push(styles.disabledDayText, customStyle.disabledDayText && customStyle.disabledDayText);
    } else if (isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText, customStyle.currentDayText && customStyle.currentDayText);
    } else if (isToday || isSelected) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText && customStyle.selectedDayText);
    } else if (isWeekend) {
      dayTextStyle.push(styles.weekendDayText, customStyle.weekendDayText && customStyle.weekendDayText);
    }
    return dayTextStyle;
  }

  render() {
    let { caption, customStyle } = this.props;
    const {
      filler,
      hasEvent,
      isWeekend,
      isSelected,
      isToday,
      isDisabled,
      usingEvents,
    } = this.props;

    return filler
      ?
      <Touchable>
        <View style={[styles.dayButtonFiller, customStyle.dayButtonFiller]}>
          <Text style={[styles.day, customStyle.day]} />
        </View>
      </Touchable>

      :
      <Touchable onPress={isDisabled ? null : this.props.onPress}>
        <View style={[styles.dayButton, customStyle.dayButton]}>
          <View style={this.dayCircleStyle(isWeekend, isSelected, isToday)}>
            <Text style={this.dayTextStyle(isWeekend, isSelected, isToday, isDisabled)}>{caption}</Text>
          </View>
          {usingEvents &&
            <View style={[
              styles.eventIndicatorFiller,
              customStyle.eventIndicatorFiller,
              hasEvent && styles.eventIndicator,
              hasEvent && customStyle.eventIndicator]}
            />
          }
        </View>
      </Touchable>
    ;
  }
}
