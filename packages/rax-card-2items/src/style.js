const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 750,
    marginBottom: 20
  },
  item: {
    width: 369,
    backgroundColor: 'rgba(255, 255, 255, 1)'
  },
  itemPic: {
    width: 369,
    height: 369
  },
  itemPicPlaceholder: {
    width: 369,
    height: 369,
    backgroundColor: '#eeeeee'
  },
  itemTitlePlaceholder: {
    marginTop: 12,
    marginLeft: 18,
    height: 30,
    width: 333,
    backgroundColor: '#eeeeee'
  },
  linePlaceholder: {
    marginTop: 12,
    marginLeft: 18,
    height: 30,
    width: 155,
    backgroundColor: '#eeeeee'
  },
  itemTitleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 12
  },
  itemTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 26,
    color: '#333333',
    textOverflow: 'ellipsis',
    lines: '2',
    overflow: 'hidden'
  },
  lineWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 18,
    marginTop: 8
  },
  content: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 32,
    color: '#FF5000'
  },
  tagging: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 22,
    color: '#999999',
    marginLeft: 14,
    marginBottom: 4
  }
};

export default styles;