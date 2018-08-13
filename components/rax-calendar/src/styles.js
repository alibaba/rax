const DEVICE_WIDTH = 750;

const styles = {
  calendarContainer: {
    backgroundColor: '#ffffff',
  },
  monthContainer: {
    width: DEVICE_WIDTH,
  },
  monthHeading: {
    padding: 10,
    alignItems: 'center',
    borderBottom: '1rem solid #f7f7f7',
    fontSize: 30,
  },
  calendarControls: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  controlButton: {
  },
  controlButtonText: {
    margin: 20,
    fontSize: 30,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 38,
    margin: 10,
  },
  calendarHeading: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  dayHeading: {
    flex: 1,
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 10,
  },
  weekendHeading: {
    flex: 1,
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 10,
    color: '#cccccc',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: 10,
    width: DEVICE_WIDTH / 7,
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
  },
  dayButtonFiller: {
    padding: 10,
    width: DEVICE_WIDTH / 7,
  },
  day: {
    fontSize: 32,
    alignSelf: 'center',
    color: '#000000',
  },
  eventIndicatorFiller: {
    marginTop: 6,
    borderColor: 'transparent',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventIndicator: {
    backgroundColor: '#cccccc',
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  currentDayCircle: {
    backgroundColor: 'red',
  },
  currentDayText: {
    color: 'red',
  },
  selectedDayCircle: {
    backgroundColor: '#2ea2ef',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  weekendDayText: {
    color: '#f74e00',
  },
  disabledDayText: {
    color: '#cccccc'
  }
};

export default styles;
