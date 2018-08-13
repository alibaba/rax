const styles = {
  container: {
    paddingLeft: 24,
    width: 750,
    backgroundColor: '#ffffff'
  },
  placeholder: {
    height: 96,
    backgroundColor: '#eeeeee'
  },
  item: {
    display: 'flex',
    height: 96,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  },
  childItem: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    height: 96
  },
  icon: {
    width: 48,
    height: 48
  },
  title: {
    fontSize: 30,
    color: '#333333',
    paddingLeft: 18
  },
  text: {
    fontSize: 26,
    color: '#999999',
    paddingRight: 55
  },
  arrow: {
    position: 'absolute',
    top: 34,
    right: 24,
    width: 14,
    height: 26
  },
  line: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 660,
    height: '1px',
    backgroundColor: '#f4f4f4'
  }
};

export default styles;