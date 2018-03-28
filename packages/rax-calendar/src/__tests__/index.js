import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Calendar from '../';

it('renders correctly', () => {
  const tree = renderer.create(
    <Calendar
      eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
      startDate={'2016-05-03'}
      selectedDate={'2016-05-06'}
      today={'2016-05-08'}
      endDate={'2016-07-03'}
      titleFormat={'YYYY年MM月'}
      prevButtonText={'上一月'}
      nextButtonText={'下一月'}
      weekStart={0}
      showDayHeadings={true}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('today is selected', () => {
  const tree = renderer.create(
    <Calendar
      eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
      startDate={'2016-05-03'}
      selectedDate={'2016-05-06'}
      today={'2016-05-06'}
      endDate={'2016-07-03'}
      titleFormat={'YYYY年MM月'}
      prevButtonText={'上一月'}
      nextButtonText={'下一月'}
      weekStart={0}
      onTouchPrev={() => console.log('Back TOUCH')} // eslint-disable-line no-console
      onTouchNext={() => console.log('Forward TOUCH')} // eslint-disable-line no-console
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('on touch prev month', () => {
  const mockPrevCallback = jest.fn();

  const tree = renderer.create(
    <Calendar
      eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
      startDate={'2016-05-03'}
      selectedDate={'2016-05-06'}
      today={'2016-05-08'}
      endDate={'2016-07-03'}
      titleFormat={'YYYY年MM月'}
      prevButtonText={'上一月'}
      nextButtonText={'下一月'}
      weekStart={0}
      showDayHeadings={true}
      onTouchPrev={mockPrevCallback}
    />
  ).toJSON();

  tree.children[0].children[0].eventListeners.click();
  expect(mockPrevCallback).toHaveBeenCalled();
});

it('on touch next month', () => {
  const mockNextCallback = jest.fn();

  const tree = renderer.create(
    <Calendar
      eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
      startDate={'2016-05-03'}
      selectedDate={'2016-05-06'}
      today={'2016-05-08'}
      endDate={'2016-07-03'}
      titleFormat={'YYYY年MM月'}
      prevButtonText={'上一月'}
      nextButtonText={'下一月'}
      weekStart={0}
      showDayHeadings={true}
      onTouchNext={mockNextCallback}
    />
  ).toJSON();

  tree.children[0].children[2].eventListeners.click();
  expect(mockNextCallback).toHaveBeenCalled();
});

it('on date select', () => {
  const mockDateSelect = jest.fn();

  const tree = renderer.create(
    <Calendar
      eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
      startDate={'2016-05-03'}
      selectedDate={'2016-05-06'}
      today={'2016-05-08'}
      endDate={'2016-07-03'}
      titleFormat={'YYYY年MM月'}
      prevButtonText={'上一月'}
      nextButtonText={'下一月'}
      weekStart={0}
      onDateSelect={mockDateSelect}
    />
  ).toJSON();

  const DateContainer = tree.children[1];
  const DateLine = DateContainer.children[0].children[0];
  const DateView = DateLine.children[3];

  DateView.eventListeners.click();
  expect(mockDateSelect).toHaveBeenCalled();
});

it('date is not vaild', () => {
  const tree = renderer.create(
    <Calendar
      startDate={'2016-05-03'}
      selectedDate={'2016-05-06 ttt'}
      today={'2016-05-06'}
      endDate={'2016-07-03'}
      titleFormat={'YYYY年MM月'}
      prevButtonText={'上一月'}
      nextButtonText={'下一月'}
      weekStart={0}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
