import {createElement, Component, PropTypes} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Touchable from 'rax-touchable';

import Day from './Day';

import moment from './moment';
import styles from './styles';

const DEVICE_WIDTH = 750;
const VIEW_INDEX = 2;

export default class Calendar extends Component {
  state = {
    currentMonthMoment: moment(this.props.selectedDate || this.props.startDate || this.props.endDate || this.props.today),
    selectedMoment: moment(this.props.selectedDate),
  };

  static propTypes = {
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    eventDates: PropTypes.array,
    monthNames: PropTypes.array,
    nextButtonText: PropTypes.string,
    onDateSelect: PropTypes.func,
    onSwipeNext: PropTypes.func,
    onSwipePrev: PropTypes.func,
    onTouchNext: PropTypes.func,
    onTouchPrev: PropTypes.func,
    prevButtonText: PropTypes.string,
    selectedDate: PropTypes.any,
    showControls: PropTypes.bool,
    startDate: PropTypes.any,
    endDate: PropTypes.any,
    titleFormat: PropTypes.string,
    dateFormat: PropTypes.string,
    today: PropTypes.any,
    weekStart: PropTypes.number,
  };

  static defaultProps = {
    customStyle: {},
    dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    eventDates: [],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    nextButtonText: 'Next',
    prevButtonText: 'Prev',
    showControls: true,
    titleFormat: 'MMMM YYYY',
    dateFormat: 'YYYY-MM-DD',
    today: moment(),
    weekStart: 1,
  };

  getMonthStack(currentMonth) {
    return [moment(currentMonth)];
  }

  prepareEventDates(eventDates) {
    const parsedDates = {};

    eventDates.forEach(event => {
      const date = moment(event);
      const month = moment(date).startOfMonth().format();
      if (!parsedDates[month]) {
        parsedDates[month] = {};
      }
      parsedDates[month][date.date() - 1] = true;
    });
    return parsedDates;
  }

  selectDate(date) {
    this.setState({ selectedMoment: date });
    this.props.onDateSelect && this.props.onDateSelect(date.format(this.props.dateFormat));
  }

  onPrev = () => {
    const newMoment = moment(this.state.currentMonthMoment).addMonth(-1);
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchPrev && this.props.onTouchPrev(newMoment);
  }

  onNext = () => {
    const newMoment = moment(this.state.currentMonthMoment).addMonth(1);
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchNext && this.props.onTouchNext(newMoment);
  }

  renderMonthView(argMoment, eventDatesMap) {
    let
      renderIndex = 0,
      weekRows = [],
      days = [],
      startOfArgMonthMoment = argMoment.startOfMonth();

    const
      selectedMoment = moment(this.state.selectedMoment),
      weekStart = this.props.weekStart,
      todayMoment = moment(this.props.today),
      todayIndex = todayMoment.date() - 1,
      argMonthDaysCount = argMoment.daysInMonth(),
      offset = (startOfArgMonthMoment.isoWeekday() - weekStart + 7) % 7,
      argMonthIsToday = argMoment.isSameMonth(todayMoment),
      selectedIndex = moment(selectedMoment).date() - 1,
      selectedMonthIsArg = selectedMoment.isSameMonth(argMoment),
      startMoment = this.props.startDate && moment(this.props.startDate),
      endMoment = this.props.endDate && moment(this.props.endDate);

    const events = eventDatesMap !== null
      ? eventDatesMap[argMoment.startOfMonth().format()]
      : null;

    if (!argMoment.isValid()) {
      console.error('[currentMonthMoment] is not valid, make sure [selectedDate startDate endDate today] are valid date');
      return null;
    }

    do {
      const dayIndex = renderIndex - offset;
      const isoWeekday = (renderIndex + weekStart) % 7;
      const date = moment(startOfArgMonthMoment).setDate(dayIndex + 1);
      const isDisabled = startMoment && date.getTime() < startMoment.getTime() || endMoment && date.getTime() > endMoment.getTime();

      if (dayIndex >= 0 && dayIndex < argMonthDaysCount) {
        days.push(
          <Day
            startOfMonth={startOfArgMonthMoment}
            isWeekend={isoWeekday === 0 || isoWeekday === 6}
            key={`${renderIndex}`}
            onPress={() => {
              this.selectDate(date);
            }}
            caption={`${dayIndex + 1}`}
            isToday={argMonthIsToday && dayIndex === todayIndex}
            isSelected={selectedMonthIsArg && dayIndex === selectedIndex}
            hasEvent={events && events[dayIndex] === true}
            usingEvents={this.props.eventDates.length > 0}
            customStyle={this.props.customStyle}
            isDisabled={isDisabled}
          />
        );
      } else {
        days.push(<Day key={`${renderIndex}`} filler />);
      }
      if (renderIndex % 7 === 6) {
        weekRows.push(
          <View
            key={weekRows.length}
            style={[styles.weekRow, this.props.customStyle.weekRow]}
          >
            {days}
          </View>);
        days = [];
        if (dayIndex + 1 >= argMonthDaysCount) {
          break;
        }
      }
      renderIndex += 1;
    } while (true);


    return (
      <View key={argMoment.month()} style={styles.monthContainer}>
        {weekRows}
      </View>
    );
  }

  renderHeading() {
    const headings = [];
    for (let i = 0; i < 7; i++) {
      const j = (i + this.props.weekStart) % 7;
      headings.push(
        <Text
          key={i}
          style={j === 0 || j === 6 ?
            [styles.weekendHeading, this.props.customStyle.weekendHeading] :
            [styles.dayHeading, this.props.customStyle.dayHeading]}
        >
          {this.props.dayHeadings[j]}
        </Text>
      );
    }

    return (
      <View style={[styles.calendarHeading, this.props.customStyle.calendarHeading]}>
        {headings}
      </View>
    );
  }

  renderTopBar() {
    return this.props.showControls
      ?
      <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
        <Touchable
          style={[styles.controlButton, this.props.customStyle.controlButton]}
          onPress={this.onPrev}
        >
          <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
            {this.props.prevButtonText}
          </Text>
        </Touchable>
        <Text style={[styles.title, this.props.customStyle.title]}>
          {this.state.currentMonthMoment.format(this.props.titleFormat)}
        </Text>
        <Touchable
          style={[styles.controlButton, this.props.customStyle.controlButton]}
          onPress={this.onNext}
        >
          <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
            {this.props.nextButtonText}
          </Text>
        </Touchable>
      </View>

      :
      <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
        <Text style={[styles.title, this.props.customStyle.title]}>
          {this.state.currentMonthMoment.format(this.props.titleFormat)}
        </Text>
      </View>
    ;
  }

  render() {
    const calendarDates = this.getMonthStack(this.state.currentMonthMoment);
    const eventDatesMap = this.prepareEventDates(this.props.eventDates);
    let calendarDatesNode = calendarDates.map((date) => this.renderMonthView(moment(date), eventDatesMap));
    return (
      <View style={[styles.calendarContainer, this.props.customStyle.calendarContainer]}>
        {this.renderTopBar()}
        {this.props.showDayHeadings && this.renderHeading(this.props.titleFormat)}
        <View style={{height: calendarDatesNode[0].props.children.length * 92}}>
          {calendarDatesNode}
        </View>
      </View>
    );
  }
}
