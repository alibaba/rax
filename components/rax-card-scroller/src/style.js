let style = {
  root: {
    width: 750,
    height: 406
  },
  scroller: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 406,
    marginLeft: 0,
    paddingRight: 12,
    paddingLeft: 24
  },
  link: {
    width: 280,
    height: 406,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    marginRight: 12
  },
  pic: {
    width: 280,
    height: 280
  },
  content: {
    width: 280,
    height: 125,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  name: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 28,
    color: '#333333',
    textOverflow: 'ellipsis'
  },
  desc: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 24,
    color: '#999999',
    textOverflow: 'ellipsis'
  }
};

export default style;