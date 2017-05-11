export default {
  util: {
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  },

  container: {
    backgroundColor: 'white',
    width: 373,
    position: 'relative'
  },
  infoWrap: {
    height: 172,
    padding: 20,
  },
  title: {
    fontSize: 28,
    lineHeight: 30,
    height: 60,
    textOverflow: 'ellipsis',
    numberOfLines: '1',
    width: 343,
    color: 'black'
  },
  subText: {
    display: 'inline-block',
    color: '#888888',
    fontSize: 22,
    marginTop: 10
  },
  priceText: {
    fontSize: 22,
    color: '#df2211',
    alignItems: 'flex-end'
  },
  tagIcon: {
    fontSize: 26
  },
  priceWrap: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-end'
  },
  addCart: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 64,
    height: 64,
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#df2211',
    // borderRadius: 32
  },
  recommend: {
    position: 'absolute',
    height: 36,
    fontSize: 22,
    left: 20,
    paddingTop: 7,
    paddingLeft: 8,
    paddingRight: 8,
    bottom: 172,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 0
  },
  lstIcon: {
    fontSize: 42,
    color: '#df2211',
    textAlign: 'center',
    alignItem: 'middle'
    // marginTop: 10
  },
  oldPrice: {
    fontSize: 36,
    height: 44,
    marginBottom: 8,
    color: '#df2211'
  }
};