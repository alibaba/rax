const DEVICE_WIDTH = 750;

const styles = {
  calendarContainer: {
    backgroundColor: '#ffffff',
  },
  monthContainer: {
    width: DEVICE_WIDTH,
  },
  monthHeading: {
    padding: '10rem',
    alignItems: 'center',
    borderBottom: '1rem solid #f7f7f7',
    fontSize: '30rem',
  },
  calendarControls: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: '10rem',
  },
  controlButton: {
  },
  controlButtonText: {
    margin: '20rem',
    fontSize: '30rem',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: '38rem',
    margin: '10rem',
  },
  calendarHeading: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  dayHeading: {
    flex: 1,
    fontSize: '30rem',
    textAlign: 'center',
    marginVertical: '10rem',
  },
  weekendHeading: {
    flex: 1,
    fontSize: '30rem',
    textAlign: 'center',
    marginVertical: '10rem',
    color: '#cccccc',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: '10rem',
    width: DEVICE_WIDTH / 7,
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
  },
  dayButtonFiller: {
    padding: '10rem',
    width: DEVICE_WIDTH / 7,
  },
  day: {
    fontSize: '32rem',
    alignSelf: 'center',
    color: '#000000',
  },
  eventIndicatorFiller: {
    marginTop: '6rem',
    borderColor: 'transparent',
    width: '8rem',
    height: '8rem',
    borderRadius: '4rem',
  },
  eventIndicator: {
    backgroundColor: '#cccccc',
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '56rem',
    height: '56rem',
    borderRadius: '28rem',
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
