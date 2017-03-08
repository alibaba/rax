let itemWidth = 166;

export default {

  container: {
    height: 80,
    backgroundColor: '#ffffff',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#e7e7e7',
    position: 'relative',
  },
  item: {
    height: 80,
    width: itemWidth + 'rem',
    textAlign: 'center',
    float: 'left',
    position: 'relative',
  },
  itemText: {
    color: '#000000',
    paddingTop: 24,
    textAlign: 'center',
  },
  selectItemText: {
    color: '#ff4200',
    paddingTop: 24,
    textAlign: 'center',
  },

  borderBottom: {
    left: 0,
    height: 0,
    width: 0,
    position: 'absolute',
  },
  borderRun: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 4,
    width: 166,
    backgroundColor: '#fc511f',
  },

  drop: {
    height: 81,
    marginBottom: -81,
  },
  dropBtn: {
    height: 80,
    width: 71,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: '#e7e7e7',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#e7e7e7',
  },
  dropBoxTtem: {
    height: 80,
    textAlign: 'center',
  },
  dropBoxText: {
    paddingTop: 27,
    textAlign: 'center',
    color: '#000000',
  },
  dropBoxSelectText: {
    paddingTop: 27,
    textAlign: 'center',
    color: '#ff4200',
  },

  iconContainer: {
    backgroundColor: '#52bfe6',
    boxShadow: 'inset 0px -1px 0px 0px rgba(0,0,0,0.10)',
    height: 112,
    fontFamily: 'PingFangSC-Regular'
  },
  iconItem: {
    width: itemWidth + 'rem',
    textAlign: 'center',
    float: 'left',
    position: 'relative',
    height: 112,
  },
  iconText: {
    textAlign: 'center',
    fontSize: 28,
    height: 112,
    color: '#000000'
  },
  selectedIconText: {
    textAlign: 'center',
    fontSize: 28,
    height: 112,
    color: '#FFFFFF',
  },
  iconBox: {
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 63,
  },
  icon: {
    width: 48,
    height: 48,
    marginTop: 12,
    display: 'inline-block',
    position: 'relative',
  },
  iconBackgroundRun: {
    left: 0,
    height: 0,
    width: 0,
    position: 'absolute',
  },

};

